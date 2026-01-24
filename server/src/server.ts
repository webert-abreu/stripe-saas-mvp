import express from "express";
import cors from "cors";
import Stripe from "stripe";
import dotenv from "dotenv";
import archiver from "archiver";
import axios from "axios";
import { PrismaClient } from "@prisma/client";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const prisma = new PrismaClient();

// Inicializa a Stripe
const myStripe = new Stripe(process.env.MY_STRIPE_SECRET_KEY as string);

// --- ROTA WEBHOOK ---
app.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const sig = req.headers["stripe-signature"];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
    let event;

    try {
      if (endpointSecret) {
        // @ts-ignore
        event = myStripe.webhooks.constructEvent(req.body, sig, endpointSecret);
      } else {
        event = JSON.parse(req.body.toString());
      }
    } catch (err: any) {
      console.log(`⚠️ Webhook Error: ${err.message}`);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const stripeAccountId = session.client_reference_id;

      if (stripeAccountId) {
        console.log(`💰 PAGAMENTO RECEBIDO! Liberando: ${stripeAccountId}`);
        await prisma.user.update({
          where: { stripeAccountId: stripeAccountId },
          data: { isPremium: true },
        });
      }
    }
    res.send();
  },
);

// Configurações Padrão
app.use(cors());
app.use(express.json());

// Middleware de Segurança
const requireStripeKey = (req: any, res: any, next: any) => {
  const key = req.headers["x-stripe-key"];
  if (!key || !key.startsWith("sk_"))
    return res.status(401).json({ error: "Chave ausente." });
  req.stripe = new Stripe(key, { apiVersion: "2025-12-15.clover" });
  next();
};

// --- ROTA DE CRIAÇÃO DE PAGAMENTO (CORRIGIDA PARA MENSAL) ---
app.post("/api/create-checkout-session", async (req, res) => {
  const { stripeAccountId } = req.body;
  try {
    const session = await myStripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: "brl",
            product_data: {
              name: "StripeSaaS PRO (Assinatura Mensal)", // Mudei o nome
              description: "Acesso ilimitado a downloads e suporte.",
            },
            unit_amount: 2990, // R$ 29,90
            recurring: { interval: "month" }, // <--- O SEGREDO DA MENSALIDADE
          },
          quantity: 1,
        },
      ],
      mode: "subscription", // <--- MUDOU DE 'payment' PARA 'subscription'
      client_reference_id: stripeAccountId,
      success_url: "http://localhost:5173/app?success=true",
      cancel_url: "http://localhost:5173/app?canceled=true",
    });
    res.json({ url: session.url });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});
// --- HELPER DE DATAS (CORRIGIDO PARA NÃO DAR ERRO TS2698) ---
function buildStripeParams(query: any) {
  const params: Stripe.InvoiceListParams = { limit: 100 };

  // Criamos um objeto temporário para garantir que é um objeto válido
  const dateFilter: any = {};

  if (query.startDate) {
    dateFilter.gte = Math.floor(new Date(query.startDate).getTime() / 1000);
  }

  if (query.endDate) {
    dateFilter.lte =
      Math.floor(new Date(query.endDate).getTime() / 1000) + 86399;
  }

  // Só atribuímos se tiver algum filtro
  if (Object.keys(dateFilter).length > 0) {
    params.created = dateFilter;
  }

  return params;
}

// Listagem
// @ts-ignore
app.get("/api/invoices", requireStripeKey, async (req, res) => {
  try {
    // @ts-ignore
    const invoices = await req.stripe.invoices.list(
      buildStripeParams(req.query),
    );
    res.json(
      invoices.data.map((inv: any) => ({
        id: inv.id,
        date: new Date(inv.created * 1000).toLocaleDateString("pt-BR"),
        amount: (inv.amount_due / 100).toLocaleString("pt-BR", {
          style: "currency",
          currency: inv.currency.toUpperCase(),
        }),
        status: inv.status,
        customer: inv.customer_email || inv.customer_name || "Cliente",
        invoice_pdf: inv.invoice_pdf,
      })),
    );
  } catch (e) {
    res.status(500).json({ error: "Erro" });
  }
});

// Download ZIP
// @ts-ignore
app.get("/api/download-all", requireStripeKey, async (req, res) => {
  try {
    // @ts-ignore
    const stripe = req.stripe;
    const account = await stripe.accounts.retrieve();
    const stripeAccountId = account.id;

    let user = await prisma.user.findUnique({ where: { stripeAccountId } });
    if (!user)
      user = await prisma.user.create({
        data: { stripeAccountId, isPremium: false },
      });

    if (!user.isPremium && user.downloadsCount >= 1) {
      return res.status(403).json({ error: "Limite", stripeAccountId });
    }

    const invoices = await stripe.invoices.list(buildStripeParams(req.query));
    res.attachment("faturas.zip");
    const archive = archiver("zip");
    archive.pipe(res);

    if (invoices.data.length === 0)
      archive.append("Vazio", { name: "aviso.txt" });
    else {
      for (const inv of invoices.data) {
        if (inv.invoice_pdf) {
          try {
            const pdf = await axios.get(inv.invoice_pdf, {
              responseType: "stream",
            });
            archive.append(pdf.data, { name: `${inv.id}.pdf` });
          } catch (e) {}
        }
      }
    }

    archive.on(
      "end",
      async () =>
        await prisma.user.update({
          where: { id: user?.id },
          data: { downloadsCount: { increment: 1 } },
        }),
    );
    await archive.finalize();
  } catch (e) {
    if (!res.headersSent) res.status(500).send("Erro");
  }
});

app.listen(PORT, () => console.log(`🔥 Servidor pronto na porta ${PORT}`));

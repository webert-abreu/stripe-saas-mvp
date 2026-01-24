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

// Inicializa a Stripe do Dono do SaaS (Você) para cobrar assinaturas
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

// Middleware de Segurança (Bring Your Own Key)
const requireStripeKey = (req: any, res: any, next: any) => {
  const key = req.headers["x-stripe-key"];
  if (!key || !key.startsWith("sk_"))
    return res.status(401).json({ error: "Chave ausente." });

  // @ts-ignore - Removida versão específica para evitar erros de compatibilidade
  req.stripe = new Stripe(key);
  next();
};

// --- ROTA DE CRIAÇÃO DE ASSINATURA ---
app.post("/api/create-checkout-session", async (req, res) => {
  const { stripeAccountId } = req.body;
  try {
    const session = await myStripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: "brl",
            product_data: {
              name: "StripeSaaS PRO (Assinatura Mensal)",
              description: "Acesso ilimitado a downloads e suporte.",
            },
            unit_amount: 2990, // R$ 29,90
            recurring: { interval: "month" }, // Cobrança Recorrente
          },
          quantity: 1,
        },
      ],
      mode: "subscription",
      client_reference_id: stripeAccountId,
      // ATENÇÃO: Confirme se este é o link exato da sua Vercel
      success_url: "https://stripe-saas-mvp.vercel.app/app?success=true",
      cancel_url: "https://stripe-saas-mvp.vercel.app/app?canceled=true",
    });
    res.json({ url: session.url });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// --- HELPER DE DATAS ---
function buildStripeParams(query: any) {
  const params: Stripe.InvoiceListParams = { limit: 100 };
  const dateFilter: any = {};

  if (query.startDate) {
    dateFilter.gte = Math.floor(new Date(query.startDate).getTime() / 1000);
  }

  if (query.endDate) {
    dateFilter.lte =
      Math.floor(new Date(query.endDate).getTime() / 1000) + 86399;
  }

  if (Object.keys(dateFilter).length > 0) {
    params.created = dateFilter;
  }

  return params;
}

// Listagem de Faturas
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
    res.status(500).json({ error: "Erro ao listar faturas" });
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

    // Lógica de Limite Gratuito
    if (!user.isPremium && user.downloadsCount >= 1) {
      return res
        .status(403)
        .json({ error: "Limite Gratuito Atingido", stripeAccountId });
    }

    const invoices = await stripe.invoices.list(buildStripeParams(req.query));
    res.attachment("faturas.zip");
    const archive = archiver("zip");
    archive.pipe(res);

    if (invoices.data.length === 0)
      archive.append("Nenhuma fatura encontrada no período.", {
        name: "aviso.txt",
      });
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
    if (!res.headersSent) res.status(500).send("Erro ao gerar ZIP");
  }
});

app.listen(PORT, () => console.log(`🔥 Servidor pronto na porta ${PORT}`));

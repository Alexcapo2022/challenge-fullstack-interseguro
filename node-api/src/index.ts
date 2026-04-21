import express from "express";
import statsRoutes from "./routes/stats.routes";
import { notFound, errorHandler } from "./middlewares/error.middleware";
import { authMiddleware } from "./middlewares/auth.middleware";

const app = express();
app.use(express.json({ limit: "5mb" }));

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

// ✅ Prefijo v1/api + ruta stats (Protegida)
app.use("/v1/api/stats", authMiddleware, statsRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Node API (TS) ejecutándose en el puerto ${PORT}`);
});
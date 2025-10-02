// server.js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

// Routers
import socioRoutes from "./routes/SocioRoutes.js";
import pagoRoutes from "./routes/PagoRoutes.js";
import asistenciaRoutes from "./routes/AsistenciaRoutes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Conexión a MongoDB
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/gym";
mongoose.connect(MONGO_URI)
  .then(() => console.log("Conectado a MongoDB"))
  .catch(err => console.error("Error conectando a MongoDB:", err));

// Rutas API
app.use("/api/socios", socioRoutes);
app.use("/api/pagos", pagoRoutes);
app.use("/api/asistencias", asistenciaRoutes);

// Servir frontend estático
app.use(express.static(path.join(__dirname, "frontend/build")));

// Todas las rutas que no sean API redirigen a index.html
app.get("*", (req, res) => {
  if (!req.path.startsWith("/api")) {
    res.sendFile(path.join(__dirname, "frontend/build", "index.html"));
  }
});

// Puerto
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});

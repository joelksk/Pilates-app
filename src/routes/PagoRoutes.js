import express from "express";
import { registrarPago, listarPagos, eliminarPagoPorId } from "../controllers/PagoController.js";

const router = express.Router();

router.post("/", registrarPago);

router.get("/", listarPagos);

router.get("/:id", listarPagos);

router.delete("/:id", eliminarPagoPorId)

export default router;

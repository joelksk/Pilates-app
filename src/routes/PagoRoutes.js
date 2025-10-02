import express from "express";
import { registrarPago, listarPagos } from "../controllers/PagoController.js";

const router = express.Router();

router.post("/", registrarPago);

router.get("/", listarPagos);

router.get("/:id", listarPagos);

export default router;

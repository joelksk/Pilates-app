import express from "express";
import { registrarAsistencia, listarAsistencias } from "../controllers/AsistenciaController.js";

const router = express.Router();

router.post("/", registrarAsistencia);

router.get("/", listarAsistencias);

router.get("/:id", listarAsistencias);

export default router;

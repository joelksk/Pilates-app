import express from "express";
import { registrarAsistencia, listarAsistencias, eliminarAsistenciaPorId } from "../controllers/AsistenciaController.js";

const router = express.Router();

router.post("/", registrarAsistencia);

router.get("/", listarAsistencias);

router.get("/:id", listarAsistencias);

router.delete("/:id", eliminarAsistenciaPorId)

export default router;

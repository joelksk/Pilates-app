import express from "express";
import {
  crearSocio,
  listarSocios,
  obtenerSocio,
  editarSocio,
  eliminarSocio,
  historialPagos,
  historialAsistencias
} from "../controllers/SocioController.js";

const router = express.Router();

// Crear un socio
router.post("/", crearSocio);

// Listar todos los socios
router.get("/", listarSocios);

// Obtener un socio por ID
router.get("/:id", obtenerSocio);

// Editar socio
router.put("/:id", editarSocio);

// Eliminar socio
router.delete("/:id", eliminarSocio);

// Historial de pagos de un socio
router.get("/:id/pagos", historialPagos);

// Historial de asistencias de un socio
router.get("/:id/asistencias", historialAsistencias);

export default router;

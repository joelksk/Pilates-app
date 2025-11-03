import Socio from "../models/Socio.js";
import Pago from "../models/Pago.js";
import Asistencia from "../models/Asistencia.js";
import { eliminarListaPagos } from "./PagoController.js";
import { eliminarListaAsistencias } from "./AsistenciaController.js";

export const crearSocio = async (req, res) => {
  try {
    const { nombre, dni, email, cumple, clase, frecuencia, cantidad_clases, vencimiento_actual, observaciones } = req.body;

    const socioExistente = await Socio.findOne({ dni });
    if (socioExistente) {
      return res.status(400).json({ mensaje: "El DNI ya está registrado" });
    }

    const nuevoSocio = new Socio({
      nombre,
      dni,
      email,
      cumple,
      clase,
      frecuencia,
      cantidad_clases: cantidad_clases || 0,
      cantidad_restantes: cantidad_clases || 0,
      vencimiento_actual,
      observaciones: observaciones || ''
    });

    await nuevoSocio.save();
    res.status(201).json(nuevoSocio);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al crear el socio" });
  }
};

export const listarSocios = async (req, res) => {
  try {
    const socios = await Socio.find().sort({ nombre: 1 });
    res.json(socios);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al listar socios" });
  }
};

export const obtenerSocio = async (req, res) => {
  try {
    const { id } = req.params;
    const socio = await Socio.findById(id);
    if (!socio) return res.status(404).json({ mensaje: "Socio no encontrado" });
    res.json(socio);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al obtener socio" });
  }
};

export const editarSocio = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const socio = await Socio.findByIdAndUpdate(id, updates, { new: true });
    if (!socio) return res.status(404).json({ mensaje: "Socio no encontrado" });
    res.json(socio);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al editar socio" });
  }
};

export const eliminarSocio = async (req, res) => {
  try {
    const { id } = req.params;
    const socio = await Socio.findByIdAndDelete(id);
    if (!socio) return res.status(404).json({ mensaje: "Socio no encontrado" });
    await eliminarListaPagos(socio._id);
    await eliminarListaAsistencias(socio._id);
    res.json({ mensaje: "Socio eliminado correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al eliminar socio" });
  }
};

export const historialPagos = async (req, res) => {
  try {
    const { id } = req.params;
    const pagos = await Pago.find({ socio: id }).sort({ fecha_de_pago: -1 });
    res.json(pagos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al obtener historial de pagos" });
  }
};

export const historialAsistencias = async (req, res) => {
  try {
    const { id } = req.params;
    const asistencias = await Asistencia.find({ socio: id }).sort({ fecha_de_asistencia: -1 });
    res.json(asistencias);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al obtener historial de asistencias" });
  }
};

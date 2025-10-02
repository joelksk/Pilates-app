import Asistencia from "../models/Asistencia.js";
import Socio from "../models/Socio.js";

export const registrarAsistencia = async (req, res) => {
  try {
    const { socioId } = req.body;

    const socio = await Socio.findById(socioId);
    if (!socio) return res.status(404).json({ mensaje: "Socio no encontrado" });

      const hoy = new Date();

      if(socio.frecuencia !== 'pase_libre') {
        if (socio.cantidad_restantes <= 0) {
        return res.status(400).json({ mensaje: "Lo sentimos ya no le quedan clases disponibles, hable con administracion." });
        }
        if (socio.vencimiento_actual < hoy) {
          return res.status(400).json({ mensaje: "Lo sentimos su cuota ha vencido, hable con administracion." });
        }
        socio.cantidad_restantes -= 1;
        await socio.save();
      }

      if (socio.vencimiento_actual < hoy) {
          return res.status(400).json({ mensaje: "Lo sentimos su cuota ha vencido, hable con administracion." });
      }
    

    const asistencia = new Asistencia({
      socio: socio._id,
      fecha_de_asistencia: hoy,
      status: "presente"
    });

    await asistencia.save();
    res.status(201).json({ mensaje: "Asistencia registrada", asistencia, socio });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al registrar asistencia" });
  }
};

export const listarAsistencias = async (req, res) => {
  try {
    const socioId  = req.params.id;
    const filtro = socioId ? { socio: socioId } : {};
    const asistencias = await Asistencia.find(filtro)
      .sort({ fecha_de_asistencia: -1 })
      .populate("socio", "nombre dni");
    res.json(asistencias);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al listar asistencias" });
  }
};

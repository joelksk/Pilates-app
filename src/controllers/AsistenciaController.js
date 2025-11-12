import Asistencia from "../models/Asistencia.js";
import Socio from "../models/Socio.js";
import {formatDate} from '../utils/Utils.js'

export const registrarAsistencia = async (req, res) => {
  try {
    const { socioId, fecha_vieja } = req.body;

    const socio = await Socio.findById(socioId);
    if (!socio) return res.status(404).json({ mensaje: "Socio no encontrado" });

      const hoy = fecha_vieja === undefined ? new Date() : new Date(fecha_vieja);

      const vencimiento = socio.vencimiento_actual.toLocaleString().split(",")[0]

      if(socio.frecuencia !== 'pase_libre') {
        if (socio.cantidad_restantes <= 0) {
        return res.status(400).json({ mensaje: "Lo sentimos ya no le quedan clases disponibles, hable con administracion." });
        }
        if (socio.vencimiento_actual < hoy) {
          return res.status(400).json({ mensaje: "Lo sentimos su cuota ha vencido el dia " + vencimiento + ", hable con administracion." });
        }
        socio.cantidad_restantes -= 1;
        await socio.save();
      }

        if (socio.vencimiento_actual < hoy) {
          return res.status(400).json({ mensaje: "Lo sentimos su cuota ha vencido el dia " + vencimiento + ", hable con administracion." });
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

export const eliminarAsistenciaPorId = async (req, res) => {
   try {
      const {id} = req.params;
      const asistencia = await Asistencia.findByIdAndDelete(id);
      if (!asistencia) return res.status(404).json({ mensaje: "Asistencia no encontrada" });
  
      //Agregamos una clase al socio, ya que eliminamos la asistencia
      const socio = await Socio.findById(asistencia.socio.toString());
      socio.cantidad_restantes++;
      await socio.save();
      res.json({ mensaje: "Asistencia eliminada correctamente" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ mensaje: "Error al eliminar el pago" });
    }
}

export const eliminarListaAsistencias = async (socioId) => {
  try {
    await Asistencia.deleteMany({ socio: socioId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al eliminar las asistencias del socio" });
  }
}

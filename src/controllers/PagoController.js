import Pago from "../models/Pago.js";
import Socio from "../models/Socio.js";

export const registrarPago = async (req, res) => {
  try {
    const { socioId, forma_de_pago, monto_de_pago, cantidad_clases, fecha_de_pago } = req.body;
    const socio = await Socio.findById(socioId);
    if (!socio) return res.status(404).json({ mensaje: "Socio no encontrado" });


    // Crear pago
    const pago = new Pago({ 
      socio: socio._id, 
      forma_de_pago, 
      monto_de_pago,
      fecha_de_pago: fecha_de_pago === "" ? new Date() : fecha_de_pago, 
      cantidad_clases 
    });
    await pago.save();

    // Actualizar clases del socio
    socio.cantidad_clases += cantidad_clases;
    socio.cantidad_restantes += cantidad_clases;

    // Actualizar vencimiento
    // const base = socio.vencimiento_actual && socio.vencimiento_actual > pago.fecha_de_pago
    //   ? socio.vencimiento_actual
    //   : pago.fecha_de_pago;
    const nuevaFecha = new Date(pago.fecha_de_pago);
    nuevaFecha.setMonth(nuevaFecha.getMonth() + 1);
    socio.vencimiento_actual = nuevaFecha;

    await socio.save();

    res.status(201).json({ mensaje: "Pago registrado y socio actualizado", pago, socio });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al registrar pago" });
  }
};

export const listarPagos = async (req, res) => {
  try {
    const socioId  = req.params.id;
    const filtro = socioId ? { socio: socioId } : {};
    const pagos = await Pago.find(filtro).sort({ fecha_de_pago: -1 }).populate("socio", "nombre dni");
    res.json(pagos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al listar pagos" });
  }
};

export const eliminarPagoPorId = async (req, res) => {
  try {
    const {id} = req.params;
    const pago = await Pago.findByIdAndDelete(id);
    if (!pago) return res.status(404).json({ mensaje: "Pago no encontrado" });

    //Restamos las clases correspondientes al pago del socio
    const socio = await Socio.findById(pago.socio.toString());
    socio.cantidad_clases -= pago.cantidad_clases;
    socio.cantidad_restantes -= pago.cantidad_clases;
    await socio.save();
    res.json({ mensaje: "Pago eliminado correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al eliminar el pago" });
  }

}

export const eliminarListaPagos = async (socioId) => {
  try {
     await Pago.deleteMany({ socio: socioId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al eliminar los pagos del socio" });
  }
}
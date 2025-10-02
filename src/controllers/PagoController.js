import Pago from "../models/Pago.js";
import Socio from "../models/Socio.js";

// Registrar un nuevo pago
export const registrarPago = async (req, res) => {
  try {
    const { socioId, forma_de_pago, monto_de_pago, cantidad_clases } = req.body;
    const socio = await Socio.findById(socioId);
    if (!socio) return res.status(404).json({ mensaje: "Socio no encontrado" });

    // Crear pago
    const pago = new Pago({ 
      socio: socio._id, 
      forma_de_pago, 
      monto_de_pago, 
      cantidad_clases 
    });
    await pago.save();

    // Actualizar clases del socio
    socio.cantidad_clases += cantidad_clases;
    socio.cantidad_restantes += cantidad_clases;

    // Actualizar vencimiento
    const fechaActual = new Date();
    const base = socio.vencimiento_actual && socio.vencimiento_actual > fechaActual
      ? socio.vencimiento_actual
      : fechaActual;
    const nuevaFecha = new Date(base);
    nuevaFecha.setMonth(nuevaFecha.getMonth() + 1); // suma 1 mes
    socio.vencimiento_actual = nuevaFecha;

    await socio.save();

    res.status(201).json({ mensaje: "Pago registrado y socio actualizado", pago, socio });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al registrar pago" });
  }
};

// Listar pagos (todos o filtrados por socio)
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

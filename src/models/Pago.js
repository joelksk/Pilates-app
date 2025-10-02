import mongoose from "mongoose";

const pagoSchema = new mongoose.Schema({
  socio: { type: mongoose.Schema.Types.ObjectId, ref: "Socio", required: true },
  forma_de_pago: { type: String, enum: ["efectivo", "transferencia", "tarjeta"], required: true },
  fecha_de_pago: { type: Date, default: Date.now },
  monto_de_pago: { type: Number, required: true },
  cantidad_clases: { type: Number, required: true } // cuántas clases se compran en este pago
}, { timestamps: true });

export default mongoose.model("Pago", pagoSchema);

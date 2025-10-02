import mongoose from "mongoose";

const asistenciaSchema = new mongoose.Schema({
  socio: { type: mongoose.Schema.Types.ObjectId, ref: "Socio", required: true },
  fecha_de_asistencia: { type: Date, default: Date.now },
  status: { type: String, enum: ["presente", "ausente"], default: "presente" }
}, { timestamps: true });

export default mongoose.model("Asistencia", asistenciaSchema);

import mongoose from "mongoose";

const socioSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  dni: { type: Number, unique: true, required: true },
  email: { type: String, unique: true, required: false },
  cumple: { type: Date },
  clase: { type: String, enum: ["Pilates", "Pilates Mat", "Funcional/Cross", "GAP", "AeroBox","Funcional Kids", "Boxeo", "Zumba"], required: true },
  frecuencia: { type: String, enum: ["1", "2", "3", "pase_libre"], required: true },
  cantidad_clases: { type: Number, default: 0 },
  cantidad_restantes: { type: Number, default: 0 },
  vencimiento_actual: { type: Date , default: new Date("1990-01-01")},
  observaciones: { type: String}
}, { timestamps: true });

export default mongoose.model("Socio", socioSchema);

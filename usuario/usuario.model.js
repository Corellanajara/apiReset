const mongoose = require('mongoose');

const sucursalSchema = mongoose.Schema({
  Nombres : String,
  ApellidoMaterno : String,
  ApellidoPaterno : String,
  FechaNacimiento : String,
  Correo : String,
  CorreoPersonal : String,
  Rut : String,
  Profesion : String,
  Direccion : String,
  Numero : String,
  Rol : Number,
  Sede : String,
  Clave : String,

  // pendiente hashear clave
}, {
    timestamps: true
  });

module.exports = mongoose.model('usuarios', sucursalSchema);

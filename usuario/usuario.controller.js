const Usuario = require('./usuario.model.js');

//Create new usuario
exports.create = (req, res) => {
    // Request validation
    if(!req.body) {

        return res.status(400).send({
            message: "No puede estar vacio"
        });
    }

    const usuario = new Usuario({
      Nombres : req.body.Nombres,
      ApellidoMaterno : req.body.ApellidoMaterno,
      ApellidoPaterno : req.body.ApellidoPaterno,
      Correo : req.body.Correo,
      CorreoPersonal : req.body.CorreoPersonal,
      FechaNacimiento : req.body.FechaNacimiento,
      Rut : req.body.Rut,
      Profesion : req.body.Profesion,
      Direccion : req.body.Direccion,
      Numero : req.body.Numero,
      Rol : req.body.Rol,
      Sede : req.body.Sede,
      Clave : req.body.Clave,
    });

    usuario.save()
    .then(data => {
        res.send(data);
    }).catch(err => {
        res.status(500).send({
            message: err.message || " Error en crear las usuarioes."
        });
    });
};

// Retrieve all usuarioes from the database.
exports.findAll = (req, res) => {
    Usuario.find()
    .then(usuarioes => {
        res.send(usuarioes);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Error en traer las usuarioes."
        });
    });
};
exports.findByRol = (req, res) => {
    Usuario.find({Rol:req.params.usuarioId})
    .then(usuarioes => {
        res.send(usuarioes);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Error en traer las usuarioes."
        });
    });
};


exports.findUser = (req, res) => {
    Usuario.find( {Correo : req.body.Correo , Clave : req.body.Clave } )
    .then(usuario => {
        if(!usuario) {
            return res.status(404).send({
                message: "No se encontro usuario"
            });
        }
        res.send(usuario);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "No encontrado correo   " + req.body.Correo
            });
        }
        return res.status(500).send({
            message: "No se puedo encontrar el usuario "
        });
    });
};
// Find a single usuario with a usuarioId
exports.findOne = (req, res) => {
    Usuario.findById(req.params.usuarioId)
    .then(usuario => {
        if(!usuario) {
            return res.status(404).send({
                message: "No se encontro info con la id " + req.params.usuarioId
            });
        }
        res.send(usuario);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "No encontrado usuario  " + req.params.usuarioId
            });
        }
        return res.status(500).send({
            message: "No se puedo encontrar " + req.params.usuarioId
        });
    });
};


exports.update = (req, res) => {

    if(!req.body) {
        return res.status(400).send({
            message: "usuario content can not be empty"
        });
    }

    Usuario.findByIdAndUpdate(req.params.usuarioId, {
      Nombres : req.body.Nombres,
      ApellidoMaterno : req.body.ApellidoMaterno,
      ApellidoPaterno : req.body.ApellidoPaterno,
      Correo : req.body.Correo,
      CorreoPersonal : req.body.CorreoPersonal,
      FechaNacimiento : req.body.FechaNacimiento,
      Rut : req.body.Rut,
      Profesion : req.body.Profesion,
      Direccion : req.body.Direccion,
      Numero : req.body.Numero,
      Rol : req.body.Rol,
      Sede : req.body.Sede,
      Clave : req.body.Clave,
    }, {new: true})
    .then(usuario => {
        if(!usuario) {
            return res.status(404).send({
                message: "No encontrado id " + req.params.usuarioId
            });
        }
        res.send(usuario);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "No encontrado id" + req.params.usuarioId
            });
        }
        return res.status(500).send({
            message: "Error al actualizar id " + req.params.usuarioId
        });
    });
};

exports.delete = (req, res) => {
    Usuario.findByIdAndRemove(req.params.usuarioId)
    .then(usuario => {
        if(!usuario) {
            return res.status(404).send({
                message: "usuario no encontrado id " + req.params.usuarioId
            });
        }
        res.send({message: "usuario borrado correctamente!"});
    }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: "usuario no encontrado id " + req.params.usuarioId
            });
        }
        return res.status(500).send({
            message: "No se pudo borrar el usuario id " + req.params.usuarioId
        });
    });
};

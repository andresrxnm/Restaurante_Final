const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const Usuario = require("../models/Usuario");

// Mostrar todos los usuarios
exports.index = async (req, res) => {
  try {
    const usuarios = await Usuario.getAll();
    res.render('usuarios/index', { 
      title: 'Listado de Usuarios',
      usuarios
    });
  } catch (error) {
    console.error(error);
    res.status(500).render('error', { 
      title: 'Error',
      message: 'Hubo un error al cargar los usuarios.' 
    });
  }
};

// Guardar nuevo usuario
exports.store = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render("usuarios/form", {
      title: "Registrar Usuario",
      usuario: req.body,
      errors: errors.array(),
      isEditing: false,
    });
  }

  try {
    const { nombre, apellido, email, password } = req.body;

    if (!password) {
      return res.render("usuarios/form", {
        title: "Registrar Usuario",
        usuario: req.body,
        errors: [{ msg: "La contraseña es obligatoria" }],
        isEditing: false,
      });
    }

    const username = (nombre + apellido).toLowerCase().replace(/\s/g, '');

    const hashedPassword = await bcrypt.hash(password, 10);

    const nuevoUsuario = {
      username,
      email,
      password: hashedPassword,
    };

    await Usuario.create(nuevoUsuario);
    res.redirect("/usuarios");
  } catch (error) {
    console.error("Error al crear usuario:", error);
    res.render("usuarios/form", {
      title: "Registrar usuario",
      usuario: req.body,
      errors: [
        {
          msg: "Error al guardar el usuario. El email podría estar duplicado.",
        },
      ],
      isEditing: false,
    });
  }
};

// Actualizar usuario
exports.update = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render("usuarios/form", {
      title: "Editar usuario",
      usuario: { ...req.body, id: req.params.id },
      errors: errors.array(),
      isEditing: true,
    });
  }

  try {
    const { nombre, apellido, email, password } = req.body;
    const username = (nombre + apellido).toLowerCase().replace(/\s/g, '');

    let hashedPassword;
    if (password && password.trim() !== '') {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    const usuarioActualizado = {
      username,
      email,
      ...(hashedPassword && { password: hashedPassword }),
    };

    const success = await Usuario.update(req.params.id, usuarioActualizado);

    if (!success) {
      return res.status(404).render("error", {
        title: "Error",
        message: "Usuario no encontrado",
      });
    }

    res.redirect("/usuarios");
  } catch (error) {
    console.error(error);
    res.render("usuarios/form", {
      title: "Editar usuario",
      usuario: { ...req.body, id: req.params.id },
      errors: [
        {
          msg: "Error al actualizar el usuario. El email podría estar duplicado.",
        },
      ],
      isEditing: true,
    });
  }
};

// Eliminar usuario
exports.delete = async (req, res) => {
  try {
    const success = await Usuario.delete(req.params.id);
    if (!success) {
      return res.status(404).json({ success: false, message: "Usuario no encontrado" });
    }
    res.redirect("/usuarios");
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error al eliminar el usuario" });
  }
};

// Mostrar formulario para crear nuevo usuario
exports.create = async (req, res) => {
  res.render("usuarios/form", {
    title: "Registrar usuario",
    usuario: {},
    errors: [],
    isEditing: false,
  });
};

// Mostrar formulario para editar usuario
exports.edit = async (req, res) => {
  try {
    const usuario = await Usuario.getById(req.params.id);
    if (!usuario) {
      return res.status(404).render("error", {
        title: "Error",
        message: "Usuario no encontrado",
      });
    }
    res.render("usuarios/form", {
      title: "Editar Usuario",
      usuario,
      errors: [],
      isEditing: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).render("error", {
      title: "Error",
      message: "Error al cargar los datos del usuario",
    });
  }
};

// Mostrar detalle de usuario
exports.show = async (req, res) => {
  try {
    const usuario = await Usuario.getById(req.params.id);
    if (!usuario) {
      return res.status(404).render("error", {
        title: "Error",
        message: "Usuario no encontrado",
      });
    }
    res.render("usuarios/show", {
      title: "Detalle del Usuario",
      usuario
    });
  } catch (error) {
    console.error(error);
    res.status(500).render("error", {
      title: "Error",
      message: "Error al cargar el usuario",
    });
  }
};

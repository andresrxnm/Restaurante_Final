const { validationResult } = require("express-validator");
const Resena = require("../models/Resena");
const Usuario = require("../models/Usuario");
const Restaurante = require("../models/Restaurante");

// Mostrar todas las reseñas (con buscador)
exports.index = async (req, res) => {
  try {
    const search = req.query.search;
    let resenas;

    if (search) {
      resenas = await Resena.searchByComentarioOrRestaurante(search);
    } else {
      resenas = await Resena.getAll();
    }

    res.render('resenas/index', {
      title: 'Listado de reseñas',
      resenas,
      search
    });
  } catch (error) {
    console.error(error);
    res.status(500).render('error', {
      title: 'Error',
      message: 'Hubo un error al cargar las reseñas.'
    });
  }
};

// Mostrar formulario para crear nueva reseña
exports.create = async (req, res) => {
  try {
    const usuarios = await Usuario.getAll();
    const restaurantes = await Restaurante.getAll();
    res.render("resenas/form", {
      title: "Registrar reseña",
      resena: {},
      usuarios,
      restaurantes,
      errors: [],
      isEditing: false,
    });
  } catch (error) {
    console.error(error);
    res.status(500).render("error", {
      title: "Error",
      message: "Error al cargar formulario de reseña",
    });
  }
};

// Guardar nueva reseña
exports.store = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    try {
      const usuarios = await Usuario.getAll();
      const restaurantes = await Restaurante.getAll();
      if (req.body.fecha_creacion) {
        req.body.fecha_creacion = new Date(req.body.fecha_creacion);
      }
      return res.render("resenas/form", {
        title: "Registrar reseña",
        resena: req.body,
        usuarios,
        restaurantes,
        errors: errors.array(),
        isEditing: false,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).render("error", {
        title: "Error",
        message: "Error al cargar formulario con errores",
      });
    }
  }

  try {
    await Resena.create(req.body);
    res.redirect("/resenas");
  } catch (error) {
    console.error(error);
    try {
      const usuarios = await Usuario.getAll();
      const restaurantes = await Restaurante.getAll();
      if (req.body.fecha_creacion) {
        req.body.fecha_creacion = new Date(req.body.fecha_creacion);
      }
      res.render("resenas/form", {
        title: "Registrar reseña",
        resena: req.body,
        usuarios,
        restaurantes,
        errors: [
          {
            msg: "Error al guardar la reseña. Verifica los datos ingresados.",
          },
        ],
        isEditing: false,
      });
    } catch (err) {
      console.error(err);
      res.status(500).render("error", {
        title: "Error",
        message: "Error inesperado",
      });
    }
  }
};

// Mostrar formulario para editar reseña
exports.edit = async (req, res) => {
  try {
    const resena = await Resena.getById(req.params.id);
    if (!resena) {
      return res.status(404).render("error", {
        title: "Error",
        message: "Reseña no encontrada",
      });
    }
    const usuarios = await Usuario.getAll();
    const restaurantes = await Restaurante.getAll();
    res.render("resenas/form", {
      title: "Editar reseña",
      resena,
      usuarios,
      restaurantes,
      errors: [],
      isEditing: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).render("error", {
      title: "Error",
      message: "Error al cargar los datos de la reseña",
    });
  }
};

// Actualizar reseña
exports.update = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    try {
      const usuarios = await Usuario.getAll();
      const restaurantes = await Restaurante.getAll();
      if (req.body.fecha_creacion) {
        req.body.fecha_creacion = new Date(req.body.fecha_creacion);
      }
      return res.render("resenas/form", {
        title: "Editar reseña",
        resena: { ...req.body, id: req.params.id },
        usuarios,
        restaurantes,
        errors: errors.array(),
        isEditing: true,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).render("error", {
        title: "Error",
        message: "Error al cargar formulario con errores",
      });
    }
  }

  try {
    const success = await Resena.update(req.params.id, req.body);
    if (!success) {
      return res.status(404).render("error", {
        title: "Error",
        message: "Reseña no encontrada",
      });
    }
    res.redirect("/resenas");
  } catch (error) {
    console.error(error);
    try {
      const usuarios = await Usuario.getAll();
      const restaurantes = await Restaurante.getAll();
      if (req.body.fecha_creacion) {
        req.body.fecha_creacion = new Date(req.body.fecha_creacion);
      }
      res.render("resenas/form", {
        title: "Editar reseña",
        resena: { ...req.body, id: req.params.id },
        usuarios,
        restaurantes,
        errors: [
          {
            msg: "Error al actualizar la reseña. Verifica los datos ingresados.",
          },
        ],
        isEditing: true,
      });
    } catch (err) {
      console.error(err);
      res.status(500).render("error", {
        title: "Error",
        message: "Error inesperado",
      });
    }
  }
};

// Eliminar reseña
exports.delete = async (req, res) => {
  try {
    const success = await Resena.delete(req.params.id);
    if (!success) {
      return res.status(404).json({ success: false, message: "Reseña no encontrada" });
    }
    res.redirect("/resenas");
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error al eliminar la reseña" });
  }
};

// Mostrar detalles de una reseña
exports.show = async (req, res) => {
  try {
    const resena = await Resena.getById(req.params.id);
    if (!resena) {
      return res.status(404).render("error", {
        title: "Error",
        message: "Reseña no encontrada",
      });
    }
    res.render("resenas/show", {
      title: "Detalle de la Reseña",
      resena
    });
  } catch (error) {
    console.error(error);
    res.status(500).render("error", {
      title: "Error",
      message: "Error al cargar la reseña",
    });
  }
};

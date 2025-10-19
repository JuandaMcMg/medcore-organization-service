// router/routes.js
const { Router } = require("express");
const departmentRoutes = require("./departmentRoutes");
const specialtyRoutes = require("./specialtyRoutes");
const affiliationsRoutes = require("./affiliationsRoutes");

const router = Router();

// Rutas para departamentos
router.use("/departments", departmentRoutes);

// Rutas para especialidades
router.use("/specialties", specialtyRoutes);

// Rutas para afiliaciones
router.use("/affiliations", affiliationsRoutes);

module.exports = router;
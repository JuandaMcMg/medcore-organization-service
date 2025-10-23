const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const { createAffiliation, listAffiliations } = require("../controllers/AffiliationsController");
const AffiliationsController = require("../controllers/AffiliationsController"); // Importar el controlador
const router = express.Router();

/**
 * @route GET /api/v1/affiliations
 * @desc Lista afiliaciones con filtros opcionales
 * @access Privado - Requiere autenticación
 */
router.get("/", authMiddleware, listAffiliations);

/**
 * @route POST /api/v1/affiliations
 * @desc Crea una nueva afiliación
 * @access Privado - Requiere autenticación
 */
router.post("/", authMiddleware, createAffiliation);
router.post('/affiliations', authMiddleware ,AffiliationsController.createAffiliation); // Crear una nueva afiliación


module.exports = router;
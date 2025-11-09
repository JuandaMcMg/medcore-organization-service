const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const { createAffiliation, listAffiliations, updateAffiliation } = require("../controllers/AffiliationsController");
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
// PUT → actualizar afiliación por userId
router.put("/:userId", updateAffiliation);
router.get('/doctors/affiliations', authMiddleware, listAffiliations);




module.exports = router;
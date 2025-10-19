// router/affiliationsRoutes.js
const { Router } = require("express");
const { createAffiliation, listAffiliations } = require("../controllers/AffiliationsController");
const authMiddleware = require("../middlewares/authMiddleware");
const sanitizeMiddleware = require("../middlewares/sanitizeMiddleware");

const router = Router();

/**
 * @route GET /affiliations
 * @desc Lista afiliaciones con filtros opcionales
 * @access Privado - Requiere autenticación
 */
router.get("/", authMiddleware, listAffiliations);

/**
 * @route POST /affiliations
 * @desc Crea una nueva afiliación
 * @access Privado - Requiere autenticación
 */
router.post("/", [authMiddleware, sanitizeMiddleware], createAffiliation);

module.exports = router;
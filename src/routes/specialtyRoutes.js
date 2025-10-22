const express = require('express');
const router = express.Router();
const verifyJWT = require('../middlewares/authMiddleware');
const specialtyController = require('../controllers/specialtyController');

// POST /api/v1/specialties - Crear una nueva especialidad
router.post('/', verifyJWT, specialtyController.createSpecialty);

// GET /api/v1/specialties - Obtener todas las especialidades
router.get('/', verifyJWT, specialtyController.listSpecialties);

// GET /api/v1/specialties/department/:departmentId - Obtener especialidades por departamento
router.get('/department/:departmentId', verifyJWT, specialtyController.listByDepartment);

// PUT /api/v1/specialties/:id - Actualizar una especialidad
router.put('/:id', verifyJWT, specialtyController.updateSpecialty);

module.exports = router;
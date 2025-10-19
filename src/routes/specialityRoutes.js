const express = require('express');
const router = express.Router();
const verifyJWT = require('../middlewares/authMiddleware');
const specialtyController = require('../controllers/specialityController');

// POST /api/v1/specialities - Crear una nueva especialidad
router.post('/', verifyJWT, specialtyController.createSpecialty);

// GET /api/v1/specialities - Obtener todas las especialidades
router.get('/', verifyJWT, specialtyController.listSpecialties);

// GET /api/v1/specialities/department/:departmentId - Obtener especialidades por departamento
router.get('/department/:departmentId', verifyJWT, specialtyController.listByDepartment);

// PUT /api/v1/specialities/:id - Actualizar una especialidad
router.put('/:id', verifyJWT, specialtyController.updateSpecialty);

module.exports = router;
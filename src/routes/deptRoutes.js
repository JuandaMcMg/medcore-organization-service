const express = require('express');
const router = express.Router();
const verifyJWT = require('../middlewares/authMiddleware');
const departmentController = require('../controllers/DeptController');

// POST /api/v1/departments - Crear un nuevo departamento
router.post('/', verifyJWT, departmentController.createDepartment);

// GET /api/v1/departments - Obtener todos los departamentos
router.get('/', verifyJWT, departmentController.listDepartments);

module.exports = router;
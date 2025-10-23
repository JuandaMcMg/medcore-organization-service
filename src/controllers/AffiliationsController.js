// controllers/AffiliationsController.js
const { PrismaClient } = require("../generated/prisma");
const prisma = new PrismaClient();

const VALID_ROLES = ["ADMINISTRADOR","MEDICO","ENFERMERO","PACIENTE"];

const createAffiliation = async (req, res) => {
  try {
    if (!req.body || typeof req.body !== 'object') {
      return res.status(400).json({
        message: "Cuerpo vacío o inválido. Envía JSON con Content-Type: application/json."
      });
    }

    let { userId, role, departmentId, specialtyId } = req.body;

    if (!userId || !role) {
      return res.status(400).json({ message: "userId y role son obligatorios" });
    }
    role = String(role).toUpperCase().trim();
    if (!VALID_ROLES.includes(role)) {
      return res.status(400).json({ message: `role inválido. Permitidos: ${VALID_ROLES.join(", ")}` });
    }

    const user = await prisma.users.findUnique({ where: { id: userId } });
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

    let deptId = departmentId || null;
    let specId = specialtyId || null;

    if (specId) {
      const sp = await prisma.specialties.findUnique({
        where: { id: specId },
        include: { department: { select: { id: true } } }
      });
      if (!sp) return res.status(404).json({ message: "Especialidad no encontrada" });
      if (deptId && deptId !== sp.department.id) {
        return res.status(400).json({ message: "departmentId no coincide con la especialidad" });
      }
      deptId = sp.department.id; // deducimos dept desde specialty
    } else if (deptId) {
      const dept = await prisma.departments.findUnique({ where: { id: deptId } });
      if (!dept) return res.status(404).json({ message: "Departamento no encontrado" });
    }

    // Verificar si existe una afiliación para el usuario con el mismo role
    const exists = await prisma.affiliations.findFirst({
      where: {
        userId,
        role,
      }
    });

    if (exists) {
      return res.status(409).json({
        message: `El usuario ya tiene una afiliación como ${role}`
      });
    }

    const affiliation = await prisma.affiliations.create({
      data: {
        userId,
        role,
        departmentId: deptId,
        specialtyId: specId,
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          }
        },
        department: deptId ? { select: { id: true, name: true } } : undefined,
        specialty: specId ? { select: { id: true, name: true } } : undefined
      }
    }); 

    // Registrar creación de afiliación (implementar después)
    try {
      // Enviaremos un evento al servicio de auditoría más adelante
      console.log(`Afiliación creada para usuario ${user.email} como ${role} por ${req.user?.email || 'sistema'}`);
    } catch (logError) {
      console.error("Error al registrar auditoría:", logError);
    }

    return res.status(201).json({
      message: "Afiliación creada con éxito",
      affiliation
    });
  } catch (error) {
  console.error("createAffiliation error:", error.message);
  console.error(error.stack);
  return res.status(500).json({ message: "Error al crear afiliación" });
}
};

// En controllers/AffiliationsController.js - modifica listAffiliations
const listAffiliations = async (req, res) => {
  try {
    const { userId, role, departmentId, specialtyId, specialty } = req.query;
    
    // Construir filtro dinámicamente
    const where = {};
    if (userId) where.userId = userId;
    if (role) where.role = String(role).toUpperCase().trim();
    if (departmentId) where.departmentId = departmentId;
    if (specialtyId) where.specialtyId = specialtyId;
    
    // Si se busca por nombre de especialidad
    if (specialty) {
      where.specialty = {
        name: { 
          contains: specialty, 
          mode: 'insensitive' 
        }
      };
    }
    
    const affiliations = await prisma.affiliations.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            isActive: true,
          }
        },
        department: {
          select: {
            id: true,
            name: true,
          }
        },
        specialty: {
          select: {
            id: true,
            name: true,
          }
        }
      },
      orderBy: [
        { role: 'asc' },
        { user: { lastName: 'asc' } }
      ]
    });
    
    // Registrar visualización de afiliaciones
    try {
      console.log(`Lista de afiliaciones consultada por ${req.user?.email || 'usuario no autenticado'}`);
    } catch (logError) {
      console.error("Error al registrar auditoría:", logError);
    }
    
    return res.json(affiliations);
  } catch (error) {
    console.error("listAffiliations error:", error);
    return res.status(500).json({ message: "Error al listar afiliaciones" });
  }
};

module.exports = {
  createAffiliation,
  listAffiliations
};
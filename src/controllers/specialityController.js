const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

/**
 * Crea una especialidad dentro de un departamento
 * Body: { name, departmentId, description? }
 */
const createSpecialty = async (req, res) => {
  try {
    const { name, departmentId, description } = req.body;

    if (!name || !departmentId) {
      return res.status(400).json({ message: "name y departmentId son obligatorios" });
    }

    // 1) Validar departamento existe
    const dept = await prisma.departments.findUnique({ where: { id: departmentId } });
    if (!dept) return res.status(404).json({ message: "Departamento no encontrado" });

    // 2) Evitar duplicados por name (tienes @unique)
    const exists = await prisma.specialties.findUnique({ where: { name } });
    if (exists) return res.status(409).json({ message: "La especialidad ya existe" });

    // 3) Crear
    const sp = await prisma.specialties.create({
      data: {
        name,
        departmentId,
        ...(description ? { description } : {}),
      },
    });
    
    // Registrar creación de especialidad (implementar después)
    try {
      // Enviaremos un evento al servicio de auditoría más adelante
      console.log(`Especialidad ${name} creada por ${req.user?.email || 'sistema'}`);
    } catch (logError) {
      console.error("Error al registrar auditoría:", logError);
    }

    return res.status(201).json({ message: "Especialidad creada", specialty: sp });
  } catch (error) {
    console.error("createSpecialty error:", error);
    return res.status(500).json({ message: "Error creando especialidad" });
  }
};

/**
 * Lista todas las especialidades
 */
const listSpecialties = async (req, res) => {
  try {
    const listSpecialtie = await prisma.specialties.findMany({
      include: {
        department: {
          select: { 
            id: true, 
            name: true 
          }
        }
      }
    });
    
    // Registrar visualización de especialidades (implementar después)
    try {
      // Enviaremos un evento al servicio de auditoría más adelante
      console.log(`Lista de especialidades consultada por ${req.user?.email || 'usuario no autenticado'}`);
    } catch (logError) {
      console.error("Error al registrar auditoría:", logError);
    }
    
    return res.json(listSpecialtie);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error listando especialidades" });
  }
};

/**
 * Lista especialidades por departamento
 * Params: :departmentId
 */
const listByDepartment = async (req, res) => {
  try {
    const { departmentId } = req.params;

    const dept = await prisma.departments.findUnique({ where: { id: departmentId } });
    if (!dept) return res.status(404).json({ message: "Departamento no encontrado" });

    const list = await prisma.specialties.findMany({
      where: { departmentId },
      orderBy: { name: "asc" },
    });
    
    // Registrar visualización de especialidades por departamento (implementar después)
    try {
      // Enviaremos un evento al servicio de auditoría más adelante
      console.log(`Especialidades del departamento ${dept.name} consultadas por ${req.user?.email || 'usuario no autenticado'}`);
    } catch (logError) {
      console.error("Error al registrar auditoría:", logError);
    }

    return res.json(list);
  } catch (error) {
    console.error("listByDepartment error:", error);
    return res.status(500).json({ message: "Error listando por departamento" });
  }
};

/**
 * Actualiza nombre y/o mueve la especialidad a otro departamento
 * Params: :id
 * Body: { name?, departmentId? }
 */
const updateSpecialty = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, departmentId } = req.body;

    const data = {};

    if (name) {
      // si cambias el nombre, opcionalmente verifica duplicado
      const dup = await prisma.specialties.findUnique({ where: { name } });
      if (dup && dup.id !== id) {
        return res.status(409).json({ message: "Ya existe una especialidad con ese nombre" });
      }
      data.name = name;
    }

    if (departmentId) {
      const dept = await prisma.departments.findUnique({ where: { id: departmentId } });
      if (!dept) return res.status(404).json({ message: "Departamento destino no encontrado" });
      data.departmentId = departmentId;
    }

    // Actualizar los datos
    const updated = await prisma.specialties.update({
      where: { id },
      data,
      include: { department: true }
    });

    // Registrar actualización de especialidad (implementar después)
    try {
      // Enviaremos un evento al servicio de auditoría más adelante
      console.log(`Especialidad ${updated.name} actualizada por ${req.user?.email || 'sistema'}`);
    } catch (logError) {
      console.error("Error al registrar auditoría:", logError);
    }

    return res.json({ message: "Especialidad actualizada", specialty: updated });
  } catch (error) {
    console.error("updateSpecialty error:", error);
    if (error.code === 'P2025') {
      return res.status(404).json({ message: "Especialidad no encontrada" });
    }
    return res.status(500).json({ message: "Error actualizando especialidad" });
  }
};

module.exports = { 
  createSpecialty, 
  listSpecialties,
  listByDepartment,
  updateSpecialty
};
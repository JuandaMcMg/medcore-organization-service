const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const createDepartment = async (req, res) => {
  try {
    let { name, description } = req.body;
    if (!name) {
        return res.status(400).json({ message: "El nombre del departamento es obligatorio" });
    }

      name = name.toUpperCase().trim();

    // Verificar si el departamento ya existe
    const depExists = await prisma.departments.findUnique({
        where: { name: name }
    });
    if (depExists) {
        return res.status(400).json({ message: "El departamento ya existe" });
    }
    // Crear el nuevo departamento
    const department = await prisma.departments.create({
        data: {
            name: name,
            description: description
        }
    });
    
    // Registrar creación de departamento en el registro de auditoría (implementar después)
    try {
      // Enviaremos un evento al servicio de auditoría más adelante
      console.log(`Departamento ${name} creado por ${req.user?.email || 'sistema'}`);
    } catch (logError) {
      console.error("Error al registrar auditoría:", logError);
    }
    
    return res.status(201).json({ message: "Departamento creado exitosamente", department });
  } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Error en el servidor" });
  }
};

const listDepartments = async (req, res) => {
  try {
    const depts = await prisma.departments.findMany();
    
    // Registrar visualización de departamentos (implementar después)
    try {
      // Enviaremos un evento al servicio de auditoría más adelante
      console.log(`Lista de departamentos consultada por ${req.user?.email || 'usuario no autenticado'}`);
    } catch (logError) {
      console.error("Error al registrar auditoría:", logError);
    }
    
    return res.json(depts);
  } catch (error) {
    console.error("listDepartments error:", error);
    return res.status(500).json({ message: "Error en el servidor" });
  }
};

module.exports = { createDepartment, listDepartments };
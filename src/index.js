const express = require("express");
const database = require("./database/database");
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
const { sanitizeInputs } = require("./middlewares/sanitizeMiddleware");

// Importar rutas
const deptRoutes = require("./routes/deptRoutes");
const specialityRoutes = require("./routes/specialityRoutes");
const affiliationsRoutes = require("./routes/affiliationsRoutes");

require("dotenv").config();

const port = process.env.PORT || 3004;
const app = express();

// Permitir CORS para comunicación entre microservicios
app.use(cors({
  origin: ["http://localhost:3000", "http://localhost:3001"], // Frontend y API Gateway
  credentials: true,
}));

app.use(helmet()); // Añade headers de seguridad
app.use(bodyParser.json());
app.use(sanitizeInputs); // Sanitiza las entradas contra XSS

// Health check endpoint
app.get("/health", (_req, res) =>
  res.json({ 
    ok: true, 
    ts: new Date().toISOString(),
    service: "organization-service",
    port: port
  })
);

// Rutas del servicio
app.use('/api/v1/departments', deptRoutes);
app.use('/api/v1/specialities', specialityRoutes);
app.use('/api/v1/affiliations', affiliationsRoutes);
app.use('/api/v1', require('./routes/affiliationsRoutes')); //
app.use('/api/v1/affiliations', require('../src/routes/affiliationsRoutes'));


// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Organization Service Error:", err);
  res.status(500).json({ 
    error: "Internal Server Error", 
    message: "Organization service encountered an error",
    service: "organization-service"
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    error: "Not Found", 
    message: `Route ${req.originalUrl} not found in organization service`,
    service: "organization-service"
  });
});

database();

app.listen(port, () => {
  console.log(`🏢 Organization Service running on port ${port}`);
  database();
});

module.exports = app;
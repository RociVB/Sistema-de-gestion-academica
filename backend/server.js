const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const studentRoutes = require('./routes/studentRoutes');
const teacherRoutes = require('./routes/teacherRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const settingsRoutes = require('./routes/settingsRoutes');

const app = express();

// Seguridad: cabeceras HTTP defensivas
app.use(helmet());

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/students', studentRoutes);
app.use('/api/teachers', teacherRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/settings', settingsRoutes);

// Ruta de prueba / health-check
app.get('/', (req, res) => {
  res.json({ message: 'API del Sistema de Gestión Académica funcionando correctamente.' });
});

// Manejo de rutas no encontradas (404)
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// Manejador global de errores (debe tener 4 parámetros para que Express lo reconozca)
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error('[Error global]', err);
  res.status(500).json({ error: 'Error interno del servidor.' });
});

// Inicio del servidor
const PORT = process.env.PORT || 5001;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor Backend corriendo en el puerto ${PORT}`);
});

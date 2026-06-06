# Sistema de Gestión Académica Universitaria

Dashboard Administrativo Full Stack desarrollado como proyecto universitario para la gestión de estudiantes, profesores y configuración académica.

---

## 🛠 Tecnologías Utilizadas

### Frontend
- **React 19** con **Vite** como bundler
- **Tailwind CSS v4** para estilos modernos y responsive
- **React Router DOM v7** para la navegación SPA
- **Axios** para el consumo de la API REST
- **Recharts** para gráficos estadísticos (barras y torta)
- **React Icons** para la iconografía
- **React Toastify** para notificaciones interactivas

### Backend
- **Node.js** y **Express v5**
- **SQLite** (via `better-sqlite3`) como base de datos embebida — no requiere instalación de servidor externo
- **dotenv** para la gestión de variables de entorno
- **cors** para políticas de seguridad cruzada
- **nodemon** como herramienta de desarrollo para recarga automática

---

## 🏗 Arquitectura

El proyecto sigue una arquitectura **Cliente-Servidor** con dos aplicaciones independientes:

```
├── backend/        # API REST (Express + SQLite)
│   ├── config/     # Inicialización de la base de datos
│   ├── controllers/# Lógica de negocio por entidad
│   ├── models/     # Acceso a datos (queries SQL)
│   ├── routes/     # Definición de endpoints
│   └── utils/      # Validaciones y sanitización
└── frontend/       # SPA (React + Vite)
    └── src/
        ├── components/  # Componentes reutilizables (Buttons, Cards, Forms, etc.)
        ├── pages/       # Vistas principales (Dashboard, Estudiantes, Profesores, Configuración)
        ├── services/    # Cliente HTTP (Axios)
        └── utils/       # Helpers de validación de formularios
```

El backend sigue el patrón **MVC**: las peticiones llegan por las `routes`, pasan a los `controllers` (lógica de negocio), que interactúan con los `models` (queries SQLite). La base de datos se crea automáticamente al iniciar el servidor por primera vez.

---

## 🚀 Instrucciones de Instalación

### Prerrequisitos
- [Node.js](https://nodejs.org/) v18 o superior
- npm v9 o superior

### Opción A — Instalación completa desde la raíz (recomendado)

```bash
# Instalar dependencias de ambas aplicaciones
npm run install:all

# Iniciar servidor y frontend en paralelo
npm run dev
```

### Opción B — Instalación manual por separado

#### Backend

```bash
cd backend
npm install

# Copiar el archivo de variables de entorno y ajustarlo si es necesario
cp .env.example .env

# Iniciar en modo desarrollo (con nodemon)
npm run dev

# O iniciar en modo producción
npm run start
```
> El servidor backend correrá en **http://localhost:5001**

#### Frontend

```bash
cd frontend
npm install
npm run dev
```
> La aplicación React abrirá en **http://localhost:5173**

> **Nota:** La base de datos SQLite (`database.sqlite`) se genera automáticamente en `backend/` al correr el servidor por primera vez. No es necesario ejecutar ningún script SQL manualmente.

---

## ✅ Funcionalidades

| Módulo | Descripción |
|---|---|
| **Dashboard** | Métricas generales y gráficos de estudiantes por carrera y profesores por especialidad |
| **Estudiantes** | CRUD completo con búsqueda en tiempo real y validación de formularios |
| **Profesores** | CRUD completo con búsqueda en tiempo real y validación de formularios |
| **Configuración** | Gestión de catálogos: Carreras, Semestres y Períodos académicos |
| **Validaciones** | Validación de cédula venezolana (V-/E-), correo, teléfono y campos de texto en backend y frontend |
| **Notificaciones** | Feedback visual con Toast tras cada operación CRUD |
| **Modales** | Confirmación de eliminación para prevenir borrados accidentales |

---

## 📡 Endpoints de la API

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/api/dashboard/stats` | Estadísticas generales |
| GET | `/api/students` | Listar estudiantes (soporta `?search=`) |
| GET | `/api/students/:id` | Obtener un estudiante |
| POST | `/api/students` | Crear estudiante |
| PUT | `/api/students/:id` | Actualizar estudiante |
| DELETE | `/api/students/:id` | Eliminar estudiante |
| GET | `/api/teachers` | Listar profesores (soporta `?search=`) |
| GET | `/api/teachers/:id` | Obtener un profesor |
| POST | `/api/teachers` | Crear profesor |
| PUT | `/api/teachers/:id` | Actualizar profesor |
| DELETE | `/api/teachers/:id` | Eliminar profesor |
| GET | `/api/settings/catalogs` | Obtener todos los catálogos |
| POST | `/api/settings/careers` | Crear carrera |
| DELETE | `/api/settings/careers/:id` | Eliminar carrera |
| POST | `/api/settings/semesters` | Crear semestre |
| DELETE | `/api/settings/semesters/:id` | Eliminar semestre |
| POST | `/api/settings/periods` | Crear período |
| DELETE | `/api/settings/periods/:id` | Eliminar período |

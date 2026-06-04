# Sistema de Gestión Académica Universitaria

Este es un Dashboard Administrativo Profesional Full Stack desarrollado como proyecto universitario.

## Tecnologías Utilizadas

### Frontend
- **React** (Vite)
- **Tailwind CSS** para estilos modernos y responsive.
- **React Router DOM** para la navegación.
- **Axios** para el consumo de la API REST.
- **Recharts** para gráficos estadísticos.
- **React Icons** para la iconografía.
- **React Toastify** para notificaciones interactivas.

### Backend
- **Node.js** y **Express**.
- **PostgreSQL** como base de datos relacional.
- **pg** para la conexión a la base de datos.
- **dotenv** para variables de entorno.
- **cors** para políticas de seguridad cruzada.

## Arquitectura

El proyecto sigue una arquitectura **Cliente-Servidor**.
- El **Frontend** está estructurado en componentes reutilizables (Layouts, Buttons, Cards, Tables, Modals, Forms) y páginas (Dashboard, Estudiantes, Profesores). Utiliza Hooks como `useState` y `useEffect` para la programación reactiva y el manejo del estado local y consumo de API.
- El **Backend** sigue el patrón **MVC** (Modelo-Vista-Controlador). Las peticiones entran por las rutas (`routes`), pasan por los controladores (`controllers`) donde se ejecuta la lógica de negocio, y estos interactúan con los modelos (`models`) que ejecutan las consultas SQL en PostgreSQL.

## Instrucciones de Instalación

### 1. Base de Datos
1. Asegúrate de tener PostgreSQL instalado y en ejecución.
2. Crea una base de datos llamada `gestion_academica`.
3. Ejecuta el script SQL que se encuentra en `backend/database.sql` para crear las tablas `students` y `teachers`.

### 2. Configuración del Backend
1. Navega a la carpeta del backend: `cd backend`
2. Instala las dependencias: `npm install`
3. Edita el archivo `.env` en la carpeta `backend` con tus credenciales de PostgreSQL si son diferentes a las por defecto.
4. Inicia el servidor: `npm run start` (o `npx nodemon server.js` para desarrollo).
   El servidor correrá en `http://localhost:5000`.

### 3. Configuración del Frontend
1. Abre una nueva terminal y navega a la carpeta del frontend: `cd frontend`
2. Instala las dependencias: `npm install`
3. Inicia la aplicación React: `npm run dev`
4. Abre el enlace proporcionado por Vite (usualmente `http://localhost:5173`) en tu navegador.

## Funcionalidades Implementadas
- **Dashboard Estadístico**: Tarjetas con indicadores y gráficos generados dinámicamente con Recharts.
- **CRUD Completo de Estudiantes y Profesores**: Crear, leer, actualizar y eliminar registros de ambas entidades.
- **Buscador en Tablas**: Filtros en tiempo real para encontrar registros rápidamente.
- **Modales de Confirmación**: Prevención de eliminaciones accidentales.
- **Diseño Moderno y Responsivo**: Implementado totalmente con Tailwind CSS.
- **Notificaciones (Toasts)**: Feedback visual tras cada operación del CRUD.

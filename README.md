# Challenge Fullstack Interseguro

Esta es una solución de arquitectura de microservicios diseñada para procesar matrices matemáticas, integrando lo último en estándares de desarrollo backend, seguridad y diseño frontend.

## 🚀 Características Elite

- **Transformaciones Matemáticas**:
  - **Factorización QR**: Implementada en Go usando la librería `gonum/mat`.
  - **Rotación Pro**: Soporte para 90°, 180° y 270° en ambos sentidos.
- **Seguridad Robusta**: 
  - Autenticación mediante **JWT (JSON Web Tokens)** compartidos entre servicios.
  - Protección de endpoints en Go (Fiber) y Node (Express).
- **Documentación Interactiva**: 
  - API documentada con **Swagger (OpenAPI)** accesible en `/swagger`.
- **Arquitectura de Microservicios**: 
  - Comunicación asíncrona y resiliente entre Go y Node.
  - Orquestación completa con **Docker Compose**.
- **Frontend Premium**: 
  - SPA moderna construida con **React 19 + TypeScript + Vite**.
  - Interfaz de vanguardia con **Glassmorphism**, diseño responsivo y estética de alto impacto.
- **Calidad de Código**: 
  - Suite de **Pruebas Unitarias** integrada en el ciclo de vida de Docker (CI/CD nativo).

---

## 🛠️ Stack Tecnológico

| Capa | Tecnologías |
| :--- | :--- |
| **Backend Core (API Gateway)** | Go 1.22 + Fiber + JWT |
| **Servicio de Estadísticas** | Node.js 20 + Express + TypeScript |
| **Frontend** | React + TailwindCSS (Glassmorphism) |
| **DevOps** | Docker + Docker Compose + Swagger |

---

## 🚦 Cómo Levantar el Proyecto

Asegúrate de tener **Docker Desktop** iniciado. Desde la raíz del proyecto:

```bash
docker compose up --build
```

### URLs de Acceso:
- **Frontend**: [http://localhost:5173](http://localhost:5173)
- **Documentación API (Swagger)**: [http://localhost:8080/swagger](http://localhost:8080/swagger)
- **Health Check Go**: `http://localhost:8080/health`
- **Health Check Node**: `http://localhost:3000/health`

---

## ☁️ Despliegue en la Nube (Render)

Este proyecto está listo para ser desplegado en **Render** usando **Blueprints**. Solo necesitas:

1.  Conectar tu repositorio de GitHub a Render.
2.  Render detectará automáticamente el archivo `render.yaml`.
3.  Aprobar el despliegue.

**Configuraciones automáticas realizadas:**
- Orquestación de los 3 servicios.
- Generación automática de secretos.
- Comunicación interna optimizada.
- Puertos dinámicos configurados.

---

### Credenciales de Prueba:
- **Usuario**: `admin`
- **Contraseña**: `admin123`

---

## 🧪 Pruebas Unitarias

Los tests se ejecutan automáticamente durante el build de las imágenes de Docker. Si deseas correrlos manualmente:

**Node API**:
```bash
docker exec -it node-api npm test
```

**Go API**:
```bash
docker run --rm -v "${PWD}/go-api:/app" -w /app golang:1.22 go test -v ./src/...
```

---

## 📐 Decisiones Arquitectónicas

1.  **Manejo de Inconsistencias**: Ante la ambigüedad del enunciado (QR vs Rotación), se optó por implementar ambas capacidades como endpoints independientes, demostrando extensibilidad.
2.  **Fault Tolerance**: La Go API está diseñada para devolver resultados incluso si el microservicio de Node (estadísticas) no está disponible, informando mediante `warnings`.
3.  **Seguridad**: Se implementó un middleware de JWT para proteger los datos y demostrar conocimientos en seguridad web.
4.  **Diseño Visual**: Se priorizó la estética con un sistema de diseño basado en cristales y gradientes para impresionar visualmente al usuario.



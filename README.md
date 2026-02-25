## Challenge Fullstack Interseguro

Aplicación fullstack para trabajar con matrices numéricas:

- **Go API (`go-api`)**: expone operaciones de **descomposición QR** y **rotación de matrices**, y delega el cálculo de estadísticas a un microservicio Node.
- **Node API (`node-api`)**: microservicio en **Node + Express** que calcula estadísticas agregadas de matrices.
- **Frontend (`frontend`)**: SPA en **React + Vite + TailwindCSS** para cargar matrices, ejecutar operaciones y visualizar resultados.

---

## Arquitectura general

- **Frontend**
  - React 19 + Vite + TailwindCSS.
  - En Docker queda publicado en `http://localhost:5173`.
  - En desarrollo local con `npm run dev` usa `http://localhost:8080` como base para la Go API (ver `frontend/src/api/http.ts`).

- **Go API (`go-api`)**
  - Framework: Fiber.
  - Puerto por defecto: **8080**.
  - Expone endpoints REST bajo `/api/v1/matrices`.
  - Consume a la Node API vía `NODE_API_URL` para obtener estadísticas.

- **Node API (`node-api`)**
  - Framework: Express.
  - Puerto por defecto: **3000**.
  - Expone un endpoint de estadísticas en `/v1/api/stats`.

- **Orquestación**
  - Todo se levanta con `docker-compose` (`docker-compose.yml` en la raíz).

---

## Requisitos previos

- **Docker** y **Docker Compose** instalados.
- Opcional (para correr en local sin Docker):
  - **Node.js** >= 18 (recomendado 18 o 20) para `node-api` y `frontend`.
  - **Go** >= 1.21 para `go-api`.

---

## Cómo levantar el proyecto con Docker

Desde la raíz del proyecto:

```bash
docker compose up --build
```

Esto levanta 3 servicios:

- **frontend**
  - URL: `http://localhost:5173`
  - Internamente sirve el build de Vite (Nginx dentro del contenedor).

- **go-api**
  - URL: `http://localhost:8080`
  - Variables de entorno (ver `docker-compose.yml`):
    - `PORT=8080`
    - `NODE_API_URL=http://node-api:3000`

- **node-api**
  - URL: `http://localhost:3000`
  - Puerto interno y externo: `3000`.

### Endpoints de salud (health checks)

- **Go API**

  - **GET** `http://localhost:8080/health`
  - Respuesta esperada:

    ```json
    {
      "ok": true,
      "nodeApi": "http://node-api:3000"
    }
    ```

- **Node API**

  - **GET** `http://localhost:3000/health`
  - Respuesta esperada:

    ```json
    {
      "ok": true
    }
    ```

---

## Cómo ejecutar cada servicio en local (sin Docker)

### 1. Node API (`node-api`)

```bash
cd node-api
npm install
npm run dev
```

- Puerto por defecto: `3000`.
- Endpoints base: `http://localhost:3000`.

### 2. Go API (`go-api`)

En otra terminal:

```bash
cd go-api
set NODE_API_URL=http://localhost:3000  # PowerShell/CMD en Windows
go run ./src/main.go
```

Si no se define `PORT`, la API usará el puerto `8080` por defecto:

- Base URL: `http://localhost:8080`.

### 3. Frontend (`frontend`)

En otra terminal:

```bash
cd frontend
npm install
npm run dev
```

- URL de desarrollo: `http://localhost:5173`.
- El cliente HTTP apunta por defecto a `http://localhost:8080` (ver `src/api/http.ts`), por lo que la Go API debe estar levantada en ese puerto.

---

## API Go (`go-api`)

Base URL (local / Docker): **`http://localhost:8080`**

### 1. GET `/health`

- **Descripción**: Verifica que la Go API está viva y muestra la URL configurada para la Node API.
- **Respuesta 200** (ejemplo):

```json
{
  "ok": true,
  "nodeApi": "http://node-api:3000"
}
```

---

### 2. POST `/api/v1/matrices/qr`

- **Descripción**: Calcula la **descomposición QR** de una matriz \(A\), devolviendo matrices \(Q\) y \(R\). Además, llama a la Node API para obtener estadísticas sobre \(Q\) y \(R\).
- **Body (JSON)**:

```json
{
  "matrix": [
    [1, 2],
    [3, 4]
  ]
}
```

- **Respuesta 200** (caso normal, con estadísticas):

```json
{
  "qr": {
    "Q": [[/* ... */]],
    "R": [[/* ... */]]
  },
  "stats": {
    "global": {
      "min": -1.2,
      "max": 4.5,
      "sum": 10.5,
      "avg": 1.75,
      "count": 6
    },
    "perMatrix": {
      "Q": {
        "shape": { "rows": 2, "cols": 2 },
        "stats": {
          "min": -1.2,
          "max": 1.3,
          "sum": 0.1,
          "avg": 0.025,
          "count": 4
        },
        "diagonal": false
      },
      "R": {
        "shape": { "rows": 2, "cols": 2 },
        "stats": {
          "min": 0,
          "max": 4.5,
          "sum": 10.4,
          "avg": 2.6,
          "count": 4
        },
        "diagonal": true
      }
    }
  }
}
```

- **Respuesta 200** (cuando falla la Node API, pero el QR se calcula bien):

```json
{
  "qr": {
    "Q": [[/* ... */]],
    "R": [[/* ... */]]
  },
  "stats": null,
  "warning": "QR computed successfully, but stats service is unavailable",
  "detail": "error llamando Node API: ..."
}
```

- **Códigos de error**:
  - `400 Bad Request`:
    - Body JSON inválido.
    - Matriz vacía o no rectangular.
    - Matriz con filas de distinta longitud.

---

### 3. POST `/api/v1/matrices/rotation`

- **Descripción**: Rota una matriz \(N \times M\) un número de grados específico y calcula estadísticas sobre la matriz resultante.
- **Body (JSON)**:

```json
{
  "matrix": [
    [1, 2],
    [3, 4]
  ],
  "degrees": 90,
  "direction": "cw"
}
```

- **Parámetros**:
  - **`matrix`**: `number[][]` (obligatorio).
    - Debe ser una matriz rectangular (todas las filas con la misma longitud) y no vacía.
  - **`degrees`**: `90 | 180 | 270` (opcional, por defecto `90`).
  - **`direction`**: `"cw" | "ccw"` (opcional, por defecto `"cw"`).
    - `"cw"`: clockwise (sentido horario).
    - `"ccw"`: counter‑clockwise (sentido antihorario).

- **Respuesta 200** (caso normal):

```json
{
  "rotated": [
    [3, 1],
    [4, 2]
  ],
  "stats": {
    "global": {
      "min": 1,
      "max": 4,
      "sum": 10,
      "avg": 2.5,
      "count": 4
    },
    "perMatrix": {
      "Rotated": {
        "shape": { "rows": 2, "cols": 2 },
        "stats": {
          "min": 1,
          "max": 4,
          "sum": 10,
          "avg": 2.5,
          "count": 4
        },
        "diagonal": false
      }
    }
  }
}
```

- **Respuesta 200** (cuando falla la Node API, pero la rotación se calcula bien):

```json
{
  "rotated": [[/* ... */]],
  "stats": null,
  "warning": "Rotation computed successfully, but stats service is unavailable",
  "detail": "error llamando Node API: ..."
}
```

- **Códigos de error**:
  - `400 Bad Request`:
    - Body JSON inválido.
    - Matriz vacía o no rectangular.
    - `degrees` con un valor distinto de `90`, `180` o `270`.
    - `direction` con un valor distinto de `"cw"` o `"ccw"`.

---

## API Node (`node-api`)

Base URL (local / Docker): **`http://localhost:3000`**

### 1. GET `/health`

- **Descripción**: Verifica que la Node API está viva.
- **Respuesta 200**:

```json
{
  "ok": true
}
```

---

### 2. POST `/v1/api/stats`

- **Descripción**: Calcula estadísticas sobre múltiples matrices en un solo request. Este endpoint es utilizado internamente por la Go API, pero puede consumirse directamente para pruebas.
- **Body (JSON)**:

```json
{
  "matrices": {
    "A": [
      [1, 2],
      [3, 4]
    ],
    "B": [
      [5, 6],
      [7, 8]
    ]
  }
}
```

- **Esquema de respuesta** (`StatsResponse`):

```json
{
  "global": {
    "min": 1,
    "max": 8,
    "sum": 36,
    "avg": 4.5,
    "count": 8
  },
  "perMatrix": {
    "A": {
      "shape": { "rows": 2, "cols": 2 },
      "stats": {
        "min": 1,
        "max": 4,
        "sum": 10,
        "avg": 2.5,
        "count": 4
      },
      "diagonal": false
    },
    "B": {
      "shape": { "rows": 2, "cols": 2 },
      "stats": {
        "min": 5,
        "max": 8,
        "sum": 26,
        "avg": 6.5,
        "count": 4
      },
      "diagonal": false
    }
  }
}
```

- **Códigos de error**:
  - `400 Bad Request`:
    - Body inválido (no se envía `matrices` o no es un objeto).
    - Alguna de las matrices no es rectangular.

---

## Frontend (`frontend`)

- **Tecnologías**:
  - React + TypeScript.
  - Vite como bundler.
  - TailwindCSS para estilos.

- **Puntos clave**:
  - El cliente HTTP está configurado en `src/api/http.ts` con:

    ```ts
    export const http = axios.create({
      baseURL: "http://localhost:8080",
      timeout: 10000,
      headers: { "Content-Type": "application/json" }
    });
    ```

  - Las operaciones de matrices se encapsulan en `src/api/matrices.api.ts`, que llama a:
    - `POST /api/v1/matrices/qr`
    - `POST /api/v1/matrices/rotation`

- **Flujo típico de uso**:
  1. El usuario ingresa una matriz desde la interfaz.
  2. Selecciona la operación (**QR** o **Rotación**) y, en el caso de rotación, los parámetros `degrees` y `direction`.
  3. El frontend envía la petición a la Go API.
  4. La Go API calcula el resultado y, en paralelo, invoca a la Node API para obtener estadísticas.
  5. El frontend muestra:
     - Matrices resultantes (`Q`, `R`, `rotated`).
     - Estadísticas globales y por matriz (si la Node API respondió correctamente).

---

## Ejemplos rápidos con cURL

### QR de una matriz

```bash
curl -X POST http://localhost:8080/api/v1/matrices/qr ^
  -H "Content-Type: application/json" ^
  -d "{\"matrix\": [[1,2],[3,4]]}"
```

### Rotación 90° clockwise

```bash
curl -X POST http://localhost:8080/api/v1/matrices/rotation ^
  -H "Content-Type: application/json" ^
  -d "{\"matrix\": [[1,2],[3,4]], \"degrees\": 90, \"direction\": \"cw\"}"
```

---

## Notas técnicas

- La Go API valida que las matrices:
  - No estén vacías.
  - Sean rectangulares (todas las filas con la misma cantidad de columnas).
- La Node API también valida forma rectangular antes de calcular estadísticas.
- La caída de la Node API **no rompe** el flujo principal:
  - Se devuelve el resultado de QR/rotación igualmente.
  - Se incluye un `warning` y detalle de error cuando no se pueden obtener estadísticas.


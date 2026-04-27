# 🏆 Mundial 2026 Fixture API - Backend Core

![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![Zod](https://img.shields.io/badge/Zod-3E67B1?style=for-the-badge&logo=zod&logoColor=white)

Un motor backend robusto, escalable y orientado a datos desarrollado para gestionar el fixture, los resultados y las clasificaciones de la Copa Mundial de la FIFA 2026. 

Este proyecto no es solo un CRUD básico; es un sistema que implementa **reglas de negocio complejas**, motores de cálculo automatizados y una arquitectura fuertemente desacoplada, pensada para soportar integraciones con múltiples plataformas frontend.

---

## 🏗️ Arquitectura y Diseño del Sistema

El proyecto está construido bajo una estricta **Arquitectura de N-Capas (N-Tier Architecture)**, garantizando la separación de responsabilidades, la mantenibilidad y la escalabilidad a largo plazo.

1. **Rutas (Router):** Definen los endpoints y delegan el flujo de la petición.
2. **Controladores (Controllers):** Interceptan la petición, higienizan y validan estrictamente las entradas utilizando **Zod v4** antes de tocar la lógica de negocio.
3. **Servicios (Services):** Contienen el "cerebro" de la aplicación. Manejan las reglas del torneo, el cálculo de puntos y la proyección de calendarios sin acoplarse a ninguna tecnología de base de datos específica.
4. **Data Access Objects (DAOs):** Implementación del **Factory Pattern**. Permite que el sistema interactúe con MongoDB hoy, y pueda migrar a PostgreSQL mañana sin alterar una sola línea de código en los Servicios.
---

## 🚀 Funcionalidades Destacadas (Business Logic)

- **Calculadora Automática de Posiciones (Standings Engine):** Un algoritmo nativo que procesa los resultados de los partidos, calcula puntos (3, 1, 0), diferencia de goles y goles a favor, actualizando automáticamente el estado de clasificación (`qualifiedTo`) de los equipos en la base de datos.
- **Smart Schedule (Calendario Inteligente):** Un endpoint diseñado específicamente para optimizar la UX del frontend. En lugar de devolver todos los partidos del torneo, detecta el "Hoy" y proyecta inteligentemente cuál es la "Próxima Fecha" con actividad, filtrando los días de descanso.
- **Estrategia de Población (Data Hydration):** Uso eficiente de relaciones no relacionales (Mongoose Populate) para entregar payloads completos listos para renderizar (incluyendo escudos y estadios), reduciendo la cantidad de peticiones del lado del cliente.
- **Gestión Avanzada de Estados:** Soporte completo para fases de grupos y eliminatorias, incluyendo validaciones condicionales para definiciones por penales.

---

## 🧠 Desafíos Técnicos Resueltos

Durante el desarrollo, me enfoqué en resolver problemas reales de ingeniería de software:

* **Desacoplamiento Absoluto:** Inicialmente, la lógica de consultas de fechas convivía en la capa de Servicios. Refactoricé el sistema trasladando las dependencias específicas de MongoDB (`$gte`, `$lte`) exclusivamente a la capa DAO. **Resultado:** Un dominio de negocio 100% agnóstico a la infraestructura.
* **Flexibilidad vs. Tipado Estricto:** Implementé esquemas de Zod dinámicos (`.nullable().optional()`) para los comandos `PUT`, permitiendo actualizaciones parciales seguras sin corromper la integridad de los datos estadísticos, vital para manejar resultados nulos antes de que se jueguen los partidos.
* **Prevención de Cuellos de Botella de Red:** Para las vistas generales (Dashboard), diseñé un endpoint consolidado (`GET /api/standings`) que calcula las 12 tablas de posiciones del torneo en un solo viaje a la base de datos, evitando sobrecargar al cliente con múltiples peticiones concurrentes.

---

## 🛠️ Tecnologías Utilizadas

* **Runtime:** Node.js (ES Modules)
* **Framework:** Express.js
* **Base de Datos:** MongoDB Atlas (Cloud)
* **ODM:** Mongoose v8
* **Validación:** Zod v4
* **Despliegue:** Zeabur / GitHub Actions

---

## ⚙️ Instalación y Uso Local

Sigue estos pasos para levantar el entorno de desarrollo en tu máquina local:

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/GeorgeValle/fixture-mundial-2026-backend.git
   cd fixture-mundial-2026-backend
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

   3. **Configurar Variables de Entorno:**
   Crea un archivo `.env` en la raíz del proyecto y agrega tus credenciales:
   ```env
   PORT=8080
   MONGO_URI=mongodb+srv://<usuario>:<password>@cluster.mongodb.net/mundial_db
   ```

4. **Ejecutar en modo desarrollo:**
   ```bash
   npm run dev
   ```
   *El servidor estará disponible en `http://localhost:8080`*

---

## 📂 Documentación de la API (Endpoints)

La API cuenta con una estructura RESTful estandarizada. *Para ver el payload completo y las reglas de cada ruta, revisar el archivo `API_Documentation_Fixture2026_v2.md` incluido en este repositorio.*

* **Equipos:** `GET`, `POST`, `PUT` en `/api/teams`
* **Estadios:** `GET`, `POST` en `/api/stadiums`
* **Partidos:** `GET`, `POST`, `PUT` en `/api/matches`
  * *Calendario Inteligente:* `GET /api/matches/schedule/daily`
* **Posiciones:** `GET`, `POST` en `/api/standings`

---

## 👨‍💻 Autor

**George Valle**
Analista de Sistemas | Desarrollador Full Stack (MERN/Angular)

* 💼 **LinkedIn:** [linkedin.com/in/valle-jorge/]
* 🐙 **GitHub:** [@GeorgeValle](https://github.com/GeorgeValle/world-cup-2026-back)
* ✉️ **Contacto:** georgevalle@outlook.com.ar / jorgeguillermovalle@gmail.com
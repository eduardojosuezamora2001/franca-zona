# Planeamiento del Proyecto — ZoFranca CR

## 1. Resumen

Plataforma web modular para la gestión de solicitudes de instalación y cumplimiento en zonas francas de Costa Rica. Este documento define la arquitectura técnica, el stack, la estrategia de componentización en JavaScript y la organización por módulos, en línea con los RF/RNF y las historias de usuario del laboratorio.

---

## 1.1 Tecnologías a utilizar

| Capa | Tecnología | Justificación |
|---|---|---|
| Backend simulado | **Node.js + json-server** | Persistencia real en `db.json`, expone API REST (`/solicitudes`, `/empresas`, `/reportesCumplimiento`, `/zonasFrancas`), soporta RF-03, RF-16, RNF-06 |
| Frontend — estructura | **HTML5** | Páginas multi-vista, una por módulo/rol |
| Frontend — estilos | **CSS3** (variables CSS / custom properties) | Necesario para theming dinámico (sección de diseño), sin frameworks de UI |
| Frontend — lógica | **JavaScript Vanilla (ES6+)** | Módulos ES (`import`/`export`), `fetch`, `Promise`, `async/await`, `Promise.all` (RF-13, RNF-01, RNF-03) |
| IA | Función `evaluarConIA()` (simulada o vía API real) | RF-04, RF-08, sección 5.4 del enunciado |
| Control de versiones | GitHub (ramas + pull requests) | RNF-08, sección 7.1 |
| Gestión de tareas | Trello | Sección 7.2 |
| Diseño de interfaz | Stitch (mockups previos al código) | RNF-07 |

**No se usan frameworks de frontend (React/Vue) ni CSS frameworks** — todo el proyecto se construye con vanilla JS, priorizando el manejo explícito de asincronía y la construcción manual de componentes reutilizables, tal como exige el laboratorio.

---

## 1.2 Componentización con JavaScript (evitar repetir HTML)

### Estrategia general
En lugar de duplicar HTML de navegación, alertas, tablas, etc. en cada página, se construyen **componentes JS reutilizables** que generan su propio HTML dinámicamente (mediante template strings o `<template>` + `cloneNode`) y se insertan en un contenedor (`<div id="app-shell">`) presente en todas las páginas.

### Patrón de componente

```js
// components/component-base.js
export function crearComponente(html, montarEn) {
  const contenedor = document.querySelector(montarEn);
  contenedor.innerHTML = html;
  return contenedor;
}
```

Cada componente vive en su propio archivo dentro de `/components`, exporta una función `render(props)` y, si aplica, `bind(elemento)` para conectar sus eventos.

### 1.2.1 Componente de navegación (Navbar) sensible al rol

El menú cambia según el rol autenticado (`empresa`, `analista`, `administrador`), guardado en `localStorage`/`sessionStorage` tras el login simulado.

```js
// components/navbar.js
const MENU_POR_ROL = {
  empresa: [
    { texto: 'Nueva solicitud', href: 'solicitud-nueva.html' },
    { texto: 'Mis solicitudes', href: 'solicitud-historial.html' },
    { texto: 'Reportar cumplimiento', href: 'reporte-cumplimiento.html' },
  ],
  analista: [
    { texto: 'Dashboard solicitudes', href: 'dashboard-solicitudes.html' },
    { texto: 'Detalle / clasificación', href: 'solicitud-detalle.html' },
    { texto: 'Alertas de incumplimiento', href: 'panel-alertas.html' },
    { texto: 'Historial y trazabilidad', href: 'historial-empresa.html' },
  ],
  administrador: [
    { texto: 'Dashboard solicitudes', href: 'dashboard-solicitudes.html' },
    { texto: 'Panel de métricas', href: 'panel-metricas.html' },
    { texto: 'Zonas francas', href: 'admin-zonas-francas.html' },
    { texto: 'Alertas de incumplimiento', href: 'panel-alertas.html' },
  ],
};

export function renderNavbar(rolActual) {
  const items = MENU_POR_ROL[rolActual] || [];
  const html = `
    <nav class="navbar" data-rol="${rolActual}">
      <div class="navbar__logo">ZoFranca CR</div>
      <ul class="navbar__links">
        ${items.map(i => `<li><a href="${i.href}">${i.texto}</a></li>`).join('')}
      </ul>
      <div class="navbar__acciones">
        <div id="selector-tema"></div>
        <div id="selector-idioma"></div>
        <button id="btn-logout">Salir</button>
      </div>
    </nav>`;
  document.querySelector('#app-shell').insertAdjacentHTML('afterbegin', html);
}
```

Cada página HTML solo necesita:

```html
<div id="app-shell"></div>
<script type="module">
  import { renderNavbar } from './components/navbar.js';
  renderNavbar(obtenerRolActual());
</script>
```

### 1.2.2 Otros componentes reutilizables previstos

| Componente | Archivo | Usado en | Resuelve |
|---|---|---|---|
| Navbar por rol | `navbar.js` | Todas las páginas | RF-14, evita duplicar menú |
| Tabla/listado genérico | `tabla-datos.js` | Dashboard, historial, alertas | RF-15, RF-09 |
| Tarjeta de solicitud | `tarjeta-solicitud.js` | Dashboard, detalle | RF-05 |
| Indicador de carga (spinner) | `spinner.js` | Toda operación asíncrona | RF-10, RNF-01 |
| Notificación/Toast de error | `toast.js` | Toda operación asíncrona | RF-11, RNF-05 |
| Formulario dinámico | `formulario.js` | Solicitud, reporte cumplimiento | RF-02, RF-06 |
| Selector de tema | `selector-tema.js` | Navbar (todas las páginas) | Sección diseño 2.1 |
| Selector de idioma | `selector-idioma.js` | Navbar (todas las páginas) | Sección idioma |
| Badge de estado | `badge-estado.js` | Dashboard, alertas | Recomendada/Revisar/Rechazada |
| Modal de confirmación | `modal.js` | Confirmar/rechazar clasificación IA | RF-12 |

Todos los componentes son **independientes del backend**: reciben datos por parámetros y emiten eventos custom (`CustomEvent`) para comunicarse con la capa de datos, evitando acoplar UI con lógica de fetch.

---

## 1.3 Arquitectura orientada a módulos

### 1.3.1 Estructura de carpetas propuesta

```
zofranca-cr/
├── db.json                        # Backend simulado (json-server)
├── index.html                     # Login / selección de rol
├── /modulos
│   ├── /solicitudes
│   │   ├── solicitud-nueva.html
│   │   ├── solicitud-historial.html
│   │   ├── dashboard-solicitudes.html
│   │   ├── solicitud-detalle.html
│   │   └── solicitudes.service.js     # fetch + async/await + Promise.all
│   ├── /cumplimiento
│   │   ├── reporte-cumplimiento.html
│   │   ├── panel-alertas.html
│   │   └── cumplimiento.service.js
│   ├── /ia
│   │   └── ia.service.js              # evaluarConIA() (RF-04, RF-08)
│   └── /admin
│       ├── panel-metricas.html
│       ├── admin-zonas-francas.html
│       └── admin.service.js
├── /components                    # componentes reutilizables (sección 1.2)
├── /shared
│   ├── auth.js                    # rol/sesión simulada
│   ├── http.js                    # wrapper de fetch con try/catch
│   ├── i18n/                      # es.json, en.json, fr.json
│   └── themes/                    # variables CSS por tema
├── /styles
│   ├── base.css
│   ├── temas.css
│   └── componentes.css
└── /assets
```

### 1.3.2 Mapeo de módulos a requerimientos

| Módulo | RF cubiertos | Roles que lo usan |
|---|---|---|
| **Solicitudes** | RF-01, RF-02, RF-03, RF-05, RF-15 | Empresa, Analista, Admin |
| **Cumplimiento** | RF-06, RF-07, RF-08, RF-09 | Empresa, Analista |
| **IA / Clasificación** | RF-04, RF-12, RF-13 | Analista (consumido por Solicitudes y Cumplimiento) |
| **Colaboración/Trazabilidad** | RF-14, RF-16, RF-17 | Analista, Admin |
| **Métricas/Admin** | RF-18, RF-01 | Admin |
| **Transversal (UI/errores)** | RF-10, RF-11, RNF-01 a RNF-05 | Todos |

### 1.3.3 Principios de la arquitectura por módulos

- Cada módulo tiene su propio archivo `*.service.js` que centraliza las llamadas a `json-server` (patrón *service layer*), separado de la manipulación del DOM.
- Ningún componente de UI hace `fetch` directamente; siempre pasa por el `service` del módulo correspondiente.
- El módulo de IA (`ia.service.js`) es **transversal**: lo consumen tanto Solicitudes (RF-04) como Cumplimiento (RF-08), evitando duplicar lógica de evaluación.
- Toda función async sigue el patrón: `mostrarCargando → try/await → catch (toast de error) → finally (ocultar carga)`, ya estandarizado en `http.js`.
- Diseño pensado para crecer (RNF-09): agregar una nueva zona franca o tipo de reporte implica solo agregar datos a `db.json` y, como máximo, un nuevo archivo de módulo — no tocar los existentes.

---

## 2. Fases de desarrollo sugeridas (para Trello)

| Fase | Entregable | RF/RNF relacionados |
|---|---|---|
| 1. Requerimientos y validación IA | Documento aprobado | Sección 4 del enunciado |
| 2. Mockups en Stitch | Pantallas aprobadas | RNF-07 |
| 3. Backend (`db.json` + json-server) | API funcional | RF-03, RF-16, RNF-06 |
| 4. Componentes base (navbar, tema, idioma) | Shell de la app | Sección 1.2 |
| 5. Módulo Solicitudes | RF-01 a RF-05, RF-15 |
| 6. Módulo IA | RF-04, RF-12, RF-13 |
| 7. Módulo Cumplimiento y Alertas | RF-06 a RF-09 |
| 8. Módulo Admin/Métricas | RF-18 |
| 9. Pulido: errores, estados de carga, i18n, temas | RNF-01, RNF-04, RNF-05 |
| 10. Demo, informe comparativo y hoja de ruta | Entregables 7, 8, 9 |

---

## 2.1 Integración de mockups desde Stitch (vía MCP)

Antes de programar cada pantalla, el equipo debe **descargar las imágenes y el código generados en Stitch** usando el MCP de Stitch (o, si no está disponible como conector, el flujo manual equivalente) y guardarlos en `/assets/mockups` y `/reference/stitch-code` respectivamente, para que sirvan de referencia fiel al construir el HTML/CSS real (RNF-07).

### Proyecto Stitch de referencia

- **Título del proyecto**: Interfaz ZoFranca CR Stitch
- **ID del proyecto**: `15623544777457143160`

### Pantallas a exportar

| # | Pantalla | ID de pantalla |
|---|---|---|
| 1 | Dashboard de Solicitudes — Tema Institucional (ES) | `5dc7ae2555a04ee5b6e9fb8399ef398c` |
| 2 | Design System | `asset-stub-assets_d942c60429e846dc8d20546b1bfc36cb` |
| 3 | Login — Selección de Rol (ES) | `06f7eb3157994c6b940242db203b0e91` |
| 4 | Detalle de Solicitud (IA) — Tema Oscuro (EN) | `55a1e5f196b84944994e97261768a80c` |
| 5 | Formulario de Cumplimiento — Estado Error (ES) | `2d1e79ce1566476989f0e2ab4280b4be` |

### Flujo de descarga

1. Con el MCP de Stitch conectado (o la exportación manual desde la app de Stitch), obtener la URL alojada de cada pantalla a partir de su `ID de proyecto` + `ID de pantalla`.
2. Descargar cada activo con:
   ```bash
   curl -L "<url_alojada_de_la_pantalla>" -o assets/mockups/<nombre-pantalla>.png
   ```
3. Si Stitch expone también el código HTML/CSS generado para la pantalla, guardarlo en `/reference/stitch-code/<nombre-pantalla>/` — se usa **solo como referencia visual**, no se copia tal cual: el equipo lo reescribe siguiendo la arquitectura de componentes de la sección 1.2 (navbar reutilizable, variables CSS por tema, claves `data-i18n`, etc.).
4. Repetir para las 5 pantallas de la tabla, y documentar el enlace/captura en el entregable de mockups (sección 6.1 del enunciado) junto con el prompt usado para generarla en Stitch.

> **Nota de entorno**: si el conector MCP de Stitch no está disponible en el entorno de trabajo del equipo, deben exportar manualmente desde la interfaz web de Stitch (botón de descarga por pantalla) y seguir el mismo esquema de carpetas.

---

## 3. Roles del sistema

| Rol | Descripción | Acceso |
|---|---|---|
| **Empresa solicitante** | Envía solicitudes y reportes de cumplimiento | Módulo Solicitudes (crear/consultar propias), Módulo Cumplimiento (enviar) |
| **Analista** | Revisa clasificaciones de IA, confirma/rechaza, gestiona alertas | Módulo Solicitudes (todas), IA, Cumplimiento, Alertas, Trazabilidad |
| **Administrador** | Configura zonas francas, ve métricas globales | Todos los módulos + Admin |

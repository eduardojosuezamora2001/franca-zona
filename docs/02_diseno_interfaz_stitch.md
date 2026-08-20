# Diseño de Interfaz — ZoFranca CR (mockups en Stitch)

Este documento especifica, pantalla por pantalla, cómo debe diseñarse la interfaz en **Stitch** antes de programar (RNF-07), junto con los sistemas de **temas** e **idiomas** que deben reflejarse en cada mockup.

---

## 2.1 Sistema de temas (Light, Dark + 2 adicionales)

La interfaz debe soportar **4 temas** intercambiables en tiempo real desde un selector en el navbar, implementados con **variables CSS (custom properties)** a nivel de `:root`, sin recargar la página.

### Temas definidos

| Tema | Nombre | Paleta / concepto | Uso recomendado |
|---|---|---|---|
| 1 | **Claro (Light)** | Fondo blanco/gris muy claro, texto gris oscuro, acentos en azul institucional | Uso general, oficinas |
| 2 | **Oscuro (Dark)** | Fondo gris carbón/negro azulado, texto gris claro, acentos en azul/verde neón suave | Trabajo nocturno, bajo consumo visual |
| 3 | **Institucional Zona Franca** *(generado)* | Fondo blanco marfil, acentos en **azul marino + dorado**, tipografía serif en títulos | Presentaciones formales, reportes a PROCOMER |
| 4 | **Alto Contraste Accesible** *(generado)* | Fondo negro puro, texto blanco puro, acentos en **amarillo**, bordes gruesos | Accesibilidad visual (WCAG AAA) |

### Estructura técnica sugerida

```css
:root[data-tema="claro"] {
  --color-fondo: #F7F9FB;
  --color-texto: #1F2937;
  --color-primario: #1E5AA8;
  --color-superficie: #FFFFFF;
  --color-borde: #E2E8F0;
}
:root[data-tema="oscuro"] {
  --color-fondo: #12161C;
  --color-texto: #E5E7EB;
  --color-primario: #4DA3FF;
  --color-superficie: #1B2129;
  --color-borde: #2A313C;
}
:root[data-tema="institucional"] {
  --color-fondo: #FDFBF6;
  --color-texto: #1A2340;
  --color-primario: #1A2340;
  --color-acento: #C9A24B;
  --color-superficie: #FFFFFF;
  --fuente-titulo: 'Georgia', serif;
}
:root[data-tema="alto-contraste"] {
  --color-fondo: #000000;
  --color-texto: #FFFFFF;
  --color-primario: #FFD700;
  --color-superficie: #000000;
  --color-borde: #FFFFFF;
  --grosor-borde: 2px;
}
```

El selector de tema (componente `selector-tema.js`) persiste la elección en `localStorage` y aplica el atributo `data-tema` en `<html>`. **Debe aparecer en cada mockup de Stitch como un control visible en el navbar** (icono de sol/luna/paleta con menú desplegable de 4 opciones).

---

## 2.2 Lineamientos generales de diseño (elegante y profesional)

- **Tipografía**: una fuente sans-serif moderna para texto general (ej. Inter, Work Sans) y, en el tema Institucional, una serif para títulos. Máximo 2 familias tipográficas por pantalla.
- **Espaciado**: generoso (mínimo 24px entre secciones), evitar pantallas saturadas — cada pantalla debe respirar.
- **Jerarquía visual clara**: título de pantalla, subtítulo de contexto (ej. nombre de zona franca), contenido principal, acciones secundarias.
- **Componentes con esquinas suaves** (radio 8–12px), sombras sutiles en tarjetas, sin gradientes estridentes.
- **Iconografía coherente** (una sola librería de íconos, ej. estilo *outline*) para estados: carga, éxito, error, alerta.
- **Estados de UI obligatorios en cada mockup**: vacío (*empty state*), cargando (*loading*), error, y con datos — Stitch debe incluir estas 4 variantes por pantalla que involucre datos asíncronos (RF-10, RF-11).
- **Colores de estado semánticos** (consistentes en los 4 temas): verde = Recomendada/En regla, ámbar = Revisar, rojo = Rechazada/Alerta de incumplimiento.

---

## 2.3 Pantallas por módulo

### Módulo: Autenticación / Selección de rol
- **Pantalla**: Login simulado.
- **Elementos**: logo ZoFranca CR, selector de rol (Empresa / Analista / Administrador), campo de nombre, botón "Ingresar", selector de tema e idioma visibles desde este primer punto de contacto.
- **Prompt Stitch sugerido**: *"Pantalla de login elegante para plataforma de gestión de zonas francas, con selector de rol tipo tarjetas, selector de tema (4 opciones) e idioma en la esquina superior."*

### Módulo: Solicitudes

| Pantalla | Rol | Elementos clave | Estados |
|---|---|---|---|
| **Formulario de solicitud de instalación** | Empresa | Campos: nombre empresa, sector (select), inversión proyectada, empleos proyectados, carga de documentos, botón "Enviar solicitud" | Enviando (spinner en botón), éxito, error de validación |
| **Dashboard de solicitudes** | Analista/Admin | Tabla/tarjetas con filtro por estado (Recomendada/Revisar/Rechazada), zona franca, sector y fecha (RF-15); badge de color por estado | Cargando lista, lista vacía, lista con datos, error de red |
| **Detalle de solicitud** | Analista | Datos completos de la empresa, **puntaje de afinidad de IA (0–100) con barra visual**, justificación textual de la IA, botones "Confirmar", "Rechazar", "Cambiar clasificación" (RF-12) | Cargando evaluación IA, evaluado, error de IA |
| **Historial de solicitudes propias** | Empresa | Lista simple de solicitudes enviadas con su estado actual | Vacío, con datos |

### Módulo: Cumplimiento

| Pantalla | Rol | Elementos clave | Estados |
|---|---|---|---|
| **Formulario de reporte de cumplimiento** | Empresa | Campos: empleos reales, inversión ejecutada, exportaciones, período del reporte | Enviando, éxito, error |
| **Panel de alertas de incumplimiento** | Analista/Admin | Lista de empresas con alerta activa, comparación visual "comprometido vs. real" (barra o gauge), fecha de detección | Sin alertas (empty state positivo), con alertas, cargando |
| **Resumen consolidado (tipo reporte a PROCOMER)** | Analista/Admin | Tabla exportable simulada con totales por zona franca | Cargando, con datos |

### Módulo: Trazabilidad / Historial

- **Pantalla**: Historial de empresa (solicitud + reportes + decisiones).
- **Elementos**: línea de tiempo (timeline) con quién tomó cada decisión y cuándo (RF-14).

### Módulo: Administración / Métricas

| Pantalla | Rol | Elementos clave |
|---|---|---|
| **Panel de métricas** | Admin | Tarjetas KPI: total de solicitudes, % aprobadas, tiempo promedio de respuesta (RF-18); gráfico simple de barras/dona |
| **Gestión de zonas francas** | Admin | Tabla de zonas francas con sus criterios (inversión mínima, empleos mínimos, sectores permitidos), formulario de alta/edición (RF-01) |

---

## 3. Sistema de idiomas (Español, Inglés, Francés)

### Alcance
Toda la interfaz —navbar, formularios, mensajes de error, estados, botones— debe soportar **3 idiomas**: Español (idioma por defecto), Inglés y Francés, seleccionables desde el navbar mediante un selector visible (bandera + código: ES / EN / FR).

### Estrategia técnica
- Archivos de traducción en `/shared/i18n/`: `es.json`, `en.json`, `fr.json`, con pares clave-valor por cada texto de la interfaz (ej. `"nav.dashboard": "Panel de solicitudes"`).
- Componente `selector-idioma.js` que:
  1. Carga el diccionario correspondiente con `fetch`.
  2. Reemplaza el contenido de todo elemento con atributo `data-i18n="clave"`.
  3. Persiste la elección en `localStorage` para mantenerla entre páginas.
- Ejemplo de uso en HTML:
```html
<button data-i18n="solicitud.enviar">Enviar solicitud</button>
```
- Los mensajes generados dinámicamente (ej. justificación de la IA, mensajes de error de `toast.js`) también deben tomarse del diccionario activo, no quedar codificados solo en español.

### Requisito para los mockups en Stitch
Cada pantalla principal debe presentarse en Stitch con **al menos una variante en inglés**, para validar que los textos más largos (ej. nombres de estados, mensajes de alerta) no rompan el diseño ("Recommended" es más largo que "Recomendada"; "Non-compliance alert" más largo que "Alerta"). Esto evita retrabajo de interfaz al implementar el i18n real.

---

## 4. Checklist de entrega de mockups (Stitch)

- [ ] Las 5 pantallas mínimas exigidas por el enunciado (formulario de solicitud, dashboard, detalle con puntaje IA, formulario de reporte, panel de alertas).
- [ ] Cada pantalla en sus 4 estados (vacío, cargando, error, con datos) cuando involucre datos asíncronos.
- [ ] Cada pantalla mostrada en al menos 2 de los 4 temas (recomendado: Claro y Oscuro como mínimo).
- [ ] Selector de tema y selector de idioma visibles en el navbar de todas las pantallas.
- [ ] Al menos una pantalla clave mostrada en español e inglés, para validar longitud de textos.
- [ ] Prompts de diseño usados en Stitch documentados junto a cada captura, como pide la sección 6.1 del enunciado.

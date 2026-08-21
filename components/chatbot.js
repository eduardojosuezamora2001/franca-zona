/**
 * Componente Chatbot Asistente Virtual ZoFranca CR (components/chatbot.js)
 * Proporciona un asistente interactivo experto en el Régimen de Zonas Francas de Costa Rica (Ley 7210),
 * requisitos de inversión, beneficios fiscales y consultas en tiempo real de la base de datos de la plataforma.
 */
import { request } from '../shared/http.js';
import { t } from '../shared/i18n.js';

// Base de conocimiento temática exhaustiva y profesional (Ley N° 7210 de Costa Rica & ZoFranca CR)
const BASE_CONOCIMIENTO = [
  {
    claves: ['ley 7210', 'que es zona franca', 'regimen', 'concepto', 'que es el regimen', 'marzo legal', 'comex'],
    respuesta: `🏛️ **Régimen de Zonas Francas de Costa Rica (Ley N° 7210)**

El **Régimen de Zona Franca** es el principal instrumento de atracción de Inversión Extranjera Directa (IED) y fomento al comercio exterior en Costa Rica, administrado por la Promotora del Comercio Exterior (**PROCOMER**) y el Ministerio de Comercio Exterior (**COMEX**).

### 🎯 Objetivos Principales:
• **Promoción de Empleo Calificado:** Creación de puestos de trabajo directos e indirectos de alta calidad.
• **Transferencia de Tecnología:** Fomento a sectores de innovación como Ciencias de la Vida y Tecnologías de Información.
• **Encadenamientos Productivos:** Integración de PYMES locales en las cadenas globales de valor.`
  },
  {
    claves: ['beneficio', 'fiscal', 'impuesto', 'renta', 'exencion', 'incentivo', 'tributo', 'iva', 'patente', 'remesas'],
    respuesta: `💎 **Incentivos y Beneficios Fiscales (Ley 7210)**

Las empresas autorizadas para operar bajo el Régimen de Zona Franca gozan de exenciones tributarias de gran alcance:

### 📊 Desglose de Exenciones:
1. **Impuesto sobre la Renta (ISR):**
   • **Dentro de la GAM:** Exención del **100%** durante los primeros 8 a 12 años, y **50%** por los 4 años subsiguientes.
   • **Fuera de la GAM:** Exención del **100%** durante 12 años, y **50%** por los 6 años siguientes.
2. **Impuesto sobre el Valor Agregado (IVA - 13%):** Exención del **100%** en compras locales de bienes y servicios vinculados a la operación.
3. **Derechos e Impuestos de Importación:** **100% libre de aranceles** en materias primas, insumos, maquinaria, repuestos y equipos.
4. **Impuestos Municipales y Patentes:** Exención de hasta un **100%** por un plazo de 10 años.
5. **Impuesto sobre Dividendos y Remesas al Exterior:** Exención del **100%** al girar utilidades a la casa matriz.`
  },
  {
    claves: ['requisito', 'inversion', 'empleo', 'gam', 'fuera de gam', 'monto minimo', 'ubicacion'],
    respuesta: `📍 **Requisitos Mínimos de Inversión y Empleo**

Para acogerse al Régimen de ZF, la empresa debe cumplir con parámetros estrictos según su ubicación geográfica y modelo de parque:

### 🏢 Dentro de la Gran Área Metropolitana (GAM):
• **Empresas en Parque Industrial de ZF:** Inversión mínima de **$150,000 USD** en activos fijos.
• **Empresas fuera de Parque (Stand-alone):** Inversión mínima de **$2,000,000 USD** en activos fijos.

### 🌿 Fuera de la Gran Área Metropolitana (Zonas Rurales o Costeras):
• **Empresas en Parque Industrial:** Inversión mínima reducida de **$100,000 USD**.
• **Empresas fuera de Parque:** Inversión mínima de **$500,000 USD**.

### 👥 Compromiso de Empleo:
Las empresas deben declarar y mantener la cantidad de puestos de trabajo directos pactados en su plan de inversión inicial.`
  },
  {
    claves: ['sector', 'sectores', 'medico', 'tecnologia', 'software', 'agro', 'servicios', 'dispositivos'],
    respuesta: `🏭 **Sectores Industriales Elegibles y Estratégicos**

Costa Rica prioriza sectores de alto valor agregado y dinamismo exportador:

1. 🩺 **Dispositivos Médicos y Ciencias de la Vida (Life Sciences):**
   • Fabricación de catéteres, instrumentos quirúrgicos, equipos electromédicos y lentes de contacto.
2. 💻 **Tecnología de Información y Software:**
   • Desarrollo de software, servicios en la nube (*Cloud*), ciberseguridad y centro de I+D.
3. 🏢 **Servicios Compartidos y Globales (Shared Services & BPO):**
   • Centros multilingües de finanzas, recursos humanos, compras y soporte técnico.
4. ⚙️ **Manufactura Avanzada y Microelectrónica:**
   • Componentes electrónicos, industria aeroespacial y automotriz de precisión.
5. 🌾 **Agroindustria Alimentaria de Exportación:**
   • Procesamiento biotecnológico de alimentos y concentrados.`
  },
  {
    claves: ['categoria', 'categorias', 'tipo de empresa', 'procesadora', 'comercializadora'],
    respuesta: `🏷️ **Categorías de Registro bajo la Ley 7210**

La legislación costarricense clasifica a las empresas beneficiarias en varias categorías:

• **Categoría (a) - Procesadoras de Exportación:** Empresas que producen, ensamblan o procesan bienes para exportación.
• **Categoría (c) - Comercializadoras de ZF:** Empresas que manipulan, reempaquetan o redistribuyen mercaderías no producidas en el país.
• **Categoría (d) - Servicios de Exportación:** Empresas que prestan servicios a personas físicas o jurídicas domiciliadas en el exterior.
• **Categoría (f) - Administradoras de Parques:** Entidades desarrolladoras que construyen y operan la infraestructura de Zonas Francas.`
  },
  {
    claves: ['procomer', 'tramite', 'solicitud', 'proceso', 'como solicitar', 'evaluacion', 'pasos'],
    respuesta: `📋 **Proceso de Solicitud y Evaluación en ZoFranca CR**

El trámite digital consta de 4 etapas automatizadas:

1. 📝 **Ingreso de Formulario:** La empresa solicitante completa sus datos de inversión, empleos proyectados, sector y zona franca deseada.
2. 🤖 **Evaluación Transversal de IA:** El algoritmo analiza la matriz de compatibilidad sectorial, ratio de inversión y proyección de empleos, asignando un puntaje de afínidad de **0 a 100**.
3. ⚖️ **Reclasificación por Analista PROCOMER:** El analista gubernamental revisa el expediente, pudiendo confirmar la recomendación de la IA o rectificar el estado justificando la resolución.
4. 📜 **Trazabilidad Auditada:** Cada cambio de estado queda registrado de forma permanente con fecha, hora y responsable.`
  },
  {
    claves: ['alerta', 'incumplimiento', 'deficit', 'rf-08', 'rf-06', 'reporte de cumplimiento', 'porcentaje'],
    respuesta: `🚨 **Sistema de Alertas y Verificación de Cumplimiento (RF-06 a RF-09)**

Las empresas instaladas deben enviar reportes periódicos de sus operaciones reales (inversión ejecutada, empleos directos y exportaciones realizadas).

### 🔍 Regla del Umbral del 85%:
Si el reporte de una empresa registra que los empleos o la inversión ejecutada cayeron **por debajo del 85%** de los compromisos adquiridos en su acuerdo inicial:
• El sistema genera automáticamente una **Alerta de Incumplimiento (RF-08)**.
• Se califica la gravedad de la alerta (Media o Alta).
• El equipo de PROCOMER coordina un plan de aceleración o fiscalización.`
  }
];

export function renderChatbot() {
  if (document.getElementById('chatbot-widget-container')) return;

  const container = document.createElement('div');
  container.id = 'chatbot-widget-container';
  container.innerHTML = `
    <!-- Botón Flotante del Chatbot -->
    <button id="chatbot-toggle-btn" class="chatbot-toggle-btn" title="Asistente Virtual ZoFranca CR" aria-label="Abrir Asistente Virtual">
      <i class="fa-solid fa-robot"></i>
      <span class="chatbot-badge-ping"></span>
    </button>

    <!-- Ventana del Chatbot -->
    <div id="chatbot-window" class="chatbot-window">
      <!-- Header -->
      <div class="chatbot-header">
        <div style="display: flex; align-items: center; gap: 0.75rem;">
          <div class="chatbot-avatar">
            <i class="fa-solid fa-robot"></i>
          </div>
          <div>
            <h4 style="margin: 0; font-size: 1rem; color: #ffffff;">Asistente ZoFranca CR</h4>
            <span style="font-size: 0.75rem; color: rgba(255,255,255,0.85); display: flex; align-items: center; gap: 0.35rem;">
              <span style="width: 7px; height: 7px; background-color: #22c55e; border-radius: 50%; display: inline-block;"></span>
              En línea — Ley 7210 & Datos ZF
            </span>
          </div>
        </div>
        <button id="chatbot-close-btn" class="chatbot-close-btn" aria-label="Cerrar chat">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>

      <!-- Cuerpo de Mensajes -->
      <div id="chatbot-messages" class="chatbot-messages">
        <!-- Mensaje de bienvenida inicial -->
        <div class="chat-message assistant">
          <div class="chat-bubble">
            ¡Saludos! 👋 Soy tu **Asistente Virtual experto en ZoFranca CR**.
            
            Puedo orientarte de manera especializada sobre el **Régimen de Zonas Francas de Costa Rica (Ley N° 7210)**, exenciones fiscales, requisitos de admisión por ubicación, o consultar datos en vivo de la plataforma.
          </div>
        </div>

        <!-- Chips de Sugerencias Rápidas -->
        <div class="chatbot-suggestions-wrapper" id="chatbot-suggestions">
          <button class="chatbot-chip" data-question="¿Qué es el Régimen de Zona Franca?">
            <i class="fa-solid fa-scale-balanced"></i> ¿Qué es el Régimen de ZF?
          </button>
          <button class="chatbot-chip" data-question="¿Cuáles son los beneficios fiscales de la Ley 7210?">
            <i class="fa-solid fa-percent"></i> Beneficios Fiscales
          </button>
          <button class="chatbot-chip" data-question="¿Cuáles son los requisitos de inversión en GAM vs fuera de GAM?">
            <i class="fa-solid fa-sack-dollar"></i> Requisitos GAM / No GAM
          </button>
          <button class="chatbot-chip" data-question="¿Qué Zonas Francas hay registradas en la plataforma?">
            <i class="fa-solid fa-building"></i> Consultar Zonas Francas
          </button>
          <button class="chatbot-chip" data-question="¿Cuál es el estado de la solicitud SOL-2026-001?">
            <i class="fa-solid fa-magnifying-glass"></i> Ver Solicitud SOL-2026-001
          </button>
        </div>
      </div>

      <!-- Formulario de Entrada -->
      <form id="chatbot-input-form" class="chatbot-input-container">
        <input type="text" id="chatbot-input" class="chatbot-input" placeholder="Pregunta sobre Ley 7210, solicitudes o zonas..." autocomplete="off" required>
        <button type="submit" class="chatbot-send-btn" title="Enviar mensaje">
          <i class="fa-solid fa-paper-plane"></i>
        </button>
      </form>
    </div>
  `;

  document.body.appendChild(container);

  // Vincular eventos
  const toggleBtn = document.getElementById('chatbot-toggle-btn');
  const closeBtn = document.getElementById('chatbot-close-btn');
  const chatWindow = document.getElementById('chatbot-window');
  const form = document.getElementById('chatbot-input-form');
  const input = document.getElementById('chatbot-input');
  const suggestions = document.getElementById('chatbot-suggestions');

  let isChatOpen = false;

  const toggleChat = () => {
    isChatOpen = !isChatOpen;
    chatWindow.classList.toggle('active', isChatOpen);
    if (isChatOpen) {
      input.focus();
    }
  };

  toggleBtn.addEventListener('click', toggleChat);
  closeBtn.addEventListener('click', toggleChat);

  // Evento enviar mensaje
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const texto = input.value.trim();
    if (!texto) return;

    input.value = '';
    await procesarMensajeUsuario(texto);
  });

  // Evento sugerencias rápidas
  suggestions.addEventListener('click', async (e) => {
    const chip = e.target.closest('.chatbot-chip');
    if (!chip) return;
    const q = chip.getAttribute('data-question');
    if (q) {
      await procesarMensajeUsuario(q);
    }
  });
}

async function procesarMensajeUsuario(mensaje) {
  agregarMensajeDOM('user', mensaje);
  mostrarIndicadorEscribiendo();

  try {
    const respuesta = await generarRespuestaInteligente(mensaje);
    ocultarIndicadorEscribiendo();
    agregarMensajeDOM('assistant', respuesta);
  } catch (err) {
    ocultarIndicadorEscribiendo();
    agregarMensajeDOM('assistant', '⚠️ Ocurrió una interrupción al consultar los datos. Por favor verifica tu conexión o intenta nuevamente.');
  }
}

function agregarMensajeDOM(rol, textoMarkdown) {
  const container = document.getElementById('chatbot-messages');
  const msgDiv = document.createElement('div');
  msgDiv.className = `chat-message ${rol}`;

  // Parseador de Markdown enriquecido (encabezados, listas, negrita, cursiva, código)
  let htmlContent = textoMarkdown
    .replace(/^### (.*$)/gim, '<h4 style="font-size: 0.95rem; margin-top: 0.5rem; margin-bottom: 0.25rem; color: var(--color-primario);">$1</h4>')
    .replace(/^## (.*$)/gim, '<h3 style="font-size: 1rem; margin-top: 0.5rem; margin-bottom: 0.35rem;">$1</h3>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/\n/g, '<br>');

  msgDiv.innerHTML = `<div class="chat-bubble">${htmlContent}</div>`;
  container.appendChild(msgDiv);

  // Auto-scroll fluido al final
  container.scrollTop = container.scrollHeight;
}

function mostrarIndicadorEscribiendo() {
  const container = document.getElementById('chatbot-messages');
  const typingDiv = document.createElement('div');
  typingDiv.id = 'chatbot-typing-indicator';
  typingDiv.className = 'chat-message assistant';
  typingDiv.innerHTML = `
    <div class="chat-bubble typing-bubble">
      <span class="typing-dot"></span>
      <span class="typing-dot"></span>
      <span class="typing-dot"></span>
    </div>
  `;
  container.appendChild(typingDiv);
  container.scrollTop = container.scrollHeight;
}

function ocultarIndicadorEscribiendo() {
  const indicator = document.getElementById('chatbot-typing-indicator');
  if (indicator) indicator.remove();
}

/**
 * Generador de Respuestas Inteligente combinando la Base de Conocimiento y Datos en Tiempo Real
 */
async function generarRespuestaInteligente(consulta) {
  const consultaLower = consulta.toLowerCase().trim();

  // 1. Búsqueda de Solicitud Específica (Formato SOL-2026-XXX)
  const matchSolicitud = consultaLower.match(/sol-\d{4}-\d{3}/i);
  if (matchSolicitud) {
    const idSol = matchSolicitud[0].toUpperCase();
    try {
      const sol = await request(`/solicitudes/${idSol}`);
      if (sol && sol.id) {
        const inv = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(sol.inversionProyectada);
        return `📑 **Expediente Digital de Solicitud: ${sol.id}**

• **Empresa Solicitante:** ${sol.nombreEmpresa}
• **Cédula Jurídica:** ${sol.cedulaJuridica}
• **Zona Franca Requerida:** ${sol.nombreZonaFranca}
• **Sector Industrial:** ${sol.sector}
• **Inversión Proyectada:** **${inv}**
• **Empleos Directos:** **${sol.empleosProyectados} puestos**
• **Clasificación IA:** **${sol.estado}** (Puntaje: **${sol.puntajeIA}/100**)

💬 **Evaluación Algorítmica de la IA:**
"${sol.justificacionIA}"`;
      }
    } catch (e) {
      return `❌ No se localizó ninguna solicitud bajo la identificación **${idSol}**. Por favor verifica el número o consulta el *Dashboard de Solicitudes*.`;
    }
  }

  // 2. Búsqueda por Provincias o Zonas Francas en Tiempo Real
  const provinciasCR = ['alajuela', 'heredia', 'cartago', 'san jose', 'puntarenas', 'limon', 'guanacaste'];
  const provEncontrada = provinciasCR.find(p => consultaLower.includes(p));

  if (provEncontrada) {
    try {
      const zonas = await request('/zonasFrancas');
      const filtradas = zonas.filter(z => 
        (z.provincia && z.provincia.toLowerCase().includes(provEncontrada)) || 
        (z.ubicacion && z.ubicacion.toLowerCase().includes(provEncontrada))
      );

      if (filtradas.length > 0) {
        const lista = filtradas.map(z => {
          const invMin = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(z.inversionMinima);
          return `• **${z.nombre}** (${z.canton || z.provincia}):
  - Inversión Mínima: **${invMin}**
  - Empleos Mínimos: **${z.empleosMinimos} puestos**
  - Sectores: ${Array.isArray(z.sectoresPermitidos) ? z.sectoresPermitidos.join(', ') : z.sectoresPermitidos}`;
        }).join('\n\n');

        return `📍 **Zonas Francas Registradas en la Provincia de ${provEncontrada.toUpperCase()}**:

${lista}

*Puedes seleccionar cualquiera de estas zonas al ingresar una nueva solicitud o ver su ubicación en el visor de mapas.*`;
      } else {
        return `Actualmente no se registran parques de Zona Franca activos en la provincia de **${provEncontrada.toUpperCase()}** en nuestra base de datos.`;
      }
    } catch (e) {}
  }

  // 3. Consulta General de Lista de Zonas Francas
  if (consultaLower.includes('zonas francas') || consultaLower.includes('zona franca') || consultaLower.includes('lista de zonas') || consultaLower.includes('ver zonas')) {
    if (consultaLower.includes('lista') || consultaLower.includes('registradas') || consultaLower.includes('cuales son') || consultaLower.includes('que zonas')) {
      try {
        const zonas = await request('/zonasFrancas');
        if (zonas && zonas.length > 0) {
          const lista = zonas.map(z => `• **${z.nombre}** (${z.provincia || z.ubicacion}) — Sectores: *${Array.isArray(z.sectoresPermitidos) ? z.sectoresPermitidos.join(', ') : z.sectoresPermitidos}*`).join('\n');
          return `🏢 **Parques de Zonas Francas Registrados en Costa Rica**:

${lista}

*Accede al menú "Zonas Francas (RF-01)" para interactuar con los mapas de ubicación.*`;
        }
      } catch (e) {}
    }
  }

  // 4. Consulta de Alertas o Reportes de Cumplimiento
  if (consultaLower.includes('alerta') || consultaLower.includes('incumplimiento') || consultaLower.includes('deficit')) {
    try {
      const alertas = await request('/alertas');
      if (alertas && alertas.length > 0) {
        const lista = alertas.map(a => `• 🚨 **${a.nombreEmpresa}** (${a.nombreZonaFranca}):
  - Período: **${a.periodo}**
  - Tipo: *${a.tipoIncumplimiento}*
  - Gravedad: **${a.gravedad}**`).join('\n\n');

        return `⚠️ **Alertas de Incumplimiento Activas en la Plataforma**:

${lista}

*Puedes revisar el consolidado oficial y exportar reportes para PROCOMER en el módulo "Alertas y PROCOMER (RF-08/09)".*`;
      } else {
        return `✅ **Cumplimiento Óptimo**: En este momento no se registran alertas activas de incumplimiento. Todas las empresas han reportado parámetros por encima del 85% pactado.`;
      }
    } catch (e) {}
  }

  // 5. Coincidencia por Base de Conocimiento Estática (Ley 7210 / Incentivos / Requisitos / Sectores)
  for (const item of BASE_CONOCIMIENTO) {
    if (item.claves.some(clave => consultaLower.includes(clave))) {
      return item.respuesta;
    }
  }

  // 6. Respuesta Inteligente por Defecto (Fallback orientativo)
  return `He analizado tu consulta sobre **"${consulta}"**.

Como asistente especializado en **ZoFranca CR**, puedo asistirte con:

• 📜 **Ley N° 7210 y Beneficios Fiscales:** Exención de Renta, IVA, Aranceles e Impuestos Municipales.
• 📍 **Requisitos de Admisión:** Montos mínimos de inversión y empleos en la GAM vs. fuera de la GAM.
• 🏢 **Consulta de Zonas Francas:** Escribe el nombre de una provincia (ej. *Alajuela*, *Heredia*, *Cartago*).
• 🔎 **Consulta de Expedientes:** Escribe el código de una solicitud (ej. *SOL-2026-001*).

¿Cuál de estos puntos deseas profundizar?`;
}

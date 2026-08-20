import{r as x,o as $}from"./navbar-CAVEdXR4.js";import{b as I,o as z,c as b,m as l}from"./solicitudes.service-M5hAAMlH.js";import{r as E}from"./badge-estado-BT3WXQ8M.js";function y({titulo:e,contenidoHtml:a,textoConfirmar:t="Confirmar",textoCancelar:i="Cancelar",onConfirmar:n}){const c=document.getElementById("modal-dinamico");c&&c.remove();const r=document.createElement("div");r.id="modal-dinamico",r.className="modal-backdrop",r.innerHTML=`
    <div class="modal-content">
      <div class="modal-header">
        <h3>${e}</h3>
        <button id="btn-modal-close" style="background:none; border:none; font-size:1.2rem; cursor:pointer; color:var(--color-texto);">&times;</button>
      </div>
      <div class="modal-body">
        ${a}
      </div>
      <div class="modal-footer">
        <button id="btn-modal-cancelar" class="btn btn-secondary">${i}</button>
        <button id="btn-modal-confirmar" class="btn btn-primary">${t}</button>
      </div>
    </div>
  `,document.body.appendChild(r),setTimeout(()=>r.classList.add("active"),10);const s=()=>{r.classList.remove("active"),setTimeout(()=>r.remove(),200)};document.getElementById("btn-modal-close").addEventListener("click",s),document.getElementById("btn-modal-cancelar").addEventListener("click",s),document.getElementById("btn-modal-confirmar").addEventListener("click",async()=>{n&&await n(),s()})}let o=null,p=null;document.addEventListener("DOMContentLoaded",async()=>{x("#app-shell");const a=new URLSearchParams(window.location.search).get("id")||"SOL-2026-001";await m(a)});async function m(e){const a=document.getElementById("contenedor-detalle-solicitud");try{o=await I(e),p=(await z()).find(i=>i.id===o.zonaFrancaId)||{inversionMinima:1e6,empleosMinimos:30,sectoresPermitidos:["Tecnología","Dispositivos Médicos"]},document.getElementById("subtitulo-solicitud").textContent=`${o.id} — Registrada el ${new Date(o.fechaEnvio).toLocaleString("es-CR")}`,document.getElementById("badge-contenedor-estado").innerHTML=E(o.estado),w(o,p)}catch(t){a.innerHTML=`
      <div class="card" style="text-align: center; color: var(--estado-rechazada-texto); border-color: var(--estado-rechazada-borde);">
        ⚠️ No se encontró la solicitud solicitada (ID: ${e}): ${t.message}
      </div>
    `}}function w(e,a){var u,v,f;const t=document.getElementById("contenedor-detalle-solicitud"),i=$(),n=i.rol==="analista"||i.rol==="administrador",c=new Intl.NumberFormat("en-US",{style:"currency",currency:"USD",maximumFractionDigits:0}).format(e.inversionProyectada),r=new Intl.NumberFormat("en-US",{style:"currency",currency:"USD",maximumFractionDigits:0}).format(a.inversionMinima);let s="#166534";e.puntajeIA<50?s="#DC2626":e.puntajeIA<80&&(s="#D97706");const h=(e.historialTrazabilidad||[]).map(d=>`
    <div style="padding-left: 1rem; border-left: 2px solid var(--color-primario); margin-bottom: 1rem; position: relative;">
      <div style="position: absolute; left: -6px; top: 0; width: 10px; height: 10px; border-radius: 50%; background: var(--color-primario);"></div>
      <div style="display: flex; justify-content: space-between; font-size: 0.85rem; color: var(--color-texto-secundario);">
        <strong>${d.usuario}</strong>
        <span>${new Date(d.fecha).toLocaleString("es-CR")}</span>
      </div>
      <div style="font-weight: 600; font-size: 0.95rem; margin-top: 0.2rem;">${d.accion}</div>
      <div style="font-size: 0.875rem; color: var(--color-texto);">${d.detalle}</div>
    </div>
  `).join("");t.innerHTML=`
    <!-- Tarjeta de Puntaje de IA -->
    <div class="ai-score-card">
      <div class="ai-score-header">
        <div>
          <h3 style="font-size: 1.25rem; display: flex; align-items: center; gap: 0.5rem;" data-i18n="detail.ai_score">
            🤖 Puntaje de Afinidad Algorítmica con IA
          </h3>
          <p style="font-size: 0.875rem; color: var(--color-texto-secundario);">Evaluación automatizada frente a parámetros de la Zona Franca "${e.nombreZonaFranca}"</p>
        </div>
        <div class="ai-score-number">${e.puntajeIA}<span style="font-size: 1rem; color: var(--color-texto-secundario);">/100</span></div>
      </div>

      <div class="ai-progress-track">
        <div class="ai-progress-fill" style="width: ${e.puntajeIA}%; background-color: ${s};"></div>
      </div>

      <div style="background-color: var(--color-superficie-elevada); border-left: 4px solid var(--color-acento); padding: 1rem; border-radius: 8px;">
        <h4 style="font-size: 0.9rem; margin-bottom: 0.35rem;" data-i18n="detail.ai_justification">💬 Justificación Algorítmica de la IA:</h4>
        <p style="font-size: 0.925rem;">${e.justificacionIA}</p>
      </div>
    </div>

    <!-- Requisitos Comparativos de la Zona Franca -->
    <div class="card">
      <h3 style="font-size: 1.15rem; margin-bottom: 1rem;" data-i18n="detail.requirements">📊 Comparativa de Requisitos Reales vs. Exigidos</h3>
      <div class="form-row">
        <div style="background-color: var(--color-superficie-elevada); padding: 1rem; border-radius: 8px;">
          <small style="color: var(--color-texto-secundario);">Inversión Proyectada</small>
          <div style="font-size: 1.2rem; font-weight: 700;">${c}</div>
          <small style="color: var(--color-texto-secundario);">Mínimo Exigido: <strong>${r}</strong></small>
        </div>

        <div style="background-color: var(--color-superficie-elevada); padding: 1rem; border-radius: 8px;">
          <small style="color: var(--color-texto-secundario);">Empleos Directos Proyectados</small>
          <div style="font-size: 1.2rem; font-weight: 700;">${e.empleosProyectados} empleos</div>
          <small style="color: var(--color-texto-secundario);">Mínimo Exigido: <strong>${a.empleosMinimos} empleos</strong></small>
        </div>

        <div style="background-color: var(--color-superficie-elevada); padding: 1rem; border-radius: 8px;">
          <small style="color: var(--color-texto-secundario);">Compatibilidad Sectorial</small>
          <div style="font-size: 1.2rem; font-weight: 700; color: ${a.sectoresPermitidos.includes(e.sector)?"#166534":"#DC2626"};">
            ${a.sectoresPermitidos.includes(e.sector)?"✅ Sector Compatible":"❌ Sector Incompatible"}
          </div>
          <small style="color: var(--color-texto-secundario);">Permitidos: <strong>${a.sectoresPermitidos.join(", ")}</strong></small>
        </div>
      </div>
    </div>

    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 1.5rem;">
      <!-- Información General -->
      <div class="card">
        <h3 style="font-size: 1.15rem; margin-bottom: 1rem;" data-i18n="detail.company_info">🏢 Información de la Empresa y Proyecto</h3>
        <div style="display: flex; flex-direction: column; gap: 0.75rem; font-size: 0.925rem;">
          <div><strong>Empresa:</strong> ${e.nombreEmpresa}</div>
          <div><strong>Cédula Jurídica:</strong> ${e.cedulaJuridica}</div>
          <div><strong>Sector:</strong> ${e.sector}</div>
          <div><strong>Zona Franca:</strong> ${e.nombreZonaFranca}</div>
          <div><strong>Descripción del Proyecto:</strong> ${e.descripcionProyecto||"Sin descripción adicional"}</div>
          <div>
            <strong>Documentos Adjuntos:</strong>
            <ul style="margin-top: 0.35rem; padding-left: 1.25rem;">
              ${(e.adjuntosSimulados||[]).map(d=>`<li>📄 <a href="#">${d}</a></li>`).join("")}
            </ul>
          </div>
        </div>
      </div>

      <!-- Historial de Trazabilidad -->
      <div class="card">
        <h3 style="font-size: 1.15rem; margin-bottom: 1rem;" data-i18n="detail.history">📜 Historial de Trazabilidad</h3>
        <div>
          ${h}
        </div>
      </div>
    </div>

    <!-- Panel de Acciones de Clasificación Manual (Analista / Admin) -->
    ${n?`
      <div class="card" style="border: 2px solid var(--color-primario);">
        <h3 style="font-size: 1.15rem; margin-bottom: 0.5rem;" data-i18n="detail.actions">⚖️ Acciones de Clasificación del Analista</h3>
        <p style="font-size: 0.875rem; color: var(--color-texto-secundario); margin-bottom: 1.25rem;">
          Como analista, usted puede confirmar la recomendación de la IA o rectificar manualmente el estado de la solicitud. Toda decisión quedará auditada en el historial de trazabilidad.
        </p>

        <div style="display: flex; flex-wrap: wrap; gap: 0.75rem;">
          <button id="btn-confirmar-ia" class="btn btn-success" data-i18n="detail.confirm_ai">
            ✅ Confirmar Recomendación IA (${e.clasificacionIA})
          </button>
          <button id="btn-rechazar-solicitud" class="btn btn-danger" data-i18n="detail.reject_ai">
            ❌ Rechazar Solicitud
          </button>
          <button id="btn-cambiar-clasificacion" class="btn btn-warning" data-i18n="detail.change_status">
            ⚠️ Cambiar Clasificación Manualmente
          </button>
        </div>
      </div>
    `:""}
  `,n&&((u=document.getElementById("btn-confirmar-ia"))==null||u.addEventListener("click",()=>{g(e.clasificacionIA,"Confirmación directa de sugerencia algorítmica.")}),(v=document.getElementById("btn-rechazar-solicitud"))==null||v.addEventListener("click",()=>{g("Rechazada","Rechazo manual por parte del analista.")}),(f=document.getElementById("btn-cambiar-clasificacion"))==null||f.addEventListener("click",()=>{A()}))}function g(e,a){const t=`
    <p style="margin-bottom: 1rem;">¿Está seguro de clasificar la solicitud <strong>${o.id}</strong> como <strong style="text-transform:uppercase;">${e}</strong>?</p>
    <div class="form-group">
      <label class="form-label" for="modal-justificacion">Justificación u observaciones del Analista *</label>
      <textarea id="modal-justificacion" class="form-control" rows="3" placeholder="Ingrese el motivo de su resolución...">${a}</textarea>
    </div>
  `;y({titulo:`Confirmar Resolución (${e})`,contenidoHtml:t,textoConfirmar:"Guardar Resolución",onConfirmar:async()=>{const i=document.getElementById("modal-justificacion").value.trim();try{await b(o.id,e,i),l("Estado actualizado correctamente","success"),await m(o.id)}catch(n){l(`Error al actualizar estado: ${n.message}`,"error")}}})}function A(){const e=`
    <div class="form-group">
      <label class="form-label" for="modal-select-nuevo-estado">Seleccione el nuevo estado:</label>
      <select id="modal-select-nuevo-estado" class="form-control">
        <option value="Recomendada" ${o.estado==="Recomendada"?"selected":""}>Recomendada</option>
        <option value="Revisar" ${o.estado==="Revisar"?"selected":""}>Revisar</option>
        <option value="Rechazada" ${o.estado==="Rechazada"?"selected":""}>Rechazada</option>
      </select>
    </div>
    <div class="form-group">
      <label class="form-label" for="modal-justificacion-manual">Motivo de la reclasificación manual *</label>
      <textarea id="modal-justificacion-manual" class="form-control" rows="3" placeholder="Justifique el cambio de estado frente al reporte de la IA..."></textarea>
    </div>
  `;y({titulo:"Reclasificación Manual de Solicitud",contenidoHtml:e,textoConfirmar:"Aplicar Cambio",onConfirmar:async()=>{const a=document.getElementById("modal-select-nuevo-estado").value,t=document.getElementById("modal-justificacion-manual").value.trim()||"Reclasificación manual efectuada por el analista.";try{await b(o.id,a,t),l("Solicitud reclasificada con éxito","success"),await m(o.id)}catch(i){l(`Error al reclasificar: ${i.message}`,"error")}}})}

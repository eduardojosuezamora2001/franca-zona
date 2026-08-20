import{r as d}from"./navbar-DLFwcji6.js";import{o as i,a as c,b as l}from"./cumplimiento.service-C5k1rC1b.js";import{m}from"./http-DIGBQfHA.js";import"./solicitudes.service-ConByWzl.js";document.addEventListener("DOMContentLoaded",async()=>{d("#app-shell"),await p(),await u(),await g(),document.getElementById("btn-exportar-procomer").addEventListener("click",()=>{m("📄 Generando informe oficial consolidado de cumplimiento para PROCOMER...","info"),setTimeout(()=>{m("✅ Informe exportado exitosamente en formato oficial PROCOMER (Simulación PDF/XLS).","success")},1500)})});async function p(){try{const t=await i(),o=new Intl.NumberFormat("en-US",{style:"currency",currency:"USD",maximumFractionDigits:0}).format(t.totalInversionEjecutada),r=new Intl.NumberFormat("en-US",{style:"currency",currency:"USD",maximumFractionDigits:0}).format(t.totalExportaciones);document.getElementById("procomer-inv-total").textContent=o,document.getElementById("procomer-inv-pct").textContent=`Cumplimiento: ${t.cumplimientoGlobalInversion}% de compromisos`,document.getElementById("procomer-emp-total").textContent=`${t.totalEmpleosReales} puestos`,document.getElementById("procomer-emp-pct").textContent=`Cumplimiento: ${t.cumplimientoGlobalEmpleos}% de compromisos`,document.getElementById("procomer-exp-total").textContent=r}catch(t){console.warn("Error en resumen PROCOMER",t)}}async function u(){const t=document.getElementById("contenedor-alertas");try{const o=await c();if(!o||o.length===0){t.innerHTML=`
        <div style="background-color: var(--estado-recomendada-bg); border: 1px solid var(--estado-recomendada-borde); padding: 1.5rem; border-radius: 8px; text-align: center; color: var(--estado-recomendada-texto);">
          🎉 <strong>Excelente:</strong> No se registran alertas activas de incumplimiento. Todas las empresas cumplen con más del 85% de sus compromisos.
        </div>
      `;return}const r=o.map(e=>{const a=new Intl.NumberFormat("en-US",{style:"currency",currency:"USD",maximumFractionDigits:0}).format(e.inversionEjecutada),n=new Intl.NumberFormat("en-US",{style:"currency",currency:"USD",maximumFractionDigits:0}).format(e.inversionComprometida),s=Math.round(e.empleosReales/e.empleosComprometidos*100);return`
        <div style="background-color: var(--estado-rechazada-bg); border: 1px solid var(--estado-rechazada-borde); border-radius: 8px; padding: 1.25rem; margin-bottom: 1rem; color: var(--estado-rechazada-texto);">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 0.5rem;">
            <div>
              <strong style="font-size: 1.1rem;">⚠️ ${e.nombreEmpresa}</strong> (${e.nombreZonaFranca})
            </div>
            <span class="badge-estado badge-estado--rechazada">Gravedad: ${e.gravedad}</span>
          </div>

          <p style="font-size: 0.9rem; margin-bottom: 0.75rem;">
            <strong>Tipo de Alerta:</strong> ${e.tipoIncumplimiento} (Período: ${e.periodo})
          </p>

          <div style="display: flex; gap: 2rem; flex-wrap: wrap; background-color: rgba(255,255,255,0.4); padding: 0.75rem; border-radius: 6px; font-size: 0.875rem;">
            <div>👥 <strong>Empleos Reales:</strong> ${e.empleosReales} de ${e.empleosComprometidos} (<span style="font-weight: 700; text-decoration: underline;">${s}%</span>)</div>
            <div>💰 <strong>Inversión Ejecutada:</strong> ${a} de ${n}</div>
          </div>
        </div>
      `}).join("");t.innerHTML=r}catch(o){t.innerHTML=`<p style="color: var(--estado-rechazada-texto);">Error cargando alertas: ${o.message}</p>`}}async function g(){const t=document.getElementById("contenedor-tabla-reportes");try{const o=await l();if(!o||o.length===0){t.innerHTML='<p style="color: var(--color-texto-secundario);">No hay reportes de cumplimiento recibidos.</p>';return}const r=o.map(e=>{const a=new Intl.NumberFormat("en-US",{style:"currency",currency:"USD",maximumFractionDigits:0}).format(e.inversionEjecutada),n=new Intl.NumberFormat("en-US",{style:"currency",currency:"USD",maximumFractionDigits:0}).format(e.exportaciones),s=e.estadoCumplimiento==="Incumplimiento";return`
        <tr>
          <td><strong>${e.id}</strong></td>
          <td>${e.nombreEmpresa}</td>
          <td>${e.nombreZonaFranca}</td>
          <td><span class="badge-estado badge-estado--recomendada">${e.periodo}</span></td>
          <td>${e.empleosReales} / ${e.empleosComprometidos} (${e.cumplimientoEmpleosPct}%)</td>
          <td>${a} (${e.cumplimientoInversionPct}%)</td>
          <td>${n}</td>
          <td>
            <span class="badge-estado badge-estado--${s?"rechazada":"recomendada"}">
              ${e.estadoCumplimiento}
            </span>
          </td>
        </tr>
      `}).join("");t.innerHTML=`
      <div class="table-container">
        <table class="table">
          <thead>
            <tr>
              <th>ID Reporte</th>
              <th>Empresa</th>
              <th>Zona Franca</th>
              <th>Período</th>
              <th>Empleos (Real / Pactado)</th>
              <th>Inversión (Real / Pactado)</th>
              <th>Exportaciones</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            ${r}
          </tbody>
        </table>
      </div>
    `}catch(o){t.innerHTML=`<p style="color: var(--estado-rechazada-texto);">Error cargando tabla: ${o.message}</p>`}}

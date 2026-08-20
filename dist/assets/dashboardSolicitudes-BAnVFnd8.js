import{t as p,r as v}from"./navbar-CAVEdXR4.js";import{o as g,a as l,m as u}from"./solicitudes.service-M5hAAMlH.js";import{r as c}from"./tabla-datos-Bhpj6yo6.js";import{r as f}from"./badge-estado-BT3WXQ8M.js";function y(e){const t=new Intl.NumberFormat("en-US",{style:"currency",currency:"USD",maximumFractionDigits:0}).format(e.inversionProyectada),a=new Date(e.fechaEnvio).toLocaleDateString("es-CR",{year:"numeric",month:"short",day:"numeric"});return`
    <div class="card" style="display: flex; flex-direction: column; justify-content: space-between;">
      <div>
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.75rem;">
          <span style="font-weight: 700; font-size: 0.85rem; color: var(--color-texto-secundario);">${e.id}</span>
          ${f(e.estado)}
        </div>
        <h3 style="font-size: 1.15rem; margin-bottom: 0.25rem;">${e.nombreEmpresa}</h3>
        <p style="font-size: 0.85rem; color: var(--color-texto-secundario); margin-bottom: 1rem;">
          📍 ${e.nombreZonaFranca} &bull; 🏭 ${e.sector}
        </p>
        
        <div style="background-color: var(--color-superficie-elevada); padding: 0.75rem; border-radius: 8px; font-size: 0.875rem; margin-bottom: 1rem;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 0.25rem;">
            <span>💵 Inversión:</span>
            <strong>${t}</strong>
          </div>
          <div style="display: flex; justify-content: space-between;">
            <span>👥 Empleos:</span>
            <strong>${e.empleosProyectados} directos</strong>
          </div>
        </div>

        <div style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.85rem; margin-bottom: 1rem;">
          <span>🤖 Afinidad IA:</span>
          <div style="flex:1; height: 8px; background: var(--color-superficie-elevada); border-radius: 4px; overflow:hidden;">
            <div style="width: ${e.puntajeIA}%; height: 100%; background: ${e.puntajeIA>=80?"#166534":e.puntajeIA>=50?"#D97706":"#DC2626"};"></div>
          </div>
          <strong>${e.puntajeIA}%</strong>
        </div>
      </div>

      <div style="display: flex; justify-content: space-between; align-items: center; border-top: var(--grosor-borde) solid var(--color-borde); pt: 0.75rem; margin-top: 0.5rem; padding-top: 0.75rem;">
        <small style="color: var(--color-texto-secundario);">${a}</small>
        <a href="/modulos/solicitudes/solicitud-detalle.html?id=${e.id}" class="btn btn-secondary" style="padding: 0.3rem 0.6rem; font-size: 0.8rem;" data-i18n="common.view_detail">
          ${p("common.view_detail","Ver Detalle")}
        </a>
      </div>
    </div>
  `}let s="tabla",d=[];document.addEventListener("DOMContentLoaded",async()=>{v("#app-shell");const e=document.getElementById("filtro-zona");try{(await g()).forEach(o=>{const r=document.createElement("option");r.value=o.id,r.textContent=o.nombre,e.appendChild(r)})}catch(n){console.warn("Error cargando combo zonas francas",n)}["filtro-busqueda","filtro-estado","filtro-zona","filtro-sector"].forEach(n=>{const o=document.getElementById(n);o&&o.addEventListener(o.tagName==="INPUT"?"input":"change",()=>m())});const t=document.getElementById("btn-vista-tabla"),a=document.getElementById("btn-vista-grid");t.addEventListener("click",()=>{s="tabla",t.classList.add("active"),a.classList.remove("active"),i(d)}),a.addEventListener("click",()=>{s="grid",a.classList.add("active"),t.classList.remove("active"),i(d)}),await b()});async function b(){const e=document.getElementById("dashboard-contenedor-datos");try{const t=await l();d=t,h(t),m()}catch(t){e.innerHTML=`
      <div class="card" style="text-align: center; color: var(--estado-rechazada-texto); border-color: var(--estado-rechazada-borde);">
        ⚠️ Error de conexión al cargar solicitudes: ${t.message}
      </div>
    `,u("Error al conectar con la API de solicitudes","error")}}async function m(){const e=document.getElementById("filtro-busqueda").value.trim(),t=document.getElementById("filtro-estado").value,a=document.getElementById("filtro-zona").value,n=document.getElementById("filtro-sector").value,o=await l({busqueda:e,estado:t,zonaFrancaId:a,sector:n});i(o)}function h(e){const t=e.length,a=e.filter(r=>r.estado==="Recomendada").length,n=e.filter(r=>r.estado==="Revisar"||r.estado==="Pendiente").length,o=e.filter(r=>r.estado==="Rechazada").length;document.getElementById("kpi-total").textContent=t,document.getElementById("kpi-recomendadas").textContent=`${a} (${t?Math.round(a/t*100):0}%)`,document.getElementById("kpi-revisar").textContent=`${n} (${t?Math.round(n/t*100):0}%)`,document.getElementById("kpi-rechazadas").textContent=`${o} (${t?Math.round(o/t*100):0}%)`}function i(e){const t=document.getElementById("dashboard-contenedor-datos");if(s==="tabla")t.innerHTML=c(e);else{if(!e||e.length===0){t.innerHTML=c([]);return}const a=e.map(n=>y(n)).join("");t.innerHTML=`
      <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 1.5rem;">
        ${a}
      </div>
    `}}

import{r as a,o as s}from"./navbar-CAVEdXR4.js";import{a as n}from"./solicitudes.service-M5hAAMlH.js";import{r as d}from"./tabla-datos-Bhpj6yo6.js";import"./badge-estado-BT3WXQ8M.js";document.addEventListener("DOMContentLoaded",async()=>{a("#app-shell");const e=s(),t=document.getElementById("subtitulo-empresa");t&&e.nombreEmpresa&&(t.textContent=`Empresa: ${e.nombreEmpresa} — Cédula Jurídica: ${e.empresaId}`);const o=document.getElementById("contenedor-lista-historial");try{const r=await n({empresaId:e.empresaId});o.innerHTML=d(r)}catch(r){o.innerHTML=`
      <div class="card" style="text-align: center; color: var(--estado-rechazada-texto); border-color: var(--estado-rechazada-borde);">
        ⚠️ Error al cargar el historial de solicitudes: ${r.message}
      </div>
    `}});

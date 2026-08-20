import{r as a,o as s}from"./navbar-DLFwcji6.js";import{o as n}from"./solicitudes.service-ConByWzl.js";import{r as d}from"./tabla-datos-DqBSN_xn.js";import"./http-DIGBQfHA.js";import"./badge-estado-DbW5lVZz.js";document.addEventListener("DOMContentLoaded",async()=>{a("#app-shell");const e=s(),t=document.getElementById("subtitulo-empresa");t&&e.nombreEmpresa&&(t.textContent=`Empresa: ${e.nombreEmpresa} — Cédula Jurídica: ${e.empresaId}`);const o=document.getElementById("contenedor-lista-historial");try{const r=await n({empresaId:e.empresaId});o.innerHTML=d(r)}catch(r){o.innerHTML=`
      <div class="card" style="text-align: center; color: var(--estado-rechazada-texto); border-color: var(--estado-rechazada-borde);">
        ⚠️ Error al cargar el historial de solicitudes: ${r.message}
      </div>
    `}});

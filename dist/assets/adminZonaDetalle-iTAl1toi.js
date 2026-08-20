import{r as p}from"./navbar-DLFwcji6.js";import{o as g}from"./admin.service-CDYmqv6N.js";import{o as v}from"./solicitudes.service-ConByWzl.js";import{r as y}from"./tabla-datos-DqBSN_xn.js";import"./http-DIGBQfHA.js";import"./badge-estado-DbW5lVZz.js";document.addEventListener("DOMContentLoaded",async()=>{p("#app-shell");const t=new URLSearchParams(window.location.search).get("id")||"zf-01";await u(t)});async function u(o){const t=document.getElementById("contenedor-detalle-zf");try{const e=await g(o),l=await v({zonaFrancaId:o});document.getElementById("lbl-zf-nombre").textContent=e.nombre;const a=e.canton?`${e.canton}, ${e.provincia}`:e.ubicacion||"Costa Rica";document.getElementById("lbl-zf-ubicacion").textContent=`ID: ${e.id} &bull; Ubicación: ${a}`,document.getElementById("badge-zf-provincia").innerHTML=`<span class="badge-estado badge-estado--recomendada" style="font-size:1rem; padding: 0.4rem 0.85rem;">📍 ${a}</span>`;const m=new Intl.NumberFormat("en-US",{style:"currency",currency:"USD",maximumFractionDigits:0}).format(e.inversionMinima),i=e.direccion||`${e.nombre}, ${a}, Costa Rica`,d=`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(i)}`,r=e.lat||9.9922,n=e.lng||-84.2818;t.innerHTML=`
      <!-- Mapa Completo a Ancho de Pantalla -->
      <div class="card" style="padding: 1rem;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
          <h3 style="font-size: 1.15rem; margin: 0; display: flex; align-items: center; gap: 0.5rem;">
            🗺️ Ubicación Geográfica en Mapa (Lat: ${r}, Lng: ${n})
          </h3>
          <a href="${d}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary" style="font-size: 0.85rem;">
            📍 Abrir en Google Maps App &nearr;
          </a>
        </div>

        <div class="detail-map-container" id="map-detail-div">
          <!-- Renderizado de mapa interactivo -->
        </div>
      </div>

      <!-- Tarjetas de Parámetros y Requisitos -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem; margin-bottom: 1.5rem;">
        <div class="card" style="margin:0;">
          <h4 style="font-size: 1rem; color: var(--color-texto-secundario); margin-bottom: 0.5rem;">💰 Inversión Mínima Requerida</h4>
          <div style="font-size: 1.75rem; font-weight: 800; color: var(--color-primario);">${m}</div>
          <small style="color: var(--color-texto-secundario);">Monto base para acogerse al régimen de ZF</small>
        </div>

        <div class="card" style="margin:0;">
          <h4 style="font-size: 1rem; color: var(--color-texto-secundario); margin-bottom: 0.5rem;">👥 Empleos Mínimos Proyectados</h4>
          <div style="font-size: 1.75rem; font-weight: 800; color: var(--color-primario);">${e.empleosMinimos} puestos</div>
          <small style="color: var(--color-texto-secundario);">Puestos de trabajo directos requeridos</small>
        </div>

        <div class="card" style="margin:0;">
          <h4 style="font-size: 1rem; color: var(--color-texto-secundario); margin-bottom: 0.5rem;">🏭 Sectores Estratégicos Permitidos</h4>
          <div style="font-size: 1.1rem; font-weight: 700; color: #166534;">
            ${Array.isArray(e.sectoresPermitidos)?e.sectoresPermitidos.join(", "):e.sectoresPermitidos}
          </div>
          <small style="color: var(--color-texto-secundario);">Sectores industriales elegibles</small>
        </div>
      </div>

      <!-- Empresas y Solicitudes en esta Zona Franca -->
      <div class="card">
        <h3 style="font-size: 1.2rem; margin-bottom: 1rem;">🏢 Solicitudes de Empresas Registradas en esta Zona Franca</h3>
        ${y(l)}
      </div>
    `,setTimeout(()=>{const s=document.getElementById("map-detail-div");if(s&&window.L){const c=L.map(s).setView([r,n],14);L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{maxZoom:19,attribution:"&copy; OpenStreetMap & Google Maps"}).addTo(c),L.marker([r,n]).addTo(c).bindPopup(`<b>📍 ${e.nombre}</b><br>${i}`).openPopup()}},50)}catch(e){t.innerHTML=`
      <div class="card" style="text-align: center; color: var(--estado-rechazada-texto);">
        ⚠️ No se encontró la Zona Franca (ID: ${o}): ${e.message}
      </div>
    `}}

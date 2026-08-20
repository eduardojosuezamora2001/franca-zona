import{r as d}from"./badge-estado-BT3WXQ8M.js";import{t}from"./navbar-CAVEdXR4.js";function s(e,m){if(!e||e.length===0)return`
      <div class="card" style="text-align: center; padding: 3rem 1.5rem;">
        <div style="font-size: 3rem; margin-bottom: 1rem;">🔍</div>
        <h3 data-i18n="dashboard.empty_title">${t("dashboard.empty_title","No se encontraron solicitudes")}</h3>
        <p style="color: var(--color-texto-secundario);" data-i18n="dashboard.empty_desc">${t("dashboard.empty_desc","Prueba ajustando los filtros de búsqueda o registra una nueva solicitud.")}</p>
      </div>
    `;const a=e.map(o=>{const n=new Date(o.fechaEnvio).toLocaleDateString("es-CR",{year:"numeric",month:"short",day:"numeric"}),r=new Intl.NumberFormat("en-US",{style:"currency",currency:"USD",maximumFractionDigits:0}).format(o.inversionProyectada);return`
      <tr>
        <td><strong>${o.id}</strong></td>
        <td>
          <div><strong>${o.nombreEmpresa}</strong></div>
          <div style="font-size: 0.8rem; color: var(--color-texto-secundario);">${o.cedulaJuridica}</div>
        </td>
        <td>${o.sector}</td>
        <td>${o.nombreZonaFranca}</td>
        <td>${r}</td>
        <td>${o.empleosProyectados}</td>
        <td>
          <div style="display: flex; flex-direction: column; gap: 0.25rem;">
            ${d(o.estado)}
            <small style="font-size: 0.75rem; color: var(--color-texto-secundario);">${t("common.score","Puntaje IA")}: <strong>${o.puntajeIA}/100</strong></small>
          </div>
        </td>
        <td>${n}</td>
        <td>
          <a href="/modulos/solicitudes/solicitud-detalle.html?id=${o.id}" class="btn btn-secondary" style="padding: 0.35rem 0.65rem; font-size: 0.8rem;" data-i18n="common.view_detail">
            ${t("common.view_detail","Ver Detalle")}
          </a>
        </td>
      </tr>
    `}).join("");return`
    <div class="table-container">
      <table class="table">
        <thead>
          <tr>
            <th>ID</th>
            <th data-i18n="common.company">${t("common.company","Empresa")}</th>
            <th data-i18n="common.sector">${t("common.sector","Sector")}</th>
            <th data-i18n="common.zone">${t("common.zone","Zona Franca")}</th>
            <th data-i18n="common.investment">${t("common.investment","Inversión")}</th>
            <th data-i18n="common.jobs">${t("common.jobs","Empleos")}</th>
            <th data-i18n="common.status">${t("common.status","Estado / IA")}</th>
            <th data-i18n="common.date">${t("common.date","Fecha")}</th>
            <th data-i18n="common.actions">${t("common.actions","Acciones")}</th>
          </tr>
        </thead>
        <tbody>
          ${a}
        </tbody>
      </table>
    </div>
  `}export{s as r};

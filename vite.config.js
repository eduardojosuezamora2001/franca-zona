import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        solicitudNueva: resolve(__dirname, 'modulos/solicitudes/solicitud-nueva.html'),
        solicitudHistorial: resolve(__dirname, 'modulos/solicitudes/solicitud-historial.html'),
        dashboardSolicitudes: resolve(__dirname, 'modulos/solicitudes/dashboard-solicitudes.html'),
        solicitudDetalle: resolve(__dirname, 'modulos/solicitudes/solicitud-detalle.html'),
      },
    },
  },
  server: {
    port: 5173,
    open: false,
  },
});

/**
 * Wrapper de Fetch con manejo de errores y fallback (shared/http.js)
 */
import { mostrarToast } from '../components/toast.js';
import { mostrarSpinner, ocultarSpinner } from '../components/spinner.js';

const API_BASE_URL = 'http://localhost:3000';

export async function request(endpoint, options = {}, activarSpinner = true) {
  if (activarSpinner) mostrarSpinner();

  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    ...options
  };

  try {
    const response = await fetch(url, config);
    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.warn(`[ZoFranca HTTP] No se pudo conectar a json-server en ${url}. Usando fallback local.`, error);
    
    // Intentar fallback desde localStorage si json-server no responde
    const fallbackData = manejarFallbackLocal(endpoint, options);
    if (fallbackData !== null) {
      return fallbackData;
    }

    mostrarToast(`Error de conexión con el servidor: ${error.message}`, 'error');
    throw error;
  } finally {
    if (activarSpinner) ocultarSpinner();
  }
}

// Fallback en memoria / localStorage cuando json-server no está corriendo en localhost:3000
function manejarFallbackLocal(endpoint, options) {
  const method = (options.method || 'GET').toUpperCase();
  const dbKey = 'zofranca_db_fallback';

  let db = JSON.parse(localStorage.getItem(dbKey) || 'null');
  if (!db) {
    // Si no hay DB guardada, usar semilla predeterminada
    db = {
      zonasFrancas: [
        { id: 'zf-01', nombre: 'Coyol Free Zone', ubicacion: 'Alajuela', inversionMinima: 1500000, empleosMinimos: 50, sectoresPermitidos: ['Dispositivos Médicos', 'Manufactura Avanzada', 'Tecnología'] },
        { id: 'zf-02', nombre: 'America Free Zone (AFZ)', ubicacion: 'Heredia', inversionMinima: 1000000, empleosMinimos: 30, sectoresPermitidos: ['Tecnología', 'Servicios Compartidos', 'Software'] },
        { id: 'zf-03', nombre: 'UltraPARK II', ubicacion: 'Heredia', inversionMinima: 800000, empleosMinimos: 25, sectoresPermitidos: ['Tecnología', 'Servicios Compartidos', 'Finanzas'] },
        { id: 'zf-04', nombre: 'Zona Franca La Lima', ubicacion: 'Cartago', inversionMinima: 1200000, empleosMinimos: 40, sectoresPermitidos: ['Manufactura Avanzada', 'Dispositivos Médicos', 'Agroindustria'] }
      ],
      solicitudes: [
        {
          id: 'SOL-2026-001',
          empresaId: 'emp-101',
          nombreEmpresa: 'BioMed Solutions CR S.A.',
          cedulaJuridica: '3-101-789456',
          sector: 'Dispositivos Médicos',
          zonaFrancaId: 'zf-01',
          nombreZonaFranca: 'Coyol Free Zone',
          inversionProyectada: 2500000,
          empleosProyectados: 85,
          descripcionProyecto: 'Planta de ensamblaje de catéteres de alta precisión.',
          fechaEnvio: '2026-08-15T10:30:00.000Z',
          estado: 'Recomendada',
          puntajeIA: 92,
          clasificacionIA: 'Recomendada',
          justificacionIA: 'Cumple holgadamente con los requisitos de Coyol Free Zone.',
          adjuntosSimulados: ['plan_inversion.pdf'],
          historialTrazabilidad: [
            { fecha: '2026-08-15T10:30:00.000Z', usuario: 'BioMed Solutions CR S.A.', accion: 'Solicitud enviada', detalle: 'Ingreso inicial' },
            { fecha: '2026-08-15T10:31:00.000Z', usuario: 'Sistema IA', accion: 'Evaluación automatizada', detalle: 'Puntaje 92/100' }
          ]
        },
        {
          id: 'SOL-2026-002',
          empresaId: 'emp-102',
          nombreEmpresa: 'CyberTech Global Ltda.',
          cedulaJuridica: '3-102-654321',
          sector: 'Tecnología',
          zonaFrancaId: 'zf-02',
          nombreZonaFranca: 'America Free Zone (AFZ)',
          inversionProyectada: 950000,
          empleosProyectados: 28,
          descripcionProyecto: 'Centro de desarrollo de software para ciberseguridad.',
          fechaEnvio: '2026-08-18T14:15:00.000Z',
          estado: 'Revisar',
          puntajeIA: 68,
          clasificacionIA: 'Revisar',
          justificacionIA: 'Inversión ligeramente por debajo del mínimo de AFZ.',
          adjuntosSimulados: ['propuesta_tecnica.pdf'],
          historialTrazabilidad: [
            { fecha: '2026-08-18T14:15:00.000Z', usuario: 'CyberTech Global Ltda.', accion: 'Solicitud enviada', detalle: 'Ingreso inicial' }
          ]
        },
        {
          id: 'SOL-2026-003',
          empresaId: 'emp-103',
          nombreEmpresa: 'AgroInnovación del Caribe',
          cedulaJuridica: '3-103-112233',
          sector: 'Agroindustria',
          zonaFrancaId: 'zf-03',
          nombreZonaFranca: 'UltraPARK II',
          inversionProyectada: 400000,
          empleosProyectados: 12,
          descripcionProyecto: 'Procesamiento de concentrados de frutas tropicales.',
          fechaEnvio: '2026-08-19T09:00:00.000Z',
          estado: 'Rechazada',
          puntajeIA: 35,
          clasificacionIA: 'Rechazada',
          justificacionIA: 'Sector no permitido e inversión insuficiente.',
          adjuntosSimulados: ['perfil_proyecto.pdf'],
          historialTrazabilidad: [
            { fecha: '2026-08-19T09:00:00.000Z', usuario: 'AgroInnovación del Caribe', accion: 'Solicitud enviada', detalle: 'Ingreso inicial' }
          ]
        }
      ]
    };
    localStorage.setItem(dbKey, JSON.stringify(db));
  }

  // Parse endpoint
  const cleanEndpoint = endpoint.split('?')[0];
  const queryParams = new URLSearchParams(endpoint.includes('?') ? endpoint.split('?')[1] : '');

  if (cleanEndpoint === '/solicitudes' && method === 'GET') {
    let result = [...db.solicitudes];
    if (queryParams.has('estado')) result = result.filter(s => s.estado === queryParams.get('estado'));
    if (queryParams.has('zonaFrancaId')) result = result.filter(s => s.zonaFrancaId === queryParams.get('zonaFrancaId'));
    if (queryParams.has('sector')) result = result.filter(s => s.sector === queryParams.get('sector'));
    if (queryParams.has('empresaId')) result = result.filter(s => s.empresaId === queryParams.get('empresaId'));
    return result;
  }

  if (cleanEndpoint.startsWith('/solicitudes/') && method === 'GET') {
    const id = cleanEndpoint.replace('/solicitudes/', '');
    const item = db.solicitudes.find(s => s.id === id);
    if (!item) throw new Error('Solicitud no encontrada');
    return item;
  }

  if (cleanEndpoint === '/solicitudes' && method === 'POST') {
    const nueva = JSON.parse(options.body);
    db.solicitudes.push(nueva);
    localStorage.setItem(dbKey, JSON.stringify(db));
    return nueva;
  }

  if (cleanEndpoint.startsWith('/solicitudes/') && (method === 'PATCH' || method === 'PUT')) {
    const id = cleanEndpoint.replace('/solicitudes/', '');
    const idx = db.solicitudes.findIndex(s => s.id === id);
    if (idx !== -1) {
      const cambios = JSON.parse(options.body);
      db.solicitudes[idx] = { ...db.solicitudes[idx], ...cambios };
      localStorage.setItem(dbKey, JSON.stringify(db));
      return db.solicitudes[idx];
    }
  }

  if (cleanEndpoint === '/zonasFrancas' && method === 'GET') {
    return db.zonasFrancas;
  }

  return null;
}

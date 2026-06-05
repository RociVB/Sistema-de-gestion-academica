import { useEffect, useMemo, useRef, useState } from 'react';
import { MdAccountCircle, MdCircleNotifications, MdNotifications } from 'react-icons/md';
import { useLocation } from 'react-router-dom';
import api from '../../services/api';

function buildNotifications(catalogs, students, pathname) {
  const notifications = [];
  const invalidCedulaPattern = /^(V|E)-\d{6,11}$/;
  const invalidPhonePattern = /^0\d{3}-\d{7}$/;
  const legacyStudents = students.filter(
    (student) =>
      !invalidCedulaPattern.test(student.cedula || '') ||
      !invalidPhonePattern.test(student.telefono || '') ||
      !student.periodo
  );

  if (catalogs.careers.length === 0) {
    notifications.push({
      id: 'missing-careers',
      tone: 'amber',
      title: 'Faltan carreras configuradas',
      description: 'Sin carreras activas no se podrán crear nuevos estudiantes desde el modal.',
    });
  }

  if (catalogs.periods.length === 0) {
    notifications.push({
      id: 'missing-periods',
      tone: 'amber',
      title: 'No hay períodos disponibles',
      description: 'Conviene cargar al menos un período académico para completar el registro.',
    });
  }

  if (legacyStudents.length > 0) {
    notifications.push({
      id: 'legacy-students',
      tone: 'slate',
      title: `${legacyStudents.length} estudiante(s) con formato heredado`,
      description: 'Hay registros antiguos sin período o con cédula/teléfono fuera del formato nuevo.',
    });
  }

  notifications.push({
    id: 'active-semesters',
    tone: 'blue',
    title: `${catalogs.semesters.length} semestres habilitados`,
    description: 'La lista de semestres ya está disponible para el formulario de estudiantes.',
  });

  if (pathname === '/settings') {
    notifications.unshift({
      id: 'settings-focus',
      tone: 'emerald',
      title: 'Vista de configuración activa',
      description: 'Los cambios que registres aquí impactarán de inmediato el modal de estudiantes.',
    });
  }

  return notifications;
}

function NotificationItem({ item }) {
  const tones = {
    amber: 'border-amber-200 bg-amber-50 text-amber-900',
    slate: 'border-slate-200 bg-slate-50 text-slate-800',
    blue: 'border-blue-200 bg-blue-50 text-blue-900',
    emerald: 'border-emerald-200 bg-emerald-50 text-emerald-900',
  };

  return (
    <article className={`rounded-2xl border px-4 py-3 ${tones[item.tone]}`}>
      <p className="text-sm font-bold">{item.title}</p>
      <p className="mt-1 text-sm opacity-80">{item.description}</p>
    </article>
  );
}

function Navbar() {
  const currentDate = new Date().toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const location = useLocation();
  const panelRef = useRef(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [catalogs, setCatalogs] = useState({ careers: [], semesters: [], periods: [] });
  const [students, setStudents] = useState([]);

  useEffect(() => {
    let isMounted = true;

    async function loadNotificationData() {
      try {
        const [catalogsResponse, studentsResponse] = await Promise.all([
          api.get('/settings/catalogs'),
          api.get('/students'),
        ]);

        if (!isMounted) {
          return;
        }

        setCatalogs(catalogsResponse.data);
        setStudents(studentsResponse.data);
      } catch (error) {
        if (isMounted) {
          setCatalogs({ careers: [], semesters: [], periods: [] });
          setStudents([]);
        }
      }
    }

    loadNotificationData();
    const refreshInterval = window.setInterval(loadNotificationData, 15000);
    window.addEventListener('academic-data-changed', loadNotificationData);

    return () => {
      isMounted = false;
      window.clearInterval(refreshInterval);
      window.removeEventListener('academic-data-changed', loadNotificationData);
    };
  }, []);

  useEffect(() => {
    function handleOutsideClick(event) {
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        setIsPanelOpen(false);
      }
    }

    document.addEventListener('mousedown', handleOutsideClick);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  const notifications = useMemo(
    () => buildNotifications(catalogs, students, location.pathname),
    [catalogs, students, location.pathname]
  );

  return (
    <header className="sticky top-0 z-20 flex h-20 items-center justify-between border-b border-slate-200 bg-white/90 px-8 shadow-sm backdrop-blur-sm">
      <div className="flex flex-col">
        <h2 className="text-xl font-bold text-slate-800">Sistema de Gestión Académica</h2>
        <p className="text-sm capitalize text-slate-500">{currentDate}</p>
      </div>

      <div className="flex items-center gap-6">
        <div className="relative" ref={panelRef}>
          <button
            type="button"
            onClick={() => setIsPanelOpen((currentValue) => !currentValue)}
            className="relative rounded-2xl border border-slate-200 bg-slate-50 p-3 text-slate-500 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
          >
            <MdNotifications size={26} />
            {notifications.length > 0 ? (
              <span className="absolute -right-1 -top-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-blue-600 px-1 text-[11px] font-bold text-white">
                {notifications.length}
              </span>
            ) : null}
          </button>

          {isPanelOpen ? (
            <div className="absolute right-0 mt-3 w-[24rem] rounded-3xl border border-slate-200 bg-white p-4 shadow-2xl">
              <div className="mb-4 flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                    Notificaciones
                  </p>
                  <h3 className="mt-1 text-lg font-bold text-slate-800">
                    Centro de actividad académica
                  </h3>
                </div>
                <div className="rounded-2xl bg-slate-100 p-2 text-slate-500">
                  <MdCircleNotifications size={24} />
                </div>
              </div>

              <div className="space-y-3">
                {notifications.map((item) => (
                  <NotificationItem key={item.id} item={item} />
                ))}
              </div>
            </div>
          ) : null}
        </div>

        <div className="flex items-center gap-3 border-l border-slate-200 pl-6">
          <div className="text-right">
            <p className="text-sm font-semibold text-slate-800">Admin Usuario</p>
            <p className="text-xs text-slate-500">Administrador</p>
          </div>
          <MdAccountCircle size={40} className="text-slate-400" />
        </div>
      </div>
    </header>
  );
}

export default Navbar;

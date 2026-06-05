import { useEffect, useMemo, useState } from 'react';
import {
  MdAdd,
  MdAutoAwesome,
  MdDelete,
  MdLibraryBooks,
  MdNumbers,
  MdToday,
} from 'react-icons/md';
import { toast } from 'react-toastify';
import api from '../services/api';
import { cleanText, onlyDigits } from '../utils/formValidation';

function SummaryCard({ title, value, hint, icon, tone }) {
  const tones = {
    blue: 'from-blue-600 via-blue-500 to-cyan-400 text-white',
    slate: 'from-slate-800 via-slate-700 to-slate-600 text-white',
    amber: 'from-amber-500 via-orange-500 to-rose-400 text-white',
  };

  return (
    <article className={`rounded-3xl bg-gradient-to-br p-5 shadow-lg ${tones[tone]}`}>
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-white/70">{title}</p>
          <p className="mt-3 text-4xl font-black leading-none">{value}</p>
        </div>
        <div className="rounded-2xl bg-white/15 p-3 text-white backdrop-blur-sm">{icon}</div>
      </div>
      <p className="text-sm text-white/80">{hint}</p>
    </article>
  );
}

function CompactCatalogSection({
  title,
  subtitle,
  icon,
  accentClass,
  items,
  valueKey,
  inputValue,
  inputLabel,
  inputPlaceholder,
  onInputChange,
  onCreate,
  onDelete,
}) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white/95 p-5 shadow-sm backdrop-blur-sm">
      <div className="mb-4 flex items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <div className={`rounded-2xl p-3 ${accentClass}`}>{icon}</div>
          <div className="min-w-0">
            <h2 className="text-lg font-bold text-slate-800">{title}</h2>
            <p className="text-sm text-slate-500">{subtitle}</p>
          </div>
        </div>
        <div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
          {items.length} activos
        </div>
      </div>

      <form
        onSubmit={onCreate}
        className="mb-4 grid grid-cols-1 gap-3 rounded-2xl border border-slate-200 bg-slate-50/80 p-3 lg:grid-cols-[1fr_auto]"
      >
        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            {inputLabel}
          </label>
          <input
            type="text"
            value={inputValue}
            onChange={onInputChange}
            placeholder={inputPlaceholder}
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-blue-300 focus:ring-2 focus:ring-blue-500/20"
          />
        </div>
        <button
          type="submit"
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 font-semibold text-white transition hover:bg-slate-700"
        >
          <MdAdd size={18} />
          Agregar
        </button>
      </form>

      {items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
          Aún no hay elementos registrados en esta sección.
        </div>
      ) : (
        <div className="flex flex-wrap gap-2">
          {items.map((item) => (
            <div
              key={item.id}
              className="group inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm transition hover:border-slate-300 hover:shadow"
            >
              <span className="font-semibold text-slate-700">{item[valueKey]}</span>
              <button
                type="button"
                onClick={() => onDelete(item.id)}
                className="rounded-xl p-1 text-slate-400 transition hover:bg-red-50 hover:text-red-600"
                title={`Eliminar ${item[valueKey]}`}
              >
                <MdDelete size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

function Settings() {
  const [catalogs, setCatalogs] = useState({
    careers: [],
    semesters: [],
    periods: [],
  });
  const [careerName, setCareerName] = useState('');
  const [semesterValue, setSemesterValue] = useState('');
  const [periodName, setPeriodName] = useState('');
  const [loading, setLoading] = useState(true);

  async function fetchCatalogs() {
    const response = await api.get('/settings/catalogs');
    setCatalogs(response.data);
  }

  function notifyAcademicDataChange() {
    window.dispatchEvent(new Event('academic-data-changed'));
  }

  useEffect(() => {
    async function loadSettings() {
      try {
        setLoading(true);
        await fetchCatalogs();
      } catch (error) {
        toast.error('No se pudo cargar la configuración.');
      } finally {
        setLoading(false);
      }
    }

    loadSettings();
  }, []);

  const handleCreateCareer = async (event) => {
    event.preventDefault();
    const name = cleanText(careerName);

    if (name.length < 3) {
      toast.info('La carrera debe tener al menos 3 caracteres.');
      return;
    }

    try {
      await api.post('/settings/careers', { name });
      setCareerName('');
      await fetchCatalogs();
      notifyAcademicDataChange();
      toast.success('Carrera registrada.');
    } catch (error) {
      toast.error(error.response?.data?.error || 'No se pudo registrar la carrera.');
    }
  };

  const handleCreateSemester = async (event) => {
    event.preventDefault();
    const value = Number(semesterValue);

    if (!Number.isInteger(value) || value < 1 || value > 12) {
      toast.info('El semestre debe estar entre 1 y 12.');
      return;
    }

    try {
      await api.post('/settings/semesters', { value });
      setSemesterValue('');
      await fetchCatalogs();
      notifyAcademicDataChange();
      toast.success('Semestre registrado.');
    } catch (error) {
      toast.error(error.response?.data?.error || 'No se pudo registrar el semestre.');
    }
  };

  const handleCreatePeriod = async (event) => {
    event.preventDefault();
    const name = cleanText(periodName);

    if (name.length < 3) {
      toast.info('El período debe tener al menos 3 caracteres.');
      return;
    }

    try {
      await api.post('/settings/periods', { name });
      setPeriodName('');
      await fetchCatalogs();
      notifyAcademicDataChange();
      toast.success('Período registrado.');
    } catch (error) {
      toast.error(error.response?.data?.error || 'No se pudo registrar el período.');
    }
  };

  const handleDelete = async (section, id) => {
    try {
      await api.delete(`/settings/${section}/${id}`);
      await fetchCatalogs();
      notifyAcademicDataChange();
      toast.success('Elemento eliminado.');
    } catch (error) {
      toast.error(error.response?.data?.error || 'No se pudo eliminar el elemento.');
    }
  };

  const summary = useMemo(() => {
    const total = catalogs.careers.length + catalogs.semesters.length + catalogs.periods.length;

    return {
      total,
      careers: catalogs.careers.length,
      semesters: catalogs.semesters.length,
      periods: catalogs.periods.length,
      readiness:
        catalogs.careers.length > 0 && catalogs.periods.length > 0
          ? 'El formulario de estudiantes ya cuenta con opciones completas.'
          : 'Aún faltan catálogos por completar para un registro más fluido.',
    };
  }, [catalogs]);

  if (loading) {
    return <div className="text-slate-500">Cargando configuración...</div>;
  }

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.15),_transparent_32%),linear-gradient(135deg,_#ffffff,_#f8fafc_58%,_#eef2ff)] p-6 shadow-sm">
        <div className="absolute right-0 top-0 h-40 w-40 translate-x-8 -translate-y-8 rounded-full bg-cyan-200/30 blur-3xl" />
        <div className="relative flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-2xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 shadow-sm">
              <MdAutoAwesome size={16} />
              Centro de configuración académica
            </div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900">
              Configuración compacta, rápida y lista para crecer.
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-slate-600">
              Gestiona carreras, semestres y períodos en un solo tablero. Cada bloque fue compactado
              para que el usuario vea más información y necesite menos desplazamiento.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 xl:w-[34rem]">
            <SummaryCard
              title="Catálogos"
              value={summary.total}
              hint="Elementos activos sumando las tres categorías."
              icon={<MdAutoAwesome size={24} />}
              tone="slate"
            />
            <SummaryCard
              title="Carreras"
              value={summary.careers}
              hint="Opciones disponibles para el modal de estudiantes."
              icon={<MdLibraryBooks size={24} />}
              tone="blue"
            />
            <SummaryCard
              title="Períodos"
              value={summary.periods}
              hint="Disponibilidad actual para la inscripción académica."
              icon={<MdToday size={24} />}
              tone="amber"
            />
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Estado general</p>
          <p className="mt-2 text-lg font-bold text-slate-800">{summary.readiness}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
              Carreras: {summary.careers}
            </span>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
              Semestres: {summary.semesters}
            </span>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
              Períodos: {summary.periods}
            </span>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-slate-950 p-5 text-white shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Recomendación</p>
          <p className="mt-2 text-lg font-bold">Mantén nombres cortos y consistentes.</p>
          <p className="mt-2 text-sm leading-6 text-slate-300">
            En carreras usa una denominación oficial, en períodos un formato uniforme como
            `2026-I` o `2026-II`, y evita duplicados con mayúsculas distintas.
          </p>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <CompactCatalogSection
          title="Carreras"
          subtitle="Opciones visibles en el formulario de estudiantes."
          icon={<MdLibraryBooks size={22} className="text-blue-700" />}
          accentClass="bg-blue-50"
          items={catalogs.careers}
          valueKey="name"
          inputValue={careerName}
          inputLabel="Nueva carrera"
          inputPlaceholder="Ej. Ingeniería de Sistemas"
          onInputChange={(event) => setCareerName(event.target.value)}
          onCreate={handleCreateCareer}
          onDelete={(id) => handleDelete('careers', id)}
        />

        <CompactCatalogSection
          title="Semestres"
          subtitle="Semestres habilitados para el registro."
          icon={<MdNumbers size={22} className="text-emerald-700" />}
          accentClass="bg-emerald-50"
          items={catalogs.semesters}
          valueKey="value"
          inputValue={semesterValue}
          inputLabel="Nuevo semestre"
          inputPlaceholder="Ej. 7"
          onInputChange={(event) => setSemesterValue(onlyDigits(event.target.value, 2))}
          onCreate={handleCreateSemester}
          onDelete={(id) => handleDelete('semesters', id)}
        />

        <CompactCatalogSection
          title="Períodos"
          subtitle="Ventanas académicas disponibles para inscripción."
          icon={<MdToday size={22} className="text-fuchsia-700" />}
          accentClass="bg-fuchsia-50"
          items={catalogs.periods}
          valueKey="name"
          inputValue={periodName}
          inputLabel="Nuevo período"
          inputPlaceholder="Ej. 2026-I"
          onInputChange={(event) => setPeriodName(event.target.value)}
          onCreate={handleCreatePeriod}
          onDelete={(id) => handleDelete('periods', id)}
        />
      </div>
    </div>
  );
}

export default Settings;

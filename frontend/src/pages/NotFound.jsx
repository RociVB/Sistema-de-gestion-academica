import { useNavigate } from 'react-router-dom';
import { MdHome, MdSearchOff } from 'react-icons/md';

function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4 text-center">
      <div className="mb-6 flex items-center justify-center rounded-full bg-slate-100 p-6">
        <MdSearchOff size={64} className="text-slate-400" />
      </div>
      <h1 className="text-6xl font-black text-slate-800">404</h1>
      <h2 className="mt-3 text-xl font-semibold text-slate-600">Página no encontrada</h2>
      <p className="mt-2 max-w-sm text-sm text-slate-500">
        La ruta que buscas no existe o fue movida. Verifica la URL o regresa al inicio.
      </p>
      <button
        onClick={() => navigate('/')}
        className="mt-8 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
      >
        <MdHome size={18} />
        Volver al inicio
      </button>
    </div>
  );
}

export default NotFound;

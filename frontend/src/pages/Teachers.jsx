import { useEffect, useState } from 'react';
import { MdAdd, MdDownload } from 'react-icons/md';
import { toast } from 'react-toastify';
import PrimaryButton from '../components/Buttons/PrimaryButton';
import DangerButton from '../components/Buttons/DangerButton';
import TeacherForm from '../components/Forms/TeacherForm';
import Spinner from '../components/Loaders/Spinner';
import Modal from '../components/Modals/Modal';
import DataTable from '../components/Tables/DataTable';
import api from '../services/api';
import { exportToCsv } from '../utils/exportCsv';

function Teachers() {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentTeacher, setCurrentTeacher] = useState(null);
  const [teacherToDelete, setTeacherToDelete] = useState(null);

  const columns = [
    { header: 'Cédula', accessor: 'cedula' },
    { header: 'Nombres', accessor: 'nombres' },
    { header: 'Apellidos', accessor: 'apellidos' },
    { header: 'Correo', accessor: 'correo' },
    { header: 'Especialidad', accessor: 'especialidad' },
  ];

  async function fetchTeachers(searchTerm = '') {
    try {
      setLoading(true);
      const response = await api.get(`/teachers${searchTerm ? `?search=${searchTerm}` : ''}`);
      setTeachers(response.data);
    } catch (error) {
      toast.error('Error al cargar profesores.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchTeachers();
  }, []);

  const handleSearch = (term) => {
    fetchTeachers(term);
  };

  const handleAdd = () => {
    setCurrentTeacher(null);
    setIsModalOpen(true);
  };

  const handleEdit = (teacher) => {
    setCurrentTeacher(teacher);
    setIsModalOpen(true);
  };

  const handleDeleteRequest = (id) => {
    setTeacherToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await api.delete(`/teachers/${teacherToDelete}`);
      toast.success('Profesor eliminado exitosamente.');
      fetchTeachers();
    } catch (error) {
      toast.error('Error al eliminar profesor.');
    } finally {
      setIsDeleteModalOpen(false);
      setTeacherToDelete(null);
    }
  };

  const handleSubmit = async (formData) => {
    try {
      if (currentTeacher) {
        await api.put(`/teachers/${currentTeacher.id}`, formData);
        toast.success('Profesor actualizado exitosamente.');
      } else {
        await api.post('/teachers', formData);
        toast.success('Profesor creado exitosamente.');
      }
      setIsModalOpen(false);
      fetchTeachers();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Error al guardar profesor.');
    }
  };

  const handleExport = () => {
    if (teachers.length === 0) {
      toast.info('No hay datos para exportar.');
      return;
    }
    exportToCsv(
      teachers,
      ['Cédula', 'Nombres', 'Apellidos', 'Correo', 'Teléfono', 'Especialidad', 'Fecha Ingreso'],
      ['cedula', 'nombres', 'apellidos', 'correo', 'telefono', 'especialidad', 'fecha_ingreso'],
      'profesores'
    );
    toast.success(`${teachers.length} registro(s) exportados correctamente.`);
  };

  return (
    <div className="space-y-6">
      <div className="mb-6 flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Profesores</h1>
          <p className="text-slate-500">Gestión de docentes universitarios</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleExport}
            disabled={teachers.length === 0}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <MdDownload size={18} />
            Exportar CSV
          </button>
          <PrimaryButton onClick={handleAdd} className="flex items-center gap-2">
            <MdAdd size={20} />
            Nuevo Profesor
          </PrimaryButton>
        </div>
      </div>

      {loading ? (
        <Spinner />
      ) : (
        <DataTable
          columns={columns}
          data={teachers}
          onEdit={handleEdit}
          onDelete={handleDeleteRequest}
          onSearch={handleSearch}
          searchPlaceholder="Buscar por nombre, cédula o especialidad..."
        />
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={currentTeacher ? 'Editar Profesor' : 'Registrar Nuevo Profesor'}
      >
        <TeacherForm
          key={currentTeacher?.id ?? 'new-teacher'}
          initialData={currentTeacher}
          onSubmit={handleSubmit}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirmar Eliminación"
      >
        <div className="space-y-4">
          <p className="text-slate-600">
            ¿Estás seguro de que deseas eliminar este profesor? Esta acción no se puede deshacer.
          </p>
          <div className="flex justify-end space-x-3 border-t border-slate-100 pt-4">
            <button
              onClick={() => setIsDeleteModalOpen(false)}
              className="rounded-lg bg-slate-100 px-4 py-2 font-medium text-slate-600 transition-colors hover:bg-slate-200"
            >
              Cancelar
            </button>
            <DangerButton onClick={confirmDelete}>Eliminar</DangerButton>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default Teachers;

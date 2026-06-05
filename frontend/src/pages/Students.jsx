import { useEffect, useState } from 'react';
import { MdAdd } from 'react-icons/md';
import { toast } from 'react-toastify';
import PrimaryButton from '../components/Buttons/PrimaryButton';
import DangerButton from '../components/Buttons/DangerButton';
import StudentForm from '../components/Forms/StudentForm';
import Spinner from '../components/Loaders/Spinner';
import Modal from '../components/Modals/Modal';
import DataTable from '../components/Tables/DataTable';
import api from '../services/api';

const EMPTY_OPTIONS = {
  careers: [],
  semesters: [],
  periods: [],
};

function Students() {
  const [students, setStudents] = useState([]);
  const [options, setOptions] = useState(EMPTY_OPTIONS);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentStudent, setCurrentStudent] = useState(null);
  const [studentToDelete, setStudentToDelete] = useState(null);

  const columns = [
    { header: 'Cédula', accessor: 'cedula' },
    { header: 'Nombres', accessor: 'nombres' },
    { header: 'Apellidos', accessor: 'apellidos' },
    { header: 'Correo', accessor: 'correo' },
    { header: 'Carrera', accessor: 'carrera' },
    { header: 'Semestre', accessor: 'semestre' },
    { header: 'Período', accessor: 'periodo' },
  ];

  async function fetchCatalogs() {
    const response = await api.get('/settings/catalogs');
    setOptions(response.data);
    return response.data;
  }

  async function fetchStudents(searchTerm = '') {
    try {
      setLoading(true);
      const response = await api.get(`/students${searchTerm ? `?search=${searchTerm}` : ''}`);
      setStudents(response.data);
    } catch (error) {
      toast.error('Error al cargar estudiantes.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    async function loadPage() {
      try {
        setLoading(true);
        const [studentsResponse, catalogsResponse] = await Promise.all([
          api.get('/students'),
          api.get('/settings/catalogs'),
        ]);
        setStudents(studentsResponse.data);
        setOptions(catalogsResponse.data);
      } catch (error) {
        toast.error('No se pudo cargar la información de estudiantes.');
      } finally {
        setLoading(false);
      }
    }

    loadPage();
  }, []);

  const missingCatalogData =
    options.careers.length === 0 || options.semesters.length === 0 || options.periods.length === 0;

  const handleSearch = (term) => {
    fetchStudents(term);
  };

  const handleAdd = () => {
    if (missingCatalogData) {
      toast.info('Configura carreras, semestres y períodos antes de registrar estudiantes.');
      return;
    }

    setCurrentStudent(null);
    setIsModalOpen(true);
  };

  const handleEdit = (student) => {
    setCurrentStudent(student);
    setIsModalOpen(true);
  };

  const handleDeleteRequest = (id) => {
    setStudentToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await api.delete(`/students/${studentToDelete}`);
      toast.success('Estudiante eliminado exitosamente.');
      fetchStudents();
    } catch (error) {
      toast.error('Error al eliminar estudiante.');
    } finally {
      setIsDeleteModalOpen(false);
      setStudentToDelete(null);
    }
  };

  const handleSubmit = async (formData) => {
    try {
      if (currentStudent) {
        await api.put(`/students/${currentStudent.id}`, formData);
        toast.success('Estudiante actualizado exitosamente.');
      } else {
        await api.post('/students', formData);
        toast.success('Estudiante creado exitosamente.');
      }

      setIsModalOpen(false);
      await Promise.all([fetchStudents(), fetchCatalogs()]);
    } catch (error) {
      const message = error.response?.data?.error || 'Error al guardar estudiante.';
      toast.error(message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Estudiantes</h1>
          <p className="text-slate-500">Gestión del alumnado universitario</p>
        </div>
        <PrimaryButton onClick={handleAdd} className="flex items-center gap-2" disabled={missingCatalogData}>
          <MdAdd size={20} />
          Nuevo Estudiante
        </PrimaryButton>
      </div>

      {missingCatalogData ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-800">
          Antes de registrar estudiantes debes cargar al menos una carrera, un semestre y un período desde Configuración.
        </div>
      ) : null}

      {loading ? (
        <Spinner />
      ) : (
        <DataTable
          columns={columns}
          data={students}
          onEdit={handleEdit}
          onDelete={handleDeleteRequest}
          onSearch={handleSearch}
          searchPlaceholder="Buscar por nombre, cédula, carrera o período..."
        />
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={currentStudent ? 'Editar Estudiante' : 'Registrar Nuevo Estudiante'}
      >
        <StudentForm
          key={currentStudent?.id ?? 'new-student'}
          initialData={currentStudent}
          onSubmit={handleSubmit}
          onCancel={() => setIsModalOpen(false)}
          options={options}
        />
      </Modal>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirmar Eliminación"
      >
        <div className="space-y-4">
          <p className="text-slate-600">
            ¿Estás seguro de que deseas eliminar este estudiante? Esta acción no se puede deshacer.
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

export default Students;

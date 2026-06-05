import { useState } from 'react';
import PrimaryButton from '../Buttons/PrimaryButton';
import {
  buildTeacherFormState,
  onlyDigits,
  validateTeacherForm,
} from '../../utils/formValidation';

const FIELD_CLASSNAME = 'w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2';

function FieldError({ message }) {
  if (!message) {
    return null;
  }

  return <p className="mt-1 text-sm text-red-600">{message}</p>;
}

function TeacherForm({ initialData, onSubmit, onCancel }) {
  const [formData, setFormData] = useState(() => buildTeacherFormState(initialData));
  const [errors, setErrors] = useState({});

  const handleChange = (event) => {
    const { name, value } = event.target;
    let nextValue = value;

    if (name === 'cedulaNumber') {
      nextValue = onlyDigits(value, 11);
    }

    if (name === 'phoneCode') {
      nextValue = onlyDigits(value, 4);
    }

    if (name === 'phoneNumber') {
      nextValue = onlyDigits(value, 7);
    }

    setFormData((currentData) => ({
      ...currentData,
      [name]: nextValue,
    }));

    setErrors((currentErrors) => ({
      ...currentErrors,
      [name]: '',
      cedula: name === 'nationality' || name === 'cedulaNumber' ? '' : currentErrors.cedula,
      telefono: name === 'phoneCode' || name === 'phoneNumber' ? '' : currentErrors.telefono,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const { errors: validationErrors, payload } = validateTeacherForm(formData);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Cédula</label>
          <div className="grid grid-cols-[92px_1fr] gap-2">
            <select
              name="nationality"
              value={formData.nationality}
              onChange={handleChange}
              className={`${FIELD_CLASSNAME} border-slate-300 focus:ring-blue-500`}
            >
              <option value="V">V</option>
              <option value="E">E</option>
            </select>
            <input
              type="text"
              name="cedulaNumber"
              value={formData.cedulaNumber}
              onChange={handleChange}
              inputMode="numeric"
              placeholder="12345678"
              className={`${FIELD_CLASSNAME} ${
                errors.cedula ? 'border-red-400 focus:ring-red-500' : 'border-slate-300 focus:ring-blue-500'
              }`}
            />
          </div>
          <FieldError message={errors.cedula} />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Correo electrónico</label>
          <input
            type="email"
            name="correo"
            value={formData.correo}
            onChange={handleChange}
            className={`${FIELD_CLASSNAME} ${
              errors.correo ? 'border-red-400 focus:ring-red-500' : 'border-slate-300 focus:ring-blue-500'
            }`}
          />
          <FieldError message={errors.correo} />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Nombres</label>
          <input
            type="text"
            name="nombres"
            value={formData.nombres}
            onChange={handleChange}
            className={`${FIELD_CLASSNAME} ${
              errors.nombres ? 'border-red-400 focus:ring-red-500' : 'border-slate-300 focus:ring-blue-500'
            }`}
          />
          <FieldError message={errors.nombres} />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Apellidos</label>
          <input
            type="text"
            name="apellidos"
            value={formData.apellidos}
            onChange={handleChange}
            className={`${FIELD_CLASSNAME} ${
              errors.apellidos ? 'border-red-400 focus:ring-red-500' : 'border-slate-300 focus:ring-blue-500'
            }`}
          />
          <FieldError message={errors.apellidos} />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Teléfono</label>
          <div className="grid grid-cols-[120px_1fr] gap-2">
            <input
              type="text"
              name="phoneCode"
              value={formData.phoneCode}
              onChange={handleChange}
              inputMode="numeric"
              placeholder="0412"
              className={`${FIELD_CLASSNAME} ${
                errors.telefono ? 'border-red-400 focus:ring-red-500' : 'border-slate-300 focus:ring-blue-500'
              }`}
            />
            <input
              type="text"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              inputMode="numeric"
              placeholder="1234567"
              className={`${FIELD_CLASSNAME} ${
                errors.telefono ? 'border-red-400 focus:ring-red-500' : 'border-slate-300 focus:ring-blue-500'
              }`}
            />
          </div>
          <FieldError message={errors.telefono} />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Especialidad</label>
          <input
            type="text"
            name="especialidad"
            value={formData.especialidad}
            onChange={handleChange}
            className={`${FIELD_CLASSNAME} ${
              errors.especialidad ? 'border-red-400 focus:ring-red-500' : 'border-slate-300 focus:ring-blue-500'
            }`}
          />
          <FieldError message={errors.especialidad} />
        </div>
      </div>

      <div className="rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-500">
        La cédula usa formato `V` o `E` con 6 a 11 números. El teléfono debe tener un código de 4 dígitos y 7 dígitos adicionales.
      </div>

      <div className="flex justify-end space-x-3 border-t border-slate-100 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg bg-slate-100 px-4 py-2 font-medium text-slate-600 transition-colors hover:bg-slate-200"
        >
          Cancelar
        </button>
        <PrimaryButton type="submit">{
          initialData ? 'Actualizar' : 'Guardar'
        }</PrimaryButton>
      </div>
    </form>
  );
}

export default TeacherForm;

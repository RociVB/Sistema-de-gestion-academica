const NAME_REGEX = /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü\s'-]{2,60}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const EMPTY_STUDENT_FORM = {
  nationality: 'V',
  cedulaNumber: '',
  nombres: '',
  apellidos: '',
  correo: '',
  phoneCode: '',
  phoneNumber: '',
  carrera: '',
  semestre: '',
  periodo: '',
};

const EMPTY_TEACHER_FORM = {
  nationality: 'V',
  cedulaNumber: '',
  nombres: '',
  apellidos: '',
  correo: '',
  phoneCode: '',
  phoneNumber: '',
  especialidad: '',
};

function cleanText(value) {
  return String(value ?? '').trim().replace(/\s+/g, ' ');
}

function onlyDigits(value, maxLength) {
  return String(value ?? '').replace(/\D/g, '').slice(0, maxLength);
}

function parseCedula(cedula) {
  const safeValue = cleanText(cedula).toUpperCase();
  const match = safeValue.match(/^(V|E)-?(\d{6,11})$/);

  if (!match) {
    return {
      nationality: 'V',
      cedulaNumber: onlyDigits(safeValue, 11),
    };
  }

  return {
    nationality: match[1],
    cedulaNumber: match[2],
  };
}

function parsePhone(phone) {
  const safeValue = cleanText(phone);
  const match = safeValue.match(/^(0\d{3})-?(\d{7})$/);

  if (!match) {
    const digits = onlyDigits(safeValue, 11);
    return {
      phoneCode: digits.slice(0, 4),
      phoneNumber: digits.slice(4, 11),
    };
  }

  return {
    phoneCode: match[1],
    phoneNumber: match[2],
  };
}

function buildStudentFormState(initialData) {
  if (!initialData) {
    return EMPTY_STUDENT_FORM;
  }

  const { nationality, cedulaNumber } = parseCedula(initialData.cedula);
  const { phoneCode, phoneNumber } = parsePhone(initialData.telefono);

  return {
    nationality,
    cedulaNumber,
    nombres: cleanText(initialData.nombres),
    apellidos: cleanText(initialData.apellidos),
    correo: cleanText(initialData.correo).toLowerCase(),
    phoneCode,
    phoneNumber,
    carrera: cleanText(initialData.carrera),
    semestre: initialData.semestre ? String(initialData.semestre) : '',
    periodo: cleanText(initialData.periodo),
  };
}

function buildTeacherFormState(initialData) {
  if (!initialData) {
    return EMPTY_TEACHER_FORM;
  }

  const { nationality, cedulaNumber } = parseCedula(initialData.cedula);
  const { phoneCode, phoneNumber } = parsePhone(initialData.telefono);

  return {
    nationality,
    cedulaNumber,
    nombres: cleanText(initialData.nombres),
    apellidos: cleanText(initialData.apellidos),
    correo: cleanText(initialData.correo).toLowerCase(),
    phoneCode,
    phoneNumber,
    especialidad: cleanText(initialData.especialidad),
  };
}

function validateCommonFields(formData) {
  const errors = {};
  const nombres = cleanText(formData.nombres);
  const apellidos = cleanText(formData.apellidos);
  const correo = cleanText(formData.correo).toLowerCase();
  const cedulaNumber = onlyDigits(formData.cedulaNumber, 11);
  const phoneCode = onlyDigits(formData.phoneCode, 4);
  const phoneNumber = onlyDigits(formData.phoneNumber, 7);

  if (!['V', 'E'].includes(formData.nationality)) {
    errors.cedula = 'Selecciona si la cédula es venezolana o extranjera.';
  } else if (cedulaNumber.length < 6 || cedulaNumber.length > 11) {
    errors.cedula = 'La cédula debe tener entre 6 y 11 números.';
  }

  if (!NAME_REGEX.test(nombres)) {
    errors.nombres = 'Ingresa nombres válidos, con solo letras y al menos 2 caracteres.';
  }

  if (!NAME_REGEX.test(apellidos)) {
    errors.apellidos = 'Ingresa apellidos válidos, con solo letras y al menos 2 caracteres.';
  }

  if (!EMAIL_REGEX.test(correo)) {
    errors.correo = 'Ingresa un correo electrónico válido.';
  }

  if (phoneCode.length !== 4 || !phoneCode.startsWith('0')) {
    errors.telefono = 'El código telefónico debe tener 4 dígitos y comenzar con 0.';
  } else if (phoneNumber.length !== 7) {
    errors.telefono = 'El número telefónico debe tener exactamente 7 dígitos.';
  }

  return {
    errors,
    normalized: {
      nombres,
      apellidos,
      correo,
      cedula: `${formData.nationality}-${cedulaNumber}`,
      telefono: `${phoneCode}-${phoneNumber}`,
    },
  };
}

function validateStudentForm(formData) {
  const { errors, normalized } = validateCommonFields(formData);
  const carrera = cleanText(formData.carrera);
  const periodo = cleanText(formData.periodo);
  const semestre = Number(formData.semestre);

  if (!carrera) {
    errors.carrera = 'Selecciona una carrera.';
  }

  if (!Number.isInteger(semestre) || semestre < 1 || semestre > 12) {
    errors.semestre = 'Selecciona un semestre válido.';
  }

  if (!periodo) {
    errors.periodo = 'Selecciona un período.';
  }

  return {
    errors,
    payload: {
      ...normalized,
      carrera,
      semestre,
      periodo,
    },
  };
}

function validateTeacherForm(formData) {
  const { errors, normalized } = validateCommonFields(formData);
  const especialidad = cleanText(formData.especialidad);

  if (!NAME_REGEX.test(especialidad)) {
    errors.especialidad = 'Ingresa una especialidad válida.';
  }

  return {
    errors,
    payload: {
      ...normalized,
      especialidad,
    },
  };
}

export {
  EMPTY_STUDENT_FORM,
  EMPTY_TEACHER_FORM,
  buildStudentFormState,
  buildTeacherFormState,
  cleanText,
  onlyDigits,
  validateStudentForm,
  validateTeacherForm,
};

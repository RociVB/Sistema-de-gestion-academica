/**
 * Genera y descarga un archivo CSV a partir de un array de objetos.
 * @param {Object[]} data       - Filas de datos
 * @param {string[]} headers    - Etiquetas de columna (en español)
 * @param {string[]} keys       - Claves del objeto que corresponden a cada cabecera
 * @param {string}   filename   - Nombre del archivo sin extensión
 */
export function exportToCsv(data, headers, keys, filename) {
  if (!data || data.length === 0) return;

  const BOM = '\uFEFF'; // Para que Excel abra correctamente caracteres UTF-8

  const headerRow = headers.join(',');

  const rows = data.map((row) =>
    keys
      .map((key) => {
        const value = row[key] ?? '';
        // Escapar comillas dobles y envolver en comillas si contiene coma o salto de línea
        const str = String(value).replace(/"/g, '""');
        return /[,\n"]/.test(str) ? `"${str}"` : str;
      })
      .join(',')
  );

  const csvContent = BOM + [headerRow, ...rows].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}_${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

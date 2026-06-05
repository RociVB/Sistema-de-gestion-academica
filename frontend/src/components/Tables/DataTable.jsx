import React, { useState } from 'react';
import { MdEdit, MdDelete, MdSearch } from 'react-icons/md';

const DataTable = ({ columns, data, onEdit, onDelete, onSearch, searchPlaceholder = "Buscar..." }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    if (onSearch) {
      onSearch(e.target.value);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md border border-slate-100 overflow-hidden">
      {/* Table Header Controls */}
      <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
        <div className="relative w-64">
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
          <MdSearch className="absolute left-3 top-2.5 text-slate-400" size={20} />
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
              {columns.map((col, idx) => (
                <th key={idx} className="px-6 py-4 font-semibold border-b border-slate-200">
                  {col.header}
                </th>
              ))}
              <th className="px-6 py-4 font-semibold border-b border-slate-200 text-right">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
            {data.length > 0 ? (
              data.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50 transition-colors">
                  {columns.map((col, idx) => (
                    <td key={idx} className="px-6 py-4 whitespace-nowrap">
                      {row[col.accessor]}
                    </td>
                  ))}
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <button
                      onClick={() => onEdit(row)}
                      className="text-blue-500 hover:text-blue-700 mx-2 transition-colors"
                      title="Editar"
                    >
                      <MdEdit size={20} />
                    </button>
                    <button
                      onClick={() => onDelete(row.id)}
                      className="text-red-500 hover:text-red-700 mx-2 transition-colors"
                      title="Eliminar"
                    >
                      <MdDelete size={20} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length + 1} className="px-6 py-8 text-center text-slate-500">
                  No se encontraron registros.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable;

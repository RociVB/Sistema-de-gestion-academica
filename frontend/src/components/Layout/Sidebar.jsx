import React from 'react';
import { NavLink } from 'react-router-dom';
import { MdDashboard, MdPeople, MdSchool, MdSettings } from 'react-icons/md';

const Sidebar = () => {
  const navItems = [
    { name: 'Dashboard', path: '/', icon: <MdDashboard size={24} /> },
    { name: 'Estudiantes', path: '/students', icon: <MdSchool size={24} /> },
    { name: 'Profesores', path: '/teachers', icon: <MdPeople size={24} /> },
    { name: 'Configuración', path: '/settings', icon: <MdSettings size={24} /> },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-white flex flex-col h-screen fixed top-0 left-0">
      <div className="p-6 border-b border-slate-800">
        <h1 className="text-2xl font-bold text-blue-500 flex items-center gap-2">
          <MdSchool />
          EduManage
        </h1>
      </div>
      <nav className="flex-1 py-6 px-4 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`
            }
          >
            {item.icon}
            <span className="font-medium">{item.name}</span>
          </NavLink>
        ))}
      </nav>
      <div className="p-4 border-t border-slate-800 text-sm text-slate-500 text-center">
        © 2026 EduManage SaaS
      </div>
    </aside>
  );
};

export default Sidebar;

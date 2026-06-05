import React, { useState, useEffect } from 'react';
import api from '../services/api';
import StatCard from '../components/Cards/StatCard';
import Spinner from '../components/Loaders/Spinner';
import { MdPeople, MdSchool, MdToday, MdAssessment } from 'react-icons/md';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await api.get('/dashboard/stats');
      setStats(response.data);
    } catch (error) {
      console.error("Error al cargar estadísticas", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Spinner />;
  if (!stats) return <div className="text-center text-slate-500">Error al cargar los datos del dashboard.</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
          <p className="text-slate-500">Resumen general de la plataforma</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Estudiantes"
          value={stats.metrics.totalStudents}
          icon={<MdSchool size={32} className="text-blue-600" />}
          colorClass="bg-blue-100"
        />
        <StatCard
          title="Total Profesores"
          value={stats.metrics.totalTeachers}
          icon={<MdPeople size={32} className="text-green-600" />}
          colorClass="bg-green-100"
        />
        <StatCard
          title="Registros de Hoy"
          value={stats.metrics.createdToday}
          icon={<MdToday size={32} className="text-orange-600" />}
          colorClass="bg-orange-100"
        />
        <StatCard
          title="Total Registros"
          value={stats.metrics.totalRecords}
          icon={<MdAssessment size={32} className="text-purple-600" />}
          colorClass="bg-purple-100"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        {/* Gráfico de Barras - Estudiantes por Carrera */}
        <div className="bg-white p-6 rounded-xl shadow-md border border-slate-100">
          <h3 className="text-lg font-semibold text-slate-800 mb-6">Estudiantes por Carrera</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.charts.studentsByCareer} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                <Bar dataKey="value" name="Estudiantes" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gráfico Circular - Profesores por Especialidad */}
        <div className="bg-white p-6 rounded-xl shadow-md border border-slate-100">
          <h3 className="text-lg font-semibold text-slate-800 mb-6">Profesores por Especialidad</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.charts.teachersBySpecialty}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {stats.charts.teachersBySpecialty.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

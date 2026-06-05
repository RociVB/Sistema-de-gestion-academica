import React from 'react';

const StatCard = ({ title, value, icon, colorClass }) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 flex items-center justify-between hover:shadow-lg transition-shadow border border-slate-100">
      <div>
        <h3 className="text-sm font-medium text-slate-500 mb-1">{title}</h3>
        <p className="text-3xl font-bold text-slate-800">{value}</p>
      </div>
      <div className={`p-4 rounded-full ${colorClass} bg-opacity-20`}>
        {icon}
      </div>
    </div>
  );
};

export default StatCard;

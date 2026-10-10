import React from 'react';

export default function Toast({ thongBao, loai }) {
  if (!thongBao) return null;

  const mau = 
    loai === 'success' ? 'bg-emerald-600' : 
    loai === 'error'   ? 'bg-rose-600' : 
                         'bg-amber-500';
  const icon = 
    loai === 'success' ? '✅' : 
    loai === 'error'   ? '❌' : 
                         '⚠️';

  return (
    <div className={`fixed bottom-6 right-6 z-[100] ${mau} text-white px-5 py-3 rounded-xl shadow-xl text-sm font-medium flex items-center gap-2 animate-bounce`}>
      {icon} 
      <span>{thongBao}</span>
    </div>
  );
}
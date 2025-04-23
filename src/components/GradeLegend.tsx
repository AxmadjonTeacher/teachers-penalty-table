
import React from 'react';

export const GradeLegend = () => {
  return (
    <div className="bg-white/80 p-4 rounded-xl shadow-md border-2 border-[#E5DEFF] mb-6 animate-fade-in">
      <h4 className="text-lg font-semibold mb-2 text-[#8B5CF6]">Explanation of symbols:</h4>
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="font-bold text-green-600">+</span>
          <span>Everything is done</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-bold text-orange-500">K</span>
          <span>K – Kelmedi (Did not come)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-bold text-yellow-600">KQ</span>
          <span>KQ – Kech keldi (Came late)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-bold text-red-500">V</span>
          <span>V – Vazifa qilmadi (Did not do homework)</span>
        </div>
      </div>
    </div>
  );
};


import React from 'react';

export const GradeLegend = () => {
  return (
    <div className="bg-white/80 p-4 rounded-xl shadow-md border-2 border-[#E5DEFF] mb-6 animate-fade-in">
      <h4 className="text-lg font-semibold mb-2 text-[#8B5CF6]">Explanation of symbols:</h4>
      <ul className="space-y-1 text-base">
        <li>
          <span className="font-bold text-green-600">+</span> Everything is done
        </li>
        <li>
          <span className="font-bold text-orange-500">K</span> - Kelmadi (Did not come)
        </li>
        <li>
          <span className="font-bold text-yellow-600">KQ</span> - Kech qoldi (Was late)
        </li>
        <li>
          <span className="font-bold text-red-500">V</span> - Vazifa qilinmadi (Did not do the homework)
        </li>
      </ul>
    </div>
  );
};

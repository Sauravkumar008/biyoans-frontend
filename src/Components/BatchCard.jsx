import React from 'react';
import { FiEdit, FiTrash2 } from 'react-icons/fi';

const BatchCard = ({ batch, onEdit, onDelete }) => {
  const { batchName, timing, mode, runningFrom } = batch || {};
  return (
    <div className="w-80 bg-[#11163D] text-white p-6 rounded-2xl shadow-md border border-gray-600">
      <h2 className="text-2xl font-bold mb-2">{batchName}</h2>
      <p className="text-gray-400 mb-1">⏰ <span className="text-white">{timing}</span></p>
      <p className="text-gray-400 mb-1">📍 Mode: <span className="text-white">{mode}</span></p>
      <p className="text-gray-400 mb-4">🚀 Running: <span className="text-white">{runningFrom}</span></p>

      <div className="flex gap-2 justify-end">
        {onEdit && (
          <button onClick={() => onEdit(batch)} className="p-2 rounded-md bg-white/5 hover:bg-white/10">
            <FiEdit />
          </button>
        )}
        {onDelete && (
          <button onClick={() => onDelete(batch)} className="p-2 rounded-md bg-white/5 hover:bg-white/10">
            <FiTrash2 />
          </button>
        )}
      </div>
    </div>
  );
};

export default BatchCard;
// src/components/SearchBar.jsx
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function SearchBar({ value, onChange, placeholder, showBack = false }) {
  const navigate = useNavigate();

  return (
    <div className="flex items-center gap-3 w-[320px] mx-auto mb-4">
      {showBack && (
        <button onClick={() => navigate(-1)} className="p-2">
          <ArrowLeft className="w-5 h-5 text-gray-600 hover:text-gray-900" />
        </button>
      )}
      <input
        type="text"
        placeholder={placeholder}
        className="flex-1 p-3 rounded-full border border-gray-300 shadow text-gray-800 placeholder-gray-400"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

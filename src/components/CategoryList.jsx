// src/components/CategoryList.jsx
import data from "../data/organized.json";
import { useParams, useNavigate } from "react-router";
import { useState } from "react";
import { ChevronRight, ArrowLeft } from "lucide-react";
import Breadcrumbs from "./Breadcrumbs";
import useBreadcrumbText from "../hooks/useBreadcrumbText";

export default function CategoryList() {
  const { brandName } = useParams();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const decodedBrand = decodeURIComponent(brandName);
  const entries = data[decodedBrand] || [];

  const filteredCategories = entries.filter((entry) =>
    entry.category.toLowerCase().includes(search.toLowerCase())
  )
  .sort((a, b) => a.category.localeCompare(b.category));
  const breadcrumbText = useBreadcrumbText();

  return (
    <div className="p-4 max-w-md mx-auto pt-6 min-h-screen w-screen">
      <div className="flex items-start gap-3 mx-auto mb-4">
        <button onClick={() => navigate('/')} className="hover:!bg-gray-200 !border-none !p-0 flex items-center justify-center w-10 h-10 rounded-full transition">
            <ArrowLeft className="w-5 h-5 text-gray-600 hover:text-gray-900" />
            </button>
        <input
            type="text"
            placeholder={`Search in ${breadcrumbText}`}
            className="w-full p-2 rounded-lg border border-gray-300 text-gray-800 placeholder-gray-400 shadow mb-4"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <Breadcrumbs />
      <div className="flex flex-col gap-3">
        {filteredCategories.map((entry, index) => (
          <button
            key={index}
            onClick={() => navigate(`/brand/${encodeURIComponent(brandName)}/${encodeURIComponent(entry.category)}`)}
            className="flex items-center justify-between p-4 bg-white rounded-xl shadow hover:shadow-md"
          >
            <span className="text-lg font-semibold">{entry.category}</span>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
        ))}
      </div>
    </div>
  );
}

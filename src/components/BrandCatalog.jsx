// src/components/BrandCatalog.jsx
import data from "../data/organized.json";
import { useState } from "react";
import { useNavigate } from "react-router";
import { ChevronRight } from "lucide-react";
import useBreadcrumbText from "../hooks/useBreadcrumbText"; 

export default function BrandCatalog() {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const filteredBrands = Object.entries(data).filter(([brand]) =>
    brand.toLowerCase().includes(search.toLowerCase())
  );
  const breadcrumbText = useBreadcrumbText();

  return (
    <div className="p-4 max-w-md mx-auto pt-6 min-h-screen w-screen">
      <div className="mb-4">
        <input
          type="text"
          placeholder={`Search in ${breadcrumbText}`}
          className="w-full p-2 rounded-lg border border-gray-300 text-gray-800 placeholder-gray-400 shadow mb-4"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div className="flex flex-col gap-3">
        {filteredBrands.map(([brand]) => (
          <button
            key={brand}
            onClick={() =>
              navigate(`/brand/${encodeURIComponent(brand)}`)
            }
            className="flex items-center justify-between p-4 bg-white rounded-xl shadow hover:shadow-md"
          >
            <span className="text-lg font-semibold">{brand}</span>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
        ))}
      </div>
    </div>
  );
}

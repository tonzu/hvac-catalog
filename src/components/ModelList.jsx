// src/components/ModelList.jsx
import data from "../data/organized.json";
import { useParams, useNavigate } from "react-router";
import { useState } from "react";
import Breadcrumbs from "./Breadcrumbs";
import useBreadcrumbText from "../hooks/useBreadcrumbText";
import { ArrowLeft } from "lucide-react";

export default function ModelList() {
  const { brandName, category } = useParams();
  const [search, setSearch] = useState("");

  const decodedBrand = decodeURIComponent(brandName);
  const decodedCategory = decodeURIComponent(category);
  const entries = data[decodedBrand] || [];

  const navigate = useNavigate();
  const breadcrumbText = useBreadcrumbText();

  const models = entries
    .filter((entry) => entry.category === decodedCategory)
    .flatMap((entry) => entry.models || []);

  const filteredModels = models.filter((model) =>
    model.sku.toLowerCase().includes(search.toLowerCase())
  )
  .sort((a, b) => a.sku.localeCompare(b.sku));

  return (
    <div className="p-4 max-w-md mx-auto pt-6 min-h-screen w-screen">
      <div className="flex items-start gap-3 mx-auto mb-4">
        <button onClick={() => navigate(-1)} className="hover:!bg-gray-200 !border-none !p-0 flex items-center justify-center w-10 h-10 rounded-full transition">
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
      <div className="grid gap-4">
        {filteredModels.map((model, index) => (
          <div key={index} className="bg-white rounded-xl shadow p-4">
            <div className="flex gap-4">
              {/* Product Image */}
              <div className="flex-shrink-0">
                {model.image ? (
                  <img
                    src={model.image}
                    alt={model.title || model.sku}
                    className="w-24 h-24 object-cover rounded-lg border border-gray-200"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="w-24 h-24 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center">
                    <span className="text-gray-400 text-xs text-center">No Image</span>
                  </div>
                )}
              </div>
              
              {/* Product Details */}
              <div className="flex-1 min-w-0">
                <h2 className="text-lg text-gray-900 font-semibold truncate">{model.sku}</h2>
                <p className="text-sm text-gray-600 line-clamp-2 mb-1">{model.title}</p>
                <p className="text-sm text-gray-600">{model.electrical}</p>
                {/* Add more specs here as needed */}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
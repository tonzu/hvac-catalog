// src/components/BrandCatalog.jsx
import data from "../data/organized.json"; // The output from your scraper
import { useState } from "react";

export default function BrandCatalog() {
  const [search, setSearch] = useState("");

  // Filter brands/models based on search
  const filteredData = Object.entries(data).filter(([brand, entries]) => {
    const brandMatch = brand.toLowerCase().includes(search.toLowerCase());
    const modelMatch = entries.some((entry) =>
      entry.models.some((m) =>
        m.sku.toLowerCase().includes(search.toLowerCase())
      )
    );
    return brandMatch || modelMatch;
  });

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <input
        className="w-full p-2 border rounded mb-4"
        type="text"
        placeholder="Search by brand or model..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {filteredData.map(([brand, entries]) => (
        <div key={brand} className="mb-6">
          <h2 className="text-xl font-bold mb-2">{brand}</h2>
          {entries.map((entry, i) => (
            <div key={i} className="mb-4">
              <h3 className="text-lg font-semibold text-gray-700">
                {entry.category}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                {entry.models.map((model, idx) => (
                  <div
                    key={idx}
                    className="border rounded-lg p-3 shadow hover:shadow-md transition"
                  >
                    <p className="font-medium">SKU: {model.sku}</p>
                    <p className="text-sm text-gray-600">
                      Electrical: {model.electrical}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

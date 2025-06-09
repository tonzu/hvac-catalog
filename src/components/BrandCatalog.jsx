// src/components/BrandCatalog.jsx
import data from "../data/organized.json";
import { useState } from "react";
import { useNavigate } from "react-router";
import { ChevronRight } from "lucide-react";
import useBreadcrumbText from "../hooks/useBreadcrumbText";

export default function BrandCatalog() {
  const [search, setSearch] = useState("");
  const [validBrands, setValidBrands] = useState(new Set());
  const [checkedBrands, setCheckedBrands] = useState(new Set());
  const navigate = useNavigate();

  const filteredBrands = Object.entries(data).filter(([brand]) =>
    brand.toLowerCase().includes(search.toLowerCase()) && validBrands.has(brand)
  )
  .sort((a, b) => a[0].localeCompare(b[0]));
  
  const breadcrumbText = useBreadcrumbText();

  const getBrandLogo = (brandName) => {
    // Convert brand name to a filename-friendly format
    const logoFileName = brandName
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-') // Replace non-alphanumeric with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single
      .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
    
    return `/logos/${logoFileName}.png`;
  };

  // Handle logo loading success - add brand to valid list
  const handleLogoLoad = (brandName) => {
    setValidBrands(prev => new Set([...prev, brandName]));
  };

  // Handle logo loading errors - don't add to valid list
  const handleLogoError = (brandName) => {
    setCheckedBrands(prev => new Set([...prev, brandName]));
  };

  // Check if we should render the brand (logo loaded successfully)
  const shouldRenderBrand = (brandName) => {
    return validBrands.has(brandName);
  };

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
        <div style={{ display: 'none' }}>
          {Object.keys(data).map((brand) => (
            <img
              key={brand}
              src={getBrandLogo(brand)}
              alt=""
              onLoad={() => handleLogoLoad(brand)}
              onError={() => handleLogoError(brand)}
            />
          ))}
        </div>

        {/* Visible brand buttons - only show brands with valid logos */}
        {filteredBrands.map(([brand]) => (
          <button
            key={brand}
            onClick={() => navigate(`/brand/${encodeURIComponent(brand)}`)}
            className="flex items-center justify-between p-4 bg-white rounded-xl shadow hover:shadow-md w-full"
          >
            <div className="flex gap-3">
              <img
                src={getBrandLogo(brand)}
                alt={`${brand} logo`}
                className="w-8 h-8 object-contain flex-shrink-0"
              />
              <span className="text-left">{brand}</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
          </button>
        ))}
      </div>
    </div>
  );
}
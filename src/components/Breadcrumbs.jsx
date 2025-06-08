// src/components/Breadcrumbs.jsx
import { Link, useParams } from "react-router";

export default function Breadcrumbs() {
  const { brandName, category } = useParams();

  return (
    <div className="text-sm text-gray-500 mb-4 space-x-1">
      <Link to="/" className="hover:underline text-blue-600">Home</Link>
      {brandName && (
        <>
          <span>/</span>
          <Link
            to={`/brand/${encodeURIComponent(brandName)}`}
            className="hover:underline text-blue-600"
          >
            {decodeURIComponent(brandName)}
          </Link>
        </>
      )}
      {category && (
        <>
          <span>/</span>
          <span className="text-blue-800">{decodeURIComponent(category)}</span>
        </>
      )}
    </div>
  );
}

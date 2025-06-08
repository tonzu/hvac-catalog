// src/hooks/useBreadcrumbText.js
import { useParams } from "react-router";

export default function useBreadcrumbText() {
  const { brandName, category } = useParams();

  const decodedBrand = brandName ? decodeURIComponent(brandName) : null;
  const decodedCategory = category ? decodeURIComponent(category) : null;

  if (decodedBrand && decodedCategory) return `${decodedBrand} / ${decodedCategory}`;
  if (decodedBrand) return decodedBrand;
  return "All Brands";
}

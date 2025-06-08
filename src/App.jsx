// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router";
import BrandCatalog from "./components/BrandCatalog";
import CategoryList from "./components/CategoryList";
import ModelList from "./components/ModelList";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<BrandCatalog />} />
        <Route path="/brand/:brandName" element={<CategoryList />} />
        <Route path="/brand/:brandName/:category" element={<ModelList />} />
      </Routes>
    </Router>
  );
}

export default App;

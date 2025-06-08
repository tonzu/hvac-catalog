import data from '../data/organized.json'; // path is relative to BrandPage.jsx

function BrandPage() {
  return (
    <div>
      <h1>{data[0].brand}</h1>
      {data[0].models.map((model) => (
        <div key={model.sku}>
          <h2>{model.sku}</h2>
          <p>Voltage/Phase: {model.electrical}</p>
        </div>
      ))}
    </div>
  );
}

export default BrandPage;

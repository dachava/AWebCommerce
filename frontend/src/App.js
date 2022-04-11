import data from './data';

function App() {
  return (
    <div>
      <header>
        <a href="/">AWebCommerce Yeah!</a>
      </header>
      <main>
        <h1>¡Los más vendidos!</h1>
        <div className="products">
          {data.products.map((product) => (
            <div className="product" key={product.slug}>
              <a href={`/product/${product.slug}`}>
                <img src={product.image} alt={product.name}></img>
              </a>

              <div className="product-info">
                <a href={`/product/${product.slug}`}>
                  <p>{product.name}</p>
                </a>
                <p>
                  <strong>${product.price}</strong>
                </p>
                <button>Al Carrito</button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default App;

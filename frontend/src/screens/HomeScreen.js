import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function HomeScreen() {
  const [products, setProducts] = useState([]); //React State Hooks
  useEffect(() => {
    const fetchData = async () => {
      const result = await axios.get('http://localhost:5000/api.php');
      setProducts(result.data);
    };
    fetchData();
  }, []);
  return (
    <div>
      <h1>¡Los más vendidos!</h1>
      <div className="products">
        {products.map((product) => (
          <div className="product" key={product.slug}>
            <Link to={`/product/${product.slug}`}>
              <img src={product.image} alt={product.name}></img>
            </Link>

            <div className="product-info">
              <Link to={`/product/${product.slug}`}>
                <p>{product.name}</p>
              </Link>
              <p>
                <strong>${product.price}</strong>
              </p>
              <button>Al Carrito</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
export default HomeScreen;

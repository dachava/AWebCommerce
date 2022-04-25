import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';
import Rating from './Rating';
import axios from 'axios';
import { useContext } from 'react';
import { Store } from '../Store';

function Product(props) {
  const { product } = props;
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    cart: { cartItems },
  } = state;

  const addCartHandler = async (item) => {
    const existItem = cartItems.find((x) => x._id === product._id); //verifica si el producto actual existe en el carrito
    const quantity = existItem ? existItem.quantity + 1 : 1; //Si existe, incrementar la cantidad en 1, si no, se setea la cant a 1
    //Maneja el aumentar o reducir los items en el cart :)
    const { data } = await axios.get(
      `http://localhost:5000/productId.php?_id=${item._id}`
    );
    if (data.countInStock < quantity) {
      //Si el stock es menor, manda la advertencia
      window.alert('Lo sentimos, ¡no hay stock disponible!');
      return;
    }
    ctxDispatch({
      type: 'CART_ADD_ITEM',
      payload: { ...item, quantity },
    });
  };

  return (
    <Card>
      <Link to={`/product/${product.slug}`}>
        <img
          src={product.image}
          className="card-img-top"
          alt={product.name}
        ></img>
      </Link>
      <Card.Body>
        <Link to={`/product/${product.slug}`}>
          <Card.Title>{product.name}</Card.Title>
        </Link>
        <Rating
          rating={product.rating}
          numReviews={product.numReviews}
        ></Rating>
        <Card.Text>${product.price}</Card.Text>
        {product.stockCount === 0 ? (
          <Button variant="light" disabled>
            {' '}
            Fuera de Stock
          </Button>
        ) : (
          <Button onClick={() => addCartHandler(product)}>Al Carrito</Button>
        )}
      </Card.Body>
    </Card>
  );
}
export default Product;

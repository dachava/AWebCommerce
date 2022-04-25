import axios from 'axios';
import { useEffect, useReducer, useContext } from 'react';
import { useParams } from 'react-router-dom';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/Button';
import Rating from '../components/Rating';
import { Helmet } from 'react-helmet-async';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { getError } from '../utils';
import logger from 'use-reducer-logger';
import { Store } from '../Store';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, product: action.payload, loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

function ProductScreen() {
  const params = useParams();
  const { slug } = params;

  const [{ loading, error, product }, dispatch] = useReducer(logger(reducer), {
    product: [],
    loading: true,
    error: '',
  });
  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const result = await axios.get(
          `http://localhost:5000/product.php?slug=${slug}`
        );
        if (!(result.data === '')) {
          //Validacion que el fetch no venga vacio. Axios envia "" si la API no retorna nada.
          dispatch({ type: 'FETCH_SUCCESS', payload: result.data });
        } else {
          throw new Error('Producto no existe.'); //Si el result.data es vacio arroja un error capturado por el catch.
        }
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };
    fetchData();
  }, [slug]);

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart } = state;
  const addToCartHandler = async () => {
    //funcion asincrona para el await axios
    const existItem = cart.cartItems.find((x) => x._id === product._id); //verifica si el producto actual existe en el carrito
    const quantity = existItem ? existItem.quantity + 1 : 1; //Si existe, incrementar la cantidad en 1, si no, se setea la cant a 1
    const { data } = await axios.get(`/api/products/${product._id}`); //para verificar que el stock no es menos que la cantidad en el cart
    if (data.countInStock < quantity) {
      //Si el stock es menor, manda la advertencia
      window.alert('Lo sentimos, ¡no hay stock disponible!');
      return;
    }
    ctxDispatch({
      type: 'CART_ADD_ITEM',
      payload: { ...product, quantity },
    });
  };

  return loading ? (
    <LoadingBox />
  ) : error ? (
    <MessageBox variant="danger">{error}</MessageBox>
  ) : (
    <div>
      <Row>
        <Col md={6}>
          <img
            className="img-large"
            src={product.image}
            alt={product.name}
          ></img>
        </Col>
        <Col md={3}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <Helmet>
                <title>{product.name}</title>
              </Helmet>
              <h1>{product.name}</h1>
            </ListGroup.Item>
            <ListGroup.Item>
              <Rating
                rating={product.rating}
                numReviews={product.numReviews}
              ></Rating>
            </ListGroup.Item>
            <ListGroup.Item>Precio : ${product.price}</ListGroup.Item>
            <ListGroup.Item>
              Descripción:
              <p>{product.description}</p>
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={3}>
          <Card>
            <Card.Body>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <Row>
                    <Col>Precio:</Col>
                    <Col>${product.price}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Disponibilidad:</Col>
                    <Col>
                      {product.stockCount > 0 ? (
                        <Badge bg="success">En Stock</Badge>
                      ) : (
                        <Badge bg="danger">No Disponible</Badge>
                      )}
                    </Col>
                  </Row>
                </ListGroup.Item>

                {product.stockCount > 0 && (
                  <ListGroup.Item>
                    <div className="d-grid">
                      <Button onClick={addToCartHandler} variant="primary">
                        Al Carrito
                      </Button>
                    </div>
                  </ListGroup.Item>
                )}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default ProductScreen;

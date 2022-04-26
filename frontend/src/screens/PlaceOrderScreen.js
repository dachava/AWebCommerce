import React from 'react';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { Store } from '../Store';
import { useEffect } from 'react';
import CheckoutSteps from '../components/CheckoutSteps';
import { useReducer } from 'react';
import { getError } from '../utils';
import { toast } from 'react-toastify';
import axios from 'axios';
import LoadingBox from '../components/LoadingBox';

const reducer = (state, action) => {
  //Acciones del reducer!
  switch (action.type) {
    case 'CREATE_REQUEST': //Despacha esta accion antes de enviar el AJAX request para crear orden
      return { ...state, loading: true };
    case 'CREATE_SUCCESS':
      return { ...state, loading: false };
    case 'CREATE_FAIL':
      return { ...state, loading: false };
    default:
      return state;
  }
};

export default function PlaceOrderScreen() {
  const navigate = useNavigate();

  const [{ loading }, dispatch] = useReducer(reducer, {
    loading: false,
  });

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart, userInfo } = state;

  const round2 = (num) => Math.round(num * 100 + Number.EPSILON) / 100; // Redondea a 2 decimales!!
  cart.itemsPrice = round2(
    cart.cartItems.reduce((a, c) => a + c.quantity * c.price, 0) //Calcula el precio multiplicando la cant de items
  );
  cart.shippingPrice = cart.itemsPrice > 100 ? round2(0) : round2(10); //Si el precio del item es mayor a 100, free shipping!, si no, 10$
  cart.taxPrice = round2(0.15 * cart.itemsPrice); //15% DE IVA UwU
  cart.totalPrice = cart.itemsPrice + cart.shippingPrice + cart.taxPrice; //Suma todo para el GRAN TOTAL :D

  const placeOrderHandler = async () => {
    try {
      dispatch({ type: 'CREATE_REQUEST' });

      const { data } = await axios.post(
        'http://localhost:5000/placeOrder.php',
        {
          //La data enviada en este request
          orderItems: cart.cartItems,
          shippingAddress: cart.shippingAddress,
          paymentMethod: cart.paymentMethod,
          itemsPrice: cart.itemsPrice,
          shippingPrice: cart.shippingPrice,
          taxPrice: cart.taxPrice,
          totalPrice: cart.totalPrice,
          //Los ultimos datos son calculados de la pagina
        },
        {
          headers: {
            //Como opcion para axios se envia el header con el auth token
            authorization: `Bearer ${userInfo.token}`,
          },
        }
      );
      ctxDispatch({ type: 'CART_CLEAR' }); //Despues del request, enviar la accion para limpiar el carrito
      dispatch({ type: 'CREATE_SUCCESS' }); //Despacha la accion que declaramos arriba
      localStorage.removeItem('cartItems'); //Limpia el carrito para la proxima orden
      navigate(`/order/${data.order._id}`); //Redirige a los detalles de la orden
    } catch (err) {
      dispatch({ type: 'CREATE_FAIL' }); //Imprime el error devuelto por php
      toast.error(getError(err));
    }
  };

  useEffect(() => {
    if (!cart.paymentMethod) {
      //Si el metodo de pago no existe
      navigate('/payment'); //Redirigir a pagar!
    }
  }, [cart, navigate]);

  return (
    <div>
      <CheckoutSteps step1 step2 step3></CheckoutSteps>
      <Helmet>
        <title>Orden</title>
      </Helmet>
      <h1 className="my-3">Resumen de la Orden</h1>
      <Row>
        <Col md={8}>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Datos del Envío</Card.Title>
              <Card.Text>
                <strong>Nombre:</strong> {cart.shippingAddress.fullName} <br />
                <strong>Dirección: </strong> {cart.shippingAddress.address},
                {cart.shippingAddress.city}, {cart.shippingAddress.postalCode},
                {cart.shippingAddress.country}
              </Card.Text>
              <Link to="/shipping">Editar</Link>
            </Card.Body>
          </Card>

          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Forma de Pago</Card.Title>
              <Card.Text>
                <strong>Método:</strong> {cart.paymentMethod}
              </Card.Text>
              <Link to="/payment">Editar</Link>
            </Card.Body>
          </Card>

          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Items</Card.Title>
              <ListGroup variant="flush">
                {cart.cartItems.map((item) => (
                  <ListGroup.Item key={item._id}>
                    <Row className="align-items-center">
                      <Col md={6}>
                        <img
                          src={item.image}
                          alt={item.name}
                          className="img-fluid rounded img-thumbnail"
                        ></img>{' '}
                        <Link to={`/product/${item.slug}`}>{item.name}</Link>
                      </Col>
                      <Col md={3}>
                        <span>{item.quantity}</span>
                      </Col>
                      <Col md={3}>${item.price}</Col>
                    </Row>
                  </ListGroup.Item>
                ))}
              </ListGroup>
              <Link to="/cart">Editar</Link>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card>
            <Card.Body>
              <Card.Title>Resumen de la orden</Card.Title>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <Row>
                    <Col>Items</Col>
                    <Col>${cart.itemsPrice.toFixed(2)}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Envío</Col>
                    <Col>${cart.shippingPrice.toFixed(2)}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Impuesto</Col>
                    <Col>${cart.taxPrice.toFixed(2)}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>
                      <strong> Gran Total</strong>
                    </Col>
                    <Col>
                      <strong>${cart.totalPrice.toFixed(2)}</strong>
                    </Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <div className="d-grid">
                    <Button
                      type="button"
                      onClick={placeOrderHandler}
                      disabled={cart.cartItems.length === 0}
                    >
                      ¡Confirmar Orden!
                    </Button>
                  </div>
                  {loading && <LoadingBox></LoadingBox>}
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

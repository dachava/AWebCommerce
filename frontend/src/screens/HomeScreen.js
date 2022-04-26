import axios from 'axios';
import { useEffect, useReducer } from 'react';
import logger from 'use-reducer-logger'; //Loguea los cambios de estado
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Product from '../components/Product';
import { Helmet } from 'react-helmet-async';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';

const reducer = (state, action) => {
  //Manejo de estados en lugar de useEffect, acepta el estado actual y la accion que cambia el estado
  switch (
    action.type //compara el tipo de accion, usando un case
  ) {
    case 'FETCH_REQUEST': //Ocurre cuando hay una peticion de AJAX al backend
      return { ...state, loading: true }; //...state regresa el estado anterior, y aqui setea el loading a true, para efectos de mostrar al usuario que la pag esta cargando
    case 'FETCH_SUCCESS': //Si la peticion es correcta
      return { ...state, products: action.payload, loading: false }; //Mantenga el estado y actualice el producto con la data que proviene de la accion.
    //La data proviene de action.payload, en este caso contiene todos los productos del backend.
    //Loading es false por que ya cargamos lo que ocupamos.
    case 'FETCH_FAIL': //Si la peticion falla
      return { ...state, loading: false, error: action.payload }; //Mantiene el estado, y carga un error en el payload
    default:
      return state; //Retorne el estado actual si ningun case aplica
  }
};

function HomeScreen() {
  //Esto define el useReducer con 2 valores, un objeto array con las variables de arriba, y dispatch para llamar una accion y cambiar el estado.
  const [{ loading, error, products }, dispatch] = useReducer(logger(reducer), {
    //useReducer acepta el propio reducer de arriba y el estado por defecto
    //Aqui se definen los estados por defecto de cada objeto que creamos
    //Logger es un paquete extra y podemos ver los cambios de estado en la consola
    products: [],
    loading: true,
    error: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' }); //Enviamos la accion de peticion
      try {
        const result = await axios.get('http://localhost:5000/api.php');
        dispatch({ type: 'FETCH_SUCCESS', payload: result.data }); //Si funciona, enviar la accion correcta y pasar los datos por el payload
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: err.message }); //Si hay un error enviar la accion de error y pasar el error en el payload
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      <Helmet>
        <title>AWebCommerce Yeah!</title>
      </Helmet>
      <h1>¡Los más vendidos!</h1>
      <div className="products">
        {loading ? (
          <LoadingBox></LoadingBox>
        ) : error ? (
          <MessageBox variant="danger">{error}</MessageBox>
        ) : (
          <Row>
            {products.map((product) => (
              <Col key={product.slug} sm={6} md={4} lg={3} className="mb-3">
                <Product product={product}></Product>
              </Col>
            ))}
          </Row>
        )}
      </div>
    </div>
  );
}
export default HomeScreen;

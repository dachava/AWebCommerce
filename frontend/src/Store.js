import { createContext, useReducer } from 'react';
//Esto es REACT CONTEXT :P
export const Store = createContext();

const initialState = {
  //Estado inicial de todos los objetos
  userInfo: localStorage.getItem('userInfo') //Revisa el localStorage de userInfo
    ? JSON.parse(localStorage.getItem('userInfo')) //Si existe, agarrar la info y hacerlo un objeto de JS
    : null, //default

  //Inicializa el cart
  cart: {
    shippingAddress: localStorage.getItem('shippingAddress') //Cargar la info del localStorage
      ? JSON.parse(localStorage.getItem('shippingAddress'))
      : {}, //Si no existe, cargar el objeto vacio
    paymentMethod: localStorage.getItem('paymentMethod') //Cargar la info del localStorage
      ? localStorage.getItem('paymentMethod')
      : '', //Si no existe, cargar el string vacio
    cartItems: localStorage.getItem('cartItems') //Mantiene los items actuales en el cart si es que hay... estan guardados en el localStorage
      ? JSON.parse(localStorage.getItem('cartItems'))
      : [], //por defecto el carrito es vacio
  },
};

function reducer(state, action) {
  //Toma el estado actual y la accion, cambia el estado de manera inmutable y retorna el nuevo estado...
  switch (action.type) {
    case 'CART_ADD_ITEM':
      // add to cart
      const newItem = action.payload; //Guarda el item agregado en esta variable
      const existItem = state.cart.cartItems.find(
        //verifica si el producto actual existe en el carrito
        (item) => item._id === newItem._id
      );
      const cartItems = existItem //Si el item ya existe en el cart,
        ? state.cart.cartItems.map(
            (item) => (item._id === existItem._id ? newItem : item) //actualiza la variable con el item existente
          )
        : [...state.cart.cartItems, newItem]; //Si es un item nuevo agregarlo al final del array
      localStorage.setItem('cartItems', JSON.stringify(cartItems)); //Mantiene el carrito aunque se haga refresh de la app
      return { ...state, cart: { ...state.cart, cartItems } }; //actualiza el item basado en estos valores

    case 'CART_REMOVE_ITEM': {
      const cartItems = state.cart.cartItems.filter(
        (item) => item._id !== action.payload._id //Si el ID del item no es igual al id actual, retornar... si no borrarlo
      );

      localStorage.setItem('cartItems', JSON.stringify(cartItems)); //Mantiene el carrito aunque se haga refresh de la app
      return { ...state, cart: { ...state.cart, cartItems } };
    }
    case 'CART_CLEAR':
      return { ...state, cart: { ...state.cart, cartItems: [] } }; //Mantiene el estado del carrito pero limpia el array de cartItems

    case 'USER_SIGNIN':
      return { ...state, userInfo: action.payload };
    case 'USER_SIGNOUT':
      return {
        ...state,
        userInfo: null,
        cart: {
          //reiniciar el cart y el shipping cuando se cierra sesion
          cartItems: [], //array vacio de cart
          shippingAddress: {}, //objeto vacio de shipping
          paymentMethod: '', //string vacio de payment
        },
      };
    case 'SAVE_SHIPPING_ADDRESS':
      return {
        ...state,
        cart: {
          //no se toca nada mas del carrito
          ...state.cart,
          shippingAddress: action.payload, //Se actualiza la direccion con la data del payload
        },
      };
    case 'SAVE_PAYMENT_METHOD':
      return {
        ...state,
        cart: { ...state.cart, paymentMethod: action.payload }, //Guardamos el metodo de pago seleccionado aqui
      };
    default:
      return state;
  }
}

export function StoreProvider(props) {
  //Este componente es un wrapper para toda la app y pasa propiedades globales a todos los elementos children, se monta en el index.js
  const [state, dispatch] = useReducer(reducer, initialState);
  //Esto es el MVP, permite a los componentes funcionales acceder al manejo de estados
  //Dispatch es la funcion que actualiza el estado para darle una accion apropiada al objeto
  const value = { state, dispatch };
  return <Store.Provider value={value}>{props.children}</Store.Provider>;
  //Este value contiene el estado actual y el dispatch para actualizar el estado
}

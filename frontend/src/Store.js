import { createContext, useReducer } from 'react';

export const Store = createContext();

const initialState = {
  //Inicializa el cart
  cart: {
    cartItems: [], //por defecto el carrito es vacio
  },
};

function reducer(state, action) {
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
      return { ...state, cart: { ...state.cart, cartItems } }; //actualiza el item basado en estos valores
    default:
      return state;
  }
}

export function StoreProvider(props) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = { state, dispatch };
  return <Store.Provider value={value}>{props.children}</Store.Provider>;
}

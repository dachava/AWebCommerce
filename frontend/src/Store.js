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
      return {
        //Agrega item sobre lo que hay, ...mantiene valores previos
        ...state,
        cart: {
          ...state.cart,
          cartItems: [...state.cart.cartItems, action.payload], //action payload agrega el item nuevo
        },
      };
    default:
      return state;
  }
}

export function StoreProvider(props) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = { state, dispatch };
  return <Store.Provider value={value}>{props.children}</Store.Provider>;
}

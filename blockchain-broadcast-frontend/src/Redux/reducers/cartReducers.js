import * as actionTypes from "../constants/cartConstants";

const CART_INITIAL_STATE = {
  cartItems: [],
};

export const cartReducer = (state = CART_INITIAL_STATE, action) => {
  switch (action.type) {
    case actionTypes.ADD_TO_CART:
      const item = action.payload;

      const existItem = state.cartItems.find((x) => x.book === item.book);

      if (existItem) {
        return {
          ...state,
          cartItems: state.cartItems.map((x) =>
            x.book === existItem.book ? item : x
          ),
        };
      } else {
        return {
          ...state,
          cartItems: [...state.cartItems, item],
        };
      }
    case actionTypes.REMOVE_FROM_CART:
      return {
        ...state,
        cartItems: state.cartItems.filter((x) => x.book !== action.payload),
      };
    default:
      return state;
  }
};


export const getCartContentReducer = (state = { cart: [] }, action) => {
  switch (action.type) {
    case actionTypes.GET_CART_CONTENT_REQUEST:
      return {
        loading: true,
        cart: [],
      };
    case actionTypes.GET_CART_CONTENT_SUCCESS:
      return {
        cart: action.payload,
        loading: false,
      };
    case actionTypes.GET_CART_CONTENT_FAIL:
      return {
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

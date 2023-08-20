import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import { cartReducer, getCartContentReducer } from "./reducers/cartReducers";
import { getBooksReducer, getBookDetailsReducer, getSortedBooksReducer } from "./reducers/bookReducers";
import { wishlistReducer } from "./reducers/wishlistReducers";
import { getAuthorDetailsReducer } from "./reducers/authorReducers";

const reducer = combineReducers({
  cart: cartReducer,
  wishlist: wishlistReducer,
  getBooks: getBooksReducer,
  getCartContent: getCartContentReducer,
  getSortedBooks: getSortedBooksReducer,
  getBookDetails: getBookDetailsReducer,
  getBooksByAuthor: getAuthorDetailsReducer,
});

const middleware = [thunk];

const cartItemsInLocalStorage = localStorage.getItem("cart")
  ? JSON.parse(localStorage.getItem("cart"))
  : [];

const wishlistItemsInLocalStorage = localStorage.getItem("wishlist")
  ? JSON.parse(localStorage.getItem("wishlist"))
  : [];

const INITIAL_STATE = {
  cart: {
    cartItems: cartItemsInLocalStorage,
  },

  wishlist: {
    wishlistItems: wishlistItemsInLocalStorage,
  },
};

const store = createStore(
  reducer,
  INITIAL_STATE,
  composeWithDevTools(applyMiddleware(...middleware))
);

export default store;

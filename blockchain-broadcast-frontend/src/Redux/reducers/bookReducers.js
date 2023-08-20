import * as actionTypes from "../constants/bookConstants";

export const getBooksReducer = (state = { books: [] }, action) => {
  switch (action.type) {
    case actionTypes.GET_BOOKS_REQUEST:
      return {
        loading: true,
        books: [],
      };
    case actionTypes.GET_BOOKS_SUCCESS:
      return {
        books: action.payload,
        loading: false,
      };
    case actionTypes.GET_BOOKS_FAIL:
      return {
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

export const getSortedBooksReducer = (state = { sortedBooks: {} }, action) => {
  switch (action.type) {
    case actionTypes.GET_SORTED_BOOKS_REQUEST:
      return {
        loading: true,
        sortedBooks: {},
      };
    case actionTypes.GET_SORTED_BOOKS_SUCCESS:
      return {
        sortedBooks: action.payload,
        loading: false,
      };
    case actionTypes.GET_SORTED_BOOKS_FAIL:
      return {
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

export const getBookDetailsReducer = (state = { book: {} }, action) => {
  switch (action.type) {
    case actionTypes.GET_BOOK_DETAILS_REQUEST:
      return {
        loading: true,
      };
    case actionTypes.GET_BOOK_DETAILS_SUCCESS:
      return {
        loading: false,
        book: action.payload,
      };
    case actionTypes.GET_BOOK_DETAILS_FAIL:
      return {
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

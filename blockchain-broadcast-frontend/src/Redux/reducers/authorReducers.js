import * as actionTypes from "../constants/authorConstants";

export const getAuthorDetailsReducer = (state = { booksByAuthor: [] }, action) => {
  switch (action.type) {
    case actionTypes.GET_AUTHOR_BOOKS_REQUEST:
      return {
        loading: true,
        booksByAuthor: [],
      };
    case actionTypes.GET_AUTHOR_BOOKS_SUCCESS:
      return {
        loading: false,
        booksByAuthor: action.payload,
      };
    case actionTypes.GET_AUTHOR_BOOKS_FAIL:
      return {
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

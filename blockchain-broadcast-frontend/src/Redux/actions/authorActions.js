import * as actionTypes from "../constants/authorConstants";

// Get a specific author from database
export const getBooksByAuthor = (id) => async (dispatch) => {

  try {
    dispatch({ type: actionTypes.GET_AUTHOR_BOOKS_REQUEST });

    const url = `/.netlify/functions/get-books-by-author?id=${id}`;
    const data = await fetch(url).then((res) => res.json());

    dispatch({
      type: actionTypes.GET_AUTHOR_BOOKS_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: actionTypes.GET_AUTHOR_BOOKS_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

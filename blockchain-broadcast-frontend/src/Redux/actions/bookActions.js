import * as actionTypes from "../constants/bookConstants";

// Get all books from database
export const getBooks = () => async (dispatch) => {
  try {
    dispatch({ type: actionTypes.GET_BOOKS_REQUEST });
    const url = '/.netlify/functions/get-all-books';
    const data = await fetch(url).then((res) => res.json());

    dispatch({
      type: actionTypes.GET_BOOKS_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: actionTypes.GET_BOOKS_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

// Get books from database filtered and sorted
export const getSortedBooks = (sort, filter, page, perPage) => async (dispatch) => {
  try {
    dispatch({ type: actionTypes.GET_SORTED_BOOKS_REQUEST });
    const url = `/.netlify/functions/get-books?sort=${sort}&filter=${filter}`;
    const data = await fetch(url).then((res) => res.json());

    dispatch({
      type: actionTypes.GET_SORTED_BOOKS_SUCCESS,
      payload: {
        data: data,
        currBooks: data.slice(
          0 + (page - 1) * perPage,
          perPage + (page - 1) * perPage
        ),
        lastPage: (Math.ceil(
          data.length / perPage)),
      },
    });
  } catch (error) {
    dispatch({
      type: actionTypes.GET_SORTED_BOOKS_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};


// Get a specific book from database
export const getBookDetails = (id) => async (dispatch) => {
  try {
    dispatch({ type: actionTypes.GET_BOOK_DETAILS_REQUEST });

    const url = `/.netlify/functions/get-book-details?id=${id}`;
    const data = await fetch(url).then((res) => res.json());

    dispatch({
      type: actionTypes.GET_BOOK_DETAILS_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: actionTypes.GET_BOOK_DETAILS_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

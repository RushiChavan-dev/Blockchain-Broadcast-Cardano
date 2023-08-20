import * as actionTypes from "../constants/cartConstants";

// Add a book to cart
// Add payload or data into the add cart or book details
export const addToCart = (id, qty, saved) => async (dispatch, getState) => {

    const url = `/.netlify/functions/get-book-details?id=${id}`;
    const data = await fetch(url).then((res) => res.json());

    console.log(data);

    dispatch({
        type: actionTypes.ADD_TO_CART,
        payload: {
            book: data._id,
            title: data.title,
            cover: data.cover,
            price: data.price,
            author: data.author,
            authorName: data.authorName,
            rating: data.rating,
            description: data.description,
            releaseDate:data.releaseDate,
            chapters:data.chapters,
            qty,
            saved,
        },
    });
    localStorage.setItem("cart", JSON.stringify(getState().cart.cartItems));
};



export const getCartContent = () => async (dispatch, getState) => {
    try {
        dispatch({ type: actionTypes.GET_CART_CONTENT_REQUEST });
        const url = '/.netlify/functions/get-cart-items';
        const data = await fetch(url).then((res) => res.json());
        dispatch({
            type: actionTypes.GET_CART_CONTENT_SUCCESS,
            payload: {
                userId: data._id,
                cartContent: data.cart,
            },
        });
        localStorage.setItem("cart", JSON.stringify(getState().cart.cartItems));//save user's cart content to local storage
    } catch (error) {
        dispatch({
            type: actionTypes.GET_CART_CONTENT_FAIL,
            payload:
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message,
        });
    }
};



// Remove a book from cart
export const removeFromCart = (id) => (dispatch, getState) => {
    dispatch({
        type: actionTypes.REMOVE_FROM_CART,
        payload: id,
    });
    localStorage.setItem("cart", JSON.stringify(getState().cart.cartItems));
};

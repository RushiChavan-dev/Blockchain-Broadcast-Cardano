import "./Book.css";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { addToCart } from "../../Redux/actions/cartActions";
import { addToWishlist, removeFromWishlist } from "../../Redux/actions/wishlistActions";
import Notification from "../Cart/UI/Notification";
import Rating from '@material-ui/lab/Rating';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

const Book = ({ cover, description, price, title, bookId, authorName, rating, authorId, releaseDate }) => {

  const dispatch = useDispatch();

  // Notification
  const [notify, setNotify] = useState({ isOpen: false, message: '', type: '' });

  // Determine whether item is already in wishlist and handle favorite state accordingly
  const wishlist = useSelector((state) => state.wishlist);
  const { wishlistItems } = wishlist;

  const isFavorited = wishlistItems.some((item) => item.book === bookId);

  const [favorited, setFavorited] = useState(isFavorited);

  // Add a new item to cart
  const addToCartNew = () => {
    dispatch(addToCart(bookId, Number(1), false));
    setNotify({
      isOpen: true,
      message: `"${title}" was added to cart`,
      type: 'success',
      typeStyle: 'specific'
    });
  };

  // Add a new item to wishilist
  const addToWishlistHandler = () => {
    dispatch(addToWishlist(bookId));
    setNotify({
      isOpen: true,
      message: `"${title}" was added to wishlist`,
      type: 'success',
      typeStyle: 'specific'
    });
    setFavorited(true);
  };

  // Remove item from wishilist
  const removeFromWishlistHandler = () => {
    dispatch(removeFromWishlist(bookId));
    setNotify({
      isOpen: true,
      message: `"${title}" was removed from your wishlist`,
      type: 'success',
      typeStyle: 'specific'
    });
    setFavorited(false);
  };


  // Add an item that already exists in cart (increment by 1)
  const addToCartExistent = (currQty) => {
    dispatch(addToCart(bookId, Number(currQty) + Number(1), false));
    setNotify({
      isOpen: true,
      message: `"${title} (x${Number(currQty) + Number(1)}) was added to cart`,
      type: 'success',
      typeStyle: 'specific'
    });
  };

  // Determine whether item is already existent in cart and handle add operation accordingly
  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;
  const addToCartHandler = () => {
    (cartItems.some(item => item.book === bookId)) ?
      addToCartExistent(cartItems.find((item) => item.book === bookId).qty)
      :
      addToCartNew();
  };


  return (
    <>
      <div className="product" >
        <div className="center__image" >
          <Link to={`/book/${bookId}`}>
            <img src={cover} alt={title} id="container" title="view details" />
          </Link>
          <div id="infoi" title={`${favorited ? "remove from wishlist" : "add to wishlist"}`}>
            {
              favorited ?
                <FavoriteIcon className="fav" onClick={removeFromWishlistHandler}
                  sx={{ border: "1px solid #4d636a", borderRadius: "50%", padding: "3px" }} />
                :
                <FavoriteBorderIcon className="fav" onClick={addToWishlistHandler}
                  sx={{ border: "1px solid #4d636a", borderRadius: "50%", padding: "3px" }}
                />
            }
          </div>

        </div>

        <div className="product__info">

          <Link to={`/book/${bookId}`} className="cartItem__name">
            <p className="info__name" title={title}>{title}</p>
          </Link>
          <p className="info__author">By <Link to={`/authorbooks/${authorId}`} className="book__author__link" title={authorName}>{authorName}</Link></p>

          <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css" />
          <div className="block rating__block">
            <div className="book__rating__stars">
              < Rating
                name="half-rating-read"
                value={rating}
                precision={0.1}
                readOnly
                size="small"
              />
            </div>
            <div className="book__rating">{parseFloat(rating).toFixed(1)}</div>
          </div>
          <div className="info__description">{description}</div>
          <p className="info__price">ADA {parseFloat(price).toFixed(2)}</p>
        </div>
        <div className="browser_buttons">
          <button type="btn" onClick={addToCartHandler} className="btn btn-primary btn-full" title="add to cart">
            ADD TO CART
          </button>


          {/* <Link to={`/book/${bookId}`} className="btn btn-light btn-full">
            Details
          </Link> */}
        </div>


      </div>
      <Notification
        notify={notify}
        setNotify={setNotify}
      />
    </>
  );
};

export default Book;

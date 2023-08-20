import "./CartItem.css";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import Rating from '@material-ui/lab/Rating';
import QtyDropdown from "../QtyDropdown/QtyDropdown";
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';


const CartItem = ({ item, qtyChangeHandler, removeHandler, addToWishlistHandler, removeFromWishlistHandler, saveForLaterHandler, addBackToCartHandler, saved, bookId }) => {
  // Determine whether item is already in wishlist and handle favorite state accordingly
  const wishlist = useSelector((state) => state.wishlist);
  const { wishlistItems } = wishlist;
  const isFavorited = wishlistItems.some((book) => book.book === item.book);
  const [favorited, setFavorited] = useState(isFavorited);

  // Add a new item to wishilist
  const wishlistAdd = () => {
    addToWishlistHandler(item.book, item.title);
    setFavorited(true);
  };

  // Remove item from wishilist
  const wishlistRemove = () => {

    removeFromWishlistHandler(item.book, item.title);
    setFavorited(false);
  };

  return (
    <>
      {saved === false ? (
        <div className="item">
          <div className="grid_Cart">
            <div className="cover_Column">
              <Link to={`/book/${bookId}`} href="#">
                <img src={item.cover} alt={item.title} className="small" title="view details" />
              </Link>
            </div>

            <div className="info_Column info">

              <Link to={`/book/${bookId}`} className="cartItem__name" title={item.title}>
                {item.title}
              </Link>
              <div className="cartItem___author">
                By <Link to={`/authorbooks/${item.author}`} className="cartItem__author__link" title={item.authorName}>{item.authorName}</Link>
              </div>

              <div className="block rating__block info_stars">
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css" />
                <div className="book__rating__stars">
                  < Rating
                    name="half-rating-read"
                    value={item.rating}
                    precision={0.1}
                    readOnly
                    size="small"
                  />
                </div>
                <div className="book__rating book__rating__cart">{parseFloat(item.rating).toFixed(1)}</div>
              </div>
              <div className="buttons__up info_buttons">
                <div className="block buttons__block buttons__up">
                  <button className="saveforlater_button"
                    onClick={() => saveForLaterHandler(item.book, item.qty)}>
                    Save for later
                  </button>
                  |<div title="add to wishlist" className="fav_button">
                    <FavoriteBorderIcon
                      style={{ fontSize: "18px" }}
                      color="inherit"
                      size="sm"
                      onClick={() => addToWishlistHandler(item.book, item.title)}
                    /></div>
                  |
                  <button className="delete_button"
                    title="remove"
                    onClick={() => removeHandler(item.book, item.title)}>
                    <i className="fa fa-trash-o fa-lg"></i>
                  </button>
                </div>
              </div>


              <div className="qty_Row">
                <div className="price_Row">
                  ${parseFloat(item.price).toFixed(2)}
                </div>
                <QtyDropdown
                  item={item}
                  qtyChangeHandler={qtyChangeHandler}
                />

              </div>
              <div className="buttons_Row">
                <div className="block buttons__block buttons__down">
                  <button className="saveforlater_button"
                    onClick={() => saveForLaterHandler(item.book, item.qty)}>
                    Save for later
                  </button>
                  |
                  <FavoriteBorderIcon
                    className="fav_button"
                    style={{ fontSize: "18px" }}
                    color="inherit"
                    size="sm"
                    onClick={() => addToWishlistHandler(item.book, item.title)}
                  />
                  |
                  <button className="delete_button"
                    onClick={() => removeHandler(item.book, item.title)}>
                    <i className="fa fa-trash-o fa-lg"></i>
                  </button>
                </div>
              </div>
            </div>
            <div className="qty_Column">
              <QtyDropdown
                item={item}
                qtyChangeHandler={qtyChangeHandler}
              />
            </div>
            <div className="price_Column cartitem__price">
              ADA {parseFloat(item.price).toFixed(2)}
            </div>
          </div>

        </div>
      ) : (

        <div className="grid_SavedForLater">

          <div className="cover_Column">
            <Link to={`/book/${bookId}`}>
              <img src={item.cover} alt={item.title} className="small" />
            </Link>
          </div>
          <div className="info_Column">
            <Link to={`/book/${bookId}`} className="cartItem__name">
              {item.title}
            </Link>
            <div className="cartItem___author">
              By <Link to={`/authorbooks/${item.author}`} className="cartItem__author__link">{item.authorName}</Link>
            </div>

            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css" />

            <div className="block rating__block">
              <div className="book__rating__stars">
                < Rating
                  name="half-rating-read"
                  value={item.rating}
                  precision={0.1}
                  readOnly
                  size="small"
                />
              </div>
              <div className="book__rating book__rating__cart">{parseFloat(item.rating).toFixed(1)}</div>
            </div>
            <div className="cartitem__price_saved">${parseFloat(item.price).toFixed(2)}</div>
            <div className="block buttons__block">
              <button className="saveforlater_button"
                onClick={() => addBackToCartHandler(item.book, item.qty)}>
                Add to cart
              </button>
              |
              {favorited ?
                <FavoriteIcon
                  className="fav_button"
                  style={{ fontSize: "18px" }}
                  color="inherit"
                  size="sm"
                  onClick={wishlistRemove}
                />
                : <FavoriteBorderIcon
                  className="fav_button"
                  style={{ fontSize: "18px" }}
                  color="inherit"
                  size="sm"
                  onClick={wishlistAdd}
                />}
              |
              <button className="delete_button"
                onClick={() => removeHandler(item.book, item.title)}>
                <i className="fa fa-trash-o fa-lg"></i>
              </button>
            </div>
          </div>
        </div>
      )
      }
    </>
  );
};

export default CartItem;

import "./SavedItem.css";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import Rating from '@material-ui/lab/Rating';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

const SavedItem = ({ cover, description, price, rating, title, book, qty, authorName, authorId, releaseDate, addToWishlistHandler, removeFromWishlistHandler, addBackToCartHandler, removeHandler }) => {


  // Determine whether item is already in wishlist and handle favorite state accordingly
  const wishlist = useSelector((state) => state.wishlist);
  const { wishlistItems } = wishlist;
  const isFavorited = wishlistItems.some((item) => item.book === book);
  const [favorited, setFavorited] = useState(isFavorited);

  // Add a new item to wishilist
  const wishlistAdd = () => {
    addToWishlistHandler(book, title);
    setFavorited(true);
  };

  // Remove item from wishilist
  const wishlistRemove = () => {
    removeFromWishlistHandler(book, title);
    setFavorited(false);
  };


  return (
    <>
      <div className="saved-product" >
        <div className="center__image" >
          <Link to={`/book/${book}`}>
            <img src={cover} alt={title} id="container" title="view details" className="saved-small" />
          </Link>
          <div id="infoi" title={`${favorited ? "remove from wishlist" : "add to wishlist"}`}>
            {
              favorited ?
                <FavoriteIcon className="fav" onClick={wishlistRemove}
                  sx={{ border: "1px solid #4d636a", borderRadius: "50%", padding: "3px" }} />
                :

                <FavoriteBorderIcon className="fav" onClick={wishlistAdd}
                  sx={{ border: "1px solid #4d636a", borderRadius: "50%", padding: "3px" }}
                />
            }
          </div>

        </div>

        <div className="product__info">

          <Link to={`/book/${book}`} className="savedItem__name">
            <p className="info__name" title={title}>{title}</p>
          </Link>

          <div className="info__description">{description}</div>
        </div>

        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css" />


        <div className="book__rating__stars stars-saved">
          < Rating
            name="half-rating-read"
            value={rating}
            precision={0.1}
            readOnly
            size="small"
          />
        </div>

        <div className="block buttons__block">
          <button className="saveforlater_button"
            onClick={() => addBackToCartHandler(book, qty)}>
            Move to cart
          </button>
          |
          <button className="delete_button" title="remove"
            onClick={() => removeHandler(book, title)}>
            <i className="fa fa-trash-o fa-lg"></i>
          </button>
        </div>

      </div>
    </>
  );
};

export default SavedItem;

import "./WishlistItem.css";
import { Link } from "react-router-dom";
import Rating from '@material-ui/lab/Rating';

const WishlistItem = ({ item, removeHandler, addToCartHandler, bookId }) => {

  return (
    <div className="item">
      <div id="grid_wishlist">
        <div id="cover_column_wishlist" title="view details">
          <Link to={`/book/${bookId}`}>
            <img src={item.cover} alt={item.title} className="medium" />
          </Link>
        </div>
        <div id="info_column_wishlist">
          <Link to={`/book/${bookId}`} className="cartItem__name wishlistItem__name" title={item.title}>
            {item.title}
          </Link>
          <div className="cartItem___author">
            By <Link to={`/authorbooks/${item.author._id}`} className="cartItem__author__link" title={item.authorName}>{item.authorName}</Link>
          </div>

          <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css" />

          <div className="block rating__block">
            <div className="book__rating__stars">
              <Rating
                name="half-rating-read"
                value={item.rating}
                precision={0.1}
                readOnly
                size="small"
              />
            </div>
            <div className="book__rating book__rating__cart">{parseFloat(item.rating).toFixed(1)}</div>
          </div>
          <div className="wishlistitem__price">
            ${parseFloat(item.price).toFixed(2)}
          </div>
          <div className="block wishlist_buttons__block">
            <button
              className="btn btn-primary btn-wishlist"
              onClick={() => addToCartHandler(bookId)}>
              ADD TO CART
            </button>
            <button
              className="delete_button delete_button_wishlist delete_button_wishlist_bottom"
              title="remove"
              onClick={() => removeHandler(item.book, item.title)}>
              <i className="fa fa-trash-o fa-lg"></i>
            </button>
          </div>
        </div>
        <div id="delete_button_column_wishlist">
          <button className="delete_button delete_button_wishlist" title="remove"
            onClick={() => removeHandler(item.book, item.title)}
          >
            <i className="fa fa-trash-o fa-2x"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default WishlistItem;

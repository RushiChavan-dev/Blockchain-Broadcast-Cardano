import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import WishlistItem from "../../Components/Wishlist/WishlistItem";
import { addToCart } from "../../Redux/actions/cartActions";
import { removeFromWishlist } from "../../Redux/actions/wishlistActions";
import MessageDialog from "../../Components/Cart/UI/MessageDialog";
import Notification from "../../Components/Cart/UI/Notification";
import "./WishlistScreen.css";

const WishlistScreen = ({ history }) => {
  useEffect(() => { }, []);
  const dispatch = useDispatch();
  const wishlist = useSelector((state) => state.wishlist);
  const { wishlistItems } = wishlist;

  // Cart
  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;

  // Notifications
  const [notify, setNotify] = useState({ isOpen: false, message: '', type: '', typeStyle: '' });
  const [messageDialog, setMessageDialog] = useState({ isOpen: false, title: '', subTitle: '' });

  // Add item from wishlist to shopping cart
  const addToCartNew = (id) => {
    dispatch(addToCart(id, 1, false));
    dispatch(removeFromWishlist(id));
    setMessageDialog({
      isOpen: true,
      title: 'Item successfully added to Shopping Cart',
      viewButton: 'View Cart',
      onView: () => { onViewCart(); },
      onKeepShopping: () => { onKeepShopping(); }
    });
  };


  // Remove an item from wishlist
  const removeFromWishlistHandler = (id, title) => {
    dispatch(removeFromWishlist(id));
    setNotify({
      isOpen: true,
      message: `"${title}" was removed from wishlist`,
      type: 'success',
      typeStyle: 'specific'
    });
  };

  // Add item to cart
  const addToCartHandler = (id) => {
    (cartItems.some(item => item.book === id)) ?
      addToCartExistent(id, (cartItems.find((item) => item.book === id).qty))
      :
      addToCartNew(id);
  };

  // Close dialog and go to cart
  const onViewCart = () => {
    setMessageDialog({
      ...messageDialog,
      isOpen: false
    });
    history.push(`/cart`);
  };

  // Close dialog and stay in current page
  const onKeepShopping = () => {
    setMessageDialog({
      ...messageDialog,
      isOpen: false
    });
  };


  // Add an item already existent in cart (increment by new qty)
  const addToCartExistent = (id, currQty) => {
    dispatch(addToCart(id, Number(currQty) + Number(1), false));
    dispatch(removeFromWishlist(id));
    setMessageDialog({
      isOpen: true,
      title: 'Item successfully updated in Shopping Cart',
      viewButton: 'View Cart',
      onView: () => { onViewCart(); },
      onKeepShopping: () => { onKeepShopping(); }
    });
  };


  return (
    <>
      {
        wishlistItems.length === 0 ?
          (
            <div className="cartscreen__center screen">
              <div className="cart_message">
                <div className="cart_upper_message">
                  <p>Your wishlist is empty.</p>
                </div>
                <div className="cart_bottom_message">
                  <p> Want to save your favorite items? Just click on the heart icon next to them and they will show up here.</p>
                </div>
                <Link to="/browse" className="btn-browse">
                  <div className="btn btn-primary btn-checkout">
                    BROWSE BOOKS
                  </div>
                </Link>
              </div>
            </div>
          )
          :
          (
            <div className="wishlistscreen">
              <div className="centered_header">
                Your Wishlist
              </div>

              <div className="number_of_items_in_wishlist">
                1 - {wishlistItems.length} of {wishlistItems.length} {wishlistItems.length > 1 ? "items" : "item"}
              </div>
              <hr />
              {
                wishlistItems.map((item, i) => (<div key={item.book} >
                  <div className="wishlistscreen__item" key={item.book}>
                    <WishlistItem
                      item={item}
                      removeHandler={removeFromWishlistHandler}
                      bookId={item.book}
                      addToCartHandler={addToCartHandler}
                    />

                  </div>
                  {i < wishlistItems.length - 1 && <hr />}
                </div>
                ))
              }
            </div>
          )
      }
      <MessageDialog
        messageDialog={messageDialog}
        setMessageDialog={setMessageDialog}
      />
      <Notification
        notify={notify}
        setNotify={setNotify}
      />
    </>
  );
};

export default WishlistScreen;

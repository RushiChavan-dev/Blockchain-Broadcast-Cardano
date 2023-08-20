import "./BookScreen.css";
import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router";

import { useSelector, useDispatch } from "react-redux";
import { getBookDetails } from "../../Redux/actions/bookActions";
import { addToCart } from "../../Redux/actions/cartActions";
import { addToWishlist, removeFromWishlist } from "../../Redux/actions/wishlistActions";

import MessageDialog from "../../Components/Cart/UI/MessageDialog";
import BookCoverModal from "../../Components/Modals/BookCoverModal/BookCoverModal";
import ReviewModal from "../../Components/Modals/ReviewModal/ReviewModal";
import CustomSelect from "../../Components/CustomSelect/CustomSelect";
import Notification from "../../Components/Cart/UI/Notification";
import Accordion from "../../Components/Accordion/Accordion";

import Heart from "../../Components/BookDetails/Heart";
import TopSection from "../../Components/BookDetails/TopSection";
import ProductDetails from "../../Components/BookDetails/ProductDetails";
import ReviewSection from "../../Components/BookDetails/ReviewSection";
import Loading from "../../Components/Loading/Loading";
import ReviewForm from "../../Components/Review/ReviewForm";

const BookScreen = ({ match, history }) => {

  const { id } = useParams();
  const [qty, setQty] = useState(1);

  // Notifications
  const [messageDialog, setMessageDialog] = useState({ isOpen: false, title: '', subTitle: '', viewButton: 'View Cart' });
  const [notify, setNotify] = useState({ isOpen: false, message: '', type: '', typeStyle: '' });
  const [showBookCoverModal, setShowBookCoverModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewed, setReviewed] = useState(false);
  // Load book details
  const dispatch = useDispatch();
  const bookDetails = useSelector((state) => state.getBookDetails);
  const { loading, error, book } = bookDetails;

  const reviews_section = useRef(null);

  const onClickReviews = () => reviews_section.current.scrollIntoView();


  useEffect(() => {
    if ((book && (match.params.id) !== book._id) || (book && reviewed)) {
      dispatch(getBookDetails(match.params.id));
      setReviewed(false);
    }
  }, [dispatch, book, match, reviewed]);

  // Determine whether item is already in wishlist and handle favorite state accordingly
  const wishlist = useSelector((state) => state.wishlist);
  const { wishlistItems } = wishlist;
  const isFavorited = wishlistItems.some((item) => item.book === id);
  const [favorited, setFavorited] = useState(isFavorited);

  // Determine whether item is already in cart and handle add operation accordingly
  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;


  const addToCartHandler = () => {
    (cartItems.some(item => item.book === book._id)) ?
      addToCartExistent(cartItems.find((item) => item.book === book._id).qty)
      :
      addToCartNew();
  };

  const onViewWishlist = () => {
    setMessageDialog({
      ...messageDialog,
      isOpen: false
    });
    history.push(`/wishlist/` + match.params.id);
  };

  // Close dialog and go to cart
  const onViewCart = () => {
    setMessageDialog({
      ...messageDialog,
      isOpen: false
    });
    history.push(`/cart/` + match.params.id + "?qty=" + qty);
  };

  // Close dialog and stay in current page
  const onKeepShopping = () => {
    setMessageDialog({
      ...messageDialog,
      isOpen: false
    });
  };

  // Add to cart (user can decide whether to stay in current page or view cart)
  const addToCartNew = () => {
    dispatch(addToCart(book._id, qty, false));
    setMessageDialog({
      isOpen: true,
      title: 'Item successfully added to Shopping Cart',
      viewButton: 'View Cart',
      onView: () => { onViewCart(); },
      onKeepShopping: () => { onKeepShopping(); }
    });
  };

  // Add an item already existent in cart (increment by new qty)
  const addToCartExistent = (currQty) => {
    dispatch(addToCart(book._id, Number(currQty) + Number(qty), false));
    setMessageDialog({
      isOpen: true,
      title: 'Item successfully updated in Shopping Cart',
      viewButton: 'View Cart',
      onView: () => { onViewCart(); },
      onKeepShopping: () => { onKeepShopping(); }
    });
  };

  // Add to cart (user can decide whether to stay in current page or view cart)
  const addToWishlistNew = () => {
    addToWishlistHandler();
    setMessageDialog({
      isOpen: true,
      title: 'Item successfully added to Wishlist',
      viewButton: 'View Wishlist',
      onView: () => { onViewWishlist(); },
      onKeepShopping: () => { onKeepShopping(); }
    });
  };

  const addToWishlistHandler = () => {
    dispatch(addToWishlist(book._id));
    setFavorited(true);
  };

  const removeFromWishlistHandler = () => {
    dispatch(removeFromWishlist(book._id));
    setNotify({
      isOpen: true,
      message: `"${book.title}" was removed from your wishlist`,
      type: 'success',
      typeStyle: 'specific'
    });
    setFavorited(false);
  };

  //handles going to the review page
  const closeReviewModalHandler = () => {
    setShowReviewModal(false);
    setReviewed(true);
  };

  const aBook = (book || {});
  const description = (book || {}).description;
  const publisher = ((book || {}).publishingInfo || {}).publisher;
  const isbn = ((book || {}).publishingInfo || {}).isbn;
  const edition = ((book || {}).publishingInfo || {}).edition;
  const genre = ((book || {}).genre || {}).name;
  const bio = ((book || {}).author || {}).bio;
  const authorID = ((book || {}).author || {})._id;
  const commentsLength = ((book || {}).comments || {}).length;
  const arr = Array.from({ length: 100 }, (_, index) => index + 1);
  const items = arr.reduce((a, v) => ({ ...a, [v]: v }), {});
  const releaseDate = (book || {}).releaseDate;
  const date = new Date(releaseDate);
  const publicationDate = date.toDateString().split(' ').slice(1).join(' '); // remove day of the week from date


  const AddToCart = ({ book }) => {
    return (<div className="middle-upper-section">
      <div className="price_qty_container">
        <div className="price">
          <span>ADA {parseFloat((book.price) || 0).toFixed(2)}</span>
        </div>
        <CustomSelect
          className="book-details-qty"
          inputLabel="Qty"
          inputLabelId="qty-select-label"
          labelId="Qty"
          id="qty-select-rating"
          value={qty}
          handleChange={(e) => setQty(e.target.value)}
          items={items}
        />
      </div>
      <button className="btn btn-primary btn-full btn-checkout" onClick={addToCartHandler}>
        ADD TO CART
      </button>
    </div>);
  };

  const accordion_data = [
    {
      heading: 'Product Details',
      content: <ProductDetails
        publisher={publisher}
        publicationDate={publicationDate}
        isbn={isbn}
        edition={edition}
        genre={genre} />
    },
    {
      heading: 'Overview',
      content: description
    },
    {
      heading: 'About the Author',
      content: bio
    }
  ];

  if (loading) {
    return <Loading />;
  }
  else {
    return (
      <>
        <div className="nav-bottom add-to-cart-nav">
          <AddToCart book={aBook} />
        </div>
        <div className="screen screen-h-padding">
          {error ? (
            <h2>{error}</h2>
          ) :
            (
              <>

                <Notification
                  notify={notify}
                  setNotify={setNotify}
                />
                <MessageDialog
                  messageDialog={messageDialog}
                  setMessageDialog={setMessageDialog}
                />

                <div className="book-screen-container">
                  <div className="container__main">
                    <TopSection
                      className="top__section__top"
                      book={aBook}
                      favorited={favorited}
                      addToWishlistNew={addToWishlistNew}
                      removeFromWishlistHandler={removeFromWishlistHandler}
                      authorID={authorID}
                      commentsLength={commentsLength}
                      onClickReviews={onClickReviews}
                    />
                    <div className="container__left">
                      <input type="image" src={aBook.cover} title="click to enlarge" alt="book cover" className="book-cover" onClick={() => setShowBookCoverModal(true)} />
                      <BookCoverModal title="Book Cover" onClose={() => setShowBookCoverModal(false)} show={showBookCoverModal}>
                        <img src={aBook.cover} alt="book cover" className="book-cover-large" />
                      </BookCoverModal>
                    </div>
                    <div className="fav-icon-text">
                      <Heart
                        addToWishlistNew={addToWishlistNew}
                        removeFromWishlistHandler={removeFromWishlistHandler}
                        favorited={favorited}
                      />
                      {favorited ?
                        <div onClick={removeFromWishlistHandler}>Remove from Wishlist</div>
                        :
                        <div onClick={addToWishlistNew}>Add to Wishlist</div>}
                    </div>

                    <hr className="hide-to-compact-before top_section_divider section_divider" />
                    <div className="container__right">
                      <TopSection
                        className="hide-to-compact"
                        book={aBook}
                        favorited={favorited}
                        addToWishlistNew={addToWishlistNew}
                        removeFromWishlistHandler={removeFromWishlistHandler}
                        authorID={authorID}
                        commentsLength={commentsLength}
                        onClickReviews={onClickReviews}
                      />
                      <hr className="hide-to-compact section_divider add-to-cart-non-nav" />
                      <div className="add-to-cart-non-nav">
                        <AddToCart
                          book={aBook}
                        />
                      </div>
                      <div className="mini_section hide-to-compact">
                        <div className="book_details_heading book_details_heading_bottom">
                          Product Details
                        </div>
                        <ProductDetails
                          publisher={publisher}
                          publicationDate={publicationDate}
                          isbn={isbn}
                          edition={edition}
                          genre={genre}
                        />
                      </div>
                    </div>
                    <div className="accordion">
                      <Accordion
                        screen="bookscreen"
                        data={accordion_data}
                      />
                    </div>
                  </div>
                  <hr className="hide-to-compact" />
                  <div className="section hide-to-compact">
                    <div className="book_details_heading_center book_details_heading book_details_heading_bottom">Overview</div>
                    <div className="text_body overview_section"> {aBook.description}</div>
                  </div>
                  <hr className="hide-to-compact" />
                  <div className="smaller_section hide-to-compact">
                    <div className="section smaller_section_content">
                      <div className="book_details_heading_center book_details_heading book_details_heading_bottom">
                        About the Author
                      </div>
                      <div className="text_body">
                        {bio}
                      </div>
                    </div>
                  </div>
                  <div className="large-padding" ref={reviews_section}>
                    <hr />
                    <ReviewSection
                      aBook={aBook}
                      commentsLength={commentsLength}
                      createReviewHandler={() => setShowReviewModal(true)}
                    />
                  </div>
                  <ReviewModal title="review" onClose={() => setShowReviewModal(false)} show={showReviewModal}>
                    <ReviewForm numComments={aBook.numComments} oldRating={aBook.rating} bookTitle={aBook.title} closeModal={closeReviewModalHandler} />
                  </ReviewModal>
                </div>

              </>
            )
          }
        </div >
      </>
    );
  }
};

export default BookScreen;

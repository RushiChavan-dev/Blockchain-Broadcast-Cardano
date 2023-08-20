import React from "react";
import Heart from "./Heart";
import Rating from '@material-ui/lab/Rating';
import { Link } from "react-router-dom";

const TopSection = ({ className, book, favorited, addToWishlistNew, removeFromWishlistHandler, authorID, commentsLength, onClickReviews }) => {
    return (<div className={className}>
        <div className="title__heading">
            <div>{book.title}</div>
            <Heart
                inHeader
                favorited={favorited}
                addToWishlistNew={addToWishlistNew}
                removeFromWishlistHandler={removeFromWishlistHandler}
            />
        </div>
        <div className="author__heading">
            by <Link to={`/authorbooks/${authorID}`}>{book.authorName}</Link>
        </div>
        <div className="rating__heading link-stars" onClick={onClickReviews}>
            <Rating
                name="half-rating-read"
                size="small"
                value={book.rating}
                precision={0.1}
                readOnly
            />
            <div>
                {book.rating} ({commentsLength})
            </div>
        </div>
    </div>);
};

export default TopSection;

import React from "react";
import Rating from '@material-ui/lab/Rating';

const RatingHeader = ({ rating, commentsLength, createReviewHandler }) => {
    return (<div className="rating-header"><div className="ave_rating">
        Average Customer Ratings
    </div>
        <div className="rating__heading overall_reviews">
            Overall
            <Rating name="half-rating-read"
                size="small"
                value={rating}
                precision={0.1}
                readOnly
            />
            {rating}
            <div className="reviews_number">
                |
            </div>
            <div className="reviews_number">
                {commentsLength} Reviews
            </div>
            <button
                className="btn btn-primary btn-stars"
                onClick={createReviewHandler}>
                Write a review
            </button>
        </div>
    </div>);
};

export default RatingHeader;

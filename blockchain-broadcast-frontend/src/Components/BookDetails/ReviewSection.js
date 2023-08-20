

import React from "react";
import Rating from '@material-ui/lab/Rating';
import RatingHeader from "./RatingHeader";

const ReviewSection = ({ aBook, commentsLength, createReviewHandler }) => {
    return (<div className="section">
        {
            <div className="reviews_section">
                <div className="inline-header">
                    <div className="author__center book_details_heading">
                        Reviews
                    </div>
                    <div className="overall-flex">
                        <RatingHeader
                            rating={aBook.rating}
                            commentsLength={commentsLength}
                            createReviewHandler={createReviewHandler}
                        />
                    </div>
                    <button
                        className="btn btn-primary btn-heading"
                        onClick={createReviewHandler}>
                        Write a review
                    </button>
                </div>
                <div className="overall-block">
                    <RatingHeader
                        rating={aBook.rating}
                        commentsLength={commentsLength}
                        createReviewHandler={createReviewHandler}
                    />
                </div>
                {
                    commentsLength > 0 ?
                        <div>
                            <div className="num_of_reviews">
                                1-{commentsLength} of {commentsLength} Reviews
                            </div>
                            <hr />
                            {
                                (aBook.comments).map((comment, i) => <div key={comment._id}>
                                    <div className="comment_container">
                                        <div className="text_body commenter left_commenter" ><b>{comment.commenter}</b></div>
                                        <div className="comments" key={comment.commenter}>
                                            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css" />
                                            <div className="book_details_rating" id="book_details_rating">
                                                <div className="rating_stars" id="rating_stars">
                                                    <Rating value={comment.rating}
                                                        precision={0.1}
                                                        size="small"
                                                        readOnly
                                                    />
                                                </div>
                                                <div className="rating_title" id="rating_title">  {comment.title}</div>
                                                <div className="text_body commenter block_commenter" id="commenter"><b>{comment.commenter}</b></div>
                                            </div>
                                            <div className="text_body">{comment.content}</div>
                                        </div>
                                    </div>
                                    {i < commentsLength - 1 && <hr />}
                                </div>
                                )
                            }
                        </div>
                        :
                        <div className="text_body" >
                            This item doesn't have any reviews yet.
                        </div>
                }
            </div>
        }
    </div>
    );
};

export default ReviewSection;

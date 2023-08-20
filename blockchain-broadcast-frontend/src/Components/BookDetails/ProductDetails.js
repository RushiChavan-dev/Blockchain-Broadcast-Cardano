import React from "react";

const ProductDetails = ({ publisher, publicationDate, isbn, edition, genre }) => {
    return (
        <div className="details_block text_body">
            <div>
                <div>Publisher:</div>
                <div>Publication Date:</div>
                <div>ISBN:</div>
                <div>Edition:</div>
                <div>Genre:</div>
            </div>
            <div>
                <div>{publisher}</div>
                <div>{publicationDate}</div>

                <div>{isbn}</div>
                <div>{edition}</div>
                <div>{genre}</div>
            </div>
        </div>
    );
};

export default ProductDetails;

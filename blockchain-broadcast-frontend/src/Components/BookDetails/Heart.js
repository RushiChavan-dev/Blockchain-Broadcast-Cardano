import React from "react";
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

const Heart = ({ favorited, inHeader, addToWishlistNew, removeFromWishlistHandler }) => {
    return (
        <div className={`heart ${inHeader && "heart__heading"}`}>
            {
                favorited ?
                    <div title="remove from wishlist" className={`fav-icon ${inHeader && "fav-icon-no-text"}`}>
                        <FavoriteIcon onClick={removeFromWishlistHandler} />
                    </div>
                    : <div title="add to wishlist" className={`fav-icon ${inHeader && "fav-icon-no-text"}`}>
                        <FavoriteBorderIcon onClick={addToWishlistNew} />
                    </div>
            }
        </div>
    );
};

export default Heart;

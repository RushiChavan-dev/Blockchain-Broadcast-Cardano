import React from "react";
import SwapVertIcon from '@mui/icons-material/SwapVert';
const SortHeading = ({ sort }) => {
    return (
        <div className="browser-buttons" >
            <SwapVertIcon style={{ margin: 0, padding: 0 }} />
            <p>Sort:</p>
            <b>{sort}</b>
        </div>
    );
};

export default SortHeading;

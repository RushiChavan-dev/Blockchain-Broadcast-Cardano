import React from "react";
import GridViewIcon from '@mui/icons-material/GridView';

const ItemsPerPageHeading = ({ itemsNumber }) => {
    return (
        <div className={`browser-buttons`}>
            <GridViewIcon />
            <p>Show:</p>
            <b>{itemsNumber}</b>
        </div>
    );
};

export default ItemsPerPageHeading;

import React from "react";
import GridViewIcon from '@mui/icons-material/GridView';
import WindowOutlinedIcon from '@mui/icons-material/WindowOutlined';
import GridOnOutlinedIcon from '@mui/icons-material/GridOnOutlined';

const ItemsPerPageCompressed = ({ itemsNumber, selected }) => {
    return (
        <div className={`browser-buttons browser-per-page-buttons ${!selected ? "per-page-not-selected" : "per-page-selected"}`}>
            {itemsNumber === 10 ?
                <>
                    <WindowOutlinedIcon />
                    10
                </>
                :
                <>
                    <GridOnOutlinedIcon />
                    20
                </>
            }
        </div>
    );
};

export default ItemsPerPageCompressed;

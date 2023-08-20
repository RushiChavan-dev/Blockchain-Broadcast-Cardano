import React from "react";
import TuneIcon from '@mui/icons-material/Tune';

const FilterHeading = ({ filter }) => {
    return (
        <div className="browser-buttons">
            <TuneIcon />
            <p>Filter:</p>
            <b>{filter}</b>
        </div>
    );
};

export default FilterHeading;

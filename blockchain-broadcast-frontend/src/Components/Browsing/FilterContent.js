import React from "react";
import CustomSelect from '../CustomSelect/CustomSelect';

const FilterContent = ({ currGenre, handleGenreChange, genres, currRating, handleRatingChange, ratings }) => {

    return (<>
        <CustomSelect
            inputLabel='Genre'
            inputLabelId='collapsed-browser-select-label'
            labelId='Genre'
            id='select-genre'
            value={currGenre}
            handleChange={handleGenreChange}
            items={genres}
        />
        <CustomSelect
            inputLabel='Rating'
            inputLabelId='collapsed-browser-select-label'
            labelId='Rating'
            id='select-rating'
            value={currRating}
            handleChange={handleRatingChange}
            items={ratings}
        />
    </>

    );
};

export default FilterContent;

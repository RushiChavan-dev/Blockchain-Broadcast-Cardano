import React from 'react';
import { Link } from "react-router-dom";

import Autobiography from '../../Assets/autobiography.png';
import Fantasy from '../../Assets/fantasy.png';
import NonFiction from '../../Assets/non-fiction.png';
import Novel from '../../Assets/novel.png';
import Poetry from '../../Assets/poetry.png';
import Humor from '../../Assets/humor.png';
import Fiction from '../../Assets/fiction.png';


const GenreItem = ({ name }) => {
    const ICONS = {
        "Non-Fiction": NonFiction,
        "Fiction": Fiction,
        "Fantasy": Fantasy,
        "Poetry": Poetry,
        "Humor": Humor,
        "Novel": Novel,
        "Autobiography": Autobiography
    };

    return (<div className='carousel-item'>
        <div className='banner-item'>
            <Link to={`/browse/${name}/getByTS`}>
                <div className='banner-icon'>
                    <img src={ICONS[name]} alt={name} />
                    <p>{name}</p>
                </div>
            </Link>
        </div>
    </div>
    );
};

export default GenreItem;

import React from 'react';
import GenreItem from './GenreItem';
import Carousel from '../../Components/Carousel/Carousel';

const GenreCategories = () => {

    // We listen to the resize event
    window.addEventListener('resize', () => {
        let vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--my-vh', `${vh}px`);
    });

    const SLIDES = [
        <GenreItem name="Novel" key="Novel" />,
        <GenreItem name="Autobiography" key="Autobiography" />,
        <GenreItem name="Fantasy" key="Fantasy" />,
        <GenreItem name="Fiction" key="Fiction" />,
        <GenreItem name="Non-Fiction" key="Non-Fiction" />,
        <GenreItem name="Humor" key="Humor" />,
        <GenreItem name="Poetry" key="Poetry" />
    ];

    return (
        <div id='bottom-height'>
            <Carousel
                slides={SLIDES}
                auto
            />
        </div>
    );
};

export default GenreCategories;

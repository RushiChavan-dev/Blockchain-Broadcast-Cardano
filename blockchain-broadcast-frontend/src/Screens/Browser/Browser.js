
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import './Browser.css';
import Book from '../../Components/Book/Book';
import CustomSelect from '../../Components/CustomSelect/CustomSelect';
import Accordion from '../../Components/Accordion/Accordion';
import { getSortedBooks } from '../../Redux/actions/bookActions';
import FilterHeading from '../../Components/Browsing/FilterHeading';
import FilterContent from '../../Components/Browsing/FilterContent';
import SortHeading from '../../Components/Browsing/SortHeading';
import ItemsPerPageCompressed from '../../Components/Browsing/ItemsPerPageCompressed';
import ListContent from '../../Components/Browsing/ListContent';
import Loading from '../../Components/Loading/Loading';

const Browser = ({ match, history }) => {

    const GENRES = {
        All: null,
        Humor: '64dfbc9fb31a86304eb54460',
        Novel: '64dfbc63b31a86304eb5445c',
        Fiction: '64dfbd8ab31a86304eb54467',
        'Non-Fiction': '64dfbc85b31a86304eb5445e',
        Fantasy: '64d2ae6377a486e833b893d1',
        Poetry: '64dfbcb7b31a86304eb54462',
        Autobiography: '64dc5e27680b46678c26148f',
    };

    const RATINGS = {
        '1 & up': 1,
        '2 & up': 2,
        '3 & up': 3,
        '4 & up': 4,
        '5 ': 5,
    };

    const PAGES = {
        10: 10,
        20: 20,
    };

    const SORT_TYPES = {
        'Top Sellers': 'getByTS',
        'Newest to Oldest': 'getByRDNO',
        'Oldest to Newest': 'getByRDON',
        'Price - High to Low': 'getByPriceHL',
        'Price - Low to High': 'getByPriceLH',
        'Title - A to Z': 'getByTitleAZ',
        'Title - Z to A': 'getByTitleZA',
        'Rating - High to Low': 'getByRatingHL',
        'Rating - Low to High': 'getByRatingLH',
        'Author - A to Z': 'getByAuthorAZ',
        'Author - Z to A': 'getByAuthorZA',
    };

    const getKeyByValue = (object, value) => {
        return Object.keys(object).find((key) => object[key] === value);
    };

    const parameters = match.params;
    const paramFilter = (parameters || {}).filter;
    const paramSort = (parameters || {}).sort;

    // pages
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(10);

    // filter
    const nonNumericFilter = isNaN(paramFilter);
    const [filter, setFilter] = useState(paramFilter ? (nonNumericFilter ? (paramFilter === "All" ? {} : { genre: GENRES[paramFilter] }) : ({ rating: { $gte: parseInt(paramFilter) } })) : {});
    const [currFilter, setCurrFilter] = useState(paramFilter ? (!nonNumericFilter ? (`Rating - ${Object.keys(RATINGS)[parseInt(paramFilter) - 1]}`) : paramFilter) : 'All');
    const [filterType, setFilterType] = useState(paramFilter ? (nonNumericFilter ? "byGenre" : "byRating") : "byGenre");
    const [genreDD, setGenreDD] = useState(paramFilter ? (nonNumericFilter ? paramFilter : 'All') : 'All');
    const [ratingDD, setRatingDD] = useState(paramFilter ? (!nonNumericFilter ? paramFilter : 1) : 1);

    // sort
    const [currSort, setCurrSort] = useState(paramSort ? (paramSort ? getKeyByValue(SORT_TYPES, paramSort) : 'Top Sellers') : 'Top Sellers');
    const [sortType, setSortType] = useState(parameters ? (paramSort ? paramSort : 'getByTS') : 'getByTS');

    // accordion
    const [closeAccordion, setCloseAccordion] = useState(false);

    // load books
    const dispatch = useDispatch();
    const sorted = useSelector((state) => state.getSortedBooks);
    const { loading, error, sortedBooks } = sorted;
    useEffect(() => {
        dispatch(getSortedBooks(sortType, paramFilter, page, perPage));
    }, [dispatch, sortType, paramFilter, page, perPage, parameters, filterType]);

    const mybooks = (sortedBooks || {}).data || [];
    const currBooks = (sortedBooks || {}).currBooks || [];
    const lastPage = (sortedBooks || {}).lastPage || 1;




    const goNext = () => {
        //next page
        if (page + 1 <= lastPage) {
            setPage(page + 1);
        }
    };

    const goBack = () => {
        //previous page
        if (page - 1 >= 1) {
            setPage(page - 1);
        }
    };

    const handlePerPageChange = (event) => {
        setPerPage(event.target.value);
        setPage(1);
    };

    const handlePerPageClick = (value) => {
        setPerPage(value);
        setPage(1);
    };

    const handleRatingChange = (event) => {
        let val = parseInt(event.target.value);
        let f = { rating: { $gte: val } };
        let r = event.target.value;
        setPage(1);
        setGenreDD('All');
        setRatingDD(r);
        setCurrFilter(`Rating - ${Object.keys(RATINGS)[val - 1]}`);
        handleCloseAccordionCallback();
        setFilter(f);
        setFilterType("byRating");
        history.push(`/browse/${r}/${sortType}`);
    };

    const handleGenreChange = (event) => {
        let g = event.target.value;
        let f = GENRES[g] ? { genre: GENRES[g] } : {};
        setPage(1);
        setGenreDD(g);
        setRatingDD(1);
        setCurrFilter(g);
        handleCloseAccordionCallback();
        setFilter(f);
        setFilterType("byGenre");
        history.push(`/browse/${g}/${sortType}`);
    };

    const handleSortTypeChange = (event) => {
        let s = event.target.value;
        let v = getKeyByValue(SORT_TYPES, s);
        setPage(1);
        setCurrSort(v);
        handleCloseAccordionCallback();
        setSortType(s);
        history.push(`/browse/${filterType === "byGenre" ? genreDD : ratingDD}/${s}`);
    };

    const handleCloseAccordionCallback = () => {
        setCloseAccordion(true);
    };
    const handleOpenAccordionCallback = () => {
        setCloseAccordion(null);
    };


    const accordion_data = [
        {
            heading: <FilterHeading filter={currFilter} />,
            content: (
                <FilterContent
                    currGenre={genreDD}
                    currRating={ratingDD}
                    handleGenreChange={handleGenreChange}
                    genres={GENRES}
                    ratings={RATINGS}
                    handleRatingChange={handleRatingChange}
                />
            ),
            type: 'filter',
        },
        {
            heading: <SortHeading sort={currSort} />,
            content: (
                <ListContent
                    items={SORT_TYPES}
                    onClick={handleSortTypeChange}
                />
            ),
            type: 'sort',
        },
    ];


    if (loading)
        return <Loading />;
    else if (error) {
        console.log(error);
        return <div className='screen screen-h-padding browser-screen'>
            <h2 className='centered_header'>Sorry, you can't browse books right now. Please try again later.</h2>
        </div>;
    }
    else {
        return (
            <div className='screen screen-h-padding browser-screen'>
                <h2 className='centered_header'>Top Picks</h2>
                <div className='nav browser-nav'>
                    <div className='nav-left'>
                        <div className='separated-inputs'>
                            <CustomSelect
                                inputLabel='Items per page'
                                inputLabelId='browser-select-label'
                                labelId='ShowBooksPerPage'
                                id='select'
                                value={perPage}
                                handleChange={handlePerPageChange}
                                items={PAGES}
                            />

                            <CustomSelect
                                inputLabel='Average Rating'
                                inputLabelId='browser-select-label'
                                labelId='Rating'
                                id='select-rating'
                                value={ratingDD}
                                handleChange={handleRatingChange}
                                items={RATINGS}
                            />

                            <CustomSelect
                                inputLabel='Genre'
                                inputLabelId='browser-select-label'
                                labelId='Genre'
                                id='select-genre'
                                value={genreDD}
                                handleChange={handleGenreChange}
                                items={GENRES}
                            />
                            <CustomSelect
                                inputLabel='Sort by'
                                inputLabelId='browser-select-label'
                                labelId='Sort'
                                id='select-sort'
                                value={sortType || 'getByTS'}
                                handleChange={handleSortTypeChange}
                                items={SORT_TYPES}
                            />
                        </div>
                        <div className='browser-buttons'>
                            <div onClick={() => handlePerPageClick(10)}>
                                <ItemsPerPageCompressed
                                    itemsNumber={10}
                                    selected={perPage === 10}
                                />
                            </div>
                            <div onClick={() => handlePerPageClick(20)}>
                                <ItemsPerPageCompressed
                                    itemsNumber={20}
                                    selected={perPage === 20}
                                />
                            </div>
                        </div>
                    </div>
                    <div className='nav-right nav-total-items'>
                        {page * perPage - perPage + 1}-
                        {page * perPage -
                            perPage +
                            currBooks.length} of {mybooks.length} results
                    </div>
                </div>
                <div className='nav browser-nav'>
                    <div className='nav-left'>
                        <Accordion
                            screen='browser'
                            data={accordion_data}
                            closeAccordion={closeAccordion}
                            handleOpenAccordionCallback={handleOpenAccordionCallback}
                            handleCloseAccordionCallback={handleCloseAccordionCallback}
                        />
                    </div>
                </div>
                <div className='homescreen__products'>
                    {currBooks.map(
                        (book) => (
                            <Book
                                key={book._id}
                                title={book.title}
                                price={book.price}
                                rating={book.rating}
                                cover={book.cover}
                                bookId={book._id}
                                authorId={book.author}
                                authorName={book.authorName}
                                releaseDate={book.releaseDate}
                            />
                        ),
                        {}
                    )}
                </div>
                <div className='nav'>
                    <div className='nav-left'>
                        <i
                            className='fa-solid fa fa-chevron-left fa-lg'
                            disabled={page === 1}
                            onClick={() => goBack()}
                        ></i>
                    </div>
                    <div className='centered-footer'>
                        <div>
                            {page} of {lastPage}
                        </div>
                    </div>
                    <div className='nav-right'>
                        <i
                            className='fa-solid fa fa-chevron-right fa-lg'
                            disabled={page === lastPage}
                            onClick={() => goNext()}
                        ></i>
                    </div>
                </div>
            </div>
        );
    }
};

export default Browser;

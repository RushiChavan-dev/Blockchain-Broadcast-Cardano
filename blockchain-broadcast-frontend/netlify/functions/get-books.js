const axios = require("axios");

exports.handler = async function (event) {
    try {
        const { sort, filter } = event.queryStringParameters;

        const GENRES = {
            All: null,
            Humor: '605679b341e30718cfa06143',
            Novel: '6057548c7cb1dc2899337811',
            Fiction: '60316e2ceda4ea0a72158abf',
            'Non-Fiction': '6047f6de2b677f17622ae060',
            Fantasy: '60309fdc5aa8bc214f4a9b9d',
            Poetry: '6047ec6c9c6672143d0e36aa',
            Autobiography: '6056918441e30718cfa06152',
        };

        const nonNumericFilter = isNaN(filter);

        const filterObject = filter ? (nonNumericFilter ? (filter === "All" ? {} : { genre: GENRES[filter] }) : ({ rating: { $gte: parseInt(filter) } })) : {};

        const baseURL = {
            dev: 'http://localhost:4000/books',
            prod: `${process.env.REACT_APP_BACKEND_URL}/books`,
        };

        const url = process.env.NODE_ENV === 'production' ? baseURL.prod : baseURL.dev;

        const { data } = await axios.get(`${url}/${sort}`, {
            params: {
                filter: filterObject
            }
        });

        return {
            statusCode: 200,
            body: JSON.stringify(data),
        };
    } catch (err) {
        return {
            statusCode: 404,
            body: err.toString(),
        };
    }
};

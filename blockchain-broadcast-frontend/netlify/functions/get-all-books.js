const axios = require("axios");

exports.handler = async function () {
    try {
        const baseURL = {
            dev: 'http://localhost:4000/books',
            prod: `${process.env.REACT_APP_BACKEND_URL}/books`,
        };

        const url = process.env.NODE_ENV === 'production' ? baseURL.prod : baseURL.dev;

        const { data } = await axios.get(url);
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

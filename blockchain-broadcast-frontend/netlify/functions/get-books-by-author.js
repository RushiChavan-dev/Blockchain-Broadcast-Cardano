const axios = require("axios");

exports.handler = async function (event) {
    try {
        const { id } = event.queryStringParameters;

        const baseURL = {
            dev: 'http://localhost:4000/authors/getbooksby',
            prod: `${process.env.REACT_APP_BACKEND_URL}/authors/getbooksby`,
        };
        const url = process.env.NODE_ENV === 'production' ? baseURL.prod : baseURL.dev;

        const { data } = await axios.get(`${url}/${id}`);

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

const axios = require("axios");

exports.handler = async function (event) {
    try {
        const { id, qty } = event.queryStringParameters;
        const baseURL = {
            dev: 'http://localhost:4000/books/purchase',
            prod: `${process.env.REACT_APP_BACKEND_URL}/books/purchase`,
        };
        const url =
            process.env.NODE_ENV === 'production' ? baseURL.prod : baseURL.dev;

        const { data } = await axios.patch(`${url}/${id}`, {
            sold: qty,
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

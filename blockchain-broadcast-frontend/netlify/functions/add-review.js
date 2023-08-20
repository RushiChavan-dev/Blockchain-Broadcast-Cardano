const axios = require("axios");

exports.handler = async function (event) {
    try {
        const { id, commenter, title, content, rating, average } = JSON.parse(event.body);

        const baseURL = {
            dev: 'http://localhost:4000/books/review/',
            prod: `${process.env.REACT_APP_BACKEND_URL}/books/review/`,
        };

        const url =
            process.env.NODE_ENV === 'production' ? baseURL.prod : baseURL.dev;

        const { data } = await axios.put(`${url}${id}`, {
            commenter: commenter,
            title: title,
            content: content,
            rating: rating,
            average: average,
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

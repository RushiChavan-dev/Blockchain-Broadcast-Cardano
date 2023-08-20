const axios = require("axios");

exports.handler = async function (event) {
    try {
        const form_data = new FormData();
        const token = localStorage.getItem('token');

        const baseURL = {
            dev: 'http://localhost:4000/api/cart',
            prod: `${process.env.REACT_APP_BACKEND_URL}/api/cart`,
        };

        const url =
            process.env.NODE_ENV === 'production' ? baseURL.prod : baseURL.dev;


        const { data } = await axios.post(url, form_data, {
            headers: {
                'x-auth-token': token,
            },
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

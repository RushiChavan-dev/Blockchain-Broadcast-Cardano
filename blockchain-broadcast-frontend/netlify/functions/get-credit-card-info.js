const axios = require("axios");

exports.handler = async function (event) {
    try {
        const bod = JSON.parse(event.body);
        const form_data = bod.formData;
        const token = bod.token;

        const baseURL = {
            dev: 'http://localhost:4000/api/managing-credit-cardd',
            prod: `${process.env.REACT_APP_BACKEND_URL}/api/managing-credit-cardd`,
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

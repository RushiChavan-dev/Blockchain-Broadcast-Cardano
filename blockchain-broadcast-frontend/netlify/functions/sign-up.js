const axios = require("axios");

exports.handler = async function (event) {
    try {
        const form_data = event.body;
        const contentType = event.headers['content-type'];

        const newForm = Buffer.from(form_data, 'base64').toString('utf8');
        const baseURL = {
            dev: 'http://localhost:4000/api/signup',
            prod: `${process.env.REACT_APP_BACKEND_URL}/api/signup`,
        };

        const url =
            process.env.NODE_ENV === 'production' ? baseURL.prod : baseURL.dev;

        const { data } = await axios.post(url, newForm, {
            headers: {
                'Content-Type': contentType
            },
        });
        return {
            statusCode: 200,
            body: JSON.stringify(data),
        };
    } catch (err) {
        console.log(err);
        return {
            statusCode: 404,
            body: err.response ? err.response.data.msg.toString() : "Sorry, you can't signup right now. Please try again later.",
        };
    }
};

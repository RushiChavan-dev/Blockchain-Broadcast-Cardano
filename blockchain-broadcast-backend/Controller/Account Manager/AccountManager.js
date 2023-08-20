import pkg from 'formidable';
const { IncomingForm } = pkg;
import { user } from '../../models/userModel.js';
import { Book } from '../../models/bookModel.js';

class AccountManager {
    UpdateUserInfo(request, response) {
        const form = new IncomingForm();
        try {
            form.parse(request, async (error, fields, files) => {
                if (error) {
                    return response.status(500).json({ msg: 'Network Error: Failed to update personal information' });
                }

                const { name, email, nickname, home_address } = fields; // Expecting at least one data from the list
                if (!name && !email && !nickname && !home_address) {
                    return response.status(400).json({ msg: 'At least 1 field is required' });
                }

                const userSession = request.user.data;
                const user_email = userSession.email;
                const isUserExisting = await user.findOne({ email: user_email });

                if (!isUserExisting) {
                    return response.status(404).json({ msg: 'An account with this email does not exist' });
                }

                const userDoc = isUserExisting;
                console.log(userDoc);

                userDoc.name = name ? name : userDoc.name;
                userDoc.email = email ? email : userDoc.email;
                userDoc.nickname = nickname ? nickname : userDoc.nickname;
                userDoc.homeAddress = home_address ? home_address : userDoc.homeAddress;

                // console.log(userDoc);//Log out the user doc

                const updatedDoc = await user.findOneAndUpdate({
                    email: user_email
                }, userDoc, { new: true });
                return response.status(200).json({ msg: 'Personal information updated' });
            });

        } catch (error) {
            return response.status(500).json({ msg: 'Network Error: Failed to update personal information' });
        }
    }

    AddCreditCard(request, response) {

        const form = new IncomingForm();

        try {
            const body = request.body;
            console.log(body);
            form.parse(request, async (error, fields, files) => {
                if (error) {
                    return response.status(500).json({ msg: 'Failed to add new credit card info' });
                }

                const {
                    cardHolder,
                    cardNumber,
                    cardExpMonth,
                    cardExpYear,
                    cardCVC
                } = fields;
                console.log('fileds', fields);

                if (!cardHolder || !cardNumber || !cardExpMonth || !cardExpYear || !cardCVC) {
                    return response.status(400).json({ msg: "All fields are required" });
                }
                const userSession = request.user.data;
                const user_email = userSession.email;
                const userDoc = await user.findOne({ email: user_email });

                userDoc.creditCards.push({
                    cardHolder,
                    cardNumber,
                    cardExpMonth,
                    cardExpYear,
                    cardCVC
                });

                const updatedDoc = await user.findOneAndUpdate({
                    email: user_email
                }, userDoc, { new: true });

                return response.status(200).json({ msg: 'Credit card information added' });
            });

        } catch (error) {
            return response.status(500).json({ msg: 'Failed to add new credit card information' });
        }

    }
    // OJO
    InsertCreditCard(request, response) {
        const form = new IncomingForm();
        try {
            form.parse(request, async (error, fields, files) => {

                if (error) {
                    return response.status(500).json({ msg: 'Network Error: Failed to update personal information' });
                }

                const { ArrayCreditCard } = fields; // Expecting at least one data from the list
                var user_email = "bloodfear@arete.com";
                const userSession = request.user.data;
                console.log("TATAKAE1" + request.user.data);
                console.log("TATAKAE2" + request.user.data.creditCards);

                const isUserExisting = await user.findOne({ email: user_email });

                if (!isUserExisting) {
                    return response.status(404).json({ msg: 'An account with this email does not exist' });
                }

                const userDoc = isUserExisting;
                console.log(userDoc);


                userDoc.creditCards = ArrayCreditCard ? ArrayCreditCard : userDoc.creditCards;

                console.log("Array3" + userDoc.creditCards);


                return response.status(200).json({ msg: 'Credit card information updated' });
            });

        } catch (error) {
            return response.status(500).json({ msg: 'Network Error: Failed to update personal information' });
        }
    }

    AddShippingAddress(request, response) {

        const form = new IncomingForm();

        try {

            form.parse(request, async (error, fields, files) => {
                if (error) {
                    return response.status(500).json({ msg: 'Failed to add new shipping address information' });
                }

                const {
                    street,
                    city,
                    state,
                    postalCode,
                    country
                } = fields;

                if (!street || !city || !state || !postalCode || !country) {
                    return response.status(400).json({ msg: "All fields are required" });
                }
                const userSession = request.user.data;
                const user_email = userSession.email;
                const userDoc = await user.findOne({ email: user_email });

                userDoc.shippingAddress.push({
                    street,
                    city,
                    state,
                    postalCode,
                    country
                });

                const updatedDoc = await user.findOneAndUpdate({
                    email: user_email
                }, userDoc, { new: true });

                return response.status(200).json({ msg: 'Shipping Address information added' });
            });

        } catch (error) {
            return response.status(500).json({ msg: 'Failed to add new shipping address information' });
        }

    }

    getCreditCard(request, response) {
        try {

            const userSession = request.user.data;
            const user_email = userSession.email;
            const isUserExisting = user.findOne({ email: user_email });

            if (!isUserExisting) {
                return response.status(404).json({ msg: 'An account with this email does not exist' });
            }

            console.log();

        } catch (error) {
            return response.status(500).json({ msg: 'Network Error: Failed to update personal information' });
        }
    }


    getttCreditCard(request, response) {
        try {
            const userSession = request.user.data;
            const user_email = userSession.email;

            user.findOne({
                email: user_email
            }, {
                id: true,
                creditCards: true
            }).then(result => {
                return response.send(result);
            });

        } catch (error) {
            return response.status(500).json({ msg: 'Network Error: Failed to update personal information' });
        }
    }

    getPersonalInfo(request, response) {
        try {
            const userSession = request.user.data;
            const user_email = userSession.email;

            user.findOne({
                email: user_email
            }, {
                id: true,
                nickname: true,
                email: true,
                name: true,
                homeAddress: true
            }).then(result => {
                return response.send(result);
            });

        } catch (error) {
            return response.status(500).json({ msg: 'Network Error: Failed to update personal information' });
        }
    }

    getCart(request, response) {
        try {
            const userSession = request.user.data;
            const user_email = userSession.email;

            user.findOne({
                email: user_email
            }, {
                id: true,
                cart: true,
            }).then(result => {
                return response.send(result);
            });

        } catch (error) {
            return response.status(500).json({ msg: 'Network Error: Failed to get cart content' });
        }
    }

    deleteCartItem(request, response) {
        const userSession = request.user.data;
        const user_email = userSession.email;
        console.log(user_email);
        const form = new IncomingForm();
        try {
            form.parse(request, async (error, fields, files) => {


                if (error) {
                    return response.status(500).json({ msg: 'Network Error: Failed to delete item from cart' });
                }

                console.log('fields', fields);
                const { id } = fields;
                await user.findOneAndUpdate({
                    email: user_email

                }, {
                    $pull: {
                        'cart': {
                            _id: id
                        }
                    }
                });
                return response.status(200).json({ msg: 'Item removed from cart' });
            });

        } catch (error) {
            return response.status(500).json({ msg: 'Network Error: Failed to delete item from cart' });
        }

    }


    addReview(request, response) {
        const form = new IncomingForm();
        try {

            form.parse(request, async (error, fields, files) => {
                if (error) {
                    return response.status(500).json({ msg: 'Failed to add cart item' });
                }

                console.log();
                const {
                    commenter,
                    title,
                    content,
                    rating,
                    bookId
                } = fields;

                if (!commenter || !title || !content || !rating) {
                    return response.status(400).json({ msg: "All fields are required" });
                }
                const userSession = request.user.data;
                const user_email = userSession.email;
                const userDoc = await user.findOne({ email: user_email });
                const bookDoc = await Book.findOne({ _id: bookId });
                console.log("from backend");

                Book.findById(bookId);

                const newReview = {
                    "commenter": commenter,
                    "title": title,
                    "content": content,
                    "rating": rating
                };
                Book.updateOne(
                    { _id: bookId },
                    { $push: { comments: newReview } },
                    done
                );
                return response.status(200).json({ msg: 'Review successfully added' });
            });

        } catch (error) {
            return response.status(500).json({ msg: 'Failed to add review' });
        }
    }

    getWishlist(request, response) {
        try {
            const userSession = request.user.data;
            const user_email = userSession.email;

            user.findOne({
                email: user_email
            }, {
                id: true,
                wishlist: true,
            }).then(result => {
                return response.send(result);
            });

        } catch (error) {
            return response.status(500).json({ msg: 'Network Error: Failed to get wishlist content' });
        }
    }

    getOrders(request, response) {
        try {
            const userSession = request.user.data;
            const user_email = userSession.email;

            user.findOne({
                email: user_email
            }, {
                id: true,
                orders: true,
            }).then(result => {
                return response.send(result);
            });

        } catch (error) {
            return response.status(500).json({ msg: 'Network Error: Failed to get orders' });
        }
    }



    deleteCreditCard(request, response) {
        try {
            console.log("I got DELETE");

            const userSession = request.user.data;
            const user_email = userSession.email;
            console.log(user_email);
            user.findOneAndUpdate({
                email: user_email
            }, {
                $pull: {
                    creditCards: {
                        cardNumber: "111111111"
                    }
                }
            }).then(result => {
                return response.send(result);
            });
        } catch (error) {
            return response.status(500).json({ msg: 'Network Error: Failed to update personal information' });
        }
    }

    managingShippingAddress(request, response) {
        try {
            const userSession = request.user.data;
            const user_email = userSession.email;
            user.findOne({
                email: user_email
            }, {
                id: true,
                shippingAddress: true
            }).then(result => {
                return response.send(result);
            });

        } catch (error) {
            return response.status(500).json({ msg: 'Network Error: Failed to update personal information' });
        }
    }

    // 3-31-21
    updatingCreditCardInfo(request, response) {
        const form = new IncomingForm();

        try {

            form.parse(request, async (error, fields, files) => {
                if (error) {
                    return response.status(500).json({ msg: 'Failed to add new credit card information' });
                }

                const {
                    cardHolder,
                    cardNumber,
                    cardExpMonth,
                    cardExpYear,
                    cardCVC,
                    id
                } = fields;

                if (!cardHolder || !cardNumber || !cardExpMonth || !cardExpYear || !cardCVC) {
                    return response.status(400).json({ msg: "All fields are required" });
                }
                const userSession = request.user.data;
                const user_email = userSession.email;
                user.findOneAndUpdate({
                    email: user_email,
                    'creditCards._id': id
                }, {
                    $set: {
                        'creditCards.$.cardNumber': cardNumber,
                        'creditCards.$.cardHolder': cardHolder,
                        'creditCards.$.cardExpMonth': cardExpMonth,
                        'creditCards.$.cardExpYear': cardExpYear,
                        'creditCards.$.cardCVC': cardCVC
                    }
                }).then(result => {
                    return response.status(200).json({ msg: 'Credit card information added' });
                });

            });

        } catch (error) {
            return response.status(500).json({ msg: 'Failed to add new credit card information' });
        }
    }
    updatingShippingAddress(request, response) {
        const form = new IncomingForm();

        try {

            form.parse(request, async (error, fields, files) => {
                if (error) {
                    return response.status(500).json({ msg: 'Failed to update shipping information' });
                }

                const {
                    street,
                    city,
                    state,
                    postalCode,
                    country,
                    id
                } = fields;

                if (!street || !city || !state || !postalCode || !country) {
                    return response.status(400).json({ msg: "All fields are required" });
                }
                const userSession = request.user.data;
                const user_email = userSession.email;
                user.findOneAndUpdate({
                    email: user_email,
                    'shippingAddress._id': id
                }, {
                    $set: {
                        'shippingAddress.$.street': street,
                        'shippingAddress.$.city': city,
                        'shippingAddress.$.state': state,
                        'shippingAddress.$.postalCode': postalCode,
                        'shippingAddress.$.country': country
                    }
                }).then(result => {
                    return response.status(200).json({ msg: 'Shipping information updated' });
                });

            });

        } catch (error) {
            return response.status(500).json({ msg: 'Failed to update shipping information' });
        }
    }

    async deletingItemFromCreditCard(request, response) {


        const userSession = request.user.data;
        const user_email = userSession.email;
        console.log(user_email);


        const form = new IncomingForm();
        try {
            form.parse(request, async (error, fields, files) => {


                if (error) {
                    return response.status(500).json({ msg: 'Network Error: Failed to update personal information' });
                }

                console.log('fiels', fields);
                const { id } = fields;
                await user.findOneAndUpdate({
                    email: user_email

                }, {

                    $pull: {
                        'creditCards': {
                            _id: id
                        }


                    }
                });
                return response.status(200).json({ msg: 'Credit card information updated' });
            });

        } catch (error) {
            return response.status(500).json({ msg: 'Network Error: Failed to update personal information' });
        }


    }

    async deletingItemFromShippingAddress(request, response) {

        const userSession = request.user.data;
        const user_email = userSession.email;

        console.log(user_email);

        console.log('delete shipping address works ');
        const form = new IncomingForm();
        try {
            form.parse(request, async (error, fields, files) => {


                if (error) {
                    return response.status(500).json({ msg: 'Network Error: Failed to update personal information' });
                }

                console.log('fiels', fields);
                const { id } = fields;
                await user.findOneAndUpdate({
                    email: user_email

                }, {

                    $pull: {
                        'shippingAddress': {
                            _id: id
                        }


                    }
                });
                return response.status(200).json({ msg: 'Credit card information updated' });
            });

        } catch (error) {
            return response.status(500).json({ msg: 'Network Error: Failed to update personal information' });
        }


    }
}
export {
    AccountManager
};

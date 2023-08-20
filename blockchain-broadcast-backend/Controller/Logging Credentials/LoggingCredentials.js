import pkg from 'formidable';
const { IncomingForm } = pkg;
import { user } from '../../models/userModel.js';


class LoggingCredentials {
    UpdateUserInfo(request, response) {
        const form = new IncomingForm();
        try {
            form.parse(request, async (error, fields, files) => {
                if (error) {
                    return response.status(500).json({ msg: 'Network Error: Failed to update personal information' });
                }
                const { email, password } = fields; // Expecting at least one data from the list
                if (!email && !password) {
                    return response.status(400).json({ msg: 'At least 1 field is required' });
                }

                if (password.length < 8) {
                    return response.status(400).json({ msg: 'Password has to be at least 8 characters long' });
                }

                const numberCheck = /\d/g;

                if (numberCheck.test(password)) { // Good
                } else {
                    return response.status(400).json({ msg: 'Password must constain at least 1 number' });
                }

                const lowercase = /[a-z]/;

                if (lowercase.test(password)) { // Good
                } else {
                    return response.status(400).json({ msg: 'Password must constain at least 1 lowercase letter' });
                }

                const upercase = /[A-Z]/;

                if (upercase.test(password)) { // Good
                } else {
                    return response.status(400).json({ msg: 'Password must constain at least 1 uppercase letter' });
                }

                const symbol = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;

                if (symbol.test(password)) { // Good
                } else {
                    return response.status(400).json({ msg: 'Password must constain at least 1 symbol' });
                }

                const userSession = request.user.data;
                const user_email = userSession.email;
                const isUserExisting = await user.findOne({ email: user_email });

                if (!isUserExisting) {
                    return response.status(404).json({ msg: 'An account with this email does not exist. Please sign up first' });
                }

                const userDoc = isUserExisting;
                console.log(userDoc);

                userDoc.email = email ? email : userDoc.email;
                userDoc.password = password ? password : userDoc.password;

                const updatedDoc = await user.findOneAndUpdate({
                    email: user_email
                }, userDoc, { new: true });
                return response.status(200).json({ msg: 'Login Credentials updated' });

            });

        } catch (error) {
            return response.status(500).json({ msg: 'Network Error: Failed to logging credentials' });
        }
    }
}
export {
    LoggingCredentials
};

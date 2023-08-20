import formidable from 'formidable';
import { hash, genSalt, compare } from 'bcrypt';
import { user } from '../models/userModel.js';
import { generateToken } from '../Utils/Token.js';

export class AuthController {

  Signup(request, response) {
    try {
      const form = new formidable.IncomingForm();
      form.parse(request, async (error, fields, files) => {
        if (error) {
          return response.status(500).json({ msg: "Network Error: Failed to signup user" });
        }
        const { email, name, nickname, password } = fields;
        if (!email) {
          return response.status(400).json({ msg: 'You must enter an email' });
        }
        if (!name) {
          return response.status(400).json({ msg: 'You must enter a name' });
        }
        if (!nickname) {
          return response.status(400).json({ msg: 'You must enter a nickname (this will be your username)' });
        }
        if (!password) {
          return response.status(400).json({ msg: 'You must enter a password' });
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
        const isNicknameExisting = await user.findOne({ nickname: nickname });
        if (isNicknameExisting) {
          return response.status(400).json({ msg: 'An account with this nickname already exists. Please login or pick a different nickname' });
        }

        const isEmailExisting = await user.findOne({ email: email });
        if (isEmailExisting) {
          return response.status(400).json({ msg: 'An account with this email already exists. Please login' });
        }

        const salt = await genSalt(15);
        const hashedPassword = await hash(password, salt);

        const newUser = new user({ email, name, nickname, password: hashedPassword });

        const savedUser = await newUser.save();

        return response.status(201).json({ msg: 'Account Successfuly created. Please login' });

      });
    } catch (error) {
      return response.status(500).json({ msg: "Network Error: Failed to signup user" });
    }
  }
  // Validating the signin of the user

  Signin(request, response) {
    const form = new formidable.IncomingForm();
    try {
      form.parse(request, async (error, fields, files) => {
        if (error) {
          return response.status(500).json({ msg: 'Network Error: Failed to sign you in' });
        }
        const { email, password } = fields;
        // Making sure that the user types the email and password
        if (!email || !password) {
          return response.status(400).json({ msg: 'All fields are required' });
        }
        const isEmailExisting = await user.findOne({ email: email }); // Interacting with mongoDB
        if (!isEmailExisting) {
          return response.status(404).json({ msg: 'An account with this email does not exist. Please sign up first' });
        }

        const user_Account = isEmailExisting;
        // validating the password
        const hashedPassword = user_Account.password;
        const isPasswordValid = await compare(password, hashedPassword);

        if (!isPasswordValid) {
          return response.status(400).json({ msg: 'Invalid credentials. Please check your password' });
        }

        const id = user_Account._id;
        const user_email = user_Account.email;
        const token = generateToken(id, user_email);

        return response.status(200).json({ token: token });


      });

    } catch (e) {
      return response.status(500).json({ msg: 'Network Error: Failed to sign you in' });
    }
  }
}

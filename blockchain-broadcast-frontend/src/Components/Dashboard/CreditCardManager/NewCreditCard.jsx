import React, {useState} from 'react';
import {useHistory} from 'react-router-dom';
import '../PersonalInfoManager/ManagePersonalInfo.css';
import Notification from '../../Cart/UI/Notification';

export const NewCreditCard = () => {
	const [cardHolder, setcardHolder] = useState('');
	const [cardNumber, setcardNumber] = useState('');
	const [cardExpMonth, setcardExpMonth] = useState('');
	const [cardExpYear, setcardExpYear] = useState('');
	const [cardCVC, setcardCVC] = useState('');

	const history = useHistory();

	// Notification
	const [notify, setNotify] = useState({
		isOpen: false,
		message: '',
		type: '',
		typeStyle: '',
	});

	const errorHandler = (message) => {
		setNotify({
			isOpen: true,
			message: message || 'Sorry, there was an error. Plase try again later.',
			type: 'error',
			typeStyle: '',
		});
	};

	const handleChangeLoginManager = (e) => {
		switch (e.target.id) {
			case 'cardHolder':
				setcardHolder(e.target.value);
				break;
			case 'cardNumber':
				setcardNumber(e.target.value);
				break;
			case 'cardExpMonth':
				setcardExpMonth(e.target.value);
				break;
			case 'cardExpYear':
				setcardExpYear(e.target.value);
				break;
			case 'cardCVC':
				setcardCVC(e.target.value);
				break;
			default:
				break;
		}
	};

	const BlankValidation = () => {
		if (
			!cardHolder &&
			!cardNumber &&
			!cardExpMonth &&
			!cardExpYear &&
			!cardCVC
		) {
			throw 'At least 1 field is required';
		}
	};

	const testingVars = () => {
		try {
			BlankValidation();
			checkCreditCardValidation();
			const url = '/.netlify/functions/add-credit-card';
			const form_data = new FormData();

			// cardHolder, cardNumber, expirationMonth, expirationYear, securityNumber
			form_data.append('cardHolder', cardHolder);
			form_data.append('cardNumber', cardNumber);
			form_data.append('cardExpMonth', cardExpMonth);
			form_data.append('cardExpYear', cardExpYear);
			form_data.append('cardCVC', cardCVC);
			const token = localStorage.getItem('token');
			fetch(url, {
				method: 'POST',
				headers: {
					'x-auth-token': token,
				},
				body: form_data,
			}).then((res) => history.push('/dashboard/manage-credit-card'));
		} catch (err) {
			errorHandler(
				err ? err : 'Something unexpected happened. Please try again later'
			);
		}
	};

	// Check CreditCard Arrow Function.
	const checkCreditCardValidation = () => {
		/* Initialization.*/
		/* Date Class Import statement. */
		let today = new Date();
		const CreditCardNumberTmp = cardNumber;
		const ExpMonthTmp = cardExpMonth;
		const ExpYearTmp = cardExpYear;
		const lowercase = /[a-z]/;
		const upercase = /[A-Z]/;
		const symbol = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
		const cn = /^[0-9]{13,19}$/;

		/* Credit Card Number can be only Numbers */
		if (
			lowercase.test(CreditCardNumberTmp) ||
			upercase.test(CreditCardNumberTmp) ||
			symbol.test(CreditCardNumberTmp) ||
			cn.test(CreditCardNumberTmp)
		) {
			throw 'The Card Number you entered is not valid';
		}

		/* Getting month. */
		let mm = today.getMonth() + 1;

		/* Getting Full Year. */
		let yyyy = today.getFullYear();

		/* Checking the year. */
		if (ExpYearTmp < yyyy) {
			throw 'The credit card you entered has expired. Please check the expiration year.';
		}

		/* Checking for the month */
		if (ExpYearTmp === yyyy && ExpMonthTmp < mm) {
			throw 'The credit card you entered has expired. Please check the expiration month.';
		}
	};

	const cancelFunc = () => {
		history.push('/dashboard/manage-credit-card');
	};

	const UpdateInfo = (e) => {
		e.preventDefault();

		testingVars();
	};

	return (
		<div className='profile-form'>
			<div className='col-1-2'>
				<form className='account__form' encType='multipart/form-data'>
					<h3 className='account__form-header'>Add New Credit Card</h3>
					<div className='form-control'>
						<label htmlFor='name'>Name on Card</label>
						<input
							id='cardHolder'
							type='text'
							placeholder='John Doe'
							onChange={handleChangeLoginManager}
						/>
					</div>
					<div className='form-control'>
						<label htmlFor='ccn'>Card Number</label>
						<input
							id='cardNumber'
							type='tel'
							inputMode='numeric'
							pattern='[0-9\s]{13,19}'
							autoComplete='cc-number'
							maxLength='19'
							placeholder='XXXX XXXX XXXX XXXX'
							onChange={handleChangeLoginManager}
						/>
					</div>
					<div className='form-control'>
						<label htmlFor='date'>Expiration Date</label>
						<div className='date-input'>
							<input
								id='cardExpMonth'
								type='text'
								name='month'
								placeholder='MM'
								maxLength='2'
								size='2'
								onChange={handleChangeLoginManager}
							/>
							<input
								type='text'
								name='year'
								placeholder='YYYY'
								maxLength='4'
								size='4'
								id='cardExpYear'
								onChange={handleChangeLoginManager}
							/>
						</div>
					</div>
					<div className='form-control'>
						<label htmlFor='cvc'>CVC</label>
						<div className='date-input'>
							<input
								id='cardCVC'
								type='text'
								placeholder='XXXX'
								onChange={handleChangeLoginManager}
							/>
						</div>
					</div>
					<div className='account__forgotpassword-buttons'>
						<button
							type='submit'
							onClick={UpdateInfo}
							className='btn btn-primary auth'
						>
							Submit
						</button>
						<button onClick={cancelFunc} className='btn btn-light auth'>
							Cancel
						</button>
					</div>
				</form>
			</div>
			<Notification notify={notify} setNotify={setNotify} />
		</div>
	);
};

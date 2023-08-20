import React, {useState, useEffect} from 'react';
import Notification from '../../Cart/UI/Notification';
import {useHistory} from 'react-router-dom';
import '../PersonalInfoManager/ManagePersonalInfo.css';

export const UpdateShippingAddress = () => {
	const [street, setStreet] = useState('');
	const [city, setCity] = useState('');
	const [state, setState] = useState('');
	const [postalCode, setPostalCode] = useState('');
	const [country, setCountry] = useState('');
	const [id, setId] = useState(null);
	const history = useHistory();

	const [streetMod, setStreetMod] = useState('');
	const [cityMod, setCityMod] = useState('');
	const [stateMod, setStateMod] = useState('');
	const [postalCodeMod, setPostalCodeMod] = useState('');
	const [countryMod, setCountryMod] = useState('');

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

	useEffect(() => {
		const data = JSON.parse(localStorage.getItem('shippingAdress'));
		setStreet(data.data.street);
		setCity(data.data.city);
		setState(data.data.state);
		setPostalCode(data.data.postalCode);
		setCountry(data.data.country);
		setId(data.data._id);
	}, []);
	const handleChangeLoginManager = (e) => {
		switch (e.target.id) {
			case 'street':
				setStreet(e.target.value);
				setStreetMod(true);
				break;
			case 'city':
				setCity(e.target.value);
				setCityMod(true);
				break;
			case 'state':
				setState(e.target.value);
				setStateMod(true);
				break;
			case 'postalCode':
				setPostalCode(e.target.value);
				setPostalCodeMod(true);
				break;
			case 'country':
				setCountry(e.target.value);
				setCountryMod(true);
				break;
			default:
				break;
		}
	};

	const BlankValidation = () => {
		if (!streetMod && !cityMod && !stateMod && !postalCodeMod && !countryMod) {
			throw "You didn't make any changes.";
		}
	};

	const cancelFunc = () => {
		history.push('/dashboard/manage-shipping-address');
	};

	const UpdateInfo = (e) => {
		e.preventDefault();
		try {
			BlankValidation();
			const url = '/.netlify/functions/update-shipping-address';
			const form_data = new FormData();

			// street, cardNumber, expirationMonth, expirationYear, securityNumber
			form_data.append('street', street);
			form_data.append('city', city);
			form_data.append('state', state);
			form_data.append('postalCode', postalCode);
			form_data.append('country', country);
			form_data.append('id', id);
			const token = localStorage.getItem('token');

			fetch(url, {
				method: 'POST',
				headers: {
					'x-auth-token': token,
				},
				body: form_data,
			}).then((res) => history.push('/dashboard/manage-shipping-address'));
		} catch (err) {
			errorHandler(
				err ? err : 'Something unexpected happened. Please try again later'
			);
		}
	};

	return (
		<div className='profile-form'>
			<div className='col-1-2'>
				<form className='account__form'>
					<h3 className='account__form-header'>Update Shipping Address</h3>
					<div className='form-control'>
						<label>Street</label>
						<input
							onChange={handleChangeLoginManager}
							type='text'
							id='street'
							value={street}
							placeholder='4 Yawkey Way'
						/>
					</div>
					<div className='form-control'>
						<label>City</label>
						<input
							onChange={handleChangeLoginManager}
							type='text'
							value={city}
							id='city'
							placeholder='Boston'
						/>
					</div>
					<div className='form-control'>
						<label>State</label>
						<input
							onChange={handleChangeLoginManager}
							type='text'
							id='state'
							value={state}
							placeholder='MA'
						/>
					</div>
					<div className='form-control'>
						<label>Postal Code</label>
						<input
							onChange={handleChangeLoginManager}
							type='text'
							id='postalCode'
							value={postalCode}
							placeholder='02225'
						/>
					</div>
					<div className='form-control'>
						<label>Country</label>
						<input
							onChange={handleChangeLoginManager}
							type='text'
							id='country'
							value={country}
							placeholder='USA'
						/>
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

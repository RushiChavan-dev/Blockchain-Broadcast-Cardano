import React, {useState} from 'react';
import {useHistory} from 'react-router-dom';
import '../PersonalInfoManager/ManagePersonalInfo.css';
import Notification from '../../Cart/UI/Notification';

export const NewShippingAddress = () => {
	const [street, setStreet] = useState('');
	const [city, setCity] = useState('');
	const [state, setState] = useState('');
	const [postalCode, setPostalCode] = useState('');
	const [country, setCountry] = useState('');

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
			case 'street':
				setStreet(e.target.value);
				break;
			case 'city':
				setCity(e.target.value);
				break;
			case 'state':
				setState(e.target.value);
				break;
			case 'postalCode':
				setPostalCode(e.target.value);
				break;
			case 'country':
				setCountry(e.target.value);
				break;
			default:
				break;
		}
	};

	const BlankValidation = () => {
		if (!street && !city && !state && !postalCode && !country) {
			throw 'At least 1 field is required';
		}
	};

	const cancelFunc = () => {
		history.push('/dashboard/manage-shipping-address');
	};

	const UpdateInfo = (e) => {
		e.preventDefault();
		try {
			BlankValidation();
			const form_data = new FormData();
			const url = '/.netlify/functions/add-shipping-address';

			form_data.append('street', street);
			form_data.append('city', city);
			form_data.append('state', state);
			form_data.append('postalCode', postalCode);
			form_data.append('country', country);
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
		<div>
			<div className='profile-form'>
				<div className='col-1-2'>
					<form className='account__form'>
						<h3 className='account__form-header'>Add New Shipping Address</h3>
						<div className='form-control'>
							<label htmlFor='name'>Street</label>
							<input
								id='street'
								type='text'
								placeholder='4 Yawkey Way'
								onChange={handleChangeLoginManager}
							/>
						</div>
						<div className='form-control'>
							<label>City</label>
							<input
								onChange={handleChangeLoginManager}
								type='text'
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
								placeholder='MA'
							/>
						</div>
						<div className='form-control'>
							<label>Postal Code</label>
							<input
								onChange={handleChangeLoginManager}
								type='text'
								id='postalCode'
								placeholder='XXXXX'
							/>
						</div>
						<div className='form-control'>
							<label style={{marginTop: '1rem'}}>Country</label>
							<input
								onChange={handleChangeLoginManager}
								type='text'
								id='country'
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
			</div>
			<Notification notify={notify} setNotify={setNotify} />
		</div>
	);
};

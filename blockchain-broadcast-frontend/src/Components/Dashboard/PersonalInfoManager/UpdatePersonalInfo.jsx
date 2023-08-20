import React, {useState, useEffect} from 'react';
import {useHistory} from 'react-router-dom';
import './ManagePersonalInfo.css';
import Notification from '../../Cart/UI/Notification';

export const UpdatePersonalInfo = () => {
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [nickname, setNickname] = useState('');
	const [homeAddress, setHomeAddress] = useState('');

	const [nameMod, setNameMod] = useState(false);
	const [emailMod, setEmailMod] = useState(false);
	const [nicknameMod, setNicknameMod] = useState(false);
	const [homeAddressMod, setHomeAddressMod] = useState(false);

	// Notification
	const [notify, setNotify] = useState({
		isOpen: false,
		message: '',
		type: '',
		typeStyle: '',
	});

	const getDataPay = async () => {
		const form_data = new FormData();
		const token = localStorage.getItem('token');
		const url = '/.netlify/functions/get-personal-info';

		try {
			const data = await fetch(url, {
				method: 'POST',
				headers: {
					'x-auth-token': token,
				},
				body: form_data,
			}).then((res) => res.json());
			setName(data.name);
			setEmail(data.email);
			setHomeAddress(data.homeAddress);
			setNickname(data.nickname);
		} catch (err) {
			errorHandler(
				err ? err : 'Something unexpected happened. Please try again later'
			);
		}
	};

	useEffect(() => {
		getDataPay();
	}, []);

	const errorHandler = (message) => {
		setNotify({
			isOpen: true,
			message: message || 'Sorry, there was an error. Plase try again later.',
			type: 'error',
			typeStyle: '',
		});
	};

	const history = useHistory();

	const BlankValidation = () => {
		if (!nameMod && !emailMod && !nicknameMod && !homeAddressMod) {
			throw "You didn't make any changes.";
		}
	};

	const handleChange = (e) => {
		switch (e.target.id) {
			case 'name':
				setName(e.target.value);
				setNameMod(true);
				break;
			case 'email':
				setEmail(e.target.value);
				setEmailMod(true);
				break;
			case 'nickname':
				setNickname(e.target.value);
				setNicknameMod(true);
				break;

			case 'homeAddress':
				setHomeAddressMod(true);
				setHomeAddress(e.target.value);
				break;

			default:
				break;
		}
	};

	const cancelFunc = () => {
		history.push('/dashboard');
	};

	const UpdateInfo = (e) => {
		e.preventDefault();
		try {
			BlankValidation();
			const url = '/.netlify/functions/update-personal-info';
			const form_data = new FormData();

			// name,email,nickname,home_address
			form_data.append('name', name);
			form_data.append('email', email);
			form_data.append('nickname', nickname);
			form_data.append('home_address', homeAddress);
			const token = localStorage.getItem('token');
			fetch(url, {
				method: 'POST',
				headers: {
					'x-auth-token': token,
				},
				body: form_data,
			}).then((res) => history.push('/dashboard'));
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
						<h3 className='account__form-header'>
							Update Personal Information
						</h3>
						<div className='form-control'>
							<label>Full Name</label>
							<input
								onChange={handleChange}
								id='name'
								type='text'
								value={name}
							/>
						</div>
						<div className='form-control'>
							<label>Email</label>
							<input
								onChange={handleChange}
								id='email'
								type='email'
								value={email}
							/>
						</div>
						<div className='form-control'>
							<label>Nickname</label>
							<input
								onChange={handleChange}
								id='nickname'
								type='text'
								value={nickname}
								// placeholder='Nickname'
							/>
						</div>
						<div className='form-control'>
							<label>Home Address</label>
							<input
								onChange={handleChange}
								id='homeAddress'
								type='text'
								value={homeAddress}
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
					</form>{' '}
				</div>
			</div>
			<Notification notify={notify} setNotify={setNotify} />
		</div>
	);
};

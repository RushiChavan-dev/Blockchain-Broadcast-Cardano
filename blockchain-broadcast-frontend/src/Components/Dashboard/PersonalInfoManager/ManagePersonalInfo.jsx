import React, {useState, useEffect} from 'react';
import './ManagePersonalInfo.css';
import {useHistory} from 'react-router-dom';
import Notification from '../../Cart/UI/Notification';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';

export const ManagePersonalInfo = () => {
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [nickname, setNickname] = useState('');
	const [homeAddress, setHomeAddress] = useState('');

	// Notification
	const [notify, setNotify] = useState({
		isOpen: false,
		message: '',
		type: '',
		typeStyle: '',
	});
	const history = useHistory();

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
			// err ? err : 
			console.log(err ? err : 'Something unexpected happened. Please try again later')
			errorHandler(
				'Something unexpected happened. Please try again later'
			);
		}
	};

	useEffect(() => {
		getDataPay();
	}, []);

	const errorHandler = (message) => {
		try {
			setNotify({
				isOpen: true,
				message: message || 'Sorry, there was an error. Plase try again later.',
				type: 'error',
				typeStyle: '',
			});
		} catch (error) {
			console.log(`Error is ${error}`)
		}
		
	};

	return (
		<div className='profile-form'>
			<div className='col-1-2'>
				<form className='account__form'>
					<div className='credit-card-compressed'>
						<h3 className='account__form-header inline-info-header'>
							Personal Information
							<div className='operation'>
								<EditOutlinedIcon
									fontSize='inherit'
									onClick={() => history.push('/dashboard/update-info')}
								/>
							</div>
						</h3>
					</div>
					<div className='divTable credit-card-compressed'>
						<div>
							<div className='inLine'>
								<b>Full Name: </b>
								<p>{name}</p>
							</div>
							<div className='inLine'>
								<b>Email: </b>
								<p>{email}</p>
							</div>
							<div className='inLine'>
								<b>Nickname: </b>
								<p>{nickname}</p>
							</div>

							{homeAddress && (
								<div className='inLine'>
									<b>Home Address: </b>
									<p>{homeAddress}</p>
								</div>
							)}
						</div>
					</div>
				</form>
			</div>
			<Notification notify={notify} setNotify={setNotify} />
		</div>
	);
};

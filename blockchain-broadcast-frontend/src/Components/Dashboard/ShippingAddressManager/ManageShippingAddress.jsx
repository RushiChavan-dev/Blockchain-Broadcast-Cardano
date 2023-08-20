import React, {useState, useEffect} from 'react';
import '../PersonalInfoManager/ManagePersonalInfo.css';
import '../CreditCardManager/ManageCreditCard.css';
import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import Notification from '../../Cart/UI/Notification';

export const ManageShippingAddress = () => {
	const [employees, setEmployees] = useState([]);
	const [deletedEmployee, setDeletedEmployee] = useState([]);

	useEffect(() => {
		getDataPay();
	}, [deletedEmployee]);

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

	const getDataPay = async () => {
		const form_data = new FormData();
		const token = localStorage.getItem('token');
		const url = '/.netlify/functions/get-shipping-info';

		try {
			const data = await fetch(url, {
				method: 'POST',
				headers: {
					'x-auth-token': token,
				},
				body: form_data,
			}).then((res) => res.json());
			setEmployees(data.shippingAddress);
		} catch (err) {
			errorHandler(
				err ? err : 'Something unexpected happened. Please try again later'
			);
		}
	};

	const removeData = async (cardNumber) => {
		const form_data = new FormData();
		form_data.append('id', cardNumber);
		const token = localStorage.getItem('token');
		const url = '/.netlify/functions/delete-shipping-address';
		const del = employees.filter(
			(employee) => cardNumber !== employee.cardNumber
		);
		try {
			await fetch(url, {
				method: 'POST',
				headers: {
					'x-auth-token': token,
				},
				body: form_data,
			}).then((res) => {
				res.json();
			});
			setDeletedEmployee(del);
			setEmployees(del);
		} catch (err) {
			errorHandler(
				err ? err : 'Something unexpected happened. Please try again later'
			);
		}
	};

	const updateData = (street, city, state, postalCode, country, _id) => {
		const data = {
			street,
			city,
			state,
			postalCode,
			country,
			_id,
		};
		localStorage.setItem('shippingAdress', JSON.stringify({data}));
		window.location = '/dashboard/updating-shipping-adress';
	};

	const CompactShipping = () => {
		return (
			employees &&
			employees.map(({street, city, state, postalCode, country, _id}, i) => {
				return (
					<div key={_id}>
						<div className='credit-card-compressed'>
							<div>
								<div className='inLine'>
									<b>Street: </b>
									<p>{street}</p>
								</div>
								<div className='inLine'>
									<b>City: </b>
									<p>{city}</p>
								</div>
								<div className='inLine'>
									<b>State: </b>
									<p>{state}</p>
								</div>
								<div className='inLine'>
									<b>Postal Code: </b>
									<p>{postalCode}</p>
								</div>

								<div className='inLine'>
									<b>Country: </b>
									<p>{country}</p>
								</div>
							</div>
							<div className='inline-buttons'>
								<div>
									<div className='operation'>
										<EditOutlinedIcon
											fontSize='inherit'
											onClick={() =>
												updateData(
													street,
													city,
													state,
													postalCode,
													country,
													_id
												)
											}
										/>
									</div>
								</div>
								<div>
									<div className='operation'>
										<ClearOutlinedIcon
											fontSize='inherit'
											onClick={() => removeData(_id)}
										/>
									</div>
								</div>
							</div>
						</div>
						{i < employees.length - 1 && <hr></hr>}
					</div>
				);
			})
		);
	};

	return (
		<div className='profile-form'>
			<div className='col-1-2'>
				<form className='account__form'>
					<h3 className='account__form-header'>Manage Shipping Address</h3>
					{(employees || []).length > 0 ? (
						<div className='form-control'>
							<CompactShipping />
						</div>
					) : (
						<p>
							You haven't added any shipping address. If you add a new shipping
							address it will appear here.
						</p>
					)}
				</form>
			</div>
			<Notification notify={notify} setNotify={setNotify} />
		</div>
	);
};

import React, {useState} from 'react';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';
import AddCardOutlinedIcon from '@mui/icons-material/AddCardOutlined';
import CreditCardOutlinedIcon from '@mui/icons-material/CreditCardOutlined';
import VpnKeyOutlinedIcon from '@mui/icons-material/VpnKeyOutlined';
import CreditScoreOutlinedIcon from '@mui/icons-material/CreditScoreOutlined';
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import RemoveOutlinedIcon from '@mui/icons-material/RemoveOutlined';
import {SideBarLayOut} from './SideBarLayOut';
import './SideBar.css';
import {Link} from 'react-router-dom';
import {useLocation} from 'react-router-dom';

export const SideBar = () => {
	const location = useLocation();
	const path = location.pathname;

	const [isCreditCardMenuOpened, setIsCreditCardMenuOpened] = useState(
		path === '/dashboard/add-new-credit-card' ||
			path === '/dashboard/manage-credit-card'
	);
	const [isShippingMenuOpened, setIsShippingMenuOpened] = useState(
		path === '/dashboard/add-new-shipping-address' ||
			path === '/dashboard/manage-shipping-address'
	);

	const [isPersonalInfoMenuOpened, setIsPersonalInfoMenuOpened] = useState(
		path === '/dashboard/update-info' || '/dashboard'
	);

	const OpenCreditCardMenu = () => {
		setIsCreditCardMenuOpened(!isCreditCardMenuOpened);
		setIsShippingMenuOpened(false);
		setIsPersonalInfoMenuOpened(false);
	};
	const OpenShippingMenu = () => {
		setIsShippingMenuOpened(!isShippingMenuOpened);
		setIsCreditCardMenuOpened(false);
		setIsPersonalInfoMenuOpened(false);
	};
	const OpenLoggingMenu = () => {
		setIsCreditCardMenuOpened(false);
		setIsPersonalInfoMenuOpened(false);
		setIsShippingMenuOpened(false);
	};
	const OpenPersonalInfoMenu = () => {
		setIsPersonalInfoMenuOpened(!isPersonalInfoMenuOpened);
		setIsCreditCardMenuOpened(false);
		setIsShippingMenuOpened(false);
	};
	return (
		<div className='sidebar'>
			<div
				className={`${isPersonalInfoMenuOpened && 'selected-menu'}`}
				onClick={OpenPersonalInfoMenu}
			>
				<Link to='/dashboard' className='sidebar-icon'>
					<SideBarLayOut
						Icon={BadgeOutlinedIcon}
						text={`Manage Personal Information`}
					/>
					{/* We give the key(Icon) and the value(PersonPin..) + text with the text that will be showed  */}{' '}
				</Link>
			</div>

			<div
				className={`credit-menu-option ${
					isCreditCardMenuOpened && 'selected-menu'
				}`}
				onClick={OpenCreditCardMenu}
			>
				<Link to='/dashboard/manage-credit-card' className='sidebar-icon'>
					<SideBarLayOut
						Icon={CreditCardOutlinedIcon}
						text={`Manage Credit Card Information`}
					/>
				</Link>
				{isCreditCardMenuOpened && (
					<div className='credit-card-menu'>
						<Link to='/dashboard/add-new-credit-card'>
							<div className='account-menu-option sidebar-icon'>
								{' '}
								<AddOutlinedIcon fontSize='inherit' />
								<h4>Add New Credit Card</h4>
							</div>
						</Link>
					</div>
				)}{' '}
			</div>
			<div
				className={`shipping-menu-option ${
					isShippingMenuOpened && 'selected-menu'
				}`}
				onClick={OpenShippingMenu}
			>
				<Link to='/dashboard/manage-shipping-address' className='sidebar-icon'>
					<SideBarLayOut
						Icon={LocalShippingOutlinedIcon}
						text={`Manage Shipping Addresses`}
					/>
				</Link>
				{!isShippingMenuOpened ? null : (
					<div className='shipping-menu'>
						<Link
							to='/dashboard/add-new-shipping-address'
							className='Router__link'
						>
							<div className='account-menu-option sidebar-icon'>
								{' '}
								<AddOutlinedIcon fontSize='inherit' />
								<h4>Add New Shipping Address</h4>
							</div>
						</Link>
					</div>
				)}{' '}
			</div>
		</div>
	);
};

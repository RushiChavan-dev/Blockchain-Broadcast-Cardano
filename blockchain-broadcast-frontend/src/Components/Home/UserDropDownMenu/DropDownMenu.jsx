import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import './DropDownMenu.css';
import {useHistory} from 'react-router-dom';

export const DropDownMenu = () => {
	const SignOut = () => {
		localStorage.removeItem('token');
		window.location = '/';
	};
	const history = useHistory();

	const goToDashboard = () => {
		history.push('/dashboard');
	};

	return (
		<div className='drop-down-menu'>
			<div className='menu-option' onClick={goToDashboard}>
				<DashboardOutlinedIcon />
				<h3 className='menu-text'>Manage Account</h3>
			</div>

			<div className='menu-option' onClick={SignOut}>
				<ExitToAppIcon />
				<h3 className='menu-text'>Logout</h3>
			</div>
		</div>
	);
};


import React, { useState, useEffect, useContext } from "react";
import TextLogo from '../../../Assets/text-logo.png';
import IconLogo from '../../../Assets/icon-logo.png';
import './Navigation.css';
import {Link} from 'react-router-dom';
import Popup from 'reactjs-popup';
// import 'reactjs-popup/dist/index.css';
import {DropDownMenu} from '../UserDropDownMenu/DropDownMenu';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import SearchIcon from '@mui/icons-material/Search';
import PermIdentityIcon from '@mui/icons-material/PermIdentity';
import CartIcon from '../../Cart/CartIcon/CartIcon';
import { Lucid, Blockfrost } from "lucid-cardano";
import { LucidContext } from '../../../helper/LucidContext';
import ListAltIcon from '@material-ui/icons/ListAlt';



export const Navigation = () => {
	const token = localStorage.getItem('token') || false;

	
    const [walletAddress, setWalletAddress] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const lucid = useContext(LucidContext);

	const connectWallet = async () => {
        try {
            if (!lucid) {
                throw new Error("Lucid instance not available");
            }
            const api = await window.cardano.nami.enable();
            lucid.selectWallet(api);
            // assuming api contains the wallet's address
            const address = await lucid.wallet.address();
            setWalletAddress(address);
        } catch (err) {
            // if there's an error, store the error message
            setErrorMessage(err.message);
        }
    };

	useEffect(() => {
		if (lucid) {
			connectWallet();
		}
	}, [lucid]); 
	
	const truncateAddress = (address) => {
		if (address.length > 9) {
			return address.slice(0, 4) + "..." + address.slice(-5);
		}
		return address;
	};
	
{/* <img className='logo icon-logo' src={IconLogo} alt='logo' /> */}

	return (
		<div className='nav nav-top'>
			<div className='nav-left' >
				<Link to='/' className='Router_Link'>
					<img className='logo text-logo' src={TextLogo} alt='logo' />
					<img className='logo icon-logo' src={IconLogo} alt='logo' />
				</Link>
			</div>

			<div className='nav-right'>
			{/* {walletAddress ? 
                    <p disabled>Connected: {truncateAddress(walletAddress)}</p>					: 
                    <button onClick={connectWallet}>Connect to Wallet</button>
                } */}

{walletAddress ? 
    <p className="rounded-blue-btn" disabled>Connected: {truncateAddress(walletAddress)}</p>
    : 
    <button className="rounded-blue-btn" onClick={connectWallet}>Connect to Wallet</button>
}




				<div className='nav-link'>
					<Link to='/browse' className='Router_Link'>
						<SearchIcon />
						<h4 className='links inlineheader'>View Books</h4>
					</Link>
				</div>

				<div className='nav-link'>
					{!token ? (
						<Link to='/auth' className='Router_Link'>
							<PermIdentityIcon />
							<h4 className='links inlineheader'>Sign In</h4>
						</Link>
					) : (
						<Popup
							trigger={
								<div className='Router_Link'>
									<PermIdentityIcon />
									<h4 className='links inlineheader'>My Account</h4>
								</div>
							}
							position='bottom center'
							on='hover'
							arrow={false}
						>
							<DropDownMenu />
						</Popup>
					)}
				</div>

				<div className='nav-link'>
					<Link to='/order' className='Router_Link'>
						<ListAltIcon />
						<h4 className='links inlineheader'>My Orders</h4>
					</Link>
				</div>


				<div className='nav-link'>
					<Link to='/wishlist' className='Router_Link'>
						<FavoriteBorderIcon/>
						<h4 className='links inlineheader'>Wishlist</h4>
					</Link>
				</div>

				<div className='nav-right-cart nav-link'>
					<Link to='/cart' className='Router_Link'>
						<CartIcon />
					</Link>
				</div>
			</div>
		</div>
	);
};

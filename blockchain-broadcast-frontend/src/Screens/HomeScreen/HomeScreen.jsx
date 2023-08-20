
import React, { useState, useEffect, useContext } from "react";
import { Lucid, Blockfrost } from "lucid-cardano";
import './HomeScreen.css';
import {Link} from 'react-router-dom';
import GenreCategories from '../../Components/GenreCategories/GenreCategories';
import { LucidContext } from '../../helper/LucidContext';


const HomeScreen = () => {

    // const [walletAddress, setWalletAddress] = useState(null);
    // const [errorMessage, setErrorMessage] = useState('');
    // const lucid = useContext(LucidContext);



	// const connectWallet = async () => {
	// 	console.log("Attempting to connect to wallet...");
	// 	try {
	// 		if (!lucid) {
				
	// 			throw new Error("Lucid instance not available");
	// 		}
	// 		const api = await window.cardano.nami.enable();
	// 		console.log("API response:", api);
	
	// 		lucid.selectWallet(api);
	
	// 		const address = await lucid.wallet.address();
	// 		console.log("Address:", address);
	// 		setWalletAddress(address);
	// 	} catch (err) {
	// 		console.error("Error while connecting:", err);
	// 		setErrorMessage(err.message);
	// 	}
	// };
	


	return (
		<div>
			<div className="homepage">
				
		

			</div>
			<div id='home'>
				<Link to='/auth'>
					<div id='fixed-height-1'>
						<p>
							Not registered? Sign up now for a faster checkout and more perks!
						</p>
					</div>
				</Link>
				<div id='fixed-height-2'>
					<p>Free Shipping on Orders of $40 or More</p>
				</div>
				<div
					id='remaining-height'
					onClick={(event) => (window.location.href = '/browse')}
				>
					<h3 className='banner-text-header'>Check out our top picks</h3>
					<Link to='/browse'>
						<div className='banner-button'>
							<button className='btn btn-dark'>Shop Now</button>
						</div>
					</Link>
				</div>
				<GenreCategories />
			</div>
			
		</div>
	);
	
};

export default HomeScreen;

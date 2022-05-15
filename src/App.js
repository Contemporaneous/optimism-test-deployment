import React, { useEffect, useState } from 'react';
import './styles/App.css';
import twitterLogo from './assets/twitter-logo.svg';
import {ethers} from "ethers";
import contractABI from './utils/contractABI.json';
import { networks } from './utils/networks';
import ethLogo from './assets/ethlogo.png';



// Constants
const TWITTER_HANDLE = 'chainedgandalf';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;


const App = () => {

	//State Varriables
	const [currentAccount, setCurrentAccount] = useState('');
	const [domain, setDomain] = useState('');
	const [favFood, setFavFood] = useState('');
	const [favPark, setFavPark] = useState('');
	const [network, setNetwork] = useState('');
	const [editing, setEditing] = useState(false);
	const [loading, setLoading] = useState(false);
	const [mints, setMints] = useState([]);

	const CONTRACT_ADDRESS = '0xC73FB11d346dc39fCAc7afc59aE13EF5eb077528';

	// Connect Waller
	const connectWallet = async () => {
		try {
			const { ethereum } = window;

			if (!ethereum) {
				alert("Get MetaMask -> https://metamask.io/");
				return;
			}

			// Fancy method to request access to account.
			const accounts = await ethereum.request({ method: "eth_requestAccounts" });
		
			// Boom! This should print out public address once we authorize Metamask.
			console.log("Connected", accounts[0]);
			setCurrentAccount(accounts[0]);
		} catch (error) {
			console.log(error)
		}
	}

	// Gotta make sure this is async.
	const checkIfWalletIsConnected = async () => {
		// First make sure we have access to window.ethereum
		const { ethereum } = window;

		if (!ethereum) {
			console.log("Make sure you have MetaMask!");
			return;
		} else {
			console.log("We have the ethereum object", ethereum);
		}

		const accounts = await ethereum.request({ method: 'eth_accounts' });

		// Users can have multiple authorized accounts, we grab the first one if its there!
		if (accounts.length !== 0) {
			const account = accounts[0];
			console.log('Found an authorized account:', account);
			setCurrentAccount(account);
		} else {
			console.log('No authorized account found');
		}

		const chainId = await ethereum.request({ method: 'eth_chainId' });
		setNetwork(networks[chainId]);

		ethereum.on('chainChanged', handleChainChanged);

		function handleChainChanged(_chainId) {
			window.location.reload();
		}
	};

	//Switch networks
	const switchNetwork = async () => {
		if (window.ethereum) {
			try {
				// Try to switch to the Optimism testnet
				await window.ethereum.request({
					method: 'wallet_switchEthereumChain',
					params: [{ chainId: '0x45' }], // Check networks.js for hexadecimal network ids
				});
			} catch (error) {
				// This error code means that the chain we want has not been added to MetaMask
				// In this case we ask the user to add it to their MetaMask
				if (error.code === 4902) {
					try {
						await window.ethereum.request({
							method: 'wallet_addKovanChain',
							params: [
								{	
									chainId: '0x45',
									chainName: 'Optimistic Kovan',
									rpcUrls: ['https://kovan.optimism.io/'],
									nativeCurrency: {
											name: "Optimistic Ethereum",
											symbol: "ETH",
											decimals: 18
									},
									blockExplorerUrls: ["https://kovan-optimistic.etherscan.io"]
								},
							],
						});
					} catch (error) {
						console.log(error);
					}
				}
				console.log(error);
			}
		} else {
			// If window.ethereum is not found then MetaMask is not installed
			alert('MetaMask is not installed. Please install it to use this app: https://metamask.io/download.html');
		} 
	}


	// Create a function to render if wallet is not connected yet
	const renderNotConnectedContainer = () => (
		<div className="connect-wallet-container">
			<img src="https://media.giphy.com/media/cMso9wDwqSy3e/giphy.gif" alt="Goat gif" />
			<button onClick={connectWallet} className="cta-button connect-wallet-button">
				Connect Wallet
			</button>
		</div>
  	);


	// useEffects 
	useEffect(() => {
		checkIfWalletIsConnected();
	}, [])

	useEffect(() => {
		if (network === 'Optimistic Kovan') {
			//fetchMints();
		}
	}, [currentAccount, network]);



 	return (
		<div className="App">
			<div className="container">

				<div className="header-container">
					<header>
            			<div className="left">
              				<p className="title"> 🐐Pay It Forward</p>
              				<p className="subtitle">Pay Some, get Some!</p>
            			</div>
						{/* Display a logo and wallet connection status*/}
						<div className="right">
							<img alt="Network logo" className="logo" src={ethLogo} />
							{ currentAccount ? <p> Wallet: {currentAccount.slice(0, 6)}...{currentAccount.slice(-4)} </p> : <p> Not connected </p> }
						</div>
					</header>
				</div>

				{/* Add your render method here */}
				{!currentAccount && renderNotConnectedContainer()}
			
				<div className="footer-container">
					<img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
						<a
							className="footer-text"
							href={TWITTER_LINK}
							target="_blank"
							rel="noreferrer"
						>{`built by @${TWITTER_HANDLE}`}</a>
				</div>
			</div>
		</div>
	);
}

export default App;

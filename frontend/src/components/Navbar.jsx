import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { tokenAbi } from '../contractArtifacts/addresses';
import { tokenAddress } from '../contractArtifacts/addresses';
const ethers = require('ethers');

const Navbar = () => {

  const [userBalance, setUserBalance] = useState(0);

  const address = tokenAddress;



  // const url = 'https://rpc.sepolia-api.lisk.com';
  // const provider = new ethers.providers.JsonRpcProvider(url);
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const loggedInUser = signer.getAddress();
  const contract = new ethers.Contract(address, tokenAbi, provider);

  const fetchbalance = async () => {
    const balance = await contract.balanceOf(loggedInUser);
    setUserBalance(balance.toString());
    console.log("This user's balance is", balance.toString());
  }

  useEffect(() => {
    fetchbalance();
  }, []);

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <h1 className="logo">LiskLancer</h1>
        <ul className="nav-links">
          <li>
            <Link to="/">
            Home
            </Link>
          </li>
          <li>
            <Link to="/mygigs">
            My Gigs
            </Link>
          </li>
          <li>Balance: {userBalance.toString()}</li>
        </ul>
      </div>
      <div className="navbar-right">
        <ConnectButton />
      </div>
    </nav>
  );
}

export default Navbar
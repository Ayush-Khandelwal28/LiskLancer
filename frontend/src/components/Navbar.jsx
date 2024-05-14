import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { tokenAbi } from '../contractArtifacts/addresses';
import { Routes, Route, Link as RouterLink } from "react-router-dom";
const ethers = require('ethers');

const Navbar = () => {

  const [userBalance, setUserBalance] = useState(0);

  const address = '0x0a9DCF8017F637B23e96c79Ac0261FB83fB0Df45';



  const url = 'https://rpc.sepolia-api.lisk.com';
  const provider = new ethers.providers.JsonRpcProvider(url);
  const contract = new ethers.Contract(address, tokenAbi, provider);

  const fetchbalance = async () => {
    const balance = await contract.balanceOf('0xe658fD80111E460D5b58FaB6fe0F18F81ee2CBe1');
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
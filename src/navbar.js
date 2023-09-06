/*
    Moshe Dego 315044511
    Omri Elbaz 315006635
*/
import React from 'react';
import './navbar.css';
import AppLogo from './costManagerLogo.avif';
import {Link} from "react-router-dom";

const Navbar = () => {
    return (
        <nav className="navbar">
            <a className="backHome" href="/">
                <img className={"logo"} src={AppLogo} alt={"logo"}/>
            </a>

            <div className="links_container">
                <Link to="/report" className="links">Report</Link>
                <Link to="/" className="links">Home</Link>
            </div>
        </nav>
    );
}

export default Navbar;
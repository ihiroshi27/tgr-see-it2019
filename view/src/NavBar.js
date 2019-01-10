import React, { Component, Nav } from 'react';
import { NavLink } from 'react-router-dom';

import './NavBar.css';

const PUBLIC_URL = process.env.PUBLIC_URL;

class Navbar extends React.Component {
    render() {
        return (
            <div id="navbar">
                <div className="logo">
                    See-It2019
                </div>
                <div className="section">
                    <NavLink className="link" activeClassName="active" exact to="/"><img src={ PUBLIC_URL + "/dashboard-icon.png" } />Dashboard</NavLink>
                    <NavLink className="link" activeClassName="active" exact to="/beacon"><img src={ PUBLIC_URL + "/line-beacon.png" } />Line Beacon</NavLink>
                    <NavLink className="link" activeClassName="active" exact to="/lora"><img src={ PUBLIC_URL + "/lora-icon.png" } />LoRa</NavLink>
                </div>
            </div>
        );
    }
}

export default Navbar;
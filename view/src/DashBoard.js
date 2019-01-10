import React, { Component, Nav } from 'react';
import { NavLink } from 'react-router-dom';

import './DashBoard.css';

class DashBoard extends React.Component {
    render() {
        return (
            <div id="dashboard">
                <div className="section">
                    <div className="status">
                        <div style={{ backgroundColor: '#d8483d'}}><i className="fas fa-thermometer-empty"></i>32<span className="type">°C</span></div>
                        <div style={{ backgroundColor: '#23305e'}}><i className="fas fa-tint"></i>30<span className="type">%</span></div>
                        <div style={{ backgroundColor: 'rgb(123, 183, 6)'}}><i className="fas fa-user"></i>30<span className="type">Enter</span></div>
                        <div style={{ backgroundColor: 'rgb(255, 141, 0)'}}><i className="fas fa-user"></i>50<span className="type">Leav</span></div>
                    </div>
                </div>
            </div>
        );
    }
}

export default DashBoard;
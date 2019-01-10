import React, { Component, Nav } from 'react';
import { NavLink } from 'react-router-dom';

import './DashBoard.css';

class DashBoard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            temperature: 0,
            humidity: 0,
            peopleIn: 0,
            peopleOut: 0
        }
    }
    componentDidMount() {
        var ws = new WebSocket("ws://localhost:8080");
        ws.onopen = () => {
            ws.send("Connected");
        }
        ws.onmessage = evt => { 
            let data = evt.data;
            let json = JSON.parse(data);
            this.setState({
                temperature: json.sensor.temperature,
                humidity: json.sensor.humidity,
                peopleIn: json.sensor.peopleIn,
                peopleOut: json.sensor.peopleOut
            });
        };
    }
    render() {
        return (
            <div id="dashboard">
                <div className="section">
                    <div className="status">
                        <div style={{ backgroundColor: '#d8483d'}}>
                                <i className="fas fa-thermometer-quarter"></i>{ this.state.temperature }<span className="type">%</span>
                        </div>
                        <div style={{ backgroundColor: '#23305e'}}>
                            <i className="fas fa-tint"></i>{ this.state.humidity }<span className="type">%</span>
                        </div>
                        <div style={{ backgroundColor: 'rgb(123, 183, 6)'}}>
                            <i className="fas fa-user"></i>{ this.state.peopleIn }<span className="type">Enter</span>
                        </div>
                        <div style={{ backgroundColor: 'rgb(255, 141, 0)'}}>
                            <i className="fas fa-user"></i>{ this.state.peopleOut }<span className="type">Leav</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default DashBoard;
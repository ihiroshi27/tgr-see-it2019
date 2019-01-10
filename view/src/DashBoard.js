import React, { Component, Nav } from 'react';
import { NavLink } from 'react-router-dom';

import './DashBoard.css';

const URL = process.env.REACT_APP_SERVER;

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
        var ws = new WebSocket("ws://" + URL + ":8080");
        ws.onopen = () => {
            ws.send("Connected");
        }
        ws.onmessage = evt => { 
            let data = evt.data;
            let json = JSON.parse(data);
            switch(json.type) {
                case 'lora':
                    this.setState({
                        temperature: json.results.sensor.temperature,
                        humidity: json.results.sensor.humidity,
                        peopleIn: json.results.sensor.peopleIn,
                        peopleOut: json.results.sensor.peopleOut
                    });
                    break;
                case 'beacon':
                    var html = this.beacon.innerHTML;
                    if (html === '<div>Waiting for activity</div>') html = "";

                    var icon;
                    var status;
                    switch(json.results.status) {
                        case 'enter':
                            icon = '<i class="fas fa-walking"></i>';
                            status = '<span style="color: rgb(123, 183, 6)">enter</span>';
                            break;
                        case 'leave':
                            icon = '<i class="fas fa-walking" style="transform: scaleX(-1)"></i>'
                            status = '<span style="color: rgb(216, 72, 61)">leave</span>';
                            break;
                    }
                    var newHTML = '<div>' + icon + json.results.userID + ' has <span class="bold">' + status + '</span> at ' + json.results.datetime + ', current <span class="bold">' + json.results.tourists + '</span> users.</div>' + html;
                    this.beacon.innerHTML = newHTML;
                    break;
            }
        };
    }
    clearTourist = () => {

    }
    render() {
        return (
            <div id="dashboard">
                <div className="section">
                    <div className="lora">
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
                            <i className="fas fa-user"></i>{ this.state.peopleOut }<span className="type">Leave</span>
                        </div>
                    </div>
                </div>
                <div className="section">
                    <div className="activity">
                       <div className="title">Beacon Activities</div>
                       <div className="body" ref={ div => this.beacon = div }><div>Waiting for activity</div></div>
                    </div>
                </div>
            </div>
        );
    }
}

export default DashBoard;
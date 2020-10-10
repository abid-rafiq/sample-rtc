import React from 'react';
import logo from './logo.svg';
import './App.css';

import io from 'socket.io-client';

class App extends React.Component {
  socketIO = null;
  apiURL = 'http://54.36.109.50/NodeJSSocket';
  scktOption = {
    path: this.apiURL,
    query: {
      scrope: "doctor",
    },
  }
  constructor(props) {
    super(props);
    this.state = { fmValue: '', doctors: [] };
  }

  componentDidMount() {
    this.socketIO = io(this.scktOption);
    console.log(this.socketIO.connected);

    this.handleSocketEvents();
    this.getDoctors();
  }

  getDoctors() {
    var xhr = new XMLHttpRequest();
    xhr.addEventListener('load', (event) => {
      // update the state of the component with the result here
      console.log(xhr.responseText, event);
      this.setState({ doctors: JSON.parse(xhr.responseText) });
    })
    // open the request with the verb and the url
    xhr.open('GET', this.apiURL + '/get-doctors')
    // send the request
    xhr.send();
  }

  handleSocketEvents() {
    this.socketIO.on('connect', () => {
      console.log(this.socketIO.connected); // true
    });

    this.socketIO.on('disconnect', () => {
      console.log(this.socketIO.connected); // false
    });

    this.socketIO.on('reconnect', () => {
      console.log('App Reconnected'); // false
    });

    this.socketIO.on('reconnecting', () => {
      console.log('App Reconnecting'); // false
    });

    this.socketIO.on('doctors-list', (doctorsList) => {
      console.log('App Reconnecting'); // false
      if (doctorsList) {
        this.setState({ doctors: JSON.parse(doctorsList) });
      }
    });

    this.socketIO.on('doctors-list', (doctorsList) => {
      console.log('App Reconnecting'); // false
      if (doctorsList) {
        this.setState({ doctors: JSON.parse(doctorsList) });
      }
    });
  }

  handleChange(event) {
    this.setState({ fmValue: event.target.value });
  }

  sendEmit(event) {
    event.preventDefault();
    this.socketIO.emit('message', this.state.fmValue);
  }

  render() {
    console.log(this.state.doctors);
    return (
      <div className="App">


        <ul>
          {this.state.doctors.map((answer, i) => {     
           console.log("Entered");                 
           // Return the element. Also pass key     
           return (<li key={i}>{`${answer.DoctorName} - Availabe: ${answer.IsAvailable ? "Yes" : "No"}`}</li>) 
        })}
        </ul>

        <form>
          <input id="m" value={this.state.fmValue} onChange={this.handleChange.bind(this)} />
          <button onClick={this.sendEmit.bind(this)}>Send</button>
        </form>

      </div>
    );
  }
}

export default App;

import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import 'bootstrap/dist/css/bootstrap.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

var mqtt = require('mqtt')
var client  = mqtt.connect('ws://test.mosquitto.org:8080/mqtt')

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();

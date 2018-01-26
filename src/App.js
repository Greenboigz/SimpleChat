import React, { Component } from 'react';
import './App.css';
import { Modal, FormGroup, FormControl, ControlLabel, HelpBlock, Button } from 'react-bootstrap';
import Chat from './Chat.jsx';

class App extends Component {

  constructor(props) {
    super(props);

    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleIconChange = this.handleIconChange.bind(this);
    this.handleClose = this.handleClose.bind(this);

    const self = this;

    this.state = {
      username: localStorage.username || "",
      iconUrl: localStorage.iconUrl || "",
      iconValidState: (localStorage.iconUrl) ? "loading" : "",
      show: true
    }
    testImage(localStorage.iconUrl)
      .then((result) => {
        self.setState({
          iconValidState: "success"
        })
      })
      .catch((error) => {
        self.setState({
          iconValidState: "error"
        })
      });
  }

  handleNameChange(event) {
    this.setState({
      username: event.target.value
    });
  }

  handleIconChange(event) {
    const self = this;
    testImage(event.target.value)
      .then((result) => {
        self.setState({
          iconValidState: "success"
        })
      })
      .catch((error) => {
        self.setState({
          iconValidState: "error"
        })
      });
    this.setState({
      iconUrl: event.target.value,
      iconValidState: "loading"
    });
  }

  getNameValidationState() {
    const length = this.state.username.length;
		if (length > 10) return 'success';
		else if (length > 5) return 'warning';
		else if (length > 0) return 'error';
		return null;
  }

  getIconValidationState() {
    const iconValidState = this.state.iconValidState;
    if (iconValidState === 'timeout') return 'error';
    else if (iconValidState === 'loading') return 'warning'
		else return iconValidState;
  }

  isValid() {
    if ((this.getNameValidationState() === 'success' || this.getNameValidationState() === 'warning') && this.getIconValidationState() === 'success') {
      return true
    } else return false;
  }

  handleClose(event) {
    event.preventDefault();

    localStorage.username = this.state.username;
    localStorage.iconUrl = this.state.iconUrl;

    this.setState({
      show: false
    });
  }

  render() {
    return (
      <div className="App">
        <Modal show={this.state.show}>
          <form onSubmit={this.handleClose}>
            <Modal.Header>
              <Modal.Title>What's Your Name?</Modal.Title>
            </Modal.Header>
            <Modal.Body>
      				<FormGroup controlId="userusername" validationState={this.getNameValidationState()}>
      					<ControlLabel>Enter your username below</ControlLabel>
      					<FormControl type="text" value={this.state.username} placeholder="Barack Obama" onChange={ this.handleNameChange } />
      					<FormControl.Feedback />
      					<HelpBlock>Names must be longer than 5 characters.</HelpBlock>
      				</FormGroup>
              <FormGroup controlId="iconUrl" validationState={this.getIconValidationState()}>
      					<ControlLabel>Give yourself an icon</ControlLabel>
      					<FormControl type="text" value={this.state.iconUrl} placeholder="http://simpleicon.com/wp-content/uploads/smile.png"
                  onChange={this.handleIconChange} />
      					<FormControl.Feedback />
      					<HelpBlock>The link must be of an image.</HelpBlock>
      				</FormGroup>
            </Modal.Body>
            <Modal.Footer>
              <Button type="submit" disabled={!this.isValid()}>Submit</Button>
            </Modal.Footer>
          </form>
        </Modal>
        <div className="center" style={{ padding: 20, height: "100%" }}>
          <Chat chatname={window.location.pathname.split('/')[1]} username={this.state.username} iconUrl={this.state.iconUrl} />
        </div>
      </div>
    );
  }

}

function testImage(url, timeoutT) {
  return new Promise(function (resolve, reject) {
    var timeout = timeoutT || 5000;
    var timer, img = new Image();
    img.onerror = img.onabort = function () {
      clearTimeout(timer);
      reject("error");
    };
    img.onload = function () {
      clearTimeout(timer);
      resolve("success");
    };
    timer = setTimeout(function () {
      // reset .src to invalid URL so it stops previous
      // loading, but doesn't trigger new load
      img.src = "//!!!!/test.jpg";
      reject("timeout");
    }, timeout);
    img.src = url;
  });
}

export default App;

import React, { Component } from 'react';
import './App.css';
import { Modal, FormGroup, FormControl, ControlLabel, HelpBlock, Button } from 'react-bootstrap';
import Chat from './Chat.jsx';

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      name: "",
      show: true
    }
  }

  handleChange(event) {
    this.setState({
      name: event.target.value
    });
  }

  getValidationState() {
    const length = this.state.name.length;
		if (length > 10) return 'success';
		else if (length > 5) return 'warning';
		else if (length > 0) return 'error';
		return null;
  }

  handleClose() {
    this.setState({
      show: false
    });
  }

  render() {
    return (
      <div className="App">
        <Modal show={this.state.show}>
          <form onSubmit={(event) => { event.preventDefault(); this.handleClose(); }}>
            <Modal.Header>
              <Modal.Title>What's Your Name</Modal.Title>
            </Modal.Header>
            <Modal.Body>
      				<FormGroup controlId="formBasicText" validationState={this.getValidationState()}>
      					<ControlLabel>Working example with validation</ControlLabel>
      					<FormControl type="text" value={this.state.name} placeholder="Enter text" onChange={(event) => { this.handleChange(event) }} />
      					<FormControl.Feedback />
      					<HelpBlock>Validation is based on string length.</HelpBlock>
      				</FormGroup>
            </Modal.Body>
            <Modal.Footer>
              <Button type="submit" disabled={this.getValidationState() !== "warning" && this.getValidationState() !== "success"}>Submit</Button>
            </Modal.Footer>
          </form>
        </Modal>
        <div className="center" style={{ padding: 20, height: "100%" }}>
          <Chat chatname="My Favorite Chat Party" name={this.state.name} />
        </div>
      </div>
    );
  }

}

export default App;

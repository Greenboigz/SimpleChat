import React, { Component } from 'react';
import { Panel, FormControl } from 'react-bootstrap';
import Message from './Message.jsx';
import ReactDOM from 'react-dom';

class Chat extends Component {

  constructor({ chatname, name, props }) {
    super(props);

    console.log(name);

    this.state = {
      chatname: chatname,
      username: name,
      curMessage: "",
      messages: [
        {
          name: "Sam Greenberg",
          body: "Hello?",
          timestamp: Date.now() - 10000
        },
        {
          name: "Tom Ficcadenti",
          body: "Hey, what's good friend?",
          timestamp: Date.now() - 5000
        },
        {
          name: "Sam Greenberg",
          body: "I just got this thing working, so everything!",
          timestamp: Date.now()
        },
      ]
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      username: nextProps.name
    });
  }

  setCurMessage(message) {
    if (message !== "\n")
      this.setState({curMessage: message});
  }

  handleKeyDown(event) {
    if(event.keyCode === 13 && event.shiftKey === false) {
      this.sendMessage();
    }
  }

  sendMessage() {
    if (this.state.curMessage !== "") {
      let messages = [...this.state.messages];
      messages.push({
        name: this.state.username,
        body: this.state.curMessage,
        timestamp: Date.now()
      });

      this.setState({messages, curMessage: ""});
    }
  }

  componentDidMount() {
    // Scroll to the bottom on initialization
    var len = this.state.messages.length - 1;
    const node = ReactDOM.findDOMNode(this['_div' + len]);
    if (node) {
      node.scrollIntoView();
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.messages.length !== this.state.messages.length) {
      // Scroll as new elements come along
      var len = this.state.messages.length - 1;
      const node = ReactDOM.findDOMNode(this['_div' + len]);
      if (node) {
        node.scrollIntoView();
      }
    }
  }

  getAlign(name) {
    return (name !== this.state.username) ? "left" : "right";
  }

  render() {
    return (
      <Panel bsStyle="primary" style={{ width: "100%", maxWidth: 800, height:"100%"}}>
        <Panel.Heading>
          <h2>{this.state.chatname}</h2>
        </Panel.Heading>
        <Panel.Body className="scrollable" style={{ height: 300 }}>
          { this.state.messages.map((message, i) => { return <Message message={message} align={this.getAlign(message.name)} key={i} ref={(ref) => this['_div' + i] = ref} />; }) }
        </Panel.Body>
        <Panel.Footer>
          <FormControl componentClass="textarea"
            className="messages"
            onChange={(event) => {this.setCurMessage(event.target.value)}}
            onKeyDown={(event) => {this.handleKeyDown(event)}}
            onSubmit={() => {this.sendMessage()}}
            value={this.state.curMessage}
            style={{ height: 100 }}
            placeholder="Write a message here" />
        </Panel.Footer>
      </Panel>
    );
  }

}

export default Chat;
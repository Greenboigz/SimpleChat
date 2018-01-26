import React, { Component } from 'react';
import { Panel, FormControl, Button } from 'react-bootstrap';
import { Editor } from 'react-draft-wysiwyg';
import { EditorState, convertToRaw, convertFromRaw, ContentState } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import Message from './Message.jsx';
import ReactDOM from 'react-dom';
import mqtt from 'mqtt';

class Chat extends Component {

  constructor({ chatname, username, iconUrl, props }) {
    super(props);

    this.state = {
      loading: true,
      chatname: chatname,
      username: username,
      iconUrl: iconUrl,
      editorState: EditorState.createEmpty(),
      messages: []
    }
  }

  componentWillMount() {
      this.client  = mqtt.connect('ws://mqtt.bucknell.edu:9001');

      console.log("Connecting");
      let self = this;

      this.client.on('connect', function () {
        self.client.subscribe(`root${window.location.pathname}/#`);
        self.setState({loading: false});
      })

      self.client.on('message', function (topic, message) {
        message = JSON.parse(message.toString());
        message.username = topic.split('/')[2];
        self.addMessage(message);
      })
  }

  componentWillUnmount() {
    // this.client.close();
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      username: nextProps.username,
      iconUrl: nextProps.iconUrl
    });
  }

  setMessage(message) {
    if (message !== "\n") {
      this.setState({message: message});
    }
  }

  handleKeyDown(event) {
    if(event.keyCode === 13 && event.shiftKey === false) {
      this.sendMessage();
    }
  }

  sendMessage() {
    if (this.state.message !== "") {

      const newMessage = {
        "iconUrl": this.state.iconUrl,
        "message": draftToHtml(convertToRaw(this.state.editorState.getCurrentContent())),
        "clientTime": Date.now()
      };

      this.client.publish(`root${window.location.pathname}/${this.state.username}`, JSON.stringify(newMessage));

      this.setState({editorState: EditorState.createEmpty()});
    }
  }

  addMessage(message) {
    let messages = [...this.state.messages];

    console.log(message.message);

    // Will update the most recent message if the new message is from the same
    // user and the message was received within 60 seconds of the previous
    if (messages.length > 0 && messages[messages.length - 1].username === message.username && (message.clientTime - messages[messages.length - 1].clientTime < 60000)) {
      messages[messages.length - 1].message += message.message;
      messages[messages.length - 1].clientTime = message.clientTime;
    } else {
      messages.push(message);
    }
    this.setState({messages});
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
    // console.log(JSON.stringify(this.state.editorState._immutable.currentContent.blockMap));
    return (
      <Panel bsStyle="primary" style={{ width: "100%", maxWidth: 800, height:"100%"}}>
        <Panel.Heading>
          <h2>{this.state.chatname}</h2>
        </Panel.Heading>
        <Panel.Body className="scrollable" style={{ height: 300 }}>
          {
            this.state.messages.map((message, i) => {
              return (
                <Message message={message} align={this.getAlign(message.username)}
                  key={i} ref={(ref) => this['_div' + i] = ref} iconUrl={this.state.iconUrl} />
              );
            })
          }
        </Panel.Body>
        <Panel.Footer>
          <Editor
            disabled={this.state.loading}
            editorState={this.state.editorState}
            wrapperClassName="wrapper-class"
            editorClassName="form-control messages"
            toolbarClassName="toolbar-class"
            onEditorStateChange={(editorState) => {this.setState({editorState: editorState})}}
            />
          <div className="right" style={{paddingTop: 10}}>
            <Button bsStyle="primary" bsSize="large" onClick={() => this.sendMessage()}>Submit</Button>
          </div>
        </Panel.Footer>
      </Panel>
    );
  }

}

export default Chat;

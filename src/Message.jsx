import React, { Component } from 'react';
import {Panel} from 'react-bootstrap';
import dateFormat from 'dateformat';

class Message extends Component {

  constructor(props) {
    super(props);

    this.state = {
      name: props.message.name,
      timestamp: props.message.timestamp,
      body: props.message.body
    }
  }

  getHeader() {
    let time = new Date(this.state.timestamp);
    if (this.props.align === "left") {
      return <div><b>{this.state.name}</b> - {dateFormat(time, "dddd, mmmm dS, yyyy, h:MM:ss TT")}</div>;
    } else {
      return <div>{dateFormat(time, "dddd, mmmm dS, yyyy, h:MM:ss TT")} - <b>{this.state.name}</b></div>;
    }
  }

  render() {
    let header = this.getHeader();

    return (
      <div className={this.props.align}>
        <Panel ref={el => { this.el = el; }} className={`message message-${this.props.align}`} bsStyle="default" style={{width: "80%"}}>
          <Panel.Heading>{header}</Panel.Heading>
          <Panel.Body>{this.state.body}</Panel.Body>
        </Panel>
      </div>
    );
  }

}

export default Message;

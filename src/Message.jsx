import React, { Component } from 'react';
import {Panel} from 'react-bootstrap';
import dateFormat from 'dateformat';
import Parser from 'html-react-parser';

class Message extends Component {

  constructor(props) {
    super(props);

    this.getImageLeft = this.getImageLeft.bind(this);
    this.getImageRight = this.getImageRight.bind(this);

    this.state = {
      username: props.message.username,
      iconUrl: props.message.iconUrl,
      timestamp: props.message.clientTime,
      body: props.message.message
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      username: nextProps.message.username,
      iconUrl: nextProps.message.iconUrl,
      timestamp: nextProps.message.clientTime,
      body: nextProps.message.message
    });
  }

  getHeader() {
    let time = new Date(this.state.timestamp);
    if (this.props.align === "left") {
      return <div><b>{this.state.username}</b> - {dateFormat(time, "dddd, mmmm dS, yyyy, h:MM:ss TT")}</div>;
    } else {
      return <div>{dateFormat(time, "dddd, mmmm dS, yyyy, h:MM:ss TT")} - <b>{this.state.username}</b></div>;
    }
  }

  getImage() {
    return <img src={this.state.iconUrl || 'http://simpleicon.com/wp-content/uploads/smile.png'}
      alt="boohoo" style={{width:50, height:50}} className="img-responsive img-circle"/>
  }

  getImageLeft() {
    if (this.props.align === 'left')
      return this.getImage();
  }

  getImageRight() {
    if (this.props.align === 'right')
      return this.getImage();
  }


  render() {
    let header = this.getHeader();

    return (
      <div className={this.props.align}>
        { this.getImageLeft() }
        <Panel ref={el => { this.el = el; }} className={`message message-${this.props.align}`} bsStyle="default">
          <Panel.Heading>{header}</Panel.Heading>
          <Panel.Body>{ Parser(this.state.body) }</Panel.Body>
        </Panel>
        { this.getImageRight() }
      </div>
    );
  }

}

export default Message;

import React, { Component } from 'react';
import axios from 'axios';

import './Story.scss';


export default class Story extends Component {
  constructor(props) {
    super(props);

    this.state = {
      text: null,
    };

    this.continue = this.continue.bind(this);
  }

  componentDidMount() {
    axios.get('/story/state')
      .then(resp => this.setState({
        text: resp.data.text,
      }))
      .catch(console.error);
  }

  continue() {
    axios.post('/story/continue')
      .then(resp => this.setState({
        text: resp.data.text,
      }))
      .catch(console.error);
  }

  render() {
    const { text } = this.state;

    return (
      <div className='Story'>
        <p>{text}</p>
        <button type='button' onClick={this.continue}>Continue</button>
      </div>
    );
  }
}

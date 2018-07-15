import React, { Component } from 'react';
import axios from 'axios';


export default class Story extends Component {
  constructor(props) {
    super(props);

    this.state = {
      state: null,
    };
  }

  componentDidMount() {
    axios.get('/story/state')
      .then(resp => this.setState({ state: resp.data.state }))
      .catch(console.error);
  }

  render() {
    const { state } = this.state;

    return (
      <div className='Story'>
        Story {JSON.stringify(state)}
      </div>
    );
  }
}

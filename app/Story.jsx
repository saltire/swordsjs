import React, { Component } from 'react';
import axios from 'axios';

import './Story.scss';
import Materials from './Materials';


export default class Story extends Component {
  constructor(props) {
    super(props);

    this.state = {
      story: null,
      choices: null,
    };

    this.continue = this.continue.bind(this);
  }

  componentDidMount() {
    axios.get('/story/state')
      .then(resp => this.setState({
        story: resp.data.story,
        choices: {},
      }))
      .catch(console.error);
  }

  continue() {
    const { story, choices } = this.state;
    const { optionSets } = story || {};

    axios.post('/story/continue', optionSets ? { choices } : {})
      .then(resp => this.setState({
        story: resp.data.story,
        choices: {},
      }))
      .catch(console.error);
  }

  render() {
    const { story, choices } = this.state;
    const { text, optionSets } = story || {};
    const complete = !optionSets || (Object.keys(choices).length === optionSets.length);

    return story && (
      <div className='Story'>
        <p>{text}</p>

        {optionSets && (
          <Materials
            optionSets={optionSets}
            choices={choices}
            onUpdate={ch => this.setState({ choices: ch })}
          />
        )}

        <button type='button' disabled={!complete} onClick={this.continue}>Continue</button>
      </div>
    );
  }
}

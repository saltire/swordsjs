import React, { Component } from 'react';
import axios from 'axios';

import './Story.scss';
import Canvas from './Canvas';
import Materials from './Materials';


export default class Story extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      story: null,
      choices: null,
    };

    this.continue = this.continue.bind(this);
  }

  componentDidMount() {
    this.setState({ loading: true });
    axios.get('/story/state')
      .then(resp => this.setState({
        story: resp.data.story,
        choices: {},
      }))
      .catch(console.error)
      .then(() => this.setState({ loading: false }));
  }

  continue() {
    const { story, choices } = this.state;
    const { optionSets } = story || {};

    this.setState({ loading: true });
    axios.post('/story/continue', optionSets ? { choices } : {})
      .then(resp => this.setState({
        story: resp.data.story,
        choices: {},
      }))
      .catch(console.error)
      .then(() => this.setState({ loading: false }));
  }

  render() {
    const { loading, story, choices } = this.state;
    const { text, optionSets, image } = story || {};
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

        {image && <Canvas image={image} />}

        <button type='button' disabled={loading || !complete} onClick={this.continue}>
          Continue
        </button>
      </div>
    );
  }
}

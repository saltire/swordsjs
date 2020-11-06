import React, { Component } from 'react';
import axios from 'axios';
import reactStringReplace from 'react-string-replace';

import './Story.scss';
import Canvas from './Canvas';
import Materials from './Materials';


export default class Story extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
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
      .catch(console.error)
      .finally(() => setTimeout(() => this.setState({ loading: false }), 10));
  }

  continue() {
    const { story, choices } = this.state;
    const { optionSets } = story || {};

    this.setState({ loading: true });
    setTimeout(() => {
      axios.post('/story/continue', optionSets ? { choices: Object.values(choices) } : {})
        .then(resp => this.setState({
          story: resp.data.story,
          choices: {},
        }))
        .catch(console.error)
        .finally(() => this.setState({ loading: false }));
    }, 750);
  }

  render() {
    const { loading, story, choices } = this.state;
    const { text, charColour, optionSets, image, end } = story || {};
    const complete = !optionSets || (Object.keys(choices).length === optionSets.length);

    return story && (
      <div className={`Story${loading ? ' hidden' : ''}`}>
        <p>
          {!charColour ? text : reactStringReplace(text, /["“](.*?)["”]/g,
            (match, i) => <span key={i} style={{ color: charColour }}>“{match}”</span>)}
        </p>

        {optionSets && (
          <Materials
            optionSets={optionSets}
            choices={choices}
            onUpdate={ch => this.setState({ choices: ch })}
          />
        )}

        {image && <Canvas className='sword' image={image} />}

        <button type='button' disabled={loading || !complete} onClick={this.continue}>
          {end ? 'Start again' : 'Continue'}
        </button>
      </div>
    );
  }
}

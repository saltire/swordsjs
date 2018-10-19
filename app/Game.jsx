import React, { Component, Fragment } from 'react';
import axios from 'axios';

import './Game.scss';
import Canvas from './Canvas';
import Description from './Description';
import Materials from './Materials';


export default class Game extends Component {
  constructor(props) {
    super(props);

    this.state = {
      optionSets: null,
      choices: {},
      image: null,
      desc: null,
      loading: true,
    };

    this.forge = this.forge.bind(this);
    this.restart = this.restart.bind(this);
  }

  componentDidMount() {
    this.start();
  }

  restart() {
    this.setState({ loading: true });
    setTimeout(() => this.start(), 750);
  }

  start() {
    this.setState({
      optionSets: null,
      choices: {},
      image: null,
      desc: null,
    });

    axios.get('/game/options')
      .then(resp => this.setState({ optionSets: resp.data.optionSets }))
      .catch(console.error)
      .finally(() => setTimeout(() => this.setState({ loading: false }), 10));
  }

  forge() {
    const { choices } = this.state;

    this.setState({ loading: true });
    setTimeout(() => {
      axios.post('/game/forge', { choices })
        .then(
          resp => this.setState({
            image: resp.data.image,
            desc: resp.data.desc,
          }),
          console.error)
        .then(() => this.setState({ loading: false }));
    }, 750);
  }

  render() {
    const { optionSets, choices, image, desc, loading } = this.state;
    const complete = optionSets && (Object.keys(choices).length === optionSets.length);

    return (
      <div className={`Game${loading ? ' hidden' : ''}`}>
        {image && desc ? (
          <Fragment>
            <Canvas image={image} />
            <Description desc={desc} />
            <button type='button' disabled={loading} onClick={this.restart}>↻</button>
          </Fragment>
        ) : (
          optionSets && (
            <Fragment>
              <Materials
                optionSets={optionSets}
                choices={choices}
                onUpdate={ch => this.setState({ choices: ch })}
              />
              <button type='button' disabled={loading || !complete} onClick={this.forge}>
                Forge
              </button>
            </Fragment>
          )
        )}
      </div>
    );
  }
}

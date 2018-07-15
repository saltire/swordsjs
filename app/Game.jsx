import React, { Component, Fragment } from 'react';
import axios from 'axios';

import './Game.scss';
import Canvas from './Canvas';
import Description from './Description';


export default class Game extends Component {
  constructor(props) {
    super(props);

    this.state = {
      optionSets: null,
      choices: {},
      image: null,
      desc: null,
      loading: false,
    };

    this.start = this.start.bind(this);
    this.forge = this.forge.bind(this);
  }

  componentDidMount() {
    this.start();
  }

  start() {
    this.setState({
      optionSets: null,
      choices: {},
      image: null,
      desc: null,
      loading: true,
    });
    axios.get('/game/options')
      .then(
        resp => this.setState({ optionSets: resp.data.optionSets }),
        console.error)
      .then(() => this.setState({ loading: false }));
  }

  forge() {
    const { choices } = this.state;

    this.setState({ loading: true });
    axios.post('/game/forge', { choices })
      .then(
        resp => this.setState({
          image: resp.data.image,
          desc: resp.data.desc,
        }),
        console.error)
      .then(() => this.setState({ loading: false }));
  }

  render() {
    const { optionSets, choices, image, desc, loading } = this.state;
    const complete = optionSets && (Object.keys(choices).length === optionSets.length);

    /* eslint-disable react/no-array-index-key */
    return (
      <div className='Game'>
        {image && desc ? (
          <Fragment>
            <Canvas image={image} />
            <Description desc={desc} />
          </Fragment>
        ) : (
          <Fragment>
            <form>
              {optionSets && optionSets.map((optionSet, i) => (
                <p key={i}>
                  {optionSet.map((option, j) => (
                    <label key={j}>
                      <input
                        type='radio'
                        checked={choices[i] === j}
                        onChange={e => (e.target.checked && this.setState(prevState => ({
                          choices: Object.assign({}, prevState.choices, { [i]: j }),
                        })))}
                      />
                      {option}
                    </label>
                  ))}
                </p>
              ))}
            </form>
            <button type='button' disabled={loading || !complete} onClick={this.forge}>
              Forge
            </button>
          </Fragment>
        )}

        <button type='button' disabled={loading} onClick={this.start}>↻</button>
      </div>
    );
  }
}

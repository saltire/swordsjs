import React, { Component } from 'react';
import axios from 'axios';

import './Game.scss';


export default class Game extends Component {
  constructor(props) {
    super(props);

    this.state = {
      choiceSets: null,
    };
  }

  componentDidMount() {
    this.start();
  }

  start() {
    axios.get('/sword/choices')
      .then(resp => this.setState({ choiceSets: resp.data.choiceSets }))
      .catch(console.error);
  }

  render() {
    const { choiceSets } = this.state;

    /* eslint-disable react/no-array-index-key */
    return (
      <div className='Game'>
        <form>
          {choiceSets && choiceSets.map((choiceSet, i) => (
            <p key={i}>
              {choiceSet.map((choice, j) => (
                <label key={j}>
                  <input type='radio' name={`material${i}`} /> {choice}
                </label>
              ))}
            </p>
          ))}
        </form>
      </div>
    );
  }
}

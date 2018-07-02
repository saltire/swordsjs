import React, { Component } from 'react';
import axios from 'axios';

import './Sword.scss';
import Canvas from './Canvas';


export default class Sword extends Component {
  constructor(props) {
    super(props);

    this.state = {
      image: null,
      desc: null,
      loading: false,
    };

    this.reload = this.reload.bind(this);
  }

  componentDidMount() {
    this.reload();
  }

  reload() {
    this.setState({ loading: true });

    axios.get('/sword/data')
      .then(
        (resp) => {
          const { image, desc } = resp.data;
          this.setState({ image, desc });
        },
        console.error)
      .then(() => this.setState({ loading: false }));
  }

  render() {
    const { image, desc, loading } = this.state;

    return (
      <div className='Sword'>
        <Canvas image={image} />
        {desc && (
          <div className='text'>
            <p><strong>Crossguard:</strong> {desc.crossguard}.</p>
            <p><strong>Grip:</strong> {desc.grip}.</p>
            <p>
              <strong>Blade:</strong> {desc.blade}{desc.bladedeco ? `, ${desc.bladedeco}` : '.'}
            </p>
          </div>
        )}
        <button type='button' disabled={loading} onClick={this.reload}>↻</button>
      </div>
    );
  }
}

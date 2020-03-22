import React, { Component } from 'react';
import axios from 'axios';

import './Sword.scss';
import Canvas from './Canvas';
import Description from './Description';


export default class Sword extends Component {
  constructor(props) {
    super(props);

    this.state = {
      image: null,
      descs: null,
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
      .then(resp => this.setState({
        image: resp.data.image,
        descs: resp.data.descs,
      }))
      .catch(console.error)
      .then(() => this.setState({ loading: false }));
  }

  render() {
    const { image, descs, loading } = this.state;

    return (
      <div className='Sword'>
        <Canvas image={image} />
        <Description descs={descs} />
        <button type='button' disabled={loading} onClick={this.reload}>↻</button>
      </div>
    );
  }
}

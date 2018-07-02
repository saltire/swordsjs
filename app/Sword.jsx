import React, { Component } from 'react';
import axios from 'axios';

import './Sword.scss';


export default class Sword extends Component {
  constructor(props) {
    super(props);

    this.state = {
      desc: null,
      loading: false,
    };

    this.canvas = React.createRef();

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
          this.setState({ desc });

          const canvas = this.canvas.current;
          const ctx = canvas.getContext('2d');

          const img = new Image();
          img.onload = () => {
            canvas.width = canvas.clientWidth;
            canvas.height = canvas.clientHeight;
            ctx.scale(canvas.width / 360, canvas.height / 120);
            ctx.imageSmoothingEnabled = false;
            ctx.mozImageSmoothingEnabled = false;

            ctx.drawImage(img, 0, 0);
          };
          img.src = image;
        },
        console.error)
      .then(() => this.setState({ loading: false }));
  }

  render() {
    const { desc, loading } = this.state;

    return (
      <div className='Sword'>
        <canvas ref={this.canvas} />
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

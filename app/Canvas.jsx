import React, { Component } from 'react';


export default class Canvas extends Component {
  constructor(props) {
    super(props);

    this.canvas = React.createRef();
  }

  componentDidMount() {
    this.draw();
  }

  componentDidUpdate(prevProps) {
    const { image } = this.props;
    if (image !== prevProps.image) {
      this.draw();
    }
  }

  draw() {
    const { image } = this.props;
    if (image) {
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
    }
  }

  render() {
    return <canvas className='Canvas' ref={this.canvas} />;
  }
}

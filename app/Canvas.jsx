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

        ctx.scale(canvas.width / img.width, canvas.height / img.height);
        ctx.imageSmoothingEnabled = false;

        ctx.drawImage(img, 0, 0);
      };
      img.src = image;
    }
  }

  render() {
    const { className, onClick } = this.props;
    return <canvas className={`Canvas ${className || ''}`} ref={this.canvas} onClick={onClick} />;
  }
}

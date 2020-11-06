import { useEffect, useRef } from 'react';


export default function Canvas({ image, className, onClick }) {
  const canvas = useRef();

  useEffect(() => {
    if (image && canvas.current) {
      const ctx = canvas.current.getContext('2d');

      const img = new Image();
      img.onload = () => {
        canvas.current.width = canvas.current.clientWidth;
        canvas.current.height = canvas.current.clientHeight;

        ctx.scale(canvas.current.width / img.width, canvas.current.height / img.height);
        ctx.imageSmoothingEnabled = false;

        ctx.drawImage(img, 0, 0);
      };
      img.src = image;
    }
  }, image);

  return <canvas className={`Canvas ${className || ''}`} ref={canvas} onClick={onClick} />;
}

import React, { useEffect, useState } from 'react';
import axios from 'axios';

import './Sword.scss';
import Canvas from './Canvas';
import Description from './Description';


export default function Sword() {
  const [image, setImage] = useState(null);
  const [descs, setDescs] = useState(null);
  const [loading, setLoading] = useState(false);

  function reload() {
    setLoading(true);

    axios.get('/sword/data')
      .then(({ data }) => {
        setImage(data.image);
        setDescs(data.descs);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    reload();
  }, []);

  return (
    <div className='Sword'>
      <Canvas className='sword' image={image} />
      <Description descs={descs} />
      <button type='button' disabled={loading} onClick={reload}>↻</button>
    </div>
  );
}

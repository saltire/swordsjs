import { useEffect, useState } from 'react';
import axios from 'axios';

import './Sword.scss';
import Canvas from './Canvas';
import Description from './Description';
import { Descriptions } from './types';


export default function Sword() {
  const [image, setImage] = useState<string | null>(null);
  const [descs, setDescs] = useState<Descriptions | null>(null);
  const [loading, setLoading] = useState(false);

  function reload() {
    setLoading(true);

    axios.get('/api/sword/data')
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

import { useEffect, useState } from 'react';
import axios from 'axios';

import './Game.scss';
import Canvas from './Canvas';
import Description from './Description';
import Materials from './Materials';


export default function Game() {
  const [optionSets, setOptionSets] = useState(null);
  const [choices, setChoices] = useState({});
  const [image, setImage] = useState(null);
  const [descs, setDescs] = useState(null);
  const [loading, setLoading] = useState(true);

  const start = () => axios.get('/api/game/options')
    .then(({ data }) => setOptionSets(data.optionSets))
    .catch(console.error)
    .finally(() => setTimeout(() => setLoading(false), 10));

  useEffect(() => {
    start();
  }, []);

  const restart = () => {
    setLoading(true);
    setTimeout(() => {
      setOptionSets(null);
      setChoices({});
      setImage(null);
      setDescs(null);
      start();
    }, 750);
  };

  const forge = () => {
    setLoading(true);
    setTimeout(() => {
      axios.post('/api/game/forge', { choices })
        .then(({ data }) => {
          setImage(data.image);
          setDescs(data.descs);
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    }, 750);
  };

  const complete = optionSets && (Object.keys(choices).length === optionSets.length);

  return (
    <div className={`Game${loading ? ' hidden' : ''}`}>
      {image && descs ? (
        <>
          <Canvas className='sword' image={image} />
          <Description descs={descs} />
          <button type='button' disabled={loading} onClick={restart}>↻</button>
        </>
      ) : (
        optionSets && (
          <>
            <Materials
              optionSets={optionSets}
              choices={choices}
              onUpdate={setChoices}
            />
            <button type='button' disabled={loading || !complete} onClick={forge}>
              Forge
            </button>
          </>
        )
      )}
    </div>
  );
}

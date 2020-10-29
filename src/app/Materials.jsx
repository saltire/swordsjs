import React from 'react';

import './Materials.scss';
import Canvas from './Canvas';
import gemOutline from './static/gem-outline.png';


export default function Materials({ optionSets, choices, onUpdate }) {
  return (
    <form className='Materials'>
      {(optionSets || []).map((optionSet, i) => (
        <p key={i.toString()}>
          {(optionSet || []).map(({ gemImage, materialNames }, j) => (
            <button
              key={j.toString()}
              type='button'
              onClick={() => onUpdate({ ...choices, [i]: j })}
            >
              <Canvas
                className='gem'
                image={choices[i] === j ? gemImage : gemOutline}
              />
              {materialNames}
            </button>
          ))}
        </p>
      ))}
    </form>
  );
}

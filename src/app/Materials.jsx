import React from 'react';

import './Materials.scss';
import Canvas from './Canvas';
import gemOutline from './static/gem-outline.png';


export default function Materials({ optionSets, choices, onUpdate }) {
  return (
    <form className='Materials'>
      {(optionSets || []).map((optionSet, i) => (
        <p key={i.toString()}>
          {(optionSet || []).map(({ gemImage, materials }, j) => (
            <label
              key={j.toString()}
              role='button'
              tabIndex='0'
              onKeyUp={e => ['Enter', ' '].includes(e.key) && onUpdate({ ...choices, [i]: j })}
              onClick={() => onUpdate({ ...choices, [i]: j })}
            >
              <Canvas
                className='gem'
                image={choices[i] === j ? gemImage : gemOutline}
              />
              {materials}
            </label>
          ))}
        </p>
      ))}
    </form>
  );
}

import React from 'react';


export default function Materials({ optionSets, choices, onUpdate }) {
  return (
    <form className='Materials'>
      {(optionSets || []).map((optionSet, i) => (
        <p key={i.toString()}>
          {(optionSet || []).map(({ gemImage, materials }, j) => (
            <label key={j.toString()}>
              <span className='input'>
                <input
                  type='radio'
                  checked={choices[i] === j}
                  onChange={e => (e.target.checked && onUpdate({ ...choices, [i]: j }))}
                />
              </span>
              <img src={gemImage} alt={materials} />
              {materials}
            </label>
          ))}
        </p>
      ))}
    </form>
  );
}

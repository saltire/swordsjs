import React from 'react';


export default function Materials({ optionSets, choices, onUpdate }) {
  /* eslint-disable react/no-array-index-key */
  return (
    <form className='Materials'>
      {(optionSets || []).map((optionSet, i) => (
        <p key={i}>
          {(optionSet || []).map((option, j) => (
            <label key={j}>
              <span className='input'>
                <input
                  type='radio'
                  checked={choices[i] === j}
                  onChange={e => (e.target.checked &&
                    onUpdate(Object.assign({}, choices, { [i]: j })))}
                />
              </span>
              {option}
            </label>
          ))}
        </p>
      ))}
    </form>
  );
}

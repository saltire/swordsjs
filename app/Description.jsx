import React from 'react';


export default function Description({ descs }) {
  return descs && (
    <div className='Description'>
      <p><strong>Crossguard:</strong> {descs.crossguard}.</p>
      <p><strong>Grip:</strong> {descs.grip}.</p>
      <p>
        <strong>Blade:</strong> {descs.blade}{descs.bladedeco ? `, ${descs.bladedeco}` : '.'}
      </p>
    </div>
  );
}

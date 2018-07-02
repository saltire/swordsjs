import React from 'react';


export default function Description({ desc }) {
  return desc && (
    <div className='Description'>
      <p><strong>Crossguard:</strong> {desc.crossguard}.</p>
      <p><strong>Grip:</strong> {desc.grip}.</p>
      <p>
        <strong>Blade:</strong> {desc.blade}{desc.bladedeco ? `, ${desc.bladedeco}` : '.'}
      </p>
    </div>
  );
}

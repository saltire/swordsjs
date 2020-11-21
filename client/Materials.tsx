import './Materials.scss';
import Canvas from './Canvas';
import { Choices, Option } from './types';
// @ts-ignore
import gemOutline from './static/gem-outline.png';


interface MaterialsProps {
  optionSets: Option[][],
  choices: Choices,
  onUpdate: (choices: Choices) => void,
}

export default function Materials({ optionSets, choices, onUpdate }: MaterialsProps) {
  return (
    <form className='Materials'>
      {(optionSets || []).map((optionSet, i) => (
        <p key={i.toString()}>
          {(optionSet || []).map(({ gemImage, materialList }, j) => (
            <button
              key={j.toString()}
              type='button'
              onClick={() => onUpdate({ ...choices, [i]: j })}
            >
              <Canvas
                className='gem'
                image={choices[i] === j ? gemImage : gemOutline}
              />
              {materialList}
            </button>
          ))}
        </p>
      ))}
    </form>
  );
}

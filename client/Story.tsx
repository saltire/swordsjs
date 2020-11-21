import { ReactNode, useEffect, useState } from 'react';
import axios from 'axios';

import './Story.scss';
import Canvas from './Canvas';
import Materials from './Materials';
import { StoryData } from './types';


const stringReplace = (str: string, re: RegExp, fn: (match: string, i: number) => ReactNode) =>
  (str || '').split(re).map((part, i) => (i % 2 === 0 ? part : fn(part, i)));

export default function Story() {
  const [loading, setLoading] = useState(true);
  const [story, setStory] = useState<StoryData | null>(null);
  const [choices, setChoices] = useState({});

  useEffect(() => {
    axios.get('/api/story/state')
      .then(({ data }) => {
        setStory(data.story);
        setChoices({});
      })
      .catch(console.error)
      .finally(() => setTimeout(() => setLoading(false), 10));
  }, []);

  const next = () => {
    const { optionSets } = story || {};

    setLoading(true);
    setTimeout(() => {
      axios.post('/api/story/continue', optionSets ? { choices: Object.values(choices) } : {})
        .then(({ data }) => {
          setStory(data.story);
          setChoices({});
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    }, 750);
  };

  const { text, charColour, optionSets, image, end } = story || {};
  const complete = !optionSets || (Object.keys(choices).length === optionSets.length);

  return story && (
    <div className={`Story${loading ? ' hidden' : ''}`}>
      <p>
        {!charColour ? text : stringReplace(text || '', /["“](.*?)["”]/g,
          (match, i) => <span key={i} style={{ color: charColour }}>“{match}”</span>)}
      </p>

      {optionSets && (
        <Materials
          optionSets={optionSets}
          choices={choices}
          onUpdate={setChoices}
        />
      )}

      {image && <Canvas className='sword' image={image} />}

      <button type='button' disabled={loading || !complete} onClick={next}>
        {end ? 'Start again' : 'Continue'}
      </button>
    </div>
  );
}

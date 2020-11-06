import { useEffect, useState } from 'react';
import axios from 'axios';
import reactStringReplace from 'react-string-replace';

import './Story.scss';
import Canvas from './Canvas';
import Materials from './Materials';


export default function Story() {
  const [loading, setLoading] = useState(true);
  const [story, setStory] = useState(null);
  const [choices, setChoices] = useState({});

  useEffect(() => {
    axios.get('/story/state')
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
      axios.post('/story/continue', optionSets ? { choices: Object.values(choices) } : {})
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
        {!charColour ? text : reactStringReplace(text, /["“](.*?)["”]/g,
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

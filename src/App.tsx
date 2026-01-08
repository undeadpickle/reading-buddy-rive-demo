import { useState, useRef } from 'react';
import { BuddyLoader, BuddyLoaderRef } from './components/BuddyLoader';
import { EventsDemo } from './components/EventsDemo';
import { CHARACTERS } from './utils/constants';
import type { BuddyCharacter } from './types/buddy';

const buttonStyle: React.CSSProperties = {
  padding: '8px 16px',
  fontSize: '14px',
  borderRadius: '4px',
  border: '1px solid #ccc',
  background: '#fff',
  cursor: 'pointer',
};

export default function App() {
  const [selectedCharacter, setSelectedCharacter] = useState<BuddyCharacter>(
    CHARACTERS[0]
  );
  const [key, setKey] = useState(0); // Used to force re-mount on character change
  const buddyRef = useRef<BuddyLoaderRef>(null);
  const buddyCroppedRef = useRef<BuddyLoaderRef>(null);

  const handleCharacterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const character = CHARACTERS.find((c) => c.id === e.target.value);
    if (character) {
      setSelectedCharacter(character);
      setKey((prev) => prev + 1); // Force re-mount to reload assets
    }
  };

  // Fire animation on both canvases
  const triggerBothWave = () => {
    buddyRef.current?.triggerWave();
    buddyCroppedRef.current?.triggerWave();
  };

  const triggerBothJump = () => {
    buddyRef.current?.triggerJump();
    buddyCroppedRef.current?.triggerJump();
  };

  const triggerBothBlink = () => {
    buddyRef.current?.triggerBlink();
    buddyCroppedRef.current?.triggerBlink();
  };

  return (
    <div
      style={{
        padding: 20,
        fontFamily: 'system-ui, -apple-system, sans-serif',
        maxWidth: 800,
        margin: '0 auto',
      }}
    >
      <h1 style={{ marginBottom: 8 }}>Reading Buddy Test Harness</h1>
      <p style={{ color: '#666', marginTop: 0 }}>
        Rive Animation with CDN Asset Loading
      </p>

      <section style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 18, marginBottom: 12 }}>Character Selection</h2>
        <select
          value={selectedCharacter.id}
          onChange={handleCharacterChange}
          style={{
            fontSize: 16,
            padding: '8px 12px',
            borderRadius: 4,
            border: '1px solid #ccc',
          }}
        >
          {CHARACTERS.map((char) => (
            <option key={char.id} value={char.id}>
              {char.name}
            </option>
          ))}
        </select>
        <span style={{ marginLeft: 12, color: '#666', fontSize: 14 }}>
          CDN folder: {selectedCharacter.folderName}
        </span>
      </section>

      <section style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 18, marginBottom: 12 }}>Buddy Preview</h2>
        <div
          style={{
            display: 'flex',
            gap: 24,
            flexWrap: 'wrap',
          }}
        >
          {/* Original full template */}
          <div>
            <h3 style={{ fontSize: 14, marginBottom: 8, color: '#666' }}>
              Full Template (500x500 assets)
            </h3>
            <div
              style={{
                border: '2px solid #e0e0e0',
                borderRadius: 8,
                padding: 16,
                background: '#f9f9f9',
              }}
            >
              <BuddyLoader
                ref={buddyRef}
                key={`full-${key}`}
                src={`${import.meta.env.BASE_URL}buddy-template.riv`}
                cdnSubfolder="buddies"
                resolution="1x"
                character={selectedCharacter}
                width={300}
                height={300}
                onTap={() => console.log('Full buddy tapped!')}
                onLoad={() => console.log('Full buddy loaded!')}
                onError={(error) => console.error('Full buddy error:', error)}
              />
            </div>
          </div>

          {/* Cropped template */}
          <div>
            <h3 style={{ fontSize: 14, marginBottom: 8, color: '#666' }}>
              Cropped Template (fitted assets)
            </h3>
            <div
              style={{
                border: '2px solid #e0e0e0',
                borderRadius: 8,
                padding: 16,
                background: '#f9f9f9',
              }}
            >
              <BuddyLoader
                ref={buddyCroppedRef}
                key={`cropped-${key}`}
                src={`${import.meta.env.BASE_URL}buddy-template-cropped.riv`}
                cdnSubfolder="buddies_cropped_parts"
                resolution="1x"
                character={selectedCharacter}
                width={300}
                height={300}
                onTap={() => console.log('Cropped buddy tapped!')}
                onLoad={() => console.log('Cropped buddy loaded!')}
                onError={(error) => console.error('Cropped buddy error:', error)}
              />
            </div>
          </div>
        </div>
        <p style={{ color: '#666', marginTop: 8, fontSize: 14 }}>
          Click on either buddy to trigger wave animation
        </p>
      </section>

      <section style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 18, marginBottom: 12 }}>Animation Controls</h2>
        <p style={{ color: '#888', fontSize: 14, marginBottom: 8 }}>
          Note: Animation controls require the .riv files to be configured with
          the BuddyStateMachine state machine and wave/jump/blink triggers.
        </p>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button style={buttonStyle} onClick={triggerBothWave}>Wave</button>
          <button style={buttonStyle} onClick={triggerBothJump}>Jump</button>
          <button style={buttonStyle} onClick={triggerBothBlink}>Blink</button>
        </div>
      </section>

      <section style={{ marginBottom: 24 }}>
        <EventsDemo buddyRef={buddyRef} />
      </section>

      <section
        style={{
          marginTop: 32,
          padding: 16,
          background: '#fff3cd',
          borderRadius: 8,
          border: '1px solid #ffc107',
        }}
      >
        <h3 style={{ margin: 0, marginBottom: 8, fontSize: 16 }}>
          Setup Required
        </h3>
        <ul style={{ margin: 0, paddingLeft: 20, fontSize: 14, color: '#856404' }}>
          <li>
            Place <code>buddy-template.riv</code> and <code>buddy-template-cropped.riv</code> in the <code>public/</code> folder
          </li>
          <li>
            Ensure all images in .riv files are set to "Referenced" export type
          </li>
          <li>
            Full template assets: <code>buddies/CatdogOrange/</code> (with @2x resolution)
          </li>
          <li>
            Cropped template assets: <code>buddies_cropped_parts/CatdogOrange/</code> (1x only)
          </li>
          <li>
            Both state machines should be named <code>BuddyStateMachine</code> with <code>wave</code>, <code>jump</code> triggers
          </li>
        </ul>
      </section>

      <footer style={{ marginTop: 32, color: '#999', fontSize: 12 }}>
        <p>
          CDN Base:{' '}
          <code>
            https://raw.githubusercontent.com/undeadpickle/reading-buddy-rive-demo/main
          </code>
        </p>
      </footer>
    </div>
  );
}

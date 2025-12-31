import { useState, useRef } from 'react';
import { BuddyCanvas, BuddyCanvasRef } from './components/BuddyCanvas';
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
  const [loadStatus, setLoadStatus] = useState<string>('');
  const buddyRef = useRef<BuddyCanvasRef>(null);

  const handleCharacterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const character = CHARACTERS.find((c) => c.id === e.target.value);
    if (character) {
      setSelectedCharacter(character);
      setKey((prev) => prev + 1); // Force re-mount to reload assets
      setLoadStatus('Loading...');
    }
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
            border: '2px solid #e0e0e0',
            borderRadius: 8,
            display: 'inline-block',
            padding: 16,
            background: '#f9f9f9',
          }}
        >
          <BuddyCanvas
            ref={buddyRef}
            key={key}
            character={selectedCharacter}
            width={300}
            height={300}
            onTap={() => console.log('Buddy tapped!')}
            onLoad={() => {
              console.log('Buddy loaded!');
              setLoadStatus('Loaded');
            }}
            onError={(error) => {
              console.error('Buddy error:', error);
              setLoadStatus(`Error: ${error.message}`);
            }}
          />
        </div>
        <p style={{ color: '#666', marginTop: 8, fontSize: 14 }}>
          Click on the buddy to trigger tap animation
        </p>
        {loadStatus && (
          <p
            style={{
              color: loadStatus.startsWith('Error') ? '#d32f2f' : '#388e3c',
              fontSize: 14,
            }}
          >
            Status: {loadStatus}
          </p>
        )}
      </section>

      <section style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 18, marginBottom: 12 }}>Animation Controls</h2>
        <p style={{ color: '#888', fontSize: 14, marginBottom: 8 }}>
          Note: Animation controls require the .riv file to be configured with
          the BuddyStateMachine state machine.
        </p>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button style={buttonStyle} onClick={() => buddyRef.current?.triggerTap()}>Tap</button>
          <button style={buttonStyle} onClick={() => buddyRef.current?.triggerWave()}>Wave</button>
          <button style={buttonStyle} onClick={() => buddyRef.current?.triggerJump()}>Jump</button>
          <button style={buttonStyle} onClick={() => buddyRef.current?.triggerBlink()}>Blink</button>
        </div>
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
            Place <code>buddy-template.riv</code> in the <code>public/</code>{' '}
            folder
          </li>
          <li>
            Ensure all images in the .riv file are set to "Referenced" export
            type
          </li>
          <li>
            Upload character assets to the GitHub repo under{' '}
            <code>buddies/CatdogOrange/</code>
          </li>
          <li>
            The state machine should be named <code>BuddyStateMachine</code>
          </li>
        </ul>
      </section>

      <footer style={{ marginTop: 32, color: '#999', fontSize: 12 }}>
        <p>
          CDN Base:{' '}
          <code>
            https://raw.githubusercontent.com/undeadpickle/Rive/main/buddies
          </code>
        </p>
      </footer>
    </div>
  );
}

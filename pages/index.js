import React, { useState, useEffect } from 'react';

export default function ConsoleLike() {
  const [text, setText] = useState('');
  const fullText = 'C:\\Users\\Usuario> Bienvenido al sistema...'; // texto a escribir
  const typingSpeed = 80; // velocidad en ms por carácter

  // Cursor parpadeante
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    let index = 0;

    // Efecto de escritura
    const typeInterval = setInterval(() => {
      if (index < fullText.length) {
        setText((prev) => prev + fullText[index]);
        index++;
      } else {
        clearInterval(typeInterval);
      }
    }, typingSpeed);

    // Efecto de parpadeo del cursor
    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 500);

    return () => {
      clearInterval(typeInterval);
      clearInterval(cursorInterval);
    };
  }, []);

  return (
    <div
      style={{
        backgroundColor: '#000',
        color: '#00ff00',
        fontFamily: 'Consolas, monospace',
        padding: '20px',
        minHeight: '100vh'
      }}
    >
      <h1>Simulación CMD</h1>
      <div style={{ whiteSpace: 'pre-wrap', fontSize: '18px' }}>
        {text}
        {showCursor && <span style={{ backgroundColor: '#00ff00' }}> </span>}
      </div>
    </div>
  );
}


import { useState, useEffect } from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';
import { FaCircle, FaSquare, FaPlay } from 'react-icons/fa';

/**
 * Componente para escribir texto con efecto 'máquina de escribir'.
 * - `text`: El contenido del texto.
 * - `speed`: Velocidad (ms) por carácter.
 * - `style`: Objeto de estilo CSS para el <p>.
 */
function TypedText({ text, speed = 50, style }) {
  // Convertimos `text` a cadena vacía si es `undefined` o `null`.
  const safeText = text || '';

  const [displayed, setDisplayed] = useState('');

  useEffect(() => {
    let i = 0;
    setDisplayed(''); // Reinicia cada vez que cambia el texto
    const timer = setInterval(() => {
      if (i < safeText.length) {
        setDisplayed((prev) => prev + safeText[i]);
        i++;
      } else {
        clearInterval(timer);
      }
    }, speed);

    return () => clearInterval(timer);
  }, [safeText, speed]);

  return <p style={style}>{displayed}</p>;
}

export default function Home() {
  // Índice del paso en el que estamos
  const [stepIndex, setStepIndex] = useState(0);
  // Cuántos bloques se han revelado en el paso actual
  const [revealedBlocksCount, setRevealedBlocksCount] = useState(1);

  /**
   * storySteps: Array de pasos.
   * Cada paso tiene un array "blocks", donde cada bloque es:
   *   { type: 'text' | 'image', content: '...' }
   */
  const storySteps = [
    {
      blocks: [
        {
          type: 'text',
          content: 'Texto inicial del paso 1. Se escribe con efecto.'
        },
        {
          type: 'image',
          content: 'https://picsum.photos/id/1011/800/500'
        },
        {
          type: 'text',
          content: 'Más texto en el mismo paso 1, después de la imagen.'
        }
      ]
    },
    {
      blocks: [
        {
          type: 'text',
          content: 'Paso 2: Aquí va un texto introductorio.'
        },
        {
          type: 'image',
          content: 'https://picsum.photos/id/1018/800/500'
        }
      ]
    },
    {
      blocks: [
        {
          type: 'text',
          content: 'Último paso, primer bloque de texto.'
        },
        {
          type: 'image',
          content: 'https://picsum.photos/id/1020/800/500'
        },
        {
          type: 'text',
          content: 'Bloque final del último paso.'
        }
      ]
    }
  ];

  // Si cambiamos de paso, mostramos primero su bloque inicial
  useEffect(() => {
    setRevealedBlocksCount(1);
  }, [stepIndex]);

  // Paso actual y sus bloques
  const currentStep = storySteps[stepIndex];
  const totalBlocks = currentStep.blocks.length;

  // Bloques que estamos mostrando ahora
  const revealedBlocks = currentStep.blocks.slice(0, revealedBlocksCount);

  // ¿Estamos en el último paso?
  const isLastStep = stepIndex === storySteps.length - 1;
  // ¿Ya se mostraron todos los bloques del paso actual?
  const areAllBlocksRevealed = revealedBlocksCount >= totalBlocks;

  // Muestra el siguiente bloque (texto o imagen) del paso actual
  const handleContinueBlock = () => {
    if (!areAllBlocksRevealed) {
      setRevealedBlocksCount((prev) => prev + 1);
    }
  };

  // Pasa al siguiente paso
  const handleNextStep = () => {
    if (!isLastStep) {
      setStepIndex((prev) => prev + 1);
    }
  };

  return (
    <div
      style={{
        backgroundColor: 'black',
        color: 'white',
        minHeight: '100vh',
        padding: '20px',
        fontFamily: '\"Press Start 2P\", cursive'
      }}
    >
      <Head>
        <title>Historia Interactiva</title>
        <link
          rel='stylesheet'
          href='https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap'
        />
      </Head>

      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          {/* Título (muestra el número de paso) */}
          <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>
            Paso {stepIndex + 1}
          </h1>

          {/* Iconos animados (círculo, cuadrado, triángulo) */}
          <motion.div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '20px',
              fontSize: '30px',
              color: '#FF3E00',
              marginBottom: '20px'
            }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, repeat: Infinity, repeatType: 'reverse' }}
          >
            <FaCircle />
            <FaSquare />
            <FaPlay />
          </motion.div>

          {/* Muestra los bloques revelados hasta ahora */}
          {revealedBlocks.map((block, i) => {
            if (block.type === 'text') {
              // Texto con efecto de escritura
              return (
                <TypedText
                  key={i}
                  text={block.content}
                  speed={50}
                  style={{ fontSize: '18px', lineHeight: '1.8', marginBottom: '20px' }}
                />
              );
            } else if (block.type === 'image') {
              // Imagen con animación de aparición
              return (
                <motion.img
                  key={i}
                  src={block.content}
                  alt={`Paso ${stepIndex + 1} - Bloque ${i + 1}`}
                  style={{ width: '100%', borderRadius: '10px', marginBottom: '20px' }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                />
              );
            }
            // Si hay algún bloque con un type desconocido
            return null;
          })}

          {/* Botón para mostrar el siguiente bloque (si no hemos mostrado todos en este paso) */}
          {!areAllBlocksRevealed && (
            <button
              onClick={handleContinueBlock}
              style={{
                display: 'block',
                margin: '20px auto',
                padding: '10px 20px',
                fontSize: '18px',
                backgroundColor: '#FF3E00',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                transition: 'background-color 0.3s ease'
              }}
              onMouseOver={(e) => (e.target.style.backgroundColor = '#D32F2F')}
              onMouseOut={(e) => (e.target.style.backgroundColor = '#FF3E00')}
            >
              Continuar
            </button>
          )}

          {/* Botón para pasar al siguiente paso (si ya se mostraron todos los bloques y no es el último paso) */}
          {areAllBlocksRevealed && !isLastStep && (
            <button
              onClick={handleNextStep}
              style={{
                display: 'block',
                margin: '20px auto',
                padding: '10px 20px',
                fontSize: '18px',
                backgroundColor: '#FF3E00',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >
              Siguiente Paso
            </button>
          )}

          {/* Mensaje final si es el último paso y todos los bloques fueron revelados */}
          {areAllBlocksRevealed && isLastStep && (
            <p style={{ textAlign: 'center', marginTop: '20px' }}>
              ¡Has completado todos los pasos!
            </p>
          )}
        </motion.div>
      </div>
    </div>
  );
}

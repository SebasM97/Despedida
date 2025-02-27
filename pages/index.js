import { useState, useEffect } from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';
import { FaCircle, FaSquare, FaPlay } from 'react-icons/fa';

// Componente auxiliar que escribe el texto con efecto de 'máquina de escribir'
function TypedText({ text, speed = 50, style = {} }) {
  const [display, setDisplay] = useState('');

  useEffect(() => {
    let i = 0;
    setDisplay(''); // reinicia el texto cada vez que cambie
    const timer = setInterval(() => {
      if (i < text.length) {
        setDisplay((prev) => prev + text[i]);
        i++;
      } else {
        clearInterval(timer);
      }
    }, speed);

    return () => clearInterval(timer);
  }, [text, speed]);

  return <p style={style}>{display}</p>;
}

export default function Home() {
  // Índice del paso actual
  const [stepIndex, setStepIndex] = useState(0);

  // Cuántos bloques del paso actual hemos revelado ya
  const [revealedBlocksCount, setRevealedBlocksCount] = useState(1);

  // Datos: cada paso tiene un array de 'blocks'
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

  // Resetea 'revealedBlocksCount' cada vez que cambies de paso
  useEffect(() => {
    setRevealedBlocksCount(1);
  }, [stepIndex]);

  // Obtiene el paso actual
  const currentStep = storySteps[stepIndex];
  const totalBlocks = currentStep.blocks.length;

  // Muestra los bloques que ya han sido revelados
  const revealedBlocks = currentStep.blocks.slice(0, revealedBlocksCount);

  // Saber si estamos en el último paso y último bloque
  const isLastStep = stepIndex === storySteps.length - 1;
  const areAllBlocksRevealed = revealedBlocksCount >= totalBlocks;

  // Maneja el botón de 'Continuar'
  // Muestra el siguiente bloque dentro del mismo paso
  const handleContinueBlock = () => {
    if (!areAllBlocksRevealed) {
      setRevealedBlocksCount((prev) => prev + 1);
    }
  };

  // Maneja el botón 'Siguiente Paso'
  const handleNextStep = () => {
    if (!isLastStep) {
      setStepIndex((prev) => prev + 1);
    }
  };

  return (
    <div
      style={{
        backgroundColor: 'black',
        minHeight: '100vh',
        padding: '20px',
        fontFamily: '"Press Start 2P", cursive',
        color: 'white'
      }}
    >
      <Head>
        <title>Desafío Interactivo</title>
        <link
          rel='stylesheet'
          href='https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap'
        />
      </Head>

      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}>
          <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>
            Paso {stepIndex + 1}
          </h1>

          {/* Iconos animados (triángulo, cuadrado, círculo) */}
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

          {/* Renderiza los bloques revelados hasta ahora */}
          {revealedBlocks.map((block, i) => {
            if (block.type === 'text') {
              return (
                <TypedText
                  key={i}
                  text={block.content}
                  speed={50}
                  style={{ fontSize: '18px', lineHeight: '1.8', marginBottom: '20px' }}
                />
              );
            } else if (block.type === 'image') {
              return (
                <motion.img
                  key={i}
                  src={block.content}
                  alt={`Imagen bloque ${i}`}
                  style={{ width: '100%', borderRadius: '10px', marginBottom: '20px' }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                />
              );
            }
            return null;
          })}

          {/* Si todavía hay más bloques que mostrar en este paso, botón CONTINUAR */}
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

          {/* Si estamos en el último bloque del paso y NO es el último paso, botón SIGUIENTE PASO */}
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
                cursor: 'pointer',
                transition: 'background-color 0.3s ease'
              }}
              onMouseOver={(e) => (e.target.style.backgroundColor = '#D32F2F')}
              onMouseOut={(e) => (e.target.style.backgroundColor = '#FF3E00')}
            >
              Siguiente Paso
            </button>
          )}

          {/* Si es el último paso y ya se revelaron todos los bloques, mensaje final */}
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

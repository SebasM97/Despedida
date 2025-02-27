import { useState, useEffect } from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';
import { FaCircle, FaSquare, FaPlay } from 'react-icons/fa';

/**
 * Componente auxiliar para texto con efecto "máquina de escribir".
 * - `text`: el texto a mostrar.
 * - `speed`: ms por caracter.
 * - `style`: objeto de estilos CSS para el <p>.
 */
function TypedText({ text, speed = 50, style }) {
  const [display, setDisplay] = useState('');

  useEffect(() => {
    // Si no hay texto, salimos
    if (!text) {
      setDisplay('');
      return;
    }
    let i = 0;
    setDisplay(''); // Reinicia cada vez que cambie 'text'
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
  // En qué paso estamos
  const [stepIndex, setStepIndex] = useState(0);
  // Cuántos bloques hemos revelado en el paso actual
  const [revealedBlocksCount, setRevealedBlocksCount] = useState(1);

  // Datos de ejemplo:
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

  // Cada vez que cambie el paso, volvemos a mostrar el primer bloque
  useEffect(() => {
    setRevealedBlocksCount(1);
  }, [stepIndex]);

  // Verifica que storySteps tenga algo
  if (!Array.isArray(storySteps) || storySteps.length === 0) {
    return (
      <div style={{ padding: '20px', color: 'red' }}>
        <h1>Error: no hay pasos definidos.</h1>
      </div>
    );
  }

  // Asegúrate de que stepIndex esté dentro de los límites
  const safeStepIndex = Math.min(Math.max(stepIndex, 0), storySteps.length - 1);
  const currentStep = storySteps[safeStepIndex];

  // Si el paso actual está mal definido o no tiene bloques, mostramos error
  if (!currentStep || !Array.isArray(currentStep.blocks)) {
    return (
      <div style={{ padding: '20px', color: 'red' }}>
        <h1>Error: el paso {safeStepIndex + 1} no tiene bloques válidos.</h1>
      </div>
    );
  }

  const totalBlocks = currentStep.blocks.length;
  // Ajustar revealedBlocksCount a los límites
  const safeRevealedBlocksCount = Math.min(Math.max(revealedBlocksCount, 1), totalBlocks);

  // Filtra los bloques que se mostrarán
  const revealedBlocks = currentStep.blocks.slice(0, safeRevealedBlocksCount);

  // ¿Estamos en el último paso?
  const isLastStep = safeStepIndex === storySteps.length - 1;
  // ¿Están todos los bloques del paso revelados?
  const areAllBlocksRevealed = safeRevealedBlocksCount >= totalBlocks;

  // Mostrar el siguiente bloque en el mismo paso
  const handleContinueBlock = () => {
    if (!areAllBlocksRevealed) {
      setRevealedBlocksCount((prev) => prev + 1);
    }
  };

  // Avanzar al siguiente paso
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
          {/* Título del paso */}
          <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>
            Paso {safeStepIndex + 1}
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

          {/* Renderiza los bloques revelados */}
          {revealedBlocks.map((block, i) => {
            // Verificar que el objeto block esté bien formado
            if (!block || !block.type) return null;

            if (block.type === 'text') {
              // Si no tiene 'content', no mostrar nada
              if (!block.content || typeof block.content !== 'string') {
                return (
                  <p key={i} style={{ color: 'red' }}>
                    Error: texto inválido en bloque {i + 1}.
                  </p>
                );
              }
              return (
                <TypedText
                  key={i}
                  text={block.content}
                  speed={50}
                  style={{
                    fontSize: '18px',
                    lineHeight: '1.8',
                    marginBottom: '20px'
                  }}
                />
              );
            }

            if (block.type === 'image') {
              // Si no tiene 'content', no mostrar nada
              if (!block.content || typeof block.content !== 'string') {
                return (
                  <p key={i} style={{ color: 'red' }}>
                    Error: URL inválida en bloque {i + 1}.
                  </p>
                );
              }
              return (
                <motion.img
                  key={i}
                  src={block.content}
                  alt={`bloque-${i}`}
                  style={{
                    width: '100%',
                    borderRadius: '10px',
                    marginBottom: '20px'
                  }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                />
              );
            }

            // Otros tipos de bloque
            return (
              <p key={i} style={{ color: 'red' }}>
                Tipo de bloque desconocido: {block.type}
              </p>
            );
          })}

          {/* Botón para mostrar el siguiente bloque del mismo paso (si no hemos mostrado todos) */}
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

          {/* Botón para pasar al siguiente paso (si estamos en el último bloque y no es el último paso) */}
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

          {/* Mensaje final si es el último paso y ya se revelaron todos los bloques */}
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


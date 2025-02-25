import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Head from 'next/head';
import { FaCircle, FaSquare, FaPlay } from 'react-icons/fa';

export default function Home() {
  // Índice del paso actual y del bloque actual dentro de ese paso
  const [stepIndex, setStepIndex] = useState(0);
  const [blockIndex, setBlockIndex] = useState(0);

  // Texto mostrado parcialmente (efecto máquina de escribir)
  const [displayedText, setDisplayedText] = useState('');

  // Control de si el bloque actual ya se completó (texto terminado de escribir o imagen cargada)
  const [blockComplete, setBlockComplete] = useState(false);

  // Datos de la historia
  const storySteps = [
    {
      blocks: [
        {
          type: 'text',
          content: 'Bienvenidos al primer desafío. Solo los más valientes continuarán adelante.'
        },
        {
          type: 'image',
          content: 'https://picsum.photos/id/1015/800/500'
        },
        {
          type: 'text',
          content: 'Aquí va un texto adicional después de la imagen. ¿Estás listo para más?'
        }
      ]
    },
    {
      blocks: [
        {
          type: 'text',
          content: 'El siguiente reto será aún más difícil. Prepara tu mente.'
        },
        {
          type: 'image',
          content: 'https://picsum.photos/id/1016/800/500'
        }
      ]
    },
    {
      blocks: [
        {
          type: 'text',
          content: 'Has llegado lejos. Supera este último desafío para consagrarte campeón.'
        },
        {
          type: 'image',
          content: 'https://picsum.photos/id/1020/800/500'
        }
      ]
    }
  ];

  // Obtiene el bloque actual
  const currentStep = storySteps[stepIndex];
  const currentBlock = currentStep.blocks[blockIndex];

  // Efecto para el bloque de texto (máquina de escribir)
  useEffect(() => {
    // Reseteamos el texto y el estado de “completado”
    setDisplayedText('');
    setBlockComplete(false);

    if (currentBlock.type === 'text') {
      let currentText = '';
      const timer = setInterval(() => {
        if (currentText.length < currentBlock.content.length) {
          currentText = currentBlock.content.substring(0, currentText.length + 1);
          setDisplayedText(currentText);
        } else {
          // Acabó de escribir el texto
          clearInterval(timer);
          setBlockComplete(true);
        }
      }, 50); // Velocidad de escritura (ajusta a tu gusto)

      return () => clearInterval(timer);
    }

    if (currentBlock.type === 'image') {
      // Para imágenes, no usamos el efecto de texto
      // Esperamos a que cargue la imagen antes de marcarlo como completado
      setDisplayedText(''); // Sin texto a mostrar en bloque de imagen
      // No podemos saber exactamente cuándo se cargó la imagen sin un <img> real
      // pero haremos un truco en la parte del <img> con onLoad.
    }
  }, [stepIndex, blockIndex]);

  // Maneja el evento “onLoad” de la imagen para marcarlo como bloque completado
  const handleImageLoad = () => {
    setBlockComplete(true);
  };

  // Función para avanzar al siguiente bloque o al siguiente paso
  const nextBlock = () => {
    // Ver si hay más bloques en el paso actual
    if (blockIndex < currentStep.blocks.length - 1) {
      // Avanzar al siguiente bloque
      setBlockIndex((prev) => prev + 1);
    } else {
      // Si no hay más bloques, pasar al siguiente paso
      if (stepIndex < storySteps.length - 1) {
        setStepIndex((prev) => prev + 1);
        setBlockIndex(0);
      }
    }
  };

  // Ver si estamos en el último paso y último bloque
  const isLastBlockOfLastStep =
    stepIndex === storySteps.length - 1 && blockIndex === currentStep.blocks.length - 1;

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
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap"
        />
      </Head>

      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        {/* Contenedor animado */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}>
          <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>
            {`Paso ${stepIndex + 1}, Bloque ${blockIndex + 1}`}
          </h1>

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

          {/* Si el bloque es de tipo 'text', mostramos displayedText */}
          {currentBlock.type === 'text' && (
            <p style={{ fontSize: '18px', lineHeight: '1.8', marginBottom: '20px' }}>
              {displayedText}
            </p>
          )}

          {/* Si el bloque es de tipo 'image', mostramos la imagen con onLoad */}
          {currentBlock.type === 'image' && (
            <motion.img
              src={currentBlock.content}
              alt='Imagen del desafío'
              style={{ width: '100%', borderRadius: '10px', marginBottom: '20px' }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              onLoad={handleImageLoad} // Se marca como completo cuando cargue
            />
          )}

          {/* Botón 'Siguiente' solo aparece si el bloque está completo (texto acabado o imagen cargada) */}
          {!isLastBlockOfLastStep && blockComplete && (
            <button
              onClick={nextBlock}
              style={{
                display: 'block',
                margin: '0 auto',
                marginTop: '20px',
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
              Siguiente
            </button>
          )}

          {/* Si es el último bloque del último paso, podrías mostrar un mensaje final */}
          {isLastBlockOfLastStep && blockComplete && (
            <p style={{ textAlign: 'center', marginTop: '20px' }}>
              ¡Has completado todos los desafíos!
            </p>
          )}
        </motion.div>
      </div>
    </div>
  );
}
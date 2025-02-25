import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Head from 'next/head';
import { FaCircle, FaSquare, FaPlay } from 'react-icons/fa';

export default function Home() {
  const [step, setStep] = useState(0);
  const [displayedText, setDisplayedText] = useState('');

  // Pasos de la historia/desafío
  const storySteps = [
    {
      text: 'Bienvenidos al desafío. Solo los más valientes continuarán adelante.',
      image: 'https://picsum.photos/id/1015/800/500'
    },
    {
      text: 'El primer reto os pondrá a prueba. Solo uno saldrá victorioso.',
      image: 'https://picsum.photos/id/1016/800/500'
    },
    {
      text: 'Preparad vuestras mentes y superad el segundo desafío.',
      image: 'https://picsum.photos/id/1020/800/500'
    }
  ];

  // Efecto para ir escribiendo el texto
  useEffect(() => {
    if (step >= 0) {
      let currentText = '';
      const timer = setInterval(() => {
        if (currentText.length < storySteps[step].text.length) {
          currentText = storySteps[step].text.substring(0, currentText.length + 1);
          setDisplayedText(currentText);
        } else {
          clearInterval(timer);
        }
      }, 100); // Velocidad de aparición (ms) a tu gusto
      return () => clearInterval(timer);
    }
  }, [step]);

  // Avanza al siguiente paso
  const nextStep = () => {
    if (step < storySteps.length - 1) {
      setDisplayedText('');
      setStep(step + 1);
    }
  };

  // Comprueba si el texto actual ya coincide con el texto completo del paso
  const isTextComplete = displayedText.length === storySteps[step].text.length;

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
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
          {/* Título que cambia si estás en el primer paso o en uno intermedio */}
          <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>
            {step === 0 ? 'Bienvenidos al Desafío' : `Prueba ${step}`}
          </h1>

          {/* Iconos de triángulo, cuadrado y círculo */}
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

          {/* Texto que aparece progresivamente */}
          <p style={{ fontSize: '18px', lineHeight: '1.8', marginBottom: '20px' }}>
            {displayedText}
          </p>

          {/* Imagen con animación */}
          {storySteps[step]?.image && (
            <motion.img
              src={storySteps[step].image}
              alt={`Paso ${step}`}
              style={{ width: '100%', borderRadius: '10px', marginBottom: '20px' }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            />
          )}

          {/* Botón de siguiente paso solo cuando el texto está completo */}
          {isTextComplete && step < storySteps.length - 1 && (
            <button
              onClick={nextStep}
              style={{
                display: 'block',
                margin: '0 auto',
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
        </motion.div>
      </div>
    </div>
  );
}
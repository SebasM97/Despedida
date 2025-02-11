import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Head from 'next/head';
import { FaCircle, FaSquare, FaPlay } from 'react-icons/fa';

export default function Home() {
  const [step, setStep] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const storySteps = [
    {
      text: 'Bienvenidos al desafío. Solo los más valientes continuarán adelante.',
      image: '/images/challenge-1.jpg',
      sound: '/sounds/intro.mp3'
    },
    {
      text: 'El primer reto os pondrá a prueba. Solo uno saldrá victorioso.',
      image: '/images/challenge-2.jpg',
      sound: '/sounds/challenge-1.mp3'
    },
    {
      text: 'Preparad vuestras mentes y superad el segundo desafío.',
      image: '/images/challenge-3.jpg',
      sound: '/sounds/challenge-2.mp3'
    }
  ];

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
      }, 100);
      return () => clearInterval(timer);
    }
  }, [step]);

  const nextStep = () => {
    if (step < storySteps.length - 1) {
      setDisplayedText('');
      setStep(step + 1);
    }
  };

  return (
    <div style={{
      backgroundColor: 'black',
      minHeight: '100vh',
      padding: '20px',
      fontFamily: '"Press Start 2P", cursive',
      color: 'white'
    }}>
      <Head>
        <title>Desafío Interactivo</title>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap" />
      </Head>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
          <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>{step === 0 ? 'Bienvenidos al Desafío' : 'Prueba ' + step}</h1>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', fontSize: '30px', color: '#FF3E00' }}>
            <FaCircle />
            <FaSquare />
            <FaPlay />
          </div>
          <p style={{ fontSize: '18px', lineHeight: '1.8', marginBottom: '20px' }}>{displayedText}</p>
          <motion.img 
            src={storySteps[step].image} 
            alt="story" 
            style={{ width: '100%', borderRadius: '10px', marginBottom: '20px' }} 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.8 }}
          />
          {step < storySteps.length - 1 && (
            <button 
              onClick={nextStep} 
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
              onMouseOver={(e) => e.target.style.backgroundColor = '#D32F2F'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#FF3E00'}
            >
              Siguiente
            </button>
          )}
        </motion.div>
      </div>
    </div>
  );
}

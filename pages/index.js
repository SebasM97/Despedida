import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Head from 'next/head';

export default function Home() {
  const [step, setStep] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const storySteps = [
    {
      text: 'Hace mucho tiempo, en un reino olvidado, comenzó una historia que cambiaría el destino de todos...',
      image: '/images/reino-antiguo.jpg'
    },
    {
      text: 'En las profundidades del bosque encantado, se ocultaba un secreto milenario.',
      image: '/images/bosque-encantado.jpg'
    },
    {
      text: 'El joven aventurero se adentró sin temor, guiado por una antigua profecía.',
      image: '/images/aventurero.jpg'
    }
  ];

  useEffect(() => {
    let currentText = '';
    const timer = setInterval(() => {
      if (currentText.length < storySteps[step].text.length) {
        currentText = storySteps[step].text.substring(0, currentText.length + 1);
        setDisplayedText(currentText);
      } else {
        clearInterval(timer);
      }
    }, 100); // Ajusta la velocidad del texto (100 ms por letra)
    return () => clearInterval(timer);
  }, [step]);

  const nextStep = () => {
    if (step < storySteps.length - 1) {
      setDisplayedText('');
      setStep(step + 1);
    }
  };

  return (
    <div style={{
      backgroundColor: 'white',
      minHeight: '100vh',
      padding: '20px',
      fontFamily: '"Cormorant Garamond", serif',
      color: '#4A2C2A'
    }}>
      <Head>
        <title>Historia Interactiva</title>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;700&display=swap" />
      </Head>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        {step === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
            <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>Bienvenido a la Historia Interactiva</h1>
            <button 
              onClick={nextStep} 
              style={{
                display: 'block',
                margin: '0 auto',
                padding: '10px 20px',
                fontSize: '18px',
                backgroundColor: '#D4A373',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                transition: 'background-color 0.3s ease'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#C38E59'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#D4A373'}
            >
              Comenzar
            </button>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
            <p style={{ fontSize: '20px', lineHeight: '1.8', marginBottom: '20px' }}>{displayedText}</p>
            <img src={storySteps[step].image} alt="story" style={{ width: '100%', borderRadius: '10px', marginBottom: '20px' }} />
            {step < storySteps.length - 1 && (
              <button 
                onClick={nextStep} 
                style={{
                  display: 'block',
                  margin: '0 auto',
                  padding: '10px 20px',
                  fontSize: '18px',
                  backgroundColor: '#D4A373',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  transition: 'background-color 0.3s ease'
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = '#C38E59'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#D4A373'}
              >
                Siguiente
              </button>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}

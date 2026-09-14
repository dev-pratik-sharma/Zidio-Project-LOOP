import React, { useEffect, useRef, useState } from 'react';

export default function InteractiveBackground() {
  const vantaRef = useRef(null);
  const [vantaEffect, setVantaEffect] = useState(null);

  useEffect(() => {
    let effectInstance = null;
    let intervalId = null;

    const initializeVantaNet = () => {
      // Check if global cdnjs window drivers are active and attached cleanly
      if (window.VANTA && window.VANTA.NET && vantaRef.current && !effectInstance) {
        try {
          effectInstance = window.VANTA.NET({
            el: vantaRef.current,
            mouseControls: true,
            touchControls: true,
            gyroControls: false,
            minHeight: 200.0,
            minWidth: 200.0,
            scale: 1.0,
            scaleMobile: 1.0,
            color: 0x6366f1,           // Bright Indigo Neon lines
            backgroundColor: 0x030712,     // Deep Corporate Midnight Gray Hex (#030712)
            points: 11.0,              // Concentration node layout density
            maxDistance: 21.0,
            spacing: 16.0
          });
          setVantaEffect(effectInstance);
          clearInterval(intervalId); // Stop tracking loop once successfully mounted
          console.log("⚡ Vanta 3D Net Engine mounted successfully.");
        } catch (err) {
          console.error("Vanta build tracking fault:", err);
        }
      }
    };

    // Run immediate check
    initializeVantaNet();

    // Fallback interval loop to handle slow network loads safely
    intervalId = setInterval(initializeVantaNet, 150);

    // Clean up memory blocks on unmount
    return () => {
      if (intervalId) clearInterval(intervalId);
      if (effectInstance) effectInstance.destroy();
    };
  }, []);

  return (
    <div 
      ref={vantaRef} 
      className="fixed inset-0 select-none"
      style={{ 
        width: '100vw', 
        height: '100vh', 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        zIndex: 0, 
        pointerEvents: 'auto', // Enforces mouse capture events
        opacity: 0.35          // Blends beautifully with our dark layout template
      }}
    />
  );
}

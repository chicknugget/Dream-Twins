import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import Galaxy from './Galaxy';
import { memo } from 'react';
import html2canvas from 'html2canvas';

const StarryBackground = memo(() => (
  <div className="absolute inset-0 z-0">
    <Galaxy
      starSpeed={0}
      density={2.5}
      hueShift={200}
      speed={0.6}
      glowIntensity={0.3}
      saturation={0.4}
      repulsionStrength={0.5}
      twinkleIntensity={0.3}
      rotationSpeed={0.1}
      transparent
    />
  </div>
));

const phrases = [
  "Searching The Void...",
  "Consulting The Stars...",
  "Weaving Through Dreams...",
  "Whispering To The Cosmos...",
  "Almost There...",
];

const CyclingText = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex(i => (i + 1) % phrases.length);
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  return (
    <AnimatePresence mode="wait">
      <motion.p
        key={index}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        transition={{ duration: 0.4 }}
        className="text-lg italic tracking-widest text-center"
      >
        {phrases[index]}
      </motion.p>
    </AnimatePresence>
  );
};


const App = () => {
  const [formData, setFormData] = useState({ name: '', country: '', dream_text: '' });
  const [result, setResult] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [rateLimited, setRateLimited] = useState(false);
  const [isMobile, setIsMobile] = useState(false); // ← move here

  useEffect(() => {                                  // ← move here
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSearching(true);
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/connect-dream`, formData);
      console.log(res.data);
      setTimeout(() => {
        setResult(res.data);
        setIsSearching(false);
      }, 2000);
    } catch (err) {
      if (err.response?.status === 429) {
        setRateLimited(true);
      }
      setIsSearching(false);
    }
  };
  const shareCardRef = useRef(null);

  const handleCopy = () => {
    if (!result) return;
    const text = `✦ Dream Twins ✦\n\n"${result.match_text}"\n\n${result.score}% Dream Match\n\ndreamtwins.app`;
    navigator.clipboard.writeText(text).then(() => {
      alert('Copied to clipboard!');
    });
  };
  const handleDownload = async () => {
    if (!shareCardRef.current) {
      console.log('ref is null:', shareCardRef.current);
      return;
    }
    try {
      const canvas = await html2canvas(shareCardRef.current);
      const link = document.createElement('a');
      link.download = 'dream-twins-match.png';
      link.href = canvas.toDataURL();
      link.click();
    } catch (err) {
      console.error('html2canvas error:', err);
    }
  };
  if (isMobile) {
    return (
      <div className="relative min-h-screen w-full overflow-hidden bg-[#050510] flex flex-col items-center justify-center text-center px-8">
        <StarryBackground />
        <div className="relative z-10 space-y-6">
          <img src="icons/title.png" alt="Dream Twins" style={{ width: 280, margin: '0 auto' }} />
          <p className="text-white/70 italic font-serif text-lg leading-relaxed">
            "This dream is best experienced on a desktop..."
          </p>
          <p className="text-white/40 text-sm tracking-widest">
            Open on a laptop or PC for the full experience ✦
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#050510] flex flex-col items-center justify-center font-['EfcoBrookshire',serif]">
      <StarryBackground />
      <div className="absolute inset-0" style={{ zIndex: 1 }}>
        {/* Title — properly centered */}
        <motion.img
          src="icons/title.png"
          alt="Dream Twins"
          className="absolute"
          style={{ top: "2%", left: "35%", transform: "translateX(-50%)", width: 420 }}
          initial={{ opacity: 0, y: -60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0 }}
        />

        {/* Sun — smaller, fully visible */}
        <motion.div
          className="absolute flex flex-col items-center"
          style={{ left: "2%", top: "0%" }}
          initial={{ opacity: 0, y: -80 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, ease: "easeOut", delay: 0.5 }}
        >
          <div style={{ width: 2, height: 150, backgroundColor: 'rgba(247, 241, 193, 0.8)', marginBottom: -15 }} />
          <img src="icons/sun.png" alt="Sun" style={{ width: 230, display: 'block' }} />
        </motion.div>

        {/* Moon — smaller, fully visible */}
        <motion.div
          className="absolute flex flex-col items-center"
          style={{ right: "2%", top: "0%" }}
          initial={{ opacity: 0, y: -80 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, ease: "easeOut", delay: 0.5 }}
        >
          <div style={{ width: 2, height: 150, backgroundColor: 'rgba(247, 241, 193, 0.8)', marginBottom: -35 }} />
          <img src="icons/moon.png" alt="Moon" style={{ width: 230, display: 'block' }} />
        </motion.div>

        {/* Star left */}
        <motion.div
          className="absolute flex flex-col items-center"
          style={{ left: "20%", top: "0%" }}
          initial={{ opacity: 0, y: -60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.7 }}
        >
          <div style={{ width: 2, height: 100, backgroundColor: 'rgba(247, 241, 193, 0.8)', marginBottom: -32 }} />
          <img src="icons/star.png" alt="Star left" style={{ width: 150, display: 'block' }} />
        </motion.div>

        {/* Star right */}
        <motion.div
          className="absolute flex flex-col items-center"
          style={{ right: "20%", top: "0%" }}
          initial={{ opacity: 0, y: -60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.9 }}
        >
          <div style={{ width: 2, height: 100, backgroundColor: 'rgba(247, 241, 193, 0.8)', marginBottom: -32 }} />
          <img src="icons/star.png" alt="Star right" style={{ width: 150, display: 'block' }} />
        </motion.div>

        {/* Angel + clouds */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <img
            src="icons/angel.png"
            alt="Angel"
            className="absolute left-1/2"
            style={{ top: "22%", transform: "translateX(-50%)", width: 150, zIndex: 2 }}
          />
          <img
            src="icons/cloud-left.png"
            alt=""
            className="absolute"
            style={{
              top: "23%", left: "calc(50% - 120px)", width: 150, zIndex: 3,
              animation: "dreamFloatLeft 8s ease-in-out infinite",
            }}
          />
          <img
            src="icons/cloud-right.png"
            alt=""
            className="absolute"
            style={{
              top: "23%", left: "calc(50% + 0px)", width: 150, zIndex: 3,
              animation: "dreamFloatRight 8s ease-in-out infinite",
            }}
          />
        </motion.div>
      </div>
      <style>{`
        @keyframes dreamFloatLeft {
          0%   { transform: translateX(0px);   }
          50%  { transform: translateX(-14px);  }
          100% { transform: translateX(0px);   }
        }
        @keyframes dreamFloatRight {
          0%   { transform: translateX(0px);   }
          50%  { transform: translateX(14px);  }
          100% { transform: translateX(0px);   }
        }
      `}</style>

      <div className="relative z-30 flex flex-col items-center" style={{ marginTop: '30vh' }}>

        <div className="relative flex items-center justify-center" style={{ width: 700, height: 540 }}>
          <img
            src="icons/ornate-frame.png"
            alt="Ornate Frame"
            className="absolute inset-0 w-full h-full object-contain pointer-events-none"
            style={{ width: 1150, height: 700, top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 0 }}
          />
          <div className="relative z-10 w-[55%] ml-[15%] mt-[5%]">
            <AnimatePresence mode="wait">
              {rateLimited ? (
                <motion.div
                  key="ratelimit"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center text-[#4a3b28] space-y-4"
                >
                  <p className="text-2xl italic">✦ The stars need a moment to rest... ✦</p>
                  <p className="text-sm opacity-60 tracking-widest">Please wait a minute before trying again</p>
                  <button
                    onClick={() => setRateLimited(false)}
                    className="mt-4 text-sm opacity-60 underline"
                  >
                    Return to Sleep
                  </button>
                </motion.div>
              ) : !isSearching && !result ? (
                <motion.form
                  key="form"
                  exit={{ opacity: 0, scale: 0.9 }}
                  onSubmit={handleSubmit}
                  className="w-3/4 space-y-4 text-[#4a3b28]"
                >
                  <div className="flex gap-4">
                    <input
                      type="text"
                      placeholder="Name"
                      className="w-1/2 p-2 bg-transparent border-b-2 border-[#402f12]/50 outline-none placeholder-[#402f12]/50 text-sm transition-all duration-300 focus:border-[#c9a84c] focus:drop-shadow-[0_2px_6px_rgba(201,168,76,0.6)]"
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                    />
                    <input
                      type="text"
                      placeholder="Country"
                      className="w-1/2 p-2 bg-transparent border-b-2 border-[#402f12]/50 outline-none placeholder-[#402f12]/50 text-sm transition-all duration-300 focus:border-[#c9a84c] focus:drop-shadow-[0_2px_6px_rgba(201,168,76,0.6)]"
                      onChange={e => setFormData({ ...formData, country: e.target.value })}
                    />
                  </div>
                  <textarea
                    placeholder="Tell your dream..."
                    rows="3"
                    className="w-full p-2 bg-transparent border-b-2 border-[#402f12]/50 outline-none placeholder-[#402f12]/50 resize-none text-sm transition-all duration-300 focus:border-[#c9a84c] focus:drop-shadow-[0_2px_6px_rgba(201,168,76,0.6)]"
                    onChange={e => setFormData({ ...formData, dream_text: e.target.value })} />
                  <button
                    type="submit"
                    className="w-full py-3 text-lg hover:text-black transition-colors tracking-widest bg-[#402f12]/50 border border-[#402f12]/30 rounded-sm backdrop-blur-sm">
                    Send Into The Stars
                  </button>
                </motion.form>
              ) : isSearching ? (
                <motion.div
                  key="searching"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center gap-4 text-[#4a3b28]"
                >
                  <div className="relative w-16 h-16">
                    {[...Array(6)].map((_, i) => (
                      <motion.span
                        key={i}
                        className="absolute text-lg"
                        style={{ top: '50%', left: '50%' }}
                        animate={{
                          rotate: [0, 360],
                          x: Math.cos((i / 6) * Math.PI * 2) * 28,
                          y: Math.sin((i / 6) * Math.PI * 2) * 28,
                        }}
                        transition={{
                          rotate: { duration: 4, repeat: Infinity, ease: "linear", delay: i * 0.15 },
                          x: { duration: 0, delay: 0 },
                          y: { duration: 0, delay: 0 },
                        }}
                      >
                        ✦
                      </motion.span>
                    ))}
                    <motion.span
                      className="absolute text-2xl"
                      style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
                      animate={{ scale: [1, 1.3, 1], opacity: [0.6, 1, 0.6] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    >
                      ✦
                    </motion.span>
                  </div>

                  <CyclingText />
                </motion.div>
              ) : (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center text-[#4a3b28] w-full"
                >
                  {result.score && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                      className="inline-block mb-2 px-4 py-1 border border-[#c9a84c]/50 bg-[#c9a84c]/10 rounded-full"
                    >
                      <span className="text-base tracking-widest text-[#4a3401]">
                        ✦ {result.score}% Dream Match ✦
                      </span>
                    </motion.div>)}

                  <p className="text-sm mb-2 tracking-widest">{result.message}</p>


                  <div className="overflow-y-auto max-h-24 px-2" style={{ scrollbarWidth: 'none' }}>
                    <p className="text-base italic font-serif leading-relaxed text-[#4a3401]">"{result.match_text}"</p>
                  </div>
                  <div
                    ref={shareCardRef}
                    style={{
                      position: 'fixed',
                      top: '-9999px',
                      left: '-9999px',
                      width: 500,
                      padding: '32px',
                      background: 'linear-gradient(135deg, #1a1a2e, #16213e)',
                      border: '1px solid rgba(201,168,76,0.4)',
                      borderRadius: 12,
                      textAlign: 'center',
                    }}
                  >
                    <p style={{ color: '#c9a84c', letterSpacing: '0.2em', fontSize: 12, marginBottom: 12 }}>✦ Dream Twins ✦</p>
                    <p style={{ color: 'white', fontStyle: 'italic', fontFamily: 'serif', fontSize: 18, lineHeight: 1.6, marginBottom: 12 }}>
                      "{result.match_text}"
                    </p>
                    <p style={{ color: '#c9a84c', fontSize: 12 }}>{result.score}% Dream Match</p>
                    <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11, marginTop: 8 }}>dreamtwins.app</p>
                  </div>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="flex gap-3 justify-center mt-4"
                  >
                    <button
                      onClick={handleCopy}
                      className="px-4 py-2 text-sm tracking-widest border border-[#4a3b28]/30 bg-[#4a3b28]/10 hover:bg-[#4a3b28]/20 transition-colors rounded-sm"
                    >
                      ✦ Copy
                    </button>
                    <button
                      onClick={handleDownload}
                      className="px-4 py-2 text-sm tracking-widest border border-[#c9a84c]/30 bg-[#c9a84c]/10 hover:bg-[#c9a84c]/20 transition-colors rounded-sm"
                    >
                      ✦ Save As Image
                    </button>
                  </motion.div>
                  <button onClick={() => setResult(null)} className="mt-4 text-base opacity-100 underline block mx-auto border-[#402f12]/30 rounded-sm backdrop-blur-sm">
                    Return to Sleep
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
      <div>
        <a
          href="https://github.com/chicknugget/Dream-Twins"
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-4 right-4 z-50 group rounded-full p-1 bg-transparent hover:bg-[#c9a84c]/20 transition-colors"
        >
          <motion.img
            src="icons/nugget.png"
            alt="Made by nugget"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 0.8, scale: 1 }}
            transition={{ delay: 1.5, type: "spring", stiffness: 200 }}
            whileHover={{ scale: 1.2, rotate: 10 }}
            style={{ width: 48 }}
          />
          <span className="absolute bottom-14 right-0 text-xs text-white/60 tracking-widest whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            ✦ made by nugget ✦
          </span>
        </a>
      </div >
    </div >
  );
};

export default App;

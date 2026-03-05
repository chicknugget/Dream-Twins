import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import Galaxy from './Galaxy';
import { memo } from 'react';

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

const App = () => {
  const [formData, setFormData] = useState({ name: '', country: '', dream_text: '' });
  const [result, setResult] = useState(null);
  const [isSearching, setIsSearching] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSearching(true);
    try {
      const res = await axios.post('http://127.0.0.1:8000/connect-dream', formData);
      setTimeout(() => {
        setResult(res.data);
        setIsSearching(false);
      }, 2000);
    } catch (err) {
      console.error(err);
      setIsSearching(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#050510] flex flex-col items-center justify-center font-['EfcoBrookshire',serif]">
      <StarryBackground />
      <div className="absolute inset-0" style={{ zIndex: 1 }}>
        <div className="absolute flex flex-col items-center" style={{ left: "6%", top: "0%", gap: 0 }}>
          <div style={{ width: 2, height: 150, backgroundColor: 'rgba(247, 241, 193, 0.8)', marginBottom: -15 }} />
          <img src="icons/sun.png" alt="Sun" style={{ width: 250, display: 'block' }} />
        </div>

        <div className="absolute flex flex-col items-center" style={{ right: "6%", top: "0%", gap: 0 }}>
          <div style={{ width: 2, height: 150, backgroundColor: 'rgba(247, 241, 193, 0.8)', marginBottom: -36 }} />
          <img src="icons/moon.png" alt="Moon" style={{ width: 250, display: 'block' }} />
        </div>

        <div className="absolute flex flex-col items-center" style={{ left: "24%", top: "0%", gap: 0 }}>
          <div style={{ width: 2, height: 75, backgroundColor: 'rgba(247, 241, 193, 0.8)', marginBottom: -32 }} />
          <img src="icons/star.png" alt="Star Left" style={{ width: 180, display: 'block' }} />
        </div>

        <div className="absolute flex flex-col items-center" style={{ right: "24%", top: "0%", gap: 0 }}>
          <div style={{ width: 2, height: 75, backgroundColor: 'rgba(247, 241, 193, 0.8)', marginBottom: -32 }} />
          <img src="icons/star.png" alt="Star Right" style={{ width: 180, display: 'block' }} />
        </div>

        <img
          src="icons/title.png"
          alt="Dream Twins"
          className="absolute left-1/2"
          style={{ top: "1.5%", transform: "translateX(-50%)", width: 420 }}
        />

        <img
          src="icons/angel.png"
          alt="Angel"
          className="absolute left-1/2"
          style={{
            top: "19%",
            transform: "translateX(-50%)",
            width: 160,
            zIndex: 2,
          }}
        />

        <img
          src="icons/cloud-left.png"
          alt=""
          className="absolute"
          style={{
            top: "20%",
            left: "calc(50% - 120px)",
            width: 160,
            zIndex: 3,
            animation: "dreamFloatLeft 8s ease-in-out infinite",
          }}
        />

        <img
          src="icons/cloud-right.png"
          alt=""
          className="absolute"
          style={{
            top: "20%",
            left: "calc(50% + 0px)",
            width: 160,
            zIndex: 3,
            animation: "dreamFloatRight 8s ease-in-out infinite reverse",
          }}
        />
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
              {!isSearching && !result ? (
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
                      className="w-1/2 p-2 bg-transparent border-b-2 border-[#402f12]/50 outline-none placeholder-[#402f12]/50 text-sm"
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                    />
                    <input
                      type="text"
                      placeholder="Country"
                      className="w-1/2 p-2 bg-transparent border-b-2 border-[#402f12]/50 outline-none placeholder-[#402f12]/50 text-sm"
                      onChange={e => setFormData({ ...formData, country: e.target.value })}
                    />
                  </div>
                  <textarea
                    placeholder="Tell your dream..."
                    rows="3"
                    className="w-full p-2 bg-transparent border-b-2 border-[#402f12]/50 outline-none placeholder-[#402f12]/50 resize-none text-sm"
                    onChange={e => setFormData({ ...formData, dream_text: e.target.value })} />
                  <button
                    type="submit"
                    className="w-full py-3 text-lg hover:text-black transition-colors tracking-widest bg-[#402f12]/50 border border-[#402f12]/30 rounded-sm backdrop-blur-sm">
                    Send Into The Stars
                  </button>
                </motion.form>
              ) : isSearching ? (
                <motion.div key="searching" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-4xl text-[#4a3b28] italic animate-pulse">
                  Searching The Void...
                </motion.div>
              ) : (
                <motion.div key="result" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center text-[#4a3b28] max-w-md">
                  <p className="text-xl mb-4 tracking-widest">{result.message}</p>
                  <p className="text-2xl italic font-serif leading-relaxed px-4">"{result.match_text}"</p>
                  <button onClick={() => setResult(null)} className="mt-8 text-sm opacity-60 underline">Return to Sleep</button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;

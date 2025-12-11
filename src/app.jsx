import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { 
  ArrowUpRight, 
  Instagram, 
  Youtube, 
  Disc, 
  Aperture, 
  Zap, 
  Music, 
  Layers,
  ChevronDown,
  Volume2,
  VolumeX,
  Sparkles,
  Cpu,
  Loader2,
  Workflow,
  Share2,
  Monitor,
  Wifi,
  Scissors,
  CheckCircle2
} from 'lucide-react';

// --- CONFIGURATION ---
// This line automatically pulls the key from your .env file
// If you see a warning in the preview about import.meta, ignore it. It works locally.
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || ""; 

// --- API HELPER FUNCTIONS ---
const generateGeminiContent = async (prompt) => {
  if (!GEMINI_API_KEY) {
    console.warn("Missing Gemini API Key");
    return "API Key missing. Please configure the Neural Link in .env (local) or Netlify (production).";
  }

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });
    
    if (!response.ok) throw new Error("API call failed");
    
    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "No creative data received.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Transmission failed. Neural link unstable. Please try again.";
  }
};

// --- CUSTOM ICONS ---
const DiscordIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18.8943 4.34399C17.5139 3.70999 16.0597 3.25099 14.5443 3.00099C14.5443 3.00099 14.2697 3.49999 14.0697 3.96699C12.4283 3.72299 10.7957 3.72299 9.16571 3.96699C8.96571 3.49999 8.67971 3.00099 8.67971 3.00099C7.16286 3.25099 5.71014 3.70999 4.33129 4.34399C1.55271 8.46899 0.792429 12.506 1.17129 16.488C2.84271 17.726 4.46271 18.477 6.04971 18.965C6.43571 18.44 6.77971 17.883 7.07271 17.301C6.49571 17.086 5.94271 16.818 5.41971 16.512C5.55829 16.41 5.69414 16.3021 5.82714 16.191C9.07971 17.697 12.6397 17.697 15.8611 16.191C15.9969 16.303 16.1331 16.411 16.2743 16.512C15.7483 16.82 15.1927 17.088 14.6127 17.301C14.9057 17.884 15.2497 18.441 15.6357 18.965C17.2241 18.477 18.8443 17.726 20.5183 16.488C20.9757 11.957 19.9571 7.95099 18.8943 4.34399ZM8.24129 13.684C7.26129 13.684 6.45829 12.783 6.45829 11.68C6.45829 10.577 7.24129 9.67699 8.24129 9.67699C9.25271 9.67699 10.0543 10.577 10.0343 11.68C10.0343 12.783 9.24129 13.684 8.24129 13.684ZM15.0011 13.684C14.0211 13.684 13.2183 12.783 13.2183 11.68C13.2183 10.577 14.0011 9.67699 15.0011 9.67699C16.0127 9.67699 16.8143 10.577 16.7943 11.68C16.7943 12.783 16.0127 13.684 15.0011 13.684Z" fill="currentColor"/>
  </svg>
);

// --- NETWORK BACKGROUND (PLEXUS EFFECT) ---
const NetworkBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let width = window.innerWidth;
    let height = window.innerHeight;
    let particles = [];
    let animationFrameId;

    const init = () => {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
        
        const particleCount = Math.floor((width * height) / 15000); 
        particles = [];

        for(let i=0; i<particleCount; i++){
            particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                size: Math.random() * 1.5 + 0.5
            });
        }
    };

    const draw = () => {
        ctx.clearRect(0, 0, width, height);
        ctx.fillStyle = '#22d3ee'; 
        
        particles.forEach((p, index) => {
            p.x += p.vx;
            p.y += p.vy;

            if (p.x < 0 || p.x > width) p.vx *= -1;
            if (p.y < 0 || p.y > height) p.vy *= -1;

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();

            for(let j = index + 1; j < particles.length; j++){
                const p2 = particles[j];
                const dx = p.x - p2.x;
                const dy = p.y - p2.y;
                const distance = Math.sqrt(dx*dx + dy*dy);
                const connectionDistance = 120;

                if (distance < connectionDistance) {
                    ctx.beginPath();
                    const opacity = 0.2 * (1 - distance/connectionDistance);
                    ctx.strokeStyle = `rgba(34, 211, 238, ${opacity})`;
                    ctx.lineWidth = 0.8;
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.stroke();
                }
            }
        });
        
        animationFrameId = requestAnimationFrame(draw);
    };

    init();
    draw();

    const handleResize = () => init();
    window.addEventListener('resize', handleResize);

    return () => {
        cancelAnimationFrame(animationFrameId);
        window.removeEventListener('resize', handleResize);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 z-[-10] bg-black" />;
};

// --- Custom Logo ---
const CustomLogo = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M16 4L28 28H4L16 4Z" stroke="white" strokeWidth="2" />
    <path d="M16 10L22 24H10L16 10Z" fill="white" fillOpacity="0.2" />
    <path d="M16 4V28" stroke="white" strokeWidth="1" strokeOpacity="0.5" />
    <circle cx="16" cy="18" r="2" fill="#22d3ee" />
  </svg>
);

// --- CSS ---
const CustomStyles = () => (
  <>
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&display=swap');
      .font-orbitron { font-family: 'Orbitron', sans-serif; }
      .custom-scrollbar::-webkit-scrollbar { width: 6px; }
      .custom-scrollbar::-webkit-scrollbar-track { background: rgba(255, 255, 255, 0.05); border-radius: 4px; }
      .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(34, 211, 238, 0.3); border-radius: 4px; }
      .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(34, 211, 238, 0.6); }
      .icon-hover-insta:hover path { fill: url(#insta-gradient); stroke: none; }
      .icon-hover-twitter:hover { color: #5865F2; filter: drop-shadow(0 0 8px rgba(88, 101, 242, 0.6)); }
      .icon-hover-youtube:hover { color: #FF0000; filter: drop-shadow(0 0 8px rgba(255, 0, 0, 0.6)); }
      .no-scrollbar::-webkit-scrollbar { display: none; }
      .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      /* Range Slider CSS */
      input[type=range]::-webkit-slider-thumb {
        -webkit-appearance: none;
        pointer-events: none;
      }
    `}</style>
    <svg width="0" height="0" className="absolute">
      <defs>
        <linearGradient id="insta-gradient" x1="100%" y1="100%" x2="0%" y2="0%">
          <stop stopColor="#f09433" offset="0%" />
          <stop stopColor="#e6683c" offset="25%" />
          <stop stopColor="#dc2743" offset="50%" />
          <stop stopColor="#cc2366" offset="75%" />
          <stop stopColor="#bc1888" offset="100%" />
        </linearGradient>
      </defs>
    </svg>
  </>
);

// --- Intro ---
const Intro = ({ onComplete }) => {
  const [text, setText] = useState("");
  const [showCursor, setShowCursor] = useState(true);
  const [showQuote, setShowQuote] = useState(false);
  const [showButton, setShowButton] = useState(false);
  
  const fullText = "WHISTLE FRAMES";
  const quote = "Every frame a masterpiece, every cut a heartbeat.";

  useEffect(() => {
    let currentIndex = 0;
    const typeInterval = setInterval(() => {
      if (currentIndex <= fullText.length) {
        setText(fullText.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(typeInterval);
        setTimeout(() => {
            setShowCursor(false);
            setTimeout(() => setShowQuote(true), 500);
            setTimeout(() => setShowButton(true), 1500);
        }, 500);
      }
    }, 100);
    return () => clearInterval(typeInterval);
  }, []);

  return (
    <motion.div 
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black" 
      exit={{ opacity: 0, transition: { duration: 1.5 } }}
    >
      <div className="absolute inset-0 bg-black/20 z-0" />
      <div className="z-30 text-center px-4 relative">
        <h1 className="text-4xl md:text-7xl font-black text-white tracking-tighter font-orbitron mb-6 min-h-[80px]">
          {text}
          <span className={`inline-block w-3 h-8 md:h-12 bg-cyan-500 ml-2 align-middle ${showCursor ? 'opacity-100' : 'opacity-0'}`} style={{ transition: 'opacity 0.2s' }} />
        </h1>
        <div className="h-16 mb-12">
          {showQuote && (
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="text-cyan-200/60 font-serif italic text-lg md:text-xl tracking-wide"
            >
              "{quote}"
            </motion.p>
          )}
        </div>
        <div className="h-20">
            {showButton && (
                <motion.button
                    onClick={onComplete}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="group relative px-8 py-3 bg-transparent overflow-hidden rounded-full border border-white/20 hover:border-cyan-500/50 transition-all duration-500 cursor-pointer pointer-events-auto"
                >
                    <div className="absolute inset-0 bg-cyan-500/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                    <span className="relative flex items-center gap-3 text-white tracking-[0.2em] text-xs font-bold uppercase">
                        BREACH REALITY <ArrowUpRight className="w-4 h-4" />
                    </span>
                </motion.button>
            )}
        </div>
      </div>
    </motion.div>
  );
};

// --- Navbar ---
const Navbar = () => {
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ delay: 0.5, duration: 1 }}
      className="fixed top-6 left-0 right-0 z-40 flex justify-center px-4 pointer-events-none"
    >
      <div className="pointer-events-auto bg-black/60 backdrop-blur-md border border-white/10 rounded-full px-6 py-3 flex items-center gap-8 shadow-2xl shadow-cyan-900/10">
        <div onClick={() => scrollToSection('hero')} className="cursor-pointer hover:scale-110 transition-transform">
          <CustomLogo />
        </div>
        <div className="hidden md:flex items-center gap-8 text-xs font-medium text-gray-400">
          <button onClick={() => scrollToSection('showcase')} className="hover:text-cyan-400 transition-colors uppercase tracking-wider">Work</button>
          <button onClick={() => scrollToSection('color-grade')} className="hover:text-cyan-400 transition-colors uppercase tracking-wider">Color Grade</button>
          <button onClick={() => scrollToSection('system')} className="hover:text-cyan-400 transition-colors uppercase tracking-wider">System</button>
          <button onClick={() => scrollToSection('services')} className="hover:text-cyan-400 transition-colors uppercase tracking-wider">Services</button>
        </div>
        <button onClick={() => scrollToSection('contact')} className="bg-white text-black px-5 py-2 rounded-full text-[10px] font-black tracking-widest hover:bg-cyan-400 transition-colors uppercase">
          Start Project
        </button>
      </div>
    </motion.nav>
  );
};

// --- Hero ---
const Hero = () => {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const y2 = useTransform(scrollY, [0, 500], [0, -150]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  const scrollToShowcase = () => {
    document.getElementById('showcase')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="hero" className="min-h-screen flex flex-col justify-center items-center px-6 relative z-10 pt-28">
      <motion.div style={{ y: y2, opacity }} className="text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 mb-8 backdrop-blur-sm">
          <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse" />
          <span className="text-cyan-300 text-[10px] tracking-[0.2em] font-bold uppercase">System Online</span>
        </div>
        <div className="pb-6 px-10">
          <h1 className="text-6xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/10 tracking-tighter leading-none mb-6 p-2 pr-4">
            BEYOND
            <br />
            <span className="font-thin italic text-cyan-200/80 font-serif pr-4">Reality</span>
          </h1>
        </div>
        <p className="max-w-md mx-auto text-blue-200/60 text-sm md:text-base leading-relaxed tracking-wide mb-24 mix-blend-plus-lighter">
          We architect digital dreams. A fusion of high-fidelity motion, 
          sound design, and psychological hooks.
        </p>
      </motion.div>
      <motion.div 
        style={{ y: y1, opacity }}
        onClick={scrollToShowcase}
        className="absolute bottom-16 left-1/2 -translate-x-1/2 flex flex-col items-center text-white/40 cursor-pointer hover:text-cyan-400 transition-colors group"
      >
        <ChevronDown className="w-8 h-8 animate-bounce" />
      </motion.div>
    </section>
  );
};

// --- System Architecture ---
const SystemArchitecture = () => {
  const steps = [
    { id: "01", title: "Ingestion", desc: "Raw footage analysis and proxy generation.", icon: Disc },
    { id: "02", title: "Assembly", desc: "Rhythm construction and pacing architecture.", icon: Layers },
    { id: "03", title: "Synthesis", desc: "VFX integration and color grade application.", icon: Cpu },
    { id: "04", title: "Deployment", desc: "High-bitrate rendering and multi-platform delivery.", icon: Share2 }
  ];

  return (
    <section id="system" className="py-16 px-6 relative z-10 mt-0">
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 border-b border-white/10 pb-8">
          <div>
            <div className="inline-flex items-center gap-2 mb-4">
              <Workflow className="w-5 h-5 text-cyan-400" />
              <span className="text-cyan-200 text-xs font-bold tracking-widest uppercase">The Process</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-white uppercase italic tracking-tighter">
              System <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 pr-2">Architecture</span>
            </h2>
          </div>
          <p className="text-gray-400 max-w-md text-sm mt-4 md:mt-0 text-right">
            Our proprietary pipeline ensures pixel-perfect precision from ingest to final render.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group relative p-6 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-colors backdrop-blur-sm"
            >
              <div className="absolute top-4 right-4 text-white/10 font-black text-4xl group-hover:text-cyan-500/20 transition-colors">{step.id}</div>
              <div className="w-12 h-12 bg-black/50 rounded-xl flex items-center justify-center mb-6 text-cyan-400 border border-white/10 group-hover:scale-110 transition-transform">
                <step.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2 uppercase tracking-wide">{step.title}</h3>
              <p className="text-gray-400 text-xs leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// --- Services ---
const FeatureCard = ({ title, subtitle, icon: Icon, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 0.8, delay }}
    className="group relative p-8 rounded-2xl bg-gradient-to-b from-white/5 to-transparent border border-white/5 hover:border-cyan-500/30 transition-all duration-500 overflow-hidden"
  >
    <div className="absolute inset-0 bg-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" />
    <div className="relative z-10">
      <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 text-cyan-400">
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-blue-200/50 text-sm leading-relaxed">{subtitle}</p>
    </div>
  </motion.div>
);

const Services = () => (
  <section id="services" className="py-32 px-6 relative z-10">
    <div className="container mx-auto max-w-6xl">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-3 mb-12 text-center">
          <h2 className="text-3xl md:text-5xl font-thin text-white mb-4">
            The <span className="font-serif italic text-cyan-400">Holistic</span> Process
          </h2>
        </div>
        <FeatureCard icon={Layers} title="Visual Synthesis" subtitle="Complex VFX compositing and color grading that redefines the visual standard." delay={0} />
        <FeatureCard icon={Music} title="Sonic Architecture" subtitle="Bespoke soundscapes designed to trigger psycho-acoustic responses." delay={0.2} />
        <FeatureCard icon={Zap} title="Retention Engineering" subtitle="Data-driven pacing and kinetic typography to maximize viewer hold time." delay={0.4} />
      </div>
    </div>
  </section>
);

// --- Color Grading ---
const ColorGradingSection = () => {
    const [sliderPosition, setSliderPosition] = useState(50);
    const containerRef = useRef(null);
    const [containerWidth, setContainerWidth] = useState(0);
    const isDragging = useRef(false);
  
    const handleMove = (clientX) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
        const percent = (x / rect.width) * 100;
        setSliderPosition(percent);
      }
    };
  
    // Update container width on resize to ensure inner image matches exactly
    useEffect(() => {
        const updateWidth = () => {
            if (containerRef.current) {
                setContainerWidth(containerRef.current.clientWidth);
            }
        };
        window.addEventListener('resize', updateWidth);
        updateWidth();
        return () => window.removeEventListener('resize', updateWidth);
    }, []);

    const handleMouseDown = () => { isDragging.current = true; };
    const handleMouseUp = () => { isDragging.current = false; };
    const handleMouseMove = (e) => { if (isDragging.current) handleMove(e.clientX); };
    const handleTouchMove = (e) => { if (isDragging.current) handleMove(e.touches[0].clientX); };
  
    const imgUrl = "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=1000&auto=format&fit=crop";
  
    return (
      <section id="color-grade" className="py-20 px-6 relative z-10 bg-transparent">
        <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 mb-4">
                    <Sparkles className="w-5 h-5 text-purple-400" />
                    <span className="text-purple-200 text-xs font-bold tracking-widest uppercase">Visual Enhancement</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-black text-white uppercase italic tracking-tighter">
                    Color Grading <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">Magic</span>
                </h2>
                <p className="text-gray-400 mt-4 text-sm">Drag the slider to see the transformation.</p>
            </div>
            
            <div 
                ref={containerRef}
                className="relative w-full max-w-5xl mx-auto aspect-video rounded-3xl overflow-hidden border border-white/10 cursor-col-resize select-none shadow-2xl shadow-purple-900/20 group"
                onMouseDown={handleMouseDown} 
                onMouseUp={handleMouseUp} 
                onMouseLeave={handleMouseUp} 
                onMouseMove={handleMouseMove} 
                onTouchStart={handleMouseDown} 
                onTouchEnd={handleMouseUp} 
                onTouchMove={handleTouchMove}
            >
                {/* 1. Base Layer (AFTER - Full Width) */}
                <div className="absolute inset-0 w-full h-full z-0">
                    <img src={imgUrl} alt="Color Graded" className="w-full h-full object-cover" />
                    {/* Visual Effects for 'After' */}
                    <div className="absolute inset-0 bg-purple-700/40 mix-blend-overlay" />
                    <div className="absolute inset-0 bg-gradient-to-t from-blue-900/50 to-transparent mix-blend-multiply" />
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-cyan-400/20 mix-blend-screen" />
                    <div className="absolute inset-0" style={{ backdropFilter: 'contrast(1.4) saturate(1.5)' }} />
                    <div 
                        className="absolute bottom-6 right-6 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-green-500/30 text-green-400 text-xs font-bold tracking-widest z-10"
                        style={{ opacity: sliderPosition > 95 ? 0 : 1, transition: 'opacity 0.3s ease' }}
                    >
                        AFTER: COLOR GRADED
                    </div>
                </div>

                {/* 2. Overlay Layer (BEFORE - Clipped Width) */}
                {/* UPDATED: Added z-20 so this layer sits ON TOP of the 'After' layer's label (z-10), causing it to properly 'wipe' the text away */}
                <div 
                    className="absolute top-0 left-0 h-full overflow-hidden border-r-2 border-white/80 z-20" 
                    style={{ width: `${sliderPosition}%` }}
                >
                    {/* Inner container to hold fixed image */}
                    <div style={{ width: containerWidth ? `${containerWidth}px` : '100vw', height: '100%' }} className="relative">
                        <img src={imgUrl} alt="Raw Log" className="absolute inset-0 w-full h-full object-cover" style={{ filter: 'grayscale(0.3) contrast(0.85) brightness(0.95) sepia(0.1)' }} />
                        <div className="absolute inset-0 bg-gray-500/20 mix-blend-lighten pointer-events-none" />
                        <div 
                            className="absolute bottom-6 left-6 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 text-white/60 text-xs font-bold tracking-widest z-20"
                            style={{ opacity: sliderPosition < 5 ? 0 : 1, transition: 'opacity 0.3s ease' }}
                        >
                            BEFORE : RAW LOG
                        </div>
                    </div>
                </div>

                {/* 3. Slider Handle */}
                <div className="absolute top-0 bottom-0 w-10 -ml-5 z-30 flex items-center justify-center pointer-events-none" style={{ left: `${sliderPosition}%` }}>
                    <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.5)]">
                        <Scissors className="w-4 h-4 text-black rotate-90" />
                    </div>
                </div>
            </div>
        </div>
      </section>
    );
};

// --- Showcase Carousel ---
const ShowcaseCarousel = () => {
    const rawProjects = [
        { title: "Duke Streetfighter", category: "Bike Edit", videoUrl: "https://www.dropbox.com/scl/fi/7zk2o7jv6anjerfumw47u/finalrender_prob3.mp4?rlkey=g92ueblkao2ntbpxi6lwqme7l&st=lxkr0dgr&raw=1" },
        { title: "Demon Slayer", category: "Anime Edit", videoUrl: "https://www.dropbox.com/scl/fi/6782d3s6zotx1ouvsii3n/Demon-slayer-anime-animeedit-demonslayer-infinitycastle-edit-1.mp4?rlkey=d9k6srazihb0s9nncxfc5o4pj&st=8whdtw36&raw=1" },
        { title: "Porsche 911", category: "Automotive Edit", videoUrl: "https://www.dropbox.com/scl/fi/9h8uhfvxjiw27pbqowdcd/Porache-911-car-automobile-edit-reels-aftereffects-caredit-editing-drift-drifting-cartok-1.mp4?rlkey=wqkifqnhqafaihvs48raratp6&st=pml7yswj&raw=1" }
    ];
    
    const projects = useMemo(() => Array(4).fill(rawProjects).flat(), []);

    const [currentIndex, setCurrentIndex] = useState(0);
    const videoRefs = useRef([]);
    const progressRefs = useRef([]);
    const containerRef = useRef(null);
    const [mutedStates, setMutedStates] = useState(projects.map(() => true));

    useEffect(() => {
        let isMounted = true; 

        const handleSlideChange = async () => {
            videoRefs.current.forEach((vid, idx) => {
                if (vid && idx !== currentIndex && !vid.paused) {
                    vid.pause();
                }
            });

            if (containerRef.current) {
                const container = containerRef.current;
                const videoCard = container.children[currentIndex];
                if (videoCard) {
                    const scrollLeft = videoCard.offsetLeft - (container.clientWidth / 2) + (videoCard.clientWidth / 2);
                    container.scrollTo({ left: scrollLeft, behavior: 'smooth' });
                }
            }

            await new Promise(r => setTimeout(r, 500));

            if (!isMounted) return;

            const currentVideo = videoRefs.current[currentIndex];
            if (currentVideo) {
                try {
                    currentVideo.muted = mutedStates[currentIndex];
                    const playPromise = currentVideo.play();
                    if (playPromise !== undefined) {
                        playPromise.catch(error => {
                            if (error.name !== 'AbortError') { }
                        });
                    }
                } catch (e) {}
            }
        };

        handleSlideChange();

        return () => {
            isMounted = false;
        };
    }, [currentIndex]); 

    const handleTimeUpdate = (index) => {
        const vid = videoRefs.current[index];
        const bar = progressRefs.current[index];
        if (vid && bar) {
            const percent = (vid.currentTime / vid.duration) * 100;
            bar.style.width = `${percent}%`;
        }
    };

    const handleVideoEnded = (e, index) => {
        e.target.currentTime = 0;
        const playPromise = e.target.play();
        if (playPromise !== undefined) {
            playPromise.catch(() => {});
        }

        if (index === currentIndex) {
            if (currentIndex < projects.length - 1) {
                setCurrentIndex((prev) => prev + 1);
            } else {
                setCurrentIndex(0); 
            }
        }
    };

    const toggleMute = (index, e) => {
        e.stopPropagation();
        const newMutedStates = [...mutedStates];
        newMutedStates[index] = !newMutedStates[index];
        setMutedStates(newMutedStates);
        if(videoRefs.current[index]) {
            videoRefs.current[index].muted = newMutedStates[index];
        }
    };

    return (
        <section id="showcase" className="py-24 relative z-10 overflow-hidden bg-transparent">
             <div className="container mx-auto max-w-6xl px-6 mb-12 flex items-end justify-between">
                <div className="pb-4">
                    <h2 className="text-5xl md:text-7xl font-black text-white uppercase italic tracking-tighter">
                        KINETIC <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-white/40 pr-4">ARCHIVES</span>
                    </h2>
                </div>
                <div className="hidden md:flex flex-col items-end text-cyan-500/60 font-mono text-sm tracking-widest pb-4">
                    <div className="flex items-center mb-1">
                        <Monitor className="w-4 h-4 mr-2" />
                        <span>8K • HDR READY</span>
                    </div>
                    <div className="flex items-center text-[10px] opacity-70">
                        <Wifi className="w-3 h-3 mr-2" />
                        <span>AUTO-BITRATE ADAPTIVE</span>
                    </div>
                </div>
            </div>
            
            <div ref={containerRef} className="flex gap-8 overflow-x-auto no-scrollbar px-6 md:px-[10vw] pb-8">
                {projects.map((project, index) => (
                    <div 
                        key={index} 
                        className={`relative w-[90vw] md:w-[800px] aspect-video flex-shrink-0 group rounded-3xl overflow-hidden border transition-all duration-700 transform-gpu ${index === currentIndex ? 'border-cyan-500/50 shadow-[0_0_30px_rgba(34,211,238,0.2)] scale-100 opacity-100' : 'border-white/10 opacity-40 scale-95'}`}
                    >
                        <video 
                            ref={el => videoRefs.current[index] = el} 
                            src={project.videoUrl} 
                            preload={index === currentIndex || index === currentIndex + 1 ? "auto" : "none"}
                            className="w-full h-full object-cover transform-gpu" 
                            muted={mutedStates[index]} 
                            playsInline 
                            onTimeUpdate={() => handleTimeUpdate(index)} 
                            onEnded={(e) => handleVideoEnded(e, index)}  
                            onClick={() => setCurrentIndex(index)} 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80 pointer-events-none" />
                        
                        <button onClick={(e) => toggleMute(index, e)} className="absolute top-6 right-6 p-3 bg-black/60 backdrop-blur-md rounded-full border border-white/10 hover:bg-cyan-500 hover:text-black transition-colors z-30 pointer-events-auto">
                            {mutedStates[index] ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                        </button>

                        <div className="absolute bottom-0 left-0 p-8 w-full pointer-events-none">
                            <div className="inline-block px-3 py-1 bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 text-xs md:text-sm font-bold tracking-widest uppercase mb-3 backdrop-blur-md rounded-md">{project.category}</div>
                            <h3 className="text-4xl md:text-6xl font-black text-white uppercase italic tracking-tighter leading-none mb-4">{project.title}</h3>
                            
                            <div className="mt-4 h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                                 <div 
                                    ref={el => progressRefs.current[index] = el}
                                    className="h-full bg-cyan-500 w-0 transition-all duration-100 ease-linear"
                                 />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

// --- Contact ---
const Contact = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedService, setSelectedService] = useState("Select Service Requirement");
  const [formData, setFormData] = useState({ name: '', email: '', brief: '' });
  const [enhancing, setEnhancing] = useState(false);
  const [status, setStatus] = useState(null); // null, 'sending', 'success', 'error'
  const dropdownRef = useRef(null);
  const serviceOptions = ["Select Service Requirement", "Speed Ramp Edits", "AMV Edits", "Automotive Edits", "Bike Edits", "Personal Edits", "Photo Edits", "Content Creations", "Script Writing", "Sound Effects SFX", "Visual Effects VFX", "Other"];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleEnhanceBrief = async (e) => {
    e.preventDefault();
    if (!formData.brief || formData.brief.length < 5) return;
    setEnhancing(true);
    const systemPrompt = "Rewrite the user's notes into a clean, professional video production brief. Output STRICTLY plain text only. Keep it concise.";
    const enhanced = await generateGeminiContent(`${systemPrompt}\n\nUser Notes: ${formData.brief}`);
    setFormData(prev => ({ ...prev, brief: enhanced }));
    setEnhancing(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedService === "Select Service Requirement") {
        alert("Please select a service.");
        return;
    }
    setStatus('sending');

    // Using FormSubmit.co for direct email without backend code
    try {
        const response = await fetch("https://formsubmit.co/ajax/bgmringtone360@gmail.com", {
            method: "POST",
            headers: { 
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                _subject: `New Collaboration: ${selectedService}`,
                _replyto: formData.email, // Allows reply directly to client
                name: formData.name,
                email: formData.email,
                service: selectedService,
                brief: formData.brief,
                _template: "table"
            })
        });

        if (response.ok) {
            setStatus('success');
            setFormData({ name: '', email: '', brief: '' });
            setSelectedService("Select Service Requirement");
        } else {
            setStatus('error');
        }
    } catch (error) {
        console.error("Email failed", error);
        setStatus('error');
    }
  };

  return (
    <section id="contact" className="min-h-[80vh] flex items-center justify-center px-6 relative z-10">
      <div className="w-full max-w-2xl bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-12 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-32 h-32 bg-cyan-500/20 rounded-full blur-[80px]" />
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-purple-500/20 rounded-full blur-[80px]" />
        
        <div className="text-center mb-10">
          <h2 className="text-4xl font-bold text-white mb-2">Initialize Collaboration</h2>
          <p className="text-blue-200/50">Transmission secure. Brief us on your objective.</p>
        </div>

        {status === 'success' ? (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-500/50">
                    <CheckCircle2 className="w-8 h-8 text-green-500" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Transmission Received</h3>
                <p className="text-gray-400">We have received your brief. A signal will be sent to your inbox shortly.</p>
                <button onClick={() => setStatus(null)} className="mt-8 text-cyan-400 hover:text-cyan-300 text-sm font-bold uppercase tracking-widest">Send Another</button>
            </motion.div>
        ) : (
            <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
            <div className="group">
                <input 
                    type="text" 
                    placeholder="Identity (Name)" 
                    required
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white placeholder:text-white/20 focus:outline-none focus:border-cyan-500/50 focus:bg-white/10 transition-all" 
                />
            </div>
            <div className="group">
                <input 
                    type="email" 
                    placeholder="Frequency (Email)" 
                    required
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white placeholder:text-white/20 focus:outline-none focus:border-cyan-500/50 focus:bg-white/10 transition-all" 
                />
            </div>
            
            <div className="group relative" ref={dropdownRef}>
                <div onClick={() => setIsOpen(!isOpen)} className={`w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white/80 cursor-pointer flex justify-between items-center transition-all ${isOpen ? 'border-cyan-500/50 bg-white/10' : 'hover:bg-white/10'}`}>
                <span className={selectedService === "Select Service Requirement" ? "text-white/50" : "text-white"}>{selectedService}</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isOpen ? 'rotate-180 text-cyan-400' : 'text-white/40'}`} />
                </div>
                <AnimatePresence>
                {isOpen && (
                    <motion.div initial={{ opacity: 0, y: -10, scaleY: 0.95 }} animate={{ opacity: 1, y: 0, scaleY: 1 }} exit={{ opacity: 0, y: -10, scaleY: 0.95 }} transition={{ duration: 0.2 }} className="absolute top-full left-0 right-0 mt-2 bg-black/90 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden z-50 max-h-60 overflow-y-auto custom-scrollbar shadow-xl shadow-cyan-900/20">
                        {serviceOptions.filter(opt => opt !== "Select Service Requirement").map((option, index) => (
                            <div key={index} onClick={() => { setSelectedService(option); setIsOpen(false); }} className="px-4 py-3 text-white/70 hover:bg-white/10 hover:text-cyan-400 cursor-pointer transition-colors text-sm border-b border-white/5 last:border-0">{option}</div>
                        ))}
                    </motion.div>
                )}
                </AnimatePresence>
            </div>

            <div className="group relative">
                <div className="flex justify-between items-center mb-2 px-1">
                <span className="text-xs text-gray-500 uppercase tracking-widest">Mission Brief</span>
                <button onClick={handleEnhanceBrief} disabled={enhancing || !formData.brief} type="button" className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors disabled:opacity-50">
                    {enhancing ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />} ✨ Auto-Enhance Brief
                </button>
                </div>
                <textarea 
                    rows="4" 
                    value={formData.brief} 
                    onChange={(e) => setFormData({...formData, brief: e.target.value})} 
                    placeholder="Describe your vision (e.g. 'Car video, fast edits, dark mode')..." 
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white placeholder:text-white/20 focus:outline-none focus:border-cyan-500/50 focus:bg-white/10 transition-all resize-none custom-scrollbar" 
                />
            </div>

            <button disabled={status === 'sending'} className="w-full bg-white text-black font-bold py-4 rounded-xl hover:bg-cyan-400 transition-colors flex items-center justify-center gap-2 mt-4 disabled:opacity-50 disabled:cursor-not-allowed">
                {status === 'sending' ? (
                    <>TRANSMITTING... <Loader2 className="w-5 h-5 animate-spin" /></>
                ) : (
                    <>SEND TRANSMISSION <ArrowUpRight className="w-5 h-5" /></>
                )}
            </button>
            {status === 'error' && <p className="text-red-500 text-center text-xs mt-2">Transmission failed. Neural link unstable.</p>}
            </form>
        )}

        <div className="flex justify-center gap-8 mt-12 pt-8 border-t border-white/5 text-white/40">
          <a href="https://www.instagram.com/whistle.frames?igsh=MWdxbjVpZWs2ejNtcw==" target="_blank" rel="noopener noreferrer" className="icon-hover-insta transition-all duration-300"><Instagram className="w-5 h-5 cursor-pointer" /></a>
          <a href="#" target="_blank" rel="noopener noreferrer" className="icon-hover-twitter transition-all duration-300"><DiscordIcon className="w-5 h-5 cursor-pointer" /></a>
          <a href="https://www.youtube.com/@niruedits/featured" target="_blank" rel="noopener noreferrer" className="icon-hover-youtube transition-all duration-300"><Youtube className="w-5 h-5 cursor-pointer" /></a>
        </div>
      </div>
    </section>
  );
};

// --- Footer ---
const Footer = () => (
  <footer className="py-12 relative z-10">
    <div className="container mx-auto px-6 flex flex-col items-center gap-4">
       <CustomLogo />
       <p className="text-white/30 text-xs font-mono tracking-widest uppercase">© {new Date().getFullYear()} Whistle Frames Studios. All Rights Reserved.</p>
    </div>
  </footer>
);

export default function App() {
  const [introComplete, setIntroComplete] = useState(false);

  useEffect(() => {
    if (introComplete) {
      setTimeout(() => {
        window.scrollTo(0, 0);
      }, 50);
    }
  }, [introComplete]);

  return (
    <div className="min-h-screen font-sans text-white overflow-x-hidden selection:bg-cyan-500 selection:text-white scroll-smooth relative">
      <CustomStyles />
      <AnimatePresence mode="wait">{!introComplete && <Intro onComplete={() => setIntroComplete(true)} />}</AnimatePresence>
      <div className={`transition-opacity duration-1000 ${introComplete ? 'opacity-100' : 'opacity-0'}`}>
        <NetworkBackground /> 
        <div className="fixed inset-0 pointer-events-none bg-gradient-to-b from-black/20 via-black/40 to-black/80 z-0" />
        <Navbar />
        <Hero />
        <ShowcaseCarousel /> 
        <ColorGradingSection /> 
        <SystemArchitecture />
        <Services />
        <Contact />
        <Footer />
      </div>
    </div>
  );
}
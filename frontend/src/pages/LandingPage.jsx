import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Lottie } from 'lottie-react';
import moneyMateLogo from '../assets/images/Circle_M.json';
import background from '../assets/images/background_2.jpg';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen overflow-hidden">
      <img
        src={background}
        alt=""
        className="absolute inset-0 w-full h-full object-cover -z-10"
      />
      <div className="absolute inset-0 bg-black/50 -z-10" />

      <div className="relative min-h-screen flex flex-col">
        <header className="flex justify-between items-center px-6 py-4 sm:px-10">
          <div className="flex items-center">
            <span className="flex items-center text-3xl font-bold tracking-tight text-white">
              <Lottie style={{ width: '40px', height: '40px' }} src={moneyMateLogo} loop autoplay />
                  <span>oney</span>
                            <span className="text-green-500">M</span>
              <span>ate</span>
            </span>
          </div>
          <button onClick={() => navigate('/dashboard')} className="btn btn-ghost hover:bg-green-500 border-cyan-600 btn-xl text-white">
            Dashboard
          </button>
        </header>

        <main className="flex-1 flex flex-col items-center  text-center px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <Lottie style={{ width: '140px', height: '140px' }} src={moneyMateLogo} loop autoplay className="mx-auto mb-6" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white"
          >
            Take control of your <span className="text-green-500">money</span>.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-4 max-w-xl text-white/70 text-lg"
          >
            Track accounts, categorize spending, stay on top of fixed bills —
            all in one clean dashboard.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-8"
          >
            <button onClick={() => navigate('/dashboard')} className="btn btn-ghost hover:bg-green-500 border-cyan-600 btn-xl text-white">
              Get Started
            </button>
          </motion.div>
        </main>

        <footer className="text-center text-xs text-white/50 py-6">
          MoneyMate — Al Mahmud
        </footer>
      </div>
    </div>
  );
}
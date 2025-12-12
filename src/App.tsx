import { useState } from 'react';
import { Scanlines } from './components/ui/Scanlines';
import { Header } from './components/Header';
import { PasswordInput } from './features/PasswordInput';
import { AlgorithmSelector } from './features/AlgorithmSelector';
import { ParameterPanel } from './features/ParameterPanel';
import { HashOutput } from './features/HashOutput';
import { CostTimeChart } from './features/CostTimeChart';
import { NeonButton } from './components/ui/NeonButton';
import { NeonCard } from './components/ui/NeonCard';
import { useHasher } from './hooks/useHasher';
import type { AlgorithmName, HashingParams } from './lib/hashing/types';
import { DEFAULTS } from './lib/hashing/constants'; // We need to export DEFAULTS from constants
import { Play, AlertTriangle, Lock } from 'lucide-react';
import { AnimatedBackground } from './components/ui/AnimatedBackground';
import { motion } from 'framer-motion';

function App() {
  const [password, setPassword] = useState('password123');
  const [algo, setAlgo] = useState<AlgorithmName>('bcrypt');
  const [params, setParams] = useState<HashingParams>(DEFAULTS['bcrypt']);

  const { hashString, isHashing, result, error, reset } = useHasher();

  const handlePasswordChange = (newPassword: string) => {
    setPassword(newPassword);
    reset();
  };

  const handleAlgoChange = (newAlgo: AlgorithmName) => {
    setAlgo(newAlgo);
    setParams(DEFAULTS[newAlgo]);
    reset();
  };

  const handleParamsChange = (newParams: HashingParams) => {
    setParams(newParams);
    reset();
  };

  const handleGenerate = () => {
    hashString(password, params);
  };

  // Auto-generate on mount or change? 
  // Maybe only on explicit click for heavier algos, or debounce.
  // For now, manual trigger button is safer for browser perf on defaults.

  return (
    <div className="min-h-screen bg-neon-bg/0 text-slate-200 font-sans selection:bg-neon-cyan selection:text-black overflow-x-hidden">
      <AnimatedBackground />
      <Scanlines />
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Educational Banner */}
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3 mb-8 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
          <div className="text-sm text-yellow-200/80">
            <strong className="text-yellow-500">Educational Use Only.</strong> This tool runs entirely in your browser.
            Do not paste real production passwords or secrets here.
            Hashing operations are performed locally using Web Workers.
          </div>
        </div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1
              }
            }
          }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8"
        >

          {/* Left Column: Controls */}
          <motion.div
            variants={{
              hidden: { opacity: 0, x: -20 },
              visible: { opacity: 1, x: 0, transition: { duration: 0.5 } }
            }}
            className="lg:col-span-5 space-y-6"
          >
            <PasswordInput value={password} onChange={handlePasswordChange} />

            <AlgorithmSelector selected={algo} onSelect={handleAlgoChange} />

            <ParameterPanel
              algorithm={algo}
              params={params}
              onChange={handleParamsChange}
            />

            <NeonButton
              className="w-full h-12 text-lg"
              onClick={handleGenerate}
              isLoading={isHashing}
              disabled={!password}
            >
              {['aes', 'des', 'tripledes', 'blowfish', 'twofish', 'chacha20'].includes(algo) ? (
                <>
                  <Lock className="w-5 h-5 mr-2 fill-current" /> Encrypt Message
                </>
              ) : (
                <>
                  <Play className="w-5 h-5 mr-2 fill-current" /> Generate Hash
                </>
              )}
            </NeonButton>
          </motion.div>

          {/* Right Column: Output & Visualization */}
          <motion.div
            variants={{
              hidden: { opacity: 0, x: 20 },
              visible: { opacity: 1, x: 0, transition: { duration: 0.5 } }
            }}
            className="lg:col-span-7 space-y-6"
          >
            <HashOutput result={result} />

            {error && (
              <NeonCard color="red" className="bg-red-950/30">
                <div className="text-red-400 font-mono text-sm">
                  <strong className="block mb-1">Error:</strong>
                  {error}
                </div>
              </NeonCard>
            )}

            {/* Chart */}
            <CostTimeChart algorithm={algo} currentParams={params} />
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
};

export default App;

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export function LogoLoader() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => setIsVisible(false), 420);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div className="loader" initial={{ opacity: 1 }} exit={{ opacity: 0 }} role="status" aria-label="Loading portfolio">
          <motion.span initial={{ scale: 0.94 }} animate={{ scale: 1 }} transition={{ duration: 0.25 }}>NB</motion.span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

export default function Carousel({ products }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((current) => (current + 1) % products.length);
    }, 10000);
    return () => clearInterval(timer);
  }, [products.length]);

  return (
    <div style={{ position: 'relative' }}>
      <AnimatePresence initial={false}>
        <motion.img
          key={products[index]._id}
          src={products[index].banner}
          alt={products[index].name}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 5 }} // Adjust the duration as needed
          style={{ width: '100%', height: 'auto', position: 'absolute' }}
        />
      </AnimatePresence>
    </div>
  );
}

// export default Carousel;

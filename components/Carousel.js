import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
// import { shuffle } from 'lodash';
export default function Carousel({ products }) {
  const [index, setIndex] = useState(0); 

  // const [currentImageIndex, setCurrentImageIndex] = useState(0);
  // const shuffledProducts = shuffle(products);
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setCurrentImageIndex((prevIndex) => (prevIndex + 1) % shuffledProducts.length);
  //   }, 5000);

  //   return () => clearInterval(interval);
  // }, [shuffledProducts.length]);

  // const imagesToShow = [
  //   shuffledProducts[currentImageIndex],
  //   shuffledProducts[(currentImageIndex + 1) % shuffledProducts.length],
  //   shuffledProducts[(currentImageIndex + 2) % shuffledProducts.length],
  //   shuffledProducts[(currentImageIndex + 3) % shuffledProducts.length],
  // ];

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
          src={products[index].jpg}
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

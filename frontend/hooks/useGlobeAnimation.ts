import { useEffect, useState } from 'react';

const useGlobeAnimation = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Simulate loading time for the 3D globe
    const loadingTimer = setTimeout(() => {
      setIsLoaded(true);
    }, 800);

    // Start animations after loading
    const animationTimer = setTimeout(() => {
      setIsAnimating(true);
    }, 1200);

    return () => {
      clearTimeout(loadingTimer);
      clearTimeout(animationTimer);
    };
  }, []);

  return { isLoaded, isAnimating };
};

export default useGlobeAnimation;

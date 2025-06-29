// src/hooks/useCountUp.js
import { useEffect, useState, useRef } from 'react';
import useOnScreen from './useOnScreen';

const useCountUp = (end, duration = 2000) => {
  const [count, setCount] = useState(0);
  const ref = useRef();
  const isOnScreen = useOnScreen(ref);

  useEffect(() => {
    if (isOnScreen) {
      let start = 0;
      const endValue = parseInt(end, 10);
      const increment = endValue / (duration / 16); // 60fps

      const timer = setInterval(() => {
        start += increment;
        if (start >= endValue) {
          setCount(endValue);
          clearInterval(timer);
        } else {
          setCount(Math.ceil(start));
        }
      }, 16);

      return () => clearInterval(timer);
    }
  }, [end, duration, isOnScreen]);

  return { count, ref };
};

export default useCountUp;
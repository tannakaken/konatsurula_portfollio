import { useEffect, useState } from "react";

export const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const handleResize = () => {
        setWindowSize({
          width: window.innerWidth,
          height: window.innerHeight,
        });
      };

      window.addEventListener("resize", handleResize);
      handleResize();
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);
  return windowSize;
};

export const useScroll = () => {
  const [scrollY, setScrollY] = useState(0);
  const [scrollX, setScrollX] = useState(0);

  const handleScroll = () => {
    if (typeof window !== "undefined") {
      setScrollY(window.scrollY);
      setScrollX(window.scrollX);
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.addEventListener("scroll", handleScroll);
    }
  }, []);
  return {
    x: scrollX,
    y: scrollY,
  };
};

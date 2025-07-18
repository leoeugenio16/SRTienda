"use client";

import { useRef, useState } from "react";

export default function Scrollable({ children }) {
  const scrollRef = useRef(null);
  const [isDown, setIsDown] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const onMouseDown = (e) => {
    setIsDown(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };
  const onMouseUp = () => setIsDown(false);
  const onMouseLeave = () => setIsDown(false);
  const onMouseMove = (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 2; // velocidad scroll al arrastrar
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  const scrollLeftClick = () => {
    scrollRef.current.scrollBy({ left: -200, behavior: "smooth" });
  };
  const scrollRightClick = () => {
    scrollRef.current.scrollBy({ left: 200, behavior: "smooth" });
  };

  return (
    <div className="relative">
      {/* Botón Izquierda */}
      <button
        onClick={scrollLeftClick}
        aria-label="Scroll Left"
        className="hidden md:flex items-center justify-center absolute top-1/2 left-2 -translate-y-1/2 w-8 h-8 bg-white bg-opacity-70 dark:bg-gray-800 dark:bg-opacity-70 rounded-full shadow hover:bg-opacity-90 transition z-10"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
          className="w-5 h-5"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Contenedor scrollable */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide cursor-grab select-none px-4"
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseLeave}
        onMouseMove={onMouseMove}
      >
        {children}
      </div>

      {/* Botón Derecha */}
      <button
        onClick={scrollRightClick}
        aria-label="Scroll Right"
        className="hidden md:flex items-center justify-center absolute top-1/2 right-2 -translate-y-1/2 w-8 h-8 bg-white bg-opacity-70 dark:bg-gray-800 dark:bg-opacity-70 rounded-full shadow hover:bg-opacity-90 transition z-10"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
          className="w-5 h-5"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* CSS para ocultar scrollbar */}
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}

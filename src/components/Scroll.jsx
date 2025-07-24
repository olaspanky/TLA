import { useRef } from 'react';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';

const ScrollArrows = ({ scrollContainerRef }) => {
  const scrollIntervalRef = useRef(null);

  // Start scrolling in the specified direction
  const startScrolling = (direction) => {
    if (scrollContainerRef.current) {
      scrollIntervalRef.current = setInterval(() => {
        scrollContainerRef.current.scrollBy({
          top: direction === 'up' ? -100 : 100, // Smaller increments for smoother scrolling
          behavior: 'smooth',
        });
      }, 100); // Adjust interval for scroll speed (lower = faster)
    }
  };

  // Stop scrolling
  const stopScrolling = () => {
    if (scrollIntervalRef.current) {
      clearInterval(scrollIntervalRef.current);
      scrollIntervalRef.current = null;
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      <button
        onMouseDown={() => startScrolling('up')}
        onMouseUp={stopScrolling}
        onMouseLeave={stopScrolling}
        onTouchStart={() => startScrolling('up')} // Support touch devices
        onTouchEnd={stopScrolling}
        className="p-3 text-white bg-[#000A48] rounded-full hover:bg-[#3A507F] transition-colors shadow-md"
        aria-label="Scroll Up"
      >
        <FaArrowUp className="w-4 h-4" />
      </button>
      <button
        onMouseDown={() => startScrolling('down')}
        onMouseUp={stopScrolling}
        onMouseLeave={stopScrolling}
        onTouchStart={() => startScrolling('down')} // Support touch devices
        onTouchEnd={stopScrolling}
        className="p-3 text-white bg-[#000A48] rounded-full hover:bg-[#3A507F] transition-colors shadow-md"
        aria-label="Scroll Down"
      >
        <FaArrowDown className="w-4 h-4" />
      </button>
    </div>
  );
};

export default ScrollArrows;
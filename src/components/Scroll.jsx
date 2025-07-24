import { useRef } from 'react';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';

const ScrollArrows = ({ scrollContainerRef }) => {
  const scrollIntervalRef = useRef(null);

  // Single tap/click scroll (discrete)
  const scrollUp = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ top: -200, behavior: 'smooth' });
    }
  };

  const scrollDown = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ top: 200, behavior: 'smooth' });
    }
  };

  // Start continuous scrolling for hold
  const startScrolling = (direction) => {
    if (scrollContainerRef.current) {
      scrollIntervalRef.current = setInterval(() => {
        scrollContainerRef.current.scrollBy({
          top: direction === 'up' ? -100 : 100, // Smaller increments for smooth hold
          behavior: 'smooth',
        });
      }, 100); // Adjust for scroll speed
    }
  };

  // Stop continuous scrolling
  const stopScrolling = () => {
    if (scrollIntervalRef.current) {
      clearInterval(scrollIntervalRef.current);
      scrollIntervalRef.current = null;
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      <button
        onClick={scrollUp} // For single tap/click
        onPointerDown={() => startScrolling('up')} // For hold (touchpad/mouse/touch)
        onPointerUp={stopScrolling}
        onPointerLeave={stopScrolling}
        onTouchStart={() => startScrolling('up')} // Extra touch support
        onTouchEnd={stopScrolling}
        className="p-3 text-white bg-[#000A48] rounded-full hover:bg-[#3A507F] transition-colors shadow-md"
        aria-label="Scroll Up"
      >
        <FaArrowUp className="w-4 h-4" />
      </button>
      <button
        onClick={scrollDown} // For single tap/click
        onPointerDown={() => startScrolling('down')} // For hold (touchpad/mouse/touch)
        onPointerUp={stopScrolling}
        onPointerLeave={stopScrolling}
        onTouchStart={() => startScrolling('down')} // Extra touch support
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
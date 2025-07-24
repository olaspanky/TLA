import { useRef, useState, useEffect } from 'react';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';

const ScrollArrows = ({ scrollContainerRef }) => {
  const scrollIntervalRef = useRef(null);
  const [canScrollUp, setCanScrollUp] = useState(false);
  const [canScrollDown, setCanScrollDown] = useState(false);

  // Check scroll position to enable/disable buttons
  const updateScrollState = () => {
    if (scrollContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
      setCanScrollUp(scrollTop > 0); // Enable up button if not at top
      setCanScrollDown(scrollTop < scrollHeight - clientHeight - 1); // Enable down button if not at bottom
    }
  };

  // Set up scroll event listener
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      updateScrollState(); // Initial check
      container.addEventListener('scroll', updateScrollState);
      return () => container.removeEventListener('scroll', updateScrollState);
    }
  }, [scrollContainerRef]);

  // Single tap/click scroll (discrete)
  const scrollUp = () => {
    if (scrollContainerRef.current && canScrollUp) {
      scrollContainerRef.current.scrollBy({ top: -200, behavior: 'smooth' });
    }
  };

  const scrollDown = () => {
    if (scrollContainerRef.current && canScrollDown) {
      scrollContainerRef.current.scrollBy({ top: 200, behavior: 'smooth' });
    }
  };

  // Start continuous scrolling for hold
  const startScrolling = (direction) => {
    if (scrollContainerRef.current && (direction === 'up' ? canScrollUp : canScrollDown)) {
      scrollIntervalRef.current = setInterval(() => {
        scrollContainerRef.current.scrollBy({
          top: direction === 'up' ? -50 : 50, // Smaller increments for smooth hold
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
        disabled={!canScrollUp}
        className={`p-3 text-white rounded-full transition-colors shadow-md ${
          canScrollUp
            ? 'bg-[#000A48] hover:bg-[#3A507F]'
            : 'bg-gray-400 cursor-not-allowed opacity-50'
        }`}
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
        disabled={!canScrollDown}
        className={`p-3 text-white rounded-full transition-colors shadow-md ${
          canScrollDown
            ? 'bg-[#000A48] hover:bg-[#3A507F]'
            : 'bg-gray-400 cursor-not-allowed opacity-50'
        }`}
        aria-label="Scroll Down"
      >
        <FaArrowDown className="w-4 h-4" />
      </button>
    </div>
  );
};

export default ScrollArrows;
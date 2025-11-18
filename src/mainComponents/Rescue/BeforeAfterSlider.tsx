import React, { useState, useRef, useEffect } from "react";

const BeforeAfterSlider: React.FC = () => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  };

  const handleMouseDown = () => setIsDragging(true);

  const handleMouseUp = () => setIsDragging(false);

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isDragging) return;
    handleMove(e.touches[0].clientX);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.addEventListener("touchmove", handleTouchMove);
      document.addEventListener("touchend", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleMouseUp);
    };
  }, [isDragging]);

  return (
    <div className='min-h-screen bg-gray-900 flex items-center justify-center p-4'>
      <div className='w-full max-w-6xl'>
        <div
          ref={containerRef}
          className='relative w-full aspect-[16/9] overflow-hidden rounded-lg shadow-2xl cursor-col-resize select-none'
          onMouseDown={handleMouseDown}
          onTouchStart={handleMouseDown}
        >
          {/* After Image (Right) */}
          <div className='absolute inset-0'>
            <img
              src='https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1200&h=675&fit=crop'
              alt='After renovation'
              className='w-full h-full object-cover'
              draggable={false}
            />
            <div className='absolute bottom-4 right-4 bg-black bg-opacity-70 text-white px-3 py-1.5 rounded text-sm font-medium'>
              AFTER
            </div>
          </div>

          {/* Before Image (Left) - Clipped */}
          <div
            className='absolute inset-0'
            style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
          >
            <img
              src='https://images.unsplash.com/photo-1581858726788-75bc0f1a4588?w=1200&h=675&fit=crop'
              alt='Before renovation'
              className='w-full h-full object-cover'
              draggable={false}
            />
            <div className='absolute bottom-4 left-4 bg-black bg-opacity-70 text-white px-3 py-1.5 rounded text-sm font-medium'>
              BEFORE
            </div>
          </div>

          {/* Slider Line & Handle */}
          <div
            className='absolute top-0 bottom-0 w-1 bg-white'
            style={{
              left: `${sliderPosition}%`,
              transform: "translateX(-50%)",
            }}
          >
            {/* Slider Handle */}
            <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'>
              <div className='w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center cursor-grab active:cursor-grabbing'>
                <div className='flex gap-1'>
                  <div className='w-0.5 h-4 bg-gray-700'></div>
                  <div className='w-0.5 h-4 bg-gray-700'></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BeforeAfterSlider;

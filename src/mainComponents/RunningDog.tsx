import React, { useState, useEffect, useRef } from "react";

const RunningDog: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [isBarking, setIsBarking] = useState(false);
  const [barkText, setBarkText] = useState("");
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Audio refs for different sounds
  const barkAudioRef = useRef<HTMLAudioElement | null>(null);
  const runningAudioRef = useRef<HTMLAudioElement | null>(null);

  // Ref to store the running timeout so we can clear it
  const runningTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize audio elements
  useEffect(() => {
    // Create bark audio element
    barkAudioRef.current = new Audio("/sounds/dog-bark.mp3");

    // Create running audio element (you can use a running/panting sound)
    runningAudioRef.current = new Audio();

    // Set audio properties for bark sound
    if (barkAudioRef.current) {
      barkAudioRef.current.volume = 0.7;
      barkAudioRef.current.preload = "auto";
    }

    // Set audio properties for running sound
    if (runningAudioRef.current) {
      runningAudioRef.current.volume = 0.4;
      runningAudioRef.current.preload = "auto";
      runningAudioRef.current.loop = true; // Loop running sound while running
    }

    // Cleanup function
    return () => {
      if (barkAudioRef.current) {
        barkAudioRef.current.pause();
        barkAudioRef.current = null;
      }
      if (runningAudioRef.current) {
        runningAudioRef.current.pause();
        runningAudioRef.current = null;
      }
      if (runningTimeoutRef.current) {
        clearTimeout(runningTimeoutRef.current);
      }
    };
  }, []);

  const playBarkSound = () => {
    if (soundEnabled && barkAudioRef.current) {
      try {
        barkAudioRef.current.currentTime = 0; // Reset to beginning
        barkAudioRef.current.play().catch((error) => {
          console.log("Bark audio playback blocked:", error);
        });
      } catch (error) {
        console.log("Error playing bark sound:", error);
      }
    }
  };

  const startRunningSound = () => {
    if (soundEnabled && runningAudioRef.current) {
      try {
        runningAudioRef.current.currentTime = 0;
        runningAudioRef.current.play().catch((error) => {
          console.log("Running audio playback blocked:", error);
        });
      } catch (error) {
        console.log("Error playing running sound:", error);
      }
    }
  };

  const stopRunningSound = () => {
    if (runningAudioRef.current) {
      runningAudioRef.current.pause();
      runningAudioRef.current.currentTime = 0;
    }
  };

  const stopRunning = () => {
    // Clear the running timeout if it exists
    if (runningTimeoutRef.current) {
      clearTimeout(runningTimeoutRef.current);
      runningTimeoutRef.current = null;
    }

    // Stop running state
    setIsRunning(false);

    // Stop running sound
    stopRunningSound();

    // Clear any bark state
    setIsBarking(false);
    setBarkText("");
  };

  const startRunning = () => {
    if (isRunning) return; // Prevent multiple runs

    // Clear any existing bark state immediately
    setIsBarking(false);
    setBarkText("");

    setIsRunning(true);

    // Special bark for starting to run (bypasses the running check)
    const barkSounds = ["Woof!", "Arf!", "Ruff!", "Bow wow!"];
    const randomBark =
      barkSounds[Math.floor(Math.random() * barkSounds.length)];

    setIsBarking(true);
    setBarkText(randomBark);
    playBarkSound();

    setTimeout(() => {
      setIsBarking(false);
      setBarkText("");
    }, 1500);

    // Start running sound immediately when running begins
    startRunningSound();

    // Stop running after animation completes (6 seconds)
    runningTimeoutRef.current = setTimeout(() => {
      setIsRunning(false);
      // Stop the running sound when running ends
      stopRunningSound();

      // Clear any remaining bark state when running ends
      setTimeout(() => {
        setIsBarking(false);
        setBarkText("");
      }, 100);

      // Clear the timeout ref
      runningTimeoutRef.current = null;
    }, 6000);
  };

  const bark = () => {
    // Don't bark if currently running (except for the initial run bark)
    if (isRunning) return;

    const barkSounds = ["Woof!", "Arf!", "Ruff!", "Bow wow!"];
    const randomBark =
      barkSounds[Math.floor(Math.random() * barkSounds.length)];

    setIsBarking(true);
    setBarkText(randomBark);

    // Play bark sound
    playBarkSound();

    setTimeout(() => {
      setIsBarking(false);
      setBarkText("");
    }, 1500);
  };

  // Random barking every 5-10 seconds when not running
  useEffect(() => {
    let randomBarkInterval: NodeJS.Timeout;

    if (!isRunning) {
      const setRandomBark = () => {
        randomBarkInterval = setTimeout(() => {
          if (!isRunning && Math.random() > 0.7) {
            bark();
          }
          if (!isRunning) {
            setRandomBark(); // Schedule next bark
          }
        }, Math.random() * 5000 + 5000);
      };

      // Start the random barking cycle
      setRandomBark();
    }

    return () => {
      if (randomBarkInterval) {
        clearTimeout(randomBarkInterval);
      }
    };
  }, [isRunning]);

  // Stop running sound if sound is disabled while running
  useEffect(() => {
    if (!soundEnabled && isRunning) {
      stopRunningSound();
    } else if (soundEnabled && isRunning) {
      startRunningSound();
    }
  }, [soundEnabled, isRunning]);

  return (
    <div className='relative w-full h-32 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg overflow-hidden border border-orange-100'>
      {/* Sound Toggle Button */}
      <button
        onClick={() => setSoundEnabled(!soundEnabled)}
        className={`absolute top-2 left-2 px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 z-10 ${
          soundEnabled
            ? "bg-green-500 hover:bg-green-600 text-white"
            : "bg-gray-300 hover:bg-gray-400 text-gray-600"
        }`}
      >
        🔊 {soundEnabled ? "ON" : "OFF"}
      </button>

      {/* Ground/grass effect */}
      <div className='absolute bottom-0 w-full h-4 bg-gradient-to-r from-green-200 to-green-300'></div>

      {/* Bark speech bubble */}
      {isBarking && (
        <div
          className={`absolute transition-all duration-300 z-20 ${
            isRunning ? "right-1/2 transform translate-x-1/2" : "right-20"
          }`}
          style={{ top: "10px" }}
        >
          <div className='bg-white border-2 border-orange-300 rounded-lg px-3 py-1 relative shadow-lg animate-bounce'>
            <span className='text-orange-600 font-bold text-sm'>
              {barkText}
            </span>
            <div className='absolute bottom-[-8px] left-4 w-0 h-0 border-l-4 border-r-4 border-t-8 border-l-transparent border-r-transparent border-t-orange-300'></div>
          </div>
        </div>
      )}

      {/* Running Dog */}
      <div
        className={`absolute bottom-4 transition-all duration-[6000ms] ease-linear ${
          isRunning ? "right-[calc(100%-80px)]" : "right-4"
        }`}
      >
        {/* Dog SVG */}
        <div className={`relative ${isRunning ? "animate-bounce" : ""}`}>
          <svg
            width='60'
            height='40'
            viewBox='0 0 60 40'
            className={`${
              isRunning ? "scale-x-100" : "scale-x-[-1]"
            } transition-transform duration-500`}
          >
            {/* Dog Body */}
            <ellipse
              cx='35'
              cy='25'
              rx='18'
              ry='8'
              fill='#F97316'
              className='drop-shadow-sm'
            />

            {/* Dog Head */}
            <circle
              cx='15'
              cy='20'
              r='12'
              fill='#FB923C'
              className='drop-shadow-sm'
            />

            {/* Dog Ears */}
            <ellipse
              cx='8'
              cy='15'
              rx='4'
              ry='7'
              fill='#EA580C'
              className='drop-shadow-sm'
            />
            <ellipse
              cx='22'
              cy='15'
              rx='4'
              ry='7'
              fill='#EA580C'
              className='drop-shadow-sm'
            />

            {/* Dog Eyes */}
            <circle cx='12' cy='18' r='2' fill='#1F2937' />
            <circle cx='18' cy='18' r='2' fill='#1F2937' />
            <circle cx='12.5' cy='17.5' r='0.8' fill='white' />
            <circle cx='18.5' cy='17.5' r='0.8' fill='white' />

            {/* Dog Nose */}
            <ellipse cx='15' cy='23' rx='1.5' ry='1' fill='#1F2937' />

            {/* Dog Mouth */}
            <path
              d='M 15 24 Q 13 26 11 25'
              stroke='#1F2937'
              strokeWidth='1'
              fill='none'
            />
            <path
              d='M 15 24 Q 17 26 19 25'
              stroke='#1F2937'
              strokeWidth='1'
              fill='none'
            />

            {/* Dog Legs */}
            <rect
              x='25'
              y='30'
              width='3'
              height='8'
              fill='#DC2626'
              className={isRunning ? "animate-pulse" : ""}
            />
            <rect
              x='30'
              y='30'
              width='3'
              height='8'
              fill='#DC2626'
              className={isRunning ? "animate-pulse" : ""}
            />
            <rect
              x='40'
              y='30'
              width='3'
              height='8'
              fill='#DC2626'
              className={isRunning ? "animate-pulse" : ""}
            />
            <rect
              x='45'
              y='30'
              width='3'
              height='8'
              fill='#DC2626'
              className={isRunning ? "animate-pulse" : ""}
            />

            {/* Dog Tail */}
            <path
              d='M 50 20 Q 58 15 55 25'
              stroke='#F97316'
              strokeWidth='4'
              fill='none'
              className={`${
                isRunning ? "animate-pulse" : "animate-bounce"
              } drop-shadow-sm`}
            />

            {/* Dog Spots */}
            <circle cx='30' cy='22' r='2' fill='#EA580C' />
            <circle cx='40' cy='27' r='1.5' fill='#EA580C' />
          </svg>

          {/* Running dust clouds */}
          {isRunning && (
            <div className='absolute -bottom-2 -right-2'>
              <div className='w-8 h-4 bg-orange-200 rounded-full opacity-60 animate-ping'></div>
              <div className='w-6 h-3 bg-orange-300 rounded-full opacity-40 animate-ping animation-delay-200'></div>
            </div>
          )}

          {/* Running speed lines */}
          {isRunning && (
            <div className='absolute -left-8 top-1/2 transform -translate-y-1/2'>
              <div className='flex flex-col space-y-1'>
                <div className='w-6 h-0.5 bg-orange-400 animate-pulse'></div>
                <div className='w-4 h-0.5 bg-orange-300 animate-pulse animation-delay-200'></div>
                <div className='w-5 h-0.5 bg-orange-400 animate-pulse animation-delay-500'></div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Control Buttons */}
      <div className='absolute top-2 right-2 flex gap-2 z-10'>
        {/* Start/Run Button */}
        <button
          onClick={startRunning}
          disabled={isRunning}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
            isRunning
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-orange-500 hover:bg-orange-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105"
          }`}
        >
          {isRunning ? "Running..." : "Make Dog Run!"}
        </button>

        {/* Stop Button */}
        {isRunning && (
          <button
            onClick={stopRunning}
            className='px-4 py-2 rounded-full text-sm font-medium bg-red-500 hover:bg-red-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200'
          >
            ⏹️ Stop
          </button>
        )}
      </div>

      {/* Status indicator */}
      {isRunning && (
        <div className='absolute bottom-2 left-2 px-2 py-1 bg-green-500 text-white text-xs rounded-full animate-pulse'>
          🏃‍♂️ Running with sound!
        </div>
      )}

      {/* Decorative elements */}
      <div className='absolute top-4 left-1/4 w-2 h-2 bg-yellow-300 rounded-full animate-pulse'></div>
      <div className='absolute top-8 right-1/3 w-1.5 h-1.5 bg-yellow-400 rounded-full animate-pulse animation-delay-500'></div>
      <div className='absolute top-6 left-2/3 w-1 h-1 bg-yellow-500 rounded-full animate-pulse animation-delay-1000'></div>
    </div>
  );
};

export default RunningDog;

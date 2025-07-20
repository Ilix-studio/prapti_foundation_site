import React, { useState, useEffect, useRef } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Loader2,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { useSendContactMessageMutation } from "@/redux-store/services/contactApi";

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

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
      runningAudioRef.current.loop = false; // Loop running sound while running
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
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [sendContactMessage, { isLoading, isSuccess, error }] =
    useSendContactMessageMutation();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.email ||
      !formData.subject ||
      !formData.message
    ) {
      return;
    }

    try {
      await sendContactMessage(formData).unwrap();
      // Reset form on success
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      // Error is handled by RTK Query
      console.error("Failed to send message:", err);
    }
  };

  const getErrorMessage = () => {
    if (error) {
      if ("data" in error) {
        return (error.data as any)?.message || "Failed to send message";
      }
      return "Network error. Please try again.";
    }
    return "";
  };

  return (
    <>
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

      {/* contact section  */}
      <section
        className='w-full py-12 md:py-24 lg:py-32 bg-gray-50'
        id='contact'
      >
        <div className='container px-4 md:px-6'>
          <div className='grid gap-12 lg:grid-cols-2 lg:gap-16'>
            {/* Left Column - Contact Information */}
            <div className='space-y-8'>
              <div className='space-y-4'>
                <Badge className='bg-green-100 text-green-700 border-green-200 hover:bg-green-200'>
                  Get in Touch
                </Badge>
                <h2 className='text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl'>
                  Connect With Us
                </h2>
                <p className='text-gray-600 text-lg'>
                  Have questions or suggestions? Reach out to our office. We're
                  here to listen and assist.
                </p>
              </div>

              {/* Contact Details */}
              <div className='space-y-6'>
                <div className='flex items-start gap-4 p-4 rounded-lg bg-white shadow-sm border'>
                  <div className='p-2 rounded-full bg-orange-100'>
                    <Mail className='h-5 w-5 text-orange-600' />
                  </div>
                  <div>
                    <h3 className='font-semibold text-gray-900'>Email</h3>
                    <p className='text-gray-600'>
                      contact@prapti-foundation.com
                    </p>
                  </div>
                </div>

                <div className='flex items-start gap-4 p-4 rounded-lg bg-white shadow-sm border'>
                  <div className='p-2 rounded-full bg-orange-100'>
                    <Phone className='h-5 w-5 text-orange-600' />
                  </div>
                  <div>
                    <h3 className='font-semibold text-gray-900'>Phone</h3>
                    <p className='text-gray-600'>+91 98765 43210</p>
                  </div>
                </div>

                <div className='flex items-start gap-4 p-4 rounded-lg bg-white shadow-sm border'>
                  <div className='p-2 rounded-full bg-orange-100'>
                    <MapPin className='h-5 w-5 text-orange-600' />
                  </div>
                  <div>
                    <h3 className='font-semibold text-gray-900'>
                      Office Address
                    </h3>
                    <p className='text-gray-600'>Golaghat, Assam, India.</p>
                  </div>
                </div>
              </div>

              {/* Social Media */}
              <div className='flex gap-4'>
                <Button
                  variant='outline'
                  size='icon'
                  className='rounded-full border-orange-200 hover:bg-orange-50 hover:border-orange-300'
                >
                  <Facebook className='h-4 w-4 text-orange-600' />
                  <span className='sr-only'>Facebook</span>
                </Button>
                <Button
                  variant='outline'
                  size='icon'
                  className='rounded-full border-orange-200 hover:bg-orange-50 hover:border-orange-300'
                >
                  <Twitter className='h-4 w-4 text-orange-600' />
                  <span className='sr-only'>Twitter</span>
                </Button>
                <Button
                  variant='outline'
                  size='icon'
                  className='rounded-full border-orange-200 hover:bg-orange-50 hover:border-orange-300'
                >
                  <Instagram className='h-4 w-4 text-orange-600' />
                  <span className='sr-only'>Instagram</span>
                </Button>
              </div>
            </div>

            {/* Right Column - Contact Form */}
            <div className='bg-white rounded-2xl shadow-lg p-6 md:p-8'>
              <div className='space-y-6'>
                <h3 className='text-2xl font-bold text-gray-900'>
                  Send a Message
                </h3>

                {/* Success Message */}
                {isSuccess && (
                  <div className='text-center py-4'>
                    <CheckCircle className='h-12 w-12 text-green-500 mx-auto mb-3' />
                    <h4 className='text-lg font-semibold text-gray-900 mb-2'>
                      Message Sent Successfully!
                    </h4>
                    <p className='text-gray-600'>
                      Thank you for contacting us. We'll get back to you soon.
                    </p>
                  </div>
                )}

                {/* Error Message */}
                {error && (
                  <div className='p-4 rounded-lg bg-red-50 border border-red-200 flex items-start gap-3'>
                    <AlertCircle className='h-5 w-5 text-red-500 mt-0.5' />
                    <div>
                      <p className='text-red-600 font-medium'>
                        Failed to send message
                      </p>
                      <p className='text-red-600/70 text-sm'>
                        {getErrorMessage()}
                      </p>
                    </div>
                  </div>
                )}

                {/* Contact Form */}
                <form onSubmit={handleSubmit} className='space-y-4'>
                  <div className='grid gap-4 sm:grid-cols-2'>
                    <div className='space-y-2'>
                      <Label htmlFor='name'>Name *</Label>
                      <Input
                        id='name'
                        name='name'
                        placeholder='Your name'
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        disabled={isLoading}
                        className='border-gray-200 focus:border-orange-300 focus:ring-orange-200'
                      />
                    </div>
                    <div className='space-y-2'>
                      <Label htmlFor='email'>Email *</Label>
                      <Input
                        id='email'
                        name='email'
                        type='email'
                        placeholder='Your email'
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        disabled={isLoading}
                        className='border-gray-200 focus:border-orange-300 focus:ring-orange-200'
                      />
                    </div>
                  </div>

                  <div className='space-y-2'>
                    <Label htmlFor='subject'>Subject *</Label>
                    <Input
                      id='subject'
                      name='subject'
                      placeholder='Message subject'
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      disabled={isLoading}
                      className='border-gray-200 focus:border-orange-300 focus:ring-orange-200'
                    />
                  </div>

                  <div className='space-y-2'>
                    <Label htmlFor='message'>Message *</Label>
                    <Textarea
                      id='message'
                      name='message'
                      placeholder='Your message'
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={5}
                      disabled={isLoading}
                      className='border-gray-200 focus:border-orange-300 focus:ring-orange-200 resize-none'
                    />
                  </div>

                  <Button
                    type='submit'
                    className='w-full bg-orange-500 hover:bg-orange-600 text-white py-3 text-lg font-medium'
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                        Sending Message...
                      </>
                    ) : (
                      "Send Message"
                    )}
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default RunningDog;

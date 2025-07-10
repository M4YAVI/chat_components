import React, { useState, useMemo, useCallback, CSSProperties } from 'react';
import { Frown, Meh, Smile, Laugh, Star, Zap } from 'lucide-react';

const MIN_RATING = 0;
const MAX_RATING = 100;

interface Feedback {
  Icon: React.ElementType;
  text: string;
  colorClass: string;
}

const getRatingFeedback = (value: number): Feedback => {
  if (value === 0) return { Icon: Frown, text: 'Terrible', colorClass: 'text-red-400' };
  if (value <= 20) return { Icon: Frown, text: 'Poor', colorClass: 'text-orange-400' };
  if (value <= 40) return { Icon: Meh, text: 'Fair', colorClass: 'text-yellow-400' };
  if (value <= 60) return { Icon: Smile, text: 'Good', colorClass: 'text-lime-400' };
  if (value <= 80) return { Icon: Laugh, text: 'Great!', colorClass: 'text-green-400' };
  if (value < 100) return { Icon: Star, text: 'Excellent!', colorClass: 'text-teal-400' };
  return { Icon: Zap, text: 'Mind-Blowing!', colorClass: 'text-cyan-400' };
};

const NeonSlidingScaleRating: React.FC = () => {
  const [rating, setRating] = useState(50);
  const [isDragging, setIsDragging] = useState(false);

  const handleInteractionStart = useCallback(() => setIsDragging(true), []);
  const handleInteractionEnd = useCallback(() => setIsDragging(false), []);
  
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setRating(Number(e.target.value));
  }, []);

  const percentage = useMemo(() => {
    return ((rating - MIN_RATING) / (MAX_RATING - MIN_RATING)) * 100;
  }, [rating]);

  const feedback = useMemo(() => getRatingFeedback(rating), [rating]);

  // Primary color: Lime-500 (approximate HSL for glow effects)
  const primaryColorHex = '#a3e635'; 

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-950 p-4 font-sans">
      <div className="bg-gray-900 p-8 sm:p-10 rounded-3xl shadow-2xl w-full max-w-lg border border-gray-800 shadow-lime-500/10 transition-shadow duration-300 hover:shadow-lime-500/20">
        
        <h2 className="text-2xl font-semibold text-gray-100 mb-8 text-center">
          How would you rate this experience?
        </h2>

        {/* Rating Display and Feedback */}
        <div className="text-center mb-12">
          <div 
            className={`text-8xl font-extrabold mb-4 transition-all duration-300 text-lime-500 ${isDragging ? 'scale-105' : 'scale-100'}`}
            style={{
              textShadow: `0 0 5px ${primaryColorHex}30, 0 0 20px ${primaryColorHex}20`
            }}
          >
            {rating}
          </div>
          
          <div className="flex items-center justify-center space-x-3">
            <feedback.Icon className={`w-8 h-8 ${feedback.colorClass} transition-transform duration-300 ${isDragging ? 'scale-125' : ''}`} />
            <p className={`text-xl font-medium ${feedback.colorClass} transition-colors duration-300`}>
              {feedback.text}
            </p>
          </div>
        </div>

        {/* Slider Component */}
        <div className="relative py-4">
          
          {/* Custom Track Visualization */}
          <div className="absolute top-1/2 left-0 w-full h-3 bg-gray-700 rounded-full transform -translate-y-1/2 overflow-hidden shadow-inner shadow-black/50">
            {/* Track Fill (Neon Green) */}
            <div 
              className="absolute top-0 left-0 h-full bg-lime-500 transition-all duration-100 ease-linear"
              style={{
                width: `${percentage}%`,
                // Inner glow effect on the fill
                boxShadow: `0 0 10px ${primaryColorHex}60, inset 0 0 4px rgba(255, 255, 255, 0.3)` 
              }}
            />
          </div>

          {/* The actual slider input */}
          <input
            type="range"
            min={MIN_RATING}
            max={MAX_RATING}
            value={rating}
            onChange={handleChange}
            onMouseDown={handleInteractionStart}
            onMouseUp={handleInteractionEnd}
            onTouchStart={handleInteractionStart}
            onTouchEnd={handleInteractionEnd}
            className="relative w-full h-8 appearance-none cursor-pointer bg-transparent z-10 focus:outline-none
            
            /* --- WebKit Styles --- */
            /* Track: Make it transparent so our custom track shows */
            [&::-webkit-slider-runnable-track]:h-3
            [&::-webkit-slider-runnable-track]:bg-transparent
            
            /* Thumb */
            [&::-webkit-slider-thumb]:appearance-none
            [&::-webkit-slider-thumb]:h-8
            [&::-webkit-slider-thumb]:w-8
            [&::-webkit-slider-thumb]:bg-lime-500
            [&::-webkit-slider-thumb]:rounded-full
            [&::-webkit-slider-thumb]:border-4
            [&::-webkit-slider-thumb]:border-gray-900 /* Dark border matching the card background */
            
            /* Center thumb vertically on the track (Thumb h-8=32px, Track h-3=12px. (32-12)/2 = 10px offset) */
            [&::-webkit-slider-thumb]:-mt-[10px] 
            
            /* Glow effect and shadow (using arbitrary values for complex shadows) */
            [&::-webkit-slider-thumb]:shadow-[0_0_15px_rgba(163,230,53,0.7),0_4px_6px_rgba(0,0,0,0.5)]
            
            /* Transitions */
            [&::-webkit-slider-thumb]:transition-all
            [&::-webkit-slider-thumb]:duration-150
            [&::-webkit-slider-thumb]:ease-in-out

            /* Hover/Active state for WebKit thumb */
            hover:[&::-webkit-slider-thumb]:scale-110
            hover:[&::-webkit-slider-thumb]:shadow-[0_0_25px_rgba(163,230,53,0.9),0_4px_8px_rgba(0,0,0,0.6)]
            active:[&::-webkit-slider-thumb]:scale-110
            
            /* --- Firefox Styles --- */
            /* Track: Make it transparent */
            [&::-moz-range-track]:h-3
            [&::-moz-range-track]:bg-transparent
            [&::-moz-range-progress]:hidden /* Hide default Firefox progress bar */

            /* Thumb */
            [&::-moz-range-thumb]:h-8
            [&::-moz-range-thumb]:w-8
            [&::-moz-range-thumb]:bg-lime-500
            [&::-moz-range-thumb]:rounded-full
            [&::-moz-range-thumb]:border-4
            [&::-moz-range-thumb]:border-gray-900
            
            /* Glow effect and shadow for Firefox */
            [&::-moz-range-thumb]:shadow-[0_0_15px_rgba(163,230,53,0.7),0_4px_6px_rgba(0,0,0,0.5)]

            /* Transitions for Firefox */
            [&::-moz-range-thumb]:transition-all
            [&::-moz-range-thumb]:duration-150
            [&::-moz-range-thumb]:ease-in-out

            /* Hover/Active state for Firefox thumb */
            hover:[&::-moz-range-thumb]:scale-110
            hover:[&::-moz-range-thumb]:shadow-[0_0_25px_rgba(163,230,53,0.9),0_4px_8px_rgba(0,0,0,0.6)]
            active:[&::-moz-range-thumb]:scale-110
            "
          />
        </div>

        {/* Scale Labels */}
        <div className="flex justify-between mt-2 text-sm font-medium text-gray-500">
          <span>{MIN_RATING}</span>
          <span className="text-gray-400">Slide to rate</span>
          <span>{MAX_RATING}</span>
        </div>
        
        {/* Submit Button */}
        <button 
          className="mt-10 w-full py-3 px-4 bg-lime-600 hover:bg-lime-500 text-gray-950 font-bold rounded-lg transition duration-300 shadow-lg shadow-lime-500/30 hover:shadow-lime-500/50 focus:outline-none focus:ring-4 focus:ring-lime-500 focus:ring-opacity-50 transform hover:scale-[1.02] active:scale-[0.98]"
          onClick={() => alert(`Rating submitted: ${rating}`)}
        >
          Submit Rating
        </button>
      </div>
    </div>
  );
};

export default NeonSlidingScaleRating;

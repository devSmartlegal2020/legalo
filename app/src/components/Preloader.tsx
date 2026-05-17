import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

interface PreloaderProps {
  onComplete: () => void;
}

const Preloader = ({ onComplete }: PreloaderProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const legaloRef = useRef<HTMLSpanElement>(null);
  const dotRef = useRef<HTMLSpanElement>(null);
  const idRef = useRef<HTMLSpanElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const [isAnimating, setIsAnimating] = useState(true);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          // Slide up the entire preloader
          gsap.to(containerRef.current, {
            yPercent: -100,
            duration: 0.8,
            ease: 'power3.inOut',
            onComplete: () => {
              setIsAnimating(false);
              onComplete();
            },
          });
        },
      });

      // Initial states
      gsap.set(legaloRef.current, { x: -100, opacity: 0 });
      gsap.set(dotRef.current, { scale: 0, opacity: 0 });
      gsap.set(idRef.current, { x: 100, opacity: 0 });
      gsap.set(gridRef.current?.querySelectorAll('.grid-square') || [], { 
        scale: 0, 
        opacity: 0 
      });

      // Animation sequence
      tl.to(legaloRef.current, {
        x: 0,
        opacity: 1,
        duration: 0.6,
        ease: 'power3.out',
      }, 0.3)
      .to(gridRef.current?.querySelectorAll('.grid-square') || [], {
        scale: 1,
        opacity: 1,
        stagger: 0.05,
        duration: 0.4,
        ease: 'back.out(1.7)',
      }, 0.5)
      .to(dotRef.current, {
        scale: 1,
        opacity: 1,
        duration: 0.3,
        ease: 'back.out(2)',
      }, 0.7)
      .to(idRef.current, {
        x: 0,
        opacity: 1,
        duration: 0.6,
        ease: 'power3.out',
      }, 0.8)
      .to({}, { duration: 0.5 }); // Hold before exit

    }, containerRef);

    return () => ctx.revert();
  }, [onComplete]);

  if (!isAnimating) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[9999] bg-black flex items-center justify-center"
    >
      <div className="flex items-center gap-4 lg:gap-6">
        {/* Legalo text */}
        <span
          ref={legaloRef}
          className="font-heading font-bold text-4xl sm:text-5xl lg:text-6xl text-white tracking-tight"
        >
          Legalo
        </span>

        {/* Grid pattern */}
        <div ref={gridRef} className="grid grid-cols-3 gap-1 w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14">
          {[...Array(9)].map((_, i) => (
            <div
              key={i}
              className={`grid-square w-full h-full rounded-sm ${
                i === 4 ? 'bg-legalo-red' : 'bg-white/80'
              }`}
            />
          ))}
        </div>

        {/* Dot and id */}
        <div className="flex items-start">
          <span
            ref={dotRef}
            className="font-heading font-medium text-xl sm:text-2xl lg:text-3xl text-gray-400 mx-2"
          >
            by
          </span>
          <span
            ref={idRef}
            className="font-heading font-bold text-4xl sm:text-5xl lg:text-6xl text-legalo-red tracking-tight"
          >
            SmartLegal
          </span>
        </div>
      </div>
    </div>
  );
};

export default Preloader;

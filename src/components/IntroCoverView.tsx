import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ChevronRight } from 'lucide-react';

import backgroundImage from '../assets/images/background.png';

interface IntroCoverViewProps {
  onOpenComplete: () => void;
  isMuted?: boolean;
  onToggleMute?: () => void;
}

export const IntroCoverView: React.FC<IntroCoverViewProps> = ({
  onOpenComplete,
}) => {
  const [dragProgress, setDragProgress] = useState<number>(0); // 0 to 1
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isOpening, setIsOpening] = useState<boolean>(false);
  const startXRef = useRef<number>(0);
  const currentDragRef = useRef<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Complete opening animation
  const triggerOpen = useCallback(() => {
    if (isOpening) return;
    setIsOpening(true);

    // Smoothly animate open to 100%
    setDragProgress(1);

    setTimeout(() => {
      onOpenComplete();
    }, 600);
  }, [isOpening, onOpenComplete]);

  // Touch and mouse drag handlers
  const handleStart = (clientX: number) => {
    if (isOpening) return;
    setIsDragging(true);
    startXRef.current = clientX;
    currentDragRef.current = dragProgress;
  };

  const handleMove = useCallback((clientX: number) => {
    if (!isDragging || isOpening) return;
    const delta = startXRef.current - clientX; // dragging leftwards opens
    const maxDistance = 260; // drag distance in px to open
    const progress = Math.min(1, Math.max(0, currentDragRef.current + delta / maxDistance));
    setDragProgress(progress);

    if (progress >= 0.85) {
      setIsDragging(false);
      triggerOpen();
    }
  }, [isDragging, isOpening, triggerOpen]);

  const handleEnd = useCallback(() => {
    if (!isDragging || isOpening) return;
    setIsDragging(false);
    if (dragProgress > 0.4) {
      triggerOpen();
    } else {
      // Snap back to 0
      setDragProgress(0);
    }
  }, [isDragging, isOpening, dragProgress, triggerOpen]);

  // Global mouse/touch up listener
  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => handleMove(e.clientX);
    const onMouseUp = () => handleEnd();
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) handleMove(e.touches[0].clientX);
    };
    const onTouchEnd = () => handleEnd();

    if (isDragging) {
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
      window.addEventListener('touchmove', onTouchMove);
      window.addEventListener('touchend', onTouchEnd);
    }

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
    };
  }, [isDragging, handleMove, handleEnd]);

  // Cover 3D rotation angle: 0deg (closed) to -175deg (fully open to left)
  const coverRotateY = -dragProgress * 170;

  // Dynamic shadow calculation based on opening progress (elevation peaks midway)
  const rad = Math.min(Math.PI, dragProgress * Math.PI);
  const elevation = Math.sin(rad);
  const coverShadow =
    dragProgress > 0.02
      ? `${-10 - elevation * 35}px ${12 + elevation * 25}px ${25 + elevation * 40}px rgba(0, 0, 0, ${
          0.6 + elevation * 0.35
        }), ${-5 - elevation * 15}px ${6 + elevation * 10}px ${12 + elevation * 20}px rgba(0, 0, 0, 0.7)`
      : '0 12px 30px rgba(0, 0, 0, 0.6)';

  return (
    <div
      ref={containerRef}
      className="relative w-full h-screen overflow-hidden bg-black select-none flex flex-col justify-between"
    >
      {/* Full Screen Modern Bar Lounge Backdrop */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <img
          src={backgroundImage}
          alt="Modern Bar Lounge Background"
          referrerPolicy="no-referrer"
          draggable={false}
          onDragStart={(e) => e.preventDefault()}
          className="w-full h-full object-cover filter brightness-[0.38] contrast-[1.08] saturate-[0.85] select-none pointer-events-none"
        />
        {/* Atmosphere Vignette & Scrims */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0f] via-[#0d0d0f]/50 to-[#0d0d0f]/80" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(13,13,15,0.85)_100%)]" />
      </div>

      {/* Top Header Bar */}
      <header className="relative z-20 flex items-center justify-between px-6 md:px-12 py-5 border-b border-neutral-800/80 bg-[#0d0d0f]/80 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <span className="font-cinzel text-xl md:text-2xl font-bold tracking-widest text-neutral-100">
            BUNNY CAFE
          </span>
          <span className="hidden sm:inline-block text-xs uppercase tracking-widest text-neutral-400 border-l border-neutral-700 pl-3">
            Private Lounge
          </span>
        </div>
      </header>

      {/* Center 3D Interactive Menu Book */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 py-6 perspective-1500">
        {/* Table Surface Contact Shadow (Spreads realistically to the left as book opens) */}
        <div className="relative">
          <div
            className="absolute -bottom-8 -left-12 -right-8 h-14 bg-black/90 rounded-full blur-2xl pointer-events-none transition-all duration-75"
            style={{
              transform: `scaleX(${1 + dragProgress * 0.7}) scaleY(${1 + dragProgress * 0.4}) translateX(${
                -dragProgress * 35
              }px)`,
              opacity: 0.85 + elevation * 0.15,
            }}
          />

          {/* 3D Menu Book Wrapper */}
          <div
            className="relative w-[300px] sm:w-[350px] md:w-[390px] h-[430px] sm:h-[490px] md:h-[540px] cursor-grab active:cursor-grabbing touch-none select-none transition-transform duration-300 hover:scale-[1.01]"
            onMouseDown={(e) => handleStart(e.clientX)}
            onTouchStart={(e) => {
              if (e.touches.length > 0) handleStart(e.touches[0].clientX);
            }}
          >
            {/* Menu Interior Base (Revealed as cover opens) */}
            <div className="absolute inset-0 rounded-r-lg rounded-l-sm bg-[#16161a] border border-neutral-800 shadow-2xl p-6 flex flex-col justify-between overflow-hidden">
              <div className="relative z-10 border border-neutral-800 h-full p-6 flex flex-col justify-between text-center bg-[#111114]">
                <div className="pt-6">
                  <span className="font-cinzel text-xs tracking-widest text-neutral-400">TABLE SERVICE</span>
                  <h3 className="font-serif-kr text-xl font-semibold text-neutral-100 mt-2">BUNNY CAFE</h3>
                  <div className="w-12 h-px bg-neutral-700 mx-auto my-3" />
                  <p className="text-xs text-neutral-300 leading-relaxed font-serif-kr">
                    달콤한 수제 디저트와 깊은 여운의 시그니처 칵테일,<br />
                    그리고 오직 당신만을 기다리는 전담 호스트.
                  </p>
                </div>
              </div>

              {/* Dynamic Spine Gutter Shadow on the Interior Page */}
              <div className="absolute top-0 bottom-0 left-0 w-16 bg-gradient-to-r from-black/85 via-black/40 to-transparent pointer-events-none z-10" />

              {/* Dynamic Shadow Cast by the Lifting Cover Leaf onto this Right Page */}
              <div
                className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent pointer-events-none z-20 transition-opacity duration-75"
                style={{
                  opacity: Math.max(0, (1 - dragProgress * 1.4) * 0.85),
                  transform: `scaleX(${Math.max(0.2, 1 - dragProgress * 0.7)})`,
                  transformOrigin: 'left',
                }}
              />
            </div>

            {/* Book Spine (Left side fixed base edge) - placed below turning leaf (z-10) */}
            <div className="absolute top-0 bottom-0 left-0 w-5 bg-gradient-to-r from-[#0a0a0c] via-[#222228] to-[#0d0d10] rounded-l-sm shadow-xl z-10 border-r border-neutral-800 pointer-events-none" />

            {/* Turning Cover Leaf - raised to z-30 so it smoothly turns in front without spine clipping */}
            <div
              className="absolute inset-0 transform-style-3d origin-left transition-transform duration-100 ease-out z-30"
              style={{
                transform: `rotateY(${coverRotateY}deg)`,
                boxShadow: coverShadow,
              }}
            >
              {/* Front of the Cover */}
              <div className="absolute inset-0 backface-hidden rounded-r-lg rounded-l-sm overflow-hidden bg-[#18181d] border border-neutral-800 flex flex-col justify-between p-6">
                {/* Left Spine Subtle Shading & Hinge Crease (Always visible to provide 3D volume even when closed) */}
                <div className="absolute top-0 bottom-0 left-0 w-8 bg-gradient-to-r from-black/55 via-black/20 to-transparent pointer-events-none z-10" />
                <div className="absolute top-0 bottom-0 left-4 w-px bg-black/45 shadow-[1px_0_1px_rgba(255,255,255,0.06)] pointer-events-none z-10" />
                <div className="absolute top-0 bottom-0 left-1 w-2 bg-gradient-to-r from-white/[0.05] to-transparent pointer-events-none z-10" />

                {/* Dynamic 3D lighting gradient as the front face angles away */}
                <div
                  className="absolute inset-0 pointer-events-none z-10 transition-opacity duration-75"
                  style={{
                    background:
                      'linear-gradient(to right, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 25%, transparent 60%)',
                    opacity: elevation * 0.9,
                  }}
                />

                {/* Inner Content Area */}
                <div className="relative z-10 w-full h-full p-4 flex flex-col justify-between pointer-events-none">
                  {/* 'Menu' Text at Top */}
                  <div className="pt-4 flex flex-col items-center text-center">
                    <h2 className="font-cinzel text-3xl sm:text-4xl md:text-5xl font-semibold tracking-[0.25em] text-neutral-100 drop-shadow-md">
                      Menu
                    </h2>
                  </div>

                  {/* Empty Middle Breathing Space */}
                  <div className="flex-1" />

                  {/* Bottom Cover Footer */}
                  <div className="text-center pb-2">
                    <span className="text-[11px] uppercase tracking-widest text-neutral-400 font-cinzel">
                      Foods, Drink, ...
                    </span>
                  </div>
                </div>

                {/* Right Page Edge Spine Curl Shadow */}
                <div className="absolute top-0 bottom-0 right-0 w-4 bg-gradient-to-l from-black/60 to-transparent" />
              </div>

              {/* Backside of Cover (Visible during flip as it turns over to the left) */}
              <div
                className="absolute inset-0 backface-hidden rounded-l-lg rounded-r-sm bg-[#131317] border border-neutral-800 p-6 flex flex-col justify-center items-center text-neutral-300 overflow-hidden"
                style={{ transform: 'rotateY(180deg)' }}
              >
                {/* Spine depth shadow on underside */}
                <div className="absolute top-0 bottom-0 right-0 w-16 bg-gradient-to-l from-black/85 via-black/40 to-transparent pointer-events-none" />
                {/* 3D Paper curvature ambient sheen */}
                <div
                  className="absolute inset-0 bg-gradient-to-r from-white/[0.03] via-transparent to-black/60 pointer-events-none"
                  style={{ opacity: elevation }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Drag Hint & Open Action Controls */}
        <div className="mt-8 flex flex-col items-center gap-3 w-full max-w-md">
          {/* Interactive Drag Track */}
          <div className="w-full bg-[#141418] border border-neutral-800 rounded-full p-1.5 flex items-center justify-between relative overflow-hidden">
            {/* Fill indicator according to drag */}
            <div
              className="absolute left-0 top-0 bottom-0 bg-neutral-700/40 rounded-full transition-all duration-75"
              style={{ width: `${Math.max(10, dragProgress * 100)}%` }}
            />

            <span className="relative z-10 pl-4 text-xs font-serif-kr text-neutral-300 flex items-center gap-2">
              <span className="text-neutral-400">◀</span> 마우스로 메뉴판을 좌측으로 드래그하여 펼치세요
            </span>

            <button
              onClick={triggerOpen}
              className="relative z-10 px-4 py-2 bg-neutral-200 hover:bg-white text-neutral-950 font-medium text-xs rounded-full shadow transition-all active:scale-95 flex items-center gap-1 shrink-0"
            >
              <span>메뉴판 열기</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <p className="text-[11px] text-neutral-500 font-serif-kr text-center">
            * 메뉴판을 드래그하거나 [메뉴판 열기]를 클릭하면 메인 소개 페이지로 전환됩니다.
          </p>
        </div>
      </div>

      {/* Bottom Quiet Footer */}
      <footer className="relative z-20 px-6 py-4 flex flex-col sm:flex-row items-center justify-between text-[11px] text-neutral-500 border-t border-neutral-800/80 bg-[#0d0d0f]/80 backdrop-blur-md">
        <div>
          © 2026 BUNNY CAFE PROJECT. All Rights Reserved.
        </div>
        <div className="flex items-center gap-4 mt-2 sm:mt-0 text-neutral-400">
          <span>합법 인가 유흥주점</span>
          <span>·</span>
          <span>프라이빗 룸 완비</span>
          <span>·</span>
          <span>호스트 지정제</span>
        </div>
      </footer>
    </div>
  );
};

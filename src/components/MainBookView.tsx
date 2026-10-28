import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Sparkles,
  Check,
  Send,
  Maximize2,
  X,
  Play,
  Pause,
  Square,
  Volume2,
  Volume1,
  VolumeX,
  Music,
} from 'lucide-react';
import { GAME_INFO, HOSTS, MENU_ITEMS, GAME_SYSTEMS, HostProfile, MenuItem, HERA_PAGE_DETAIL, GLASS_PAGE_DETAIL, LILY_PAGE_DETAIL, CARROT_PAGE_DETAIL, LOKI_PAGE_DETAIL, INDIGO_PAGE_DETAIL, THOR_PAGE_DETAIL, RIO_PAGE_DETAIL } from '../data/gameData';
import backgroundImage from '../assets/images/background.png';
import mapImage from '../assets/images/map.png';
import recommendImage from '../assets/images/recommendf.png';
import bestHostImg from '../assets/images/besthost.png';
import suImg from '../assets/images/su.png';
import kiImg from '../assets/images/ki.png';
import yuImg from '../assets/images/yu.png';
import goImg from '../assets/images/go.png';
import baImg from '../assets/images/ba.png';
import naImg from '../assets/images/na.png';
import leImg from '../assets/images/le.png';
import hoImg from '../assets/images/ho.png';
import sup00Img from '../assets/images/sup00.png';
import yup00Img from '../assets/images/yup00.png';
import bap00Img from '../assets/images/bap00.png';
import lep00Img from '../assets/images/lep00.png';
import kip00Img from '../assets/images/kip00.png';
import gop00Img from '../assets/images/gop00.png';
import nap00Img from '../assets/images/nap00.png';
import hop00Img from '../assets/images/hop00.png';
import logoImg from '../assets/images/logo.png';
import bgmAudioUrl from '../assets/bunnycafe.mp3';

interface MainBookViewProps {
  onCloseToCover: () => void;
  isMuted?: boolean;
  onToggleMute?: () => void;
}

export const MainBookView: React.FC<MainBookViewProps> = ({
  onCloseToCover,
}) => {
  // Current spread index (0: Cafe Intro, 1~2: Dining & Drinks, 3~7: Host Menu [8 Hosts], 8: Notice & Final)
  const [currentSpread, setCurrentSpread] = useState<number>(0);
  const totalSpreads = 9;

  // 3D Page flip states
  // flipProgress: 0 (resting), -1 to 0 (flipping forward to next), 0 to 1 (flipping backward to prev)
  const [flipProgress, setFlipProgress] = useState<number>(0);
  const [isFlipping, setIsFlipping] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const flipProgressRef = useRef<number>(0);
  const dragStartXRef = useRef<number>(0);
  const animFrameRef = useRef<number | null>(null);
  const bookContainerRef = useRef<HTMLDivElement>(null);

  // Sub-component states
  const [selectedHost, setSelectedHost] = useState<HostProfile>(HOSTS[0]);
  const [voiceLinePlaying, setVoiceLinePlaying] = useState<boolean>(false);
  const [choiceSelected, setChoiceSelected] = useState<number | null>(null);
  const [lightboxImage, setLightboxImage] = useState<{ src: string; caption: string } | null>(null);

  // Pre-registration form state
  const [regForm, setRegForm] = useState({
    nickname: '',
    email: '',
    favoriteHost: 'elara',
    comment: '',
  });
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string>('');

  // BGM Audio HUD states
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0.65);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // Auto-play when entering MainBookView
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.loop = true;
    audio.volume = volume;

    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsPlaying(true);
        })
        .catch((err) => {
          // Autoplay policy: waiting for user click
          console.log('Autoplay waiting for interaction:', err);
          setIsPlaying(false);
        });
    }

    return () => {
      audio.pause();
    };
  }, []);

  const handlePlayBgm = () => {
    if (!audioRef.current) return;
    audioRef.current.play().then(() => {
      setIsPlaying(true);
    }).catch(console.error);
  };

  const handlePauseBgm = () => {
    if (!audioRef.current) return;
    audioRef.current.pause();
    setIsPlaying(false);
  };

  const handleStopBgm = () => {
    if (!audioRef.current) return;
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    setIsPlaying(false);
  };

  const handleVolumeChange = (newVol: number) => {
    setVolume(newVol);
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : newVol;
    }
  };

  const handleToggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    if (audioRef.current) {
      audioRef.current.volume = nextMuted ? 0 : volume;
    }
  };

  const handleCloseAndStopAudio = () => {
    handleStopBgm();
    onCloseToCover();
  };

  // Smooth animation helper
  const animateFlipTo = useCallback((targetProgress: number, onComplete?: () => void) => {
    setIsFlipping(true);
    const startVal = flipProgressRef.current;
    const startTime = performance.now();
    const duration = 340; // ms

    const step = (now: number) => {
      const elapsed = now - startTime;
      const t = Math.min(1, elapsed / duration);
      // Smooth quad easeInOut
      const ease = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
      const currentVal = startVal + (targetProgress - startVal) * ease;

      setFlipProgress(currentVal);
      flipProgressRef.current = currentVal;

      if (t < 1) {
        animFrameRef.current = requestAnimationFrame(step);
      } else {
        setIsFlipping(false);
        if (onComplete) onComplete();
      }
    };

    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    animFrameRef.current = requestAnimationFrame(step);
  }, []);

  // Programmatic Page Turning with 3D animation
  const goToSpread = useCallback((targetIndex: number) => {
    if (isFlipping || targetIndex === currentSpread || targetIndex < 0 || targetIndex >= totalSpreads) return;

    if (targetIndex > currentSpread) {
      // Animate flip forward
      animateFlipTo(-1, () => {
        setCurrentSpread(targetIndex);
        setFlipProgress(0);
        flipProgressRef.current = 0;
      });
    } else {
      // Animate flip backward
      animateFlipTo(1, () => {
        setCurrentSpread(targetIndex);
        setFlipProgress(0);
        flipProgressRef.current = 0;
      });
    }
  }, [currentSpread, isFlipping, totalSpreads, animateFlipTo]);

  const handleNextPage = useCallback(() => {
    if (currentSpread < totalSpreads - 1 && !isFlipping) {
      animateFlipTo(-1, () => {
        setCurrentSpread((s) => s + 1);
        setFlipProgress(0);
        flipProgressRef.current = 0;
      });
    }
  }, [currentSpread, totalSpreads, isFlipping, animateFlipTo]);

  const handlePrevPage = useCallback(() => {
    if (currentSpread > 0 && !isFlipping) {
      animateFlipTo(1, () => {
        setCurrentSpread((s) => s - 1);
        setFlipProgress(0);
        flipProgressRef.current = 0;
      });
    }
  }, [currentSpread, isFlipping, animateFlipTo]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') handleNextPage();
      if (e.key === 'ArrowLeft') handlePrevPage();
      if (e.key === 'Escape') setLightboxImage(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNextPage, handlePrevPage]);

  // Interactive Drag & Drop page flipping
  const handleDragStart = (clientX: number) => {
    if (isFlipping) return;
    setIsDragging(true);
    dragStartXRef.current = clientX;
  };

  const handleDragMove = useCallback((clientX: number) => {
    if (!isDragging || isFlipping) return;
    const delta = clientX - dragStartXRef.current;
    const maxDragDistance = 340; // px to reach 180deg flip

    if (delta < 0) {
      // Dragging left (turning forward to next page)
      if (currentSpread < totalSpreads - 1) {
        const progress = Math.max(-1, delta / maxDragDistance);
        setFlipProgress(progress);
        flipProgressRef.current = progress;
      }
    } else if (delta > 0) {
      // Dragging right (turning backward to prev page)
      if (currentSpread > 0) {
        const progress = Math.min(1, delta / maxDragDistance);
        setFlipProgress(progress);
        flipProgressRef.current = progress;
      }
    }
  }, [isDragging, isFlipping, currentSpread, totalSpreads]);

  const handleDragEnd = useCallback(() => {
    if (!isDragging) return;
    setIsDragging(false);

    const progress = flipProgressRef.current;
    const threshold = 0.28; // flip threshold

    if (progress < -threshold && currentSpread < totalSpreads - 1) {
      // Complete turn to next page
      animateFlipTo(-1, () => {
        setCurrentSpread((s) => s + 1);
        setFlipProgress(0);
        flipProgressRef.current = 0;
      });
    } else if (progress > threshold && currentSpread > 0) {
      // Complete turn to previous page
      animateFlipTo(1, () => {
        setCurrentSpread((s) => s - 1);
        setFlipProgress(0);
        flipProgressRef.current = 0;
      });
    } else {
      // Cancel and spring back to 0
      animateFlipTo(0);
    }
  }, [isDragging, currentSpread, totalSpreads, animateFlipTo]);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => handleDragMove(e.clientX);
    const onMouseUp = () => handleDragEnd();
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) handleDragMove(e.touches[0].clientX);
    };
    const onTouchEnd = () => handleDragEnd();

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
  }, [isDragging, handleDragMove, handleDragEnd]);

  const handlePlayVoice = () => {
    setVoiceLinePlaying(true);
    setTimeout(() => {
      setVoiceLinePlaying(false);
    }, 4500);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regForm.nickname.trim()) {
      setSubmitError('닉네임을 입력해주세요.');
      return;
    }
    if (!regForm.email.includes('@') || !regForm.email.includes('.')) {
      setSubmitError('올바른 이메일 주소를 입력해주세요.');
      return;
    }
    setSubmitError('');
    setIsSubmitted(true);
  };

  // Render left page content for a given spread
  const renderLeftPageContent = (spreadIdx: number) => {
    if (spreadIdx === 0) {
      return (
        <div className="space-y-4">
          <h2 className="text-2xl sm:text-3xl font-serif-kr font-semibold text-neutral-100 tracking-tight leading-snug">
            도심 속 숨겨진 프라이빗 모던 라운지, 'Bunny cafe'
          </h2>
          <div className="w-12 h-0.5 bg-neutral-700" />

          <p className="text-sm font-serif-kr text-neutral-300 leading-relaxed whitespace-pre-line pt-1">
            {GAME_INFO.synopsis}
          </p>

          <div className="p-4 bg-neutral-900 border border-neutral-800 rounded-lg mt-4">
            <p className="text-xs font-serif-kr italic text-neutral-300 leading-relaxed">
              "지친 하루의 끝, 무거운 문을 열면 감미로운 음악과 은은한 에스프레소 향, 그리고 위스키 잔을 닦는
              바니 호스트의 미소가 당신을 맞이합니다."
            </p>
          </div>
        </div>
      );
    }
    if (spreadIdx === 1) {
      // Page 03: 식사 메뉴 (Part 1 - 셰프 스페셜 다이닝)
      return (
        <div className="h-full flex flex-col justify-between space-y-4">
          <div>
            <span className="text-xs uppercase tracking-widest text-neutral-400 font-cinzel">
              CHEF'S SPECIAL DINING
            </span>
            <h3 className="text-xl sm:text-2xl font-serif-kr font-semibold text-neutral-100 mt-1">
              셰프 추천 시그니처 플레이트
            </h3>
          </div>

          <div className="flex-1 flex items-center justify-center py-4 select-none">
            <img
              src={recommendImage}
              alt="셰프 추천 시그니처 플레이트"
              draggable={false}
              onDragStart={(e) => e.preventDefault()}
              className="w-full max-h-[380px] sm:max-h-[440px] object-contain select-none pointer-events-none drop-shadow-2xl"
            />
          </div>
        </div>
      );
    }
    if (spreadIdx === 2) {
      // Page 05: 식사 메뉴 (Part 2 - 크래프트 칵테일 & 주류)
      const cocktailItems = MENU_ITEMS.filter((item) => item.category === 'Cocktail');
      return (
        <div className="space-y-4">
          <div>
            <span className="text-xs uppercase tracking-widest text-neutral-400 font-cinzel">
              Cocktails & Drinks
            </span>
            <h3 className="text-xl sm:text-2xl font-serif-kr font-semibold text-neutral-100">
              칵테일 & 주류
            </h3>
          </div>

          <div className="space-y-2.5">
            {cocktailItems.map((item, idx) => (
              <div
                key={idx}
                className="p-3 rounded-lg border bg-neutral-900/60 border-neutral-800"
              >
                <div className="flex justify-between items-baseline">
                  <h4 className="font-serif-kr text-sm font-semibold text-neutral-100">{item.name}</h4>
                  <span className="text-xs font-mono text-neutral-300 tabular-nums">{item.price}</span>
                </div>
                <div className="text-[11px] text-neutral-400 font-serif-kr mt-0.5">{item.subName}</div>
                <p className="text-xs text-neutral-300 mt-1 font-serif-kr leading-relaxed line-clamp-2">
                  {item.description}
                </p>
                <div className="mt-1.5 text-[10px] text-neutral-400 flex items-center justify-between">
                  <span>주의: {item.recommendedHost}</span>
                </div>
              </div>
            ))}
          </div>

        </div>
      );
    }
    if (spreadIdx === 3) {
      // Page 07: 호스트 메뉴 (이 달의 직원)
      return (
        <div className="h-full flex flex-col justify-between space-y-4">
          <div>
            <span className="text-xs uppercase tracking-widest text-neutral-400 font-cinzel">
              BEST HOST OF THE MONTH
            </span>
            <h3 className="text-2xl sm:text-3xl font-serif-kr font-semibold text-neutral-100 mt-1">
              이 달의 직원: 헤라
            </h3>
          </div>

          <div className="flex-1 flex items-center justify-center py-2 select-none">
            <div className="relative rounded-lg overflow-hidden border border-neutral-700/80 shadow-lg bg-neutral-900/40">
              <img
                src={bestHostImg}
                alt="이 달의 직원: 헤라"
                draggable={false}
                onDragStart={(e) => e.preventDefault()}
                className="w-full max-h-[380px] sm:max-h-[440px] object-contain select-none pointer-events-none block"
              />
            </div>
          </div>
        </div>
      );
    }
    if (spreadIdx === 4) {
      // Page 09: 호스트 헤라 상세 정보
      return (
        <div className="h-full flex flex-col justify-between space-y-3">
          {/* Top-most: Nickname & Real Name (Left-aligned at top) */}
          <div className="flex items-baseline gap-2 shrink-0">
            <h3 className="text-2xl sm:text-3xl font-serif-kr font-bold text-neutral-100 tracking-wide">
              {HERA_PAGE_DETAIL.nickname}
            </h3>
            <span className="text-xs sm:text-sm font-serif-kr text-neutral-400/80">
              {HERA_PAGE_DETAIL.realName}
            </span>
          </div>

          {/* Side-by-side Section: Image & 12 Body Specs Table (Completely Unified Height) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 items-stretch flex-1 min-h-0">
            {/* Left: Host Image (Identical height to spec table) */}
            <div className="relative rounded-lg overflow-hidden border border-neutral-700/80 bg-neutral-950 shadow-md h-full flex items-center justify-center">
              <img
                src={sup00Img}
                alt="헤라 (박수아)"
                draggable={false}
                onDragStart={(e) => e.preventDefault()}
                className="w-full h-full object-cover select-none pointer-events-none"
              />
            </div>

            {/* Right: 12 Body Specs Table (Height completely unified with image, zero empty space under shoe size) */}
            <div className="rounded-lg border border-neutral-700/80 bg-neutral-900/60 shadow-md p-2.5 sm:p-3 h-full flex flex-col justify-between min-h-0">
              <div className="h-full flex flex-col justify-between divide-y divide-neutral-800/60 font-serif-kr">
                {HERA_PAGE_DETAIL.bodySpecs.map((spec, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between text-xs sm:text-[12px] flex-1 py-0.5"
                  >
                    <span className="text-neutral-400">{spec.label}</span>
                    <span className="text-neutral-200 font-mono font-medium">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Middle Section: Full-width Box for 나이, 성격, 호불호, 애교 서비스 */}
          <div className="w-full rounded-lg border border-neutral-700/80 bg-neutral-900/60 shadow-md p-2.5 sm:p-3 shrink-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5 text-xs sm:text-[12px] font-serif-kr">
              {HERA_PAGE_DETAIL.profileDetails.map((detail, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <span className="text-[11px] font-semibold text-neutral-400 shrink-0 min-w-[58px]">
                    {detail.label}
                  </span>
                  <span className="text-neutral-200 leading-snug break-keep text-[11.5px] sm:text-xs">
                    {detail.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Center: Host Quote */}
          <div className="pt-2 pb-0.5 text-center border-t border-neutral-800/70 shrink-0">
            <p className="text-sm sm:text-base font-serif-kr text-neutral-200 italic tracking-wide">
              {HERA_PAGE_DETAIL.quote}
            </p>
          </div>
        </div>
      );
    }
    if (spreadIdx === 5) {
      // Page 11: 호스트 릴리 상세 정보
      return (
        <div className="h-full flex flex-col justify-between space-y-3">
          {/* Top-most: Nickname & Real Name (Left-aligned at top) */}
          <div className="flex items-baseline gap-2 shrink-0">
            <h3 className="text-2xl sm:text-3xl font-serif-kr font-bold text-neutral-100 tracking-wide">
              {LILY_PAGE_DETAIL.nickname}
            </h3>
            <span className="text-xs sm:text-sm font-serif-kr text-neutral-400/80">
              {LILY_PAGE_DETAIL.realName}
            </span>
          </div>

          {/* Side-by-side Section: Image & 12 Body Specs Table (Completely Unified Height) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 items-stretch flex-1 min-h-0">
            {/* Left: Host Image (Identical height to spec table) */}
            <div className="relative rounded-lg overflow-hidden border border-neutral-700/80 bg-neutral-950 shadow-md h-full flex items-center justify-center">
              <img
                src={bap00Img}
                alt="릴리 (배수정)"
                draggable={false}
                onDragStart={(e) => e.preventDefault()}
                className="w-full h-full object-cover select-none pointer-events-none"
              />
            </div>

            {/* Right: 12 Body Specs Table (Height completely unified with image, zero empty space under shoe size) */}
            <div className="rounded-lg border border-neutral-700/80 bg-neutral-900/60 shadow-md p-2.5 sm:p-3 h-full flex flex-col justify-between min-h-0">
              <div className="h-full flex flex-col justify-between divide-y divide-neutral-800/60 font-serif-kr">
                {LILY_PAGE_DETAIL.bodySpecs.map((spec, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between text-xs sm:text-[12px] flex-1 py-0.5"
                  >
                    <span className="text-neutral-400">{spec.label}</span>
                    <span className="text-neutral-200 font-mono font-medium">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Middle Section: Full-width Box for 나이, 성격, 호불호, 애교 서비스 */}
          <div className="w-full rounded-lg border border-neutral-700/80 bg-neutral-900/60 shadow-md p-2.5 sm:p-3 shrink-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5 text-xs sm:text-[12px] font-serif-kr">
              {LILY_PAGE_DETAIL.profileDetails.map((detail, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <span className="text-[11px] font-semibold text-neutral-400 shrink-0 min-w-[58px]">
                    {detail.label}
                  </span>
                  <span className="text-neutral-200 leading-snug break-keep text-[11.5px] sm:text-xs">
                    {detail.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Center: Host Quote */}
          <div className="pt-2 pb-0.5 text-center border-t border-neutral-800/70 shrink-0">
            <p className="text-sm sm:text-base font-serif-kr text-neutral-200 italic tracking-wide">
              {LILY_PAGE_DETAIL.quote}
            </p>
          </div>
        </div>
      );
    }
    if (spreadIdx === 6) {
      // Page 13: 호스트 로키 상세 정보
      return (
        <div className="h-full flex flex-col justify-between space-y-3">
          {/* Top-most: Nickname & Real Name (Left-aligned at top) */}
          <div className="flex items-baseline gap-2 shrink-0">
            <h3 className="text-2xl sm:text-3xl font-serif-kr font-bold text-neutral-100 tracking-wide">
              {LOKI_PAGE_DETAIL.nickname}
            </h3>
            <span className="text-xs sm:text-sm font-serif-kr text-neutral-400/80">
              {LOKI_PAGE_DETAIL.realName}
            </span>
          </div>

          {/* Side-by-side Section: Image & 12 Body Specs Table (Completely Unified Height) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 items-stretch flex-1 min-h-0">
            {/* Left: Host Image (Identical height to spec table) */}
            <div className="relative rounded-lg overflow-hidden border border-neutral-700/80 bg-neutral-950 shadow-md h-full flex items-center justify-center">
              <img
                src={kip00Img}
                alt="로키 (김현진)"
                draggable={false}
                onDragStart={(e) => e.preventDefault()}
                className="w-full h-full object-cover select-none pointer-events-none"
              />
            </div>

            {/* Right: 12 Body Specs Table (Height completely unified with image, zero empty space under shoe size) */}
            <div className="rounded-lg border border-neutral-700/80 bg-neutral-900/60 shadow-md p-2.5 sm:p-3 h-full flex flex-col justify-between min-h-0">
              <div className="h-full flex flex-col justify-between divide-y divide-neutral-800/60 font-serif-kr">
                {LOKI_PAGE_DETAIL.bodySpecs.map((spec, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between text-xs sm:text-[12px] flex-1 py-0.5"
                  >
                    <span className="text-neutral-400">{spec.label}</span>
                    <span className="text-neutral-200 font-mono font-medium">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Middle Section: Full-width Box for 나이, 성격, 호불호, 애교 서비스 */}
          <div className="w-full rounded-lg border border-neutral-700/80 bg-neutral-900/60 shadow-md p-2.5 sm:p-3 shrink-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5 text-xs sm:text-[12px] font-serif-kr">
              {LOKI_PAGE_DETAIL.profileDetails.map((detail, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <span className="text-[11px] font-semibold text-neutral-400 shrink-0 min-w-[58px]">
                    {detail.label}
                  </span>
                  <span className="text-neutral-200 leading-snug break-keep text-[11.5px] sm:text-xs">
                    {detail.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Center: Host Quote */}
          <div className="pt-2 pb-0.5 text-center border-t border-neutral-800/70 shrink-0">
            <p className="text-sm sm:text-base font-serif-kr text-neutral-200 italic tracking-wide">
              {LOKI_PAGE_DETAIL.quote}
            </p>
          </div>
        </div>
      );
    }
    if (spreadIdx === 7) {
      // Page 15: 호스트 토르 상세 정보
      return (
        <div className="h-full flex flex-col justify-between space-y-3">
          {/* Top-most: Nickname & Real Name (Left-aligned at top) */}
          <div className="flex items-baseline gap-2 shrink-0">
            <h3 className="text-2xl sm:text-3xl font-serif-kr font-bold text-neutral-100 tracking-wide">
              {THOR_PAGE_DETAIL.nickname}
            </h3>
            <span className="text-xs sm:text-sm font-serif-kr text-neutral-400/80">
              {THOR_PAGE_DETAIL.realName}
            </span>
          </div>

          {/* Side-by-side Section: Image & 12 Body Specs Table (Completely Unified Height) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 items-stretch flex-1 min-h-0">
            {/* Left: Host Image (Identical height to spec table) */}
            <div className="relative rounded-lg overflow-hidden border border-neutral-700/80 bg-neutral-950 shadow-md h-full flex items-center justify-center">
              <img
                src={nap00Img}
                alt="토르 (남덕배)"
                draggable={false}
                onDragStart={(e) => e.preventDefault()}
                className="w-full h-full object-cover select-none pointer-events-none"
              />
            </div>

            {/* Right: 12 Body Specs Table (Height completely unified with image, zero empty space under shoe size) */}
            <div className="rounded-lg border border-neutral-700/80 bg-neutral-900/60 shadow-md p-2.5 sm:p-3 h-full flex flex-col justify-between min-h-0">
              <div className="h-full flex flex-col justify-between divide-y divide-neutral-800/60 font-serif-kr">
                {THOR_PAGE_DETAIL.bodySpecs.map((spec, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between text-xs sm:text-[12px] flex-1 py-0.5"
                  >
                    <span className="text-neutral-400">{spec.label}</span>
                    <span className="text-neutral-200 font-mono font-medium">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Middle Section: Full-width Box for 나이, 성격, 호불호, 애교 서비스 */}
          <div className="w-full rounded-lg border border-neutral-700/80 bg-neutral-900/60 shadow-md p-2.5 sm:p-3 shrink-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5 text-xs sm:text-[12px] font-serif-kr">
              {THOR_PAGE_DETAIL.profileDetails.map((detail, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <span className="text-[11px] font-semibold text-neutral-400 shrink-0 min-w-[58px]">
                    {detail.label}
                  </span>
                  <span className="text-neutral-200 leading-snug break-keep text-[11.5px] sm:text-xs">
                    {detail.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Center: Host Quote */}
          <div className="pt-2 pb-0.5 text-center border-t border-neutral-800/70 shrink-0">
            <p className="text-sm sm:text-base font-serif-kr text-neutral-200 italic tracking-wide">
              {THOR_PAGE_DETAIL.quote}
            </p>
          </div>
        </div>
      );
    }
    if (spreadIdx === 8) {
      // Page 17: 안내 사항 (이전 25페이지 내용 이전)
      const noticeList = [
        '각 호스트들은 본인만의 애교를 갖고 있습니다. 애교 서비스를 신청해보세요!',
        '버니카페는 합법적인 유흥업소로, 카페 내에서 호스트와의 직접적인 성행위는 엄격히 금지되어 있습니다.',
        '마음에 드는 호스트가 있나요? 호스트를 지명 호출해 원하는 호스트에게만 서비스를 제공받을 수 있습니다.',
        '호스트 및 직원 일동은 근무자이기 이전에 소중한 사람입니다. 폭언, 폭행 및 동의 없는 접촉은 금지됩니다.',
        '메뉴판에 담지 못한 음식과 음료도 많습니다. 커스텀 칵테일도 가능하니 호스트에게 문의하세요.',
      ];

      return (
        <div className="space-y-4">
          <div>
            <span className="text-xs uppercase tracking-widest text-neutral-400 font-cinzel">
              Information & Notice
            </span>
            <h3 className="text-2xl sm:text-3xl font-serif-kr font-semibold text-neutral-100 mt-1">
              안내 사항
            </h3>
          </div>

          <div className="space-y-2.5">
            {noticeList.map((text, idx) => (
              <div
                key={idx}
                className="p-3 bg-neutral-900/80 border border-neutral-800 rounded-lg flex items-start gap-3 shadow-xs"
              >
                <span className="flex items-center justify-center w-6 h-6 rounded bg-neutral-800 text-neutral-300 font-mono text-xs font-semibold shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <p className="text-xs sm:text-[13px] font-serif-kr text-neutral-200 leading-relaxed pt-0.5">
                  {text}
                </p>
              </div>
            ))}
          </div>

          <div className="p-3 bg-neutral-950/60 border border-neutral-800/80 rounded-lg">
            <p className="text-[11px] font-serif-kr text-neutral-400 leading-relaxed text-center">
              버니 카페는 모든 고객님과 호스트의 안전하고 품격 있는 휴식을 최우선으로 여깁니다.
            </p>
          </div>
        </div>
      );
    }

    // spreadIdx >= 4 (and other unpopulated spreads): 호스트 메뉴 준비 중
    return (
      <div className="h-full min-h-[460px] flex flex-col justify-center items-center py-12 text-center select-none pointer-events-none opacity-40">
        <div className="w-12 h-px bg-neutral-800 mb-3" />
        <span className="text-[11px] font-cinzel tracking-[0.25em] text-neutral-500 uppercase">
          Host Dossier
        </span>
        <span className="text-[10px] font-serif-kr text-neutral-600 mt-1">
          호스트 메뉴 준비 중
        </span>
        <div className="w-12 h-px bg-neutral-800 mt-3" />
      </div>
    );
  };

  // Render right page content for a given spread
  const renderRightPageContent = (spreadIdx: number) => {
    if (spreadIdx === 0) {
      // Page 02: 카페 소개 운영원칙 & 오시는 길
      return (
        <div className="space-y-4">
          {/* Rules / Guide */}
          <div className="space-y-2.5">
            <div className="p-3 bg-neutral-900 border border-neutral-800 rounded-lg">
              <div className="text-xs font-serif-kr font-bold text-neutral-100">
                1. 건전하고 합법적인 공간
              </div>
              <p className="text-[11px] font-serif-kr text-neutral-300 mt-1 leading-relaxed">
                버니 카페는 정식으로 허가 받은 유흥 음식점으로써, 안심할 수 있는 휴식처입니다.
              </p>
            </div>

            <div className="p-3 bg-neutral-900 border border-neutral-800 rounded-lg">
              <div className="text-xs font-serif-kr font-bold text-neutral-100">
                2. 전 좌석 프라이빗 룸
              </div>
              <p className="text-[11px] font-serif-kr text-neutral-300 mt-1 leading-relaxed">
                버니 카페의 모든 테이블은 방음 파티션과 암막 커튼으로 분리되어 있어 타인에게 방해받지 않는 휴식을 보장합니다.
              </p>
            </div>

            <div className="p-3 bg-neutral-900 border border-neutral-800 rounded-lg">
              <div className="text-xs font-serif-kr font-bold text-neutral-100">
                3. 전문적인 직원들
              </div>
              <p className="text-[11px] font-serif-kr text-neutral-300 mt-1 leading-relaxed">
                버니 카페의 전문 주방 인력들은 항상 변치 않는 맛의 음식을 제공하며, 카페의 얼굴인 호스트들은 개성 넘치는 모습으로 즐거움을 채워줍니다.
              </p>
            </div>
          </div>

          {/* Location & Map Section */}
          <div className="pt-1 space-y-2">
            <h4 className="font-bold text-sm text-neutral-100 font-serif-kr">
              오시는 길
            </h4>
            <div className="relative rounded-lg overflow-hidden border border-neutral-800 bg-neutral-950/60 shadow-md select-none">
              <img
                src={mapImage}
                alt="오시는 길 약도"
                draggable={false}
                onDragStart={(e) => e.preventDefault()}
                className="w-full h-36 sm:h-44 object-cover filter contrast-105 select-none pointer-events-none"
              />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxImage({
                    src: mapImage,
                    caption: '오시는 길 (서울특별시 용산구 이태원동 ○△□-△○)',
                  });
                }}
                onMouseDown={(e) => e.stopPropagation()}
                onTouchStart={(e) => e.stopPropagation()}
                className="absolute bottom-1.5 right-2 flex items-center gap-1.5 text-[11px] font-serif-kr text-neutral-200 bg-neutral-900/90 hover:bg-neutral-800 border border-neutral-700 hover:border-neutral-500 px-2.5 py-1 rounded shadow-md backdrop-blur-xs transition-all cursor-pointer pointer-events-auto active:scale-95"
                title="약도 확대보기"
              >
                <span>확대보기</span>
                <Maximize2 className="w-3 h-3 text-neutral-400" />
              </button>
            </div>
            <p className="text-[11px] text-neutral-400 font-serif-kr">
              서울특별시 용산구 이태원동 ○△□-△○
            </p>
          </div>
        </div>
      );
    }
    if (spreadIdx === 1) {
      // Page 04: 식사 메뉴 (Part 1 - 다이닝 & 타파스 메뉴 리스트)
      const diningItems = MENU_ITEMS.filter((item) => item.category === 'Tapas & Dining');
      return (
        <div className="space-y-4">
          <div>
            <span className="text-xs uppercase tracking-widest text-neutral-400 font-cinzel">
              Main Dining
            </span>
            <h3 className="text-xl sm:text-2xl font-serif-kr font-semibold text-neutral-100">
              식사 메뉴
            </h3>
          </div>

          <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
            {diningItems.map((item, idx) => (
              <div
                key={idx}
                className="p-3 rounded-lg border bg-neutral-900/60 border-neutral-800"
              >
                <div className="flex justify-between items-baseline">
                  <h4 className="font-serif-kr text-sm font-semibold text-neutral-100">{item.name}</h4>
                  <span className="text-xs font-mono text-neutral-300 tabular-nums">{item.price}</span>
                </div>
                <div className="text-[11px] text-neutral-400 font-serif-kr mt-0.5">{item.subName}</div>
                <p className="text-xs text-neutral-300 mt-1 font-serif-kr leading-relaxed line-clamp-2">
                  {item.description}
                </p>
                <div className="mt-1.5 text-[10px] text-neutral-400 flex items-center justify-between">
                  <span>주의: {item.recommendedHost}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }
    if (spreadIdx === 2) {
      // Page 06: 식사 메뉴 (Part 2 - 커피 & 디저트)
      const sweetItems = MENU_ITEMS.filter((item) => item.category === 'Coffee & Tea' || item.category === 'Dessert');
      return (
        <div className="space-y-4">
          <div>
            <span className="text-xs uppercase tracking-widest text-neutral-400 font-cinzel">
              Tea & Coffee
            </span>
            <h3 className="text-xl sm:text-2xl font-serif-kr font-semibold text-neutral-100">
              차 & 커피
            </h3>
          </div>

          <div className="space-y-2.5">
            {sweetItems.map((item, idx) => (
              <div
                key={idx}
                className="p-3 rounded-lg border bg-neutral-900/60 border-neutral-800"
              >
                <div className="flex justify-between items-baseline">
                  <h4 className="font-serif-kr text-sm font-semibold text-neutral-100">{item.name}</h4>
                  <span className="text-xs font-mono text-neutral-300 tabular-nums">{item.price}</span>
                </div>
                <div className="text-[11px] text-neutral-400 font-serif-kr mt-0.5">{item.subName}</div>
                <p className="text-xs text-neutral-300 mt-1 font-serif-kr leading-relaxed line-clamp-2">
                  {item.description}
                </p>
                <div className="mt-1.5 text-[10px] text-neutral-400 flex items-center justify-between">
                  <span>주의: {item.recommendedHost}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 bg-neutral-900 border border-neutral-800 rounded-lg text-xs font-serif-kr text-neutral-300 leading-relaxed">
            <span className="text-neutral-200 font-semibold">찾으시는 메뉴가 있나요?</span>
            <p className="text-[11px] text-neutral-400 mt-1 leading-relaxed">
              메뉴판에 없는 음료도 많으니 호스트에게 문의하세요!
            </p>
          </div>
        </div>
      );
    }
    if (spreadIdx === 3) {
      // Page 08: 호스트 메뉴 (호스트 목록 8인)
      const hostRosterRows = [
        [
          { name: '헤라', img: suImg, targetSpread: 4, pages: '09' },
          { name: '글래스', img: yuImg, targetSpread: 4, pages: '10' },
        ],
        [
          { name: '릴리', img: baImg, targetSpread: 5, pages: '11' },
          { name: '캐럿', img: leImg, targetSpread: 5, pages: '12' },
        ],
        [
          { name: '로키', img: kiImg, targetSpread: 6, pages: '13' },
          { name: '인디고', img: goImg, targetSpread: 6, pages: '14' },
        ],
        [
          { name: '토르', img: naImg, targetSpread: 7, pages: '15' },
          { name: '리오', img: hoImg, targetSpread: 7, pages: '16' },
        ],
      ];

      return (
        <div className="space-y-3.5 sm:space-y-4">
          <div>
            <span className="text-[11px] uppercase tracking-widest text-neutral-400 font-cinzel">
              Host Roster
            </span>
            <h3 className="text-lg sm:text-xl font-serif-kr font-semibold text-neutral-100 mt-0.5">
              호스트 메뉴
            </h3>
          </div>

          <div className="space-y-2.5 sm:space-y-3">
            {hostRosterRows.map((row, rowIdx) => (
              <div key={rowIdx} className="grid grid-cols-2 gap-2 sm:gap-3">
                {row.map((host, hIdx) => (
                  <button
                    key={hIdx}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      goToSpread(host.targetSpread);
                    }}
                    onMouseDown={(e) => e.stopPropagation()}
                    onTouchStart={(e) => e.stopPropagation()}
                    className="flex items-center justify-between p-2 sm:p-2.5 rounded-lg bg-neutral-900/70 hover:bg-neutral-800 border border-neutral-800 hover:border-neutral-600 transition-all cursor-pointer group text-left shadow-sm active:scale-[0.98]"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img
                        src={host.img}
                        alt={host.name}
                        draggable={false}
                        onDragStart={(e) => e.preventDefault()}
                        className="w-10 h-10 sm:w-11 sm:h-11 rounded-full object-cover select-none pointer-events-none border border-neutral-700/80 group-hover:border-neutral-400 shrink-0 shadow-sm transition-colors"
                      />
                      <div className="min-w-0">
                        <span className="font-serif-kr text-xs sm:text-sm font-semibold text-neutral-100 group-hover:text-white block truncate">
                          {host.name}
                        </span>
                        <span className="text-[10px] font-cinzel text-neutral-400 group-hover:text-neutral-300 tracking-wider">
                          P.{host.pages}
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-neutral-500 group-hover:text-neutral-200 group-hover:translate-x-0.5 transition-all shrink-0 ml-1" />
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>
      );
    }
    if (spreadIdx === 4) {
      // Page 10: 호스트 글래스 상세 정보
      return (
        <div className="h-full flex flex-col justify-between space-y-3">
          {/* Top-most: Nickname & Real Name (Left-aligned at top) */}
          <div className="flex items-baseline gap-2 shrink-0">
            <h3 className="text-2xl sm:text-3xl font-serif-kr font-bold text-neutral-100 tracking-wide">
              {GLASS_PAGE_DETAIL.nickname}
            </h3>
            <span className="text-xs sm:text-sm font-serif-kr text-neutral-400/80">
              {GLASS_PAGE_DETAIL.realName}
            </span>
          </div>

          {/* Side-by-side Section: Image & 12 Body Specs Table (Completely Unified Height) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 items-stretch flex-1 min-h-0">
            {/* Left: Host Image (Identical height to spec table) */}
            <div className="relative rounded-lg overflow-hidden border border-neutral-700/80 bg-neutral-950 shadow-md h-full flex items-center justify-center">
              <img
                src={yup00Img}
                alt="글래스 (여미진)"
                draggable={false}
                onDragStart={(e) => e.preventDefault()}
                className="w-full h-full object-cover select-none pointer-events-none"
              />
            </div>

            {/* Right: 12 Body Specs Table (Height completely unified with image, zero empty space under shoe size) */}
            <div className="rounded-lg border border-neutral-700/80 bg-neutral-900/60 shadow-md p-2.5 sm:p-3 h-full flex flex-col justify-between min-h-0">
              <div className="h-full flex flex-col justify-between divide-y divide-neutral-800/60 font-serif-kr">
                {GLASS_PAGE_DETAIL.bodySpecs.map((spec, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between text-xs sm:text-[12px] flex-1 py-0.5"
                  >
                    <span className="text-neutral-400">{spec.label}</span>
                    <span className="text-neutral-200 font-mono font-medium">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Middle Section: Full-width Box for 나이, 성격, 호불호, 애교 서비스 */}
          <div className="w-full rounded-lg border border-neutral-700/80 bg-neutral-900/60 shadow-md p-2.5 sm:p-3 shrink-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5 text-xs sm:text-[12px] font-serif-kr">
              {GLASS_PAGE_DETAIL.profileDetails.map((detail, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <span className="text-[11px] font-semibold text-neutral-400 shrink-0 min-w-[58px]">
                    {detail.label}
                  </span>
                  <span className="text-neutral-200 leading-snug break-keep text-[11.5px] sm:text-xs">
                    {detail.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Center: Host Quote */}
          <div className="pt-2 pb-0.5 text-center border-t border-neutral-800/70 shrink-0">
            <p className="text-sm sm:text-base font-serif-kr text-neutral-200 italic tracking-wide">
              {GLASS_PAGE_DETAIL.quote}
            </p>
          </div>
        </div>
      );
    }
    if (spreadIdx === 5) {
      // Page 12: 호스트 캐럿 상세 정보
      return (
        <div className="h-full flex flex-col justify-between space-y-3">
          {/* Top-most: Nickname & Real Name (Left-aligned at top) */}
          <div className="flex items-baseline gap-2 shrink-0">
            <h3 className="text-2xl sm:text-3xl font-serif-kr font-bold text-neutral-100 tracking-wide">
              {CARROT_PAGE_DETAIL.nickname}
            </h3>
            <span className="text-xs sm:text-sm font-serif-kr text-neutral-400/80">
              {CARROT_PAGE_DETAIL.realName}
            </span>
          </div>

          {/* Side-by-side Section: Image & 12 Body Specs Table (Completely Unified Height) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 items-stretch flex-1 min-h-0">
            {/* Left: Host Image (Identical height to spec table) */}
            <div className="relative rounded-lg overflow-hidden border border-neutral-700/80 bg-neutral-950 shadow-md h-full flex items-center justify-center">
              <img
                src={lep00Img}
                alt="캐럿 (이연아)"
                draggable={false}
                onDragStart={(e) => e.preventDefault()}
                className="w-full h-full object-cover select-none pointer-events-none"
              />
            </div>

            {/* Right: 12 Body Specs Table (Height completely unified with image, zero empty space under shoe size) */}
            <div className="rounded-lg border border-neutral-700/80 bg-neutral-900/60 shadow-md p-2.5 sm:p-3 h-full flex flex-col justify-between min-h-0">
              <div className="h-full flex flex-col justify-between divide-y divide-neutral-800/60 font-serif-kr">
                {CARROT_PAGE_DETAIL.bodySpecs.map((spec, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between text-xs sm:text-[12px] flex-1 py-0.5"
                  >
                    <span className="text-neutral-400">{spec.label}</span>
                    <span className="text-neutral-200 font-mono font-medium">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Middle Section: Full-width Box for 나이, 성격, 호불호, 애교 서비스 */}
          <div className="w-full rounded-lg border border-neutral-700/80 bg-neutral-900/60 shadow-md p-2.5 sm:p-3 shrink-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5 text-xs sm:text-[12px] font-serif-kr">
              {CARROT_PAGE_DETAIL.profileDetails.map((detail, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <span className="text-[11px] font-semibold text-neutral-400 shrink-0 min-w-[58px]">
                    {detail.label}
                  </span>
                  <span className="text-neutral-200 leading-snug break-keep text-[11.5px] sm:text-xs">
                    {detail.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Center: Host Quote */}
          <div className="pt-2 pb-0.5 text-center border-t border-neutral-800/70 shrink-0">
            <p className="text-sm sm:text-base font-serif-kr text-neutral-200 italic tracking-wide">
              {CARROT_PAGE_DETAIL.quote}
            </p>
          </div>
        </div>
      );
    }
    if (spreadIdx === 6) {
      // Page 14: 호스트 인디고 상세 정보
      return (
        <div className="h-full flex flex-col justify-between space-y-3">
          {/* Top-most: Nickname & Real Name (Left-aligned at top) */}
          <div className="flex items-baseline gap-2 shrink-0">
            <h3 className="text-2xl sm:text-3xl font-serif-kr font-bold text-neutral-100 tracking-wide">
              {INDIGO_PAGE_DETAIL.nickname}
            </h3>
            <span className="text-xs sm:text-sm font-serif-kr text-neutral-400/80">
              {INDIGO_PAGE_DETAIL.realName}
            </span>
          </div>

          {/* Side-by-side Section: Image & 12 Body Specs Table (Completely Unified Height) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 items-stretch flex-1 min-h-0">
            {/* Left: Host Image (Identical height to spec table) */}
            <div className="relative rounded-lg overflow-hidden border border-neutral-700/80 bg-neutral-950 shadow-md h-full flex items-center justify-center">
              <img
                src={gop00Img}
                alt="인디고 (고석진)"
                draggable={false}
                onDragStart={(e) => e.preventDefault()}
                className="w-full h-full object-cover select-none pointer-events-none"
              />
            </div>

            {/* Right: 12 Body Specs Table (Height completely unified with image, zero empty space under shoe size) */}
            <div className="rounded-lg border border-neutral-700/80 bg-neutral-900/60 shadow-md p-2.5 sm:p-3 h-full flex flex-col justify-between min-h-0">
              <div className="h-full flex flex-col justify-between divide-y divide-neutral-800/60 font-serif-kr">
                {INDIGO_PAGE_DETAIL.bodySpecs.map((spec, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between text-xs sm:text-[12px] flex-1 py-0.5"
                  >
                    <span className="text-neutral-400">{spec.label}</span>
                    <span className="text-neutral-200 font-mono font-medium">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Middle Section: Full-width Box for 나이, 성격, 호불호, 애교 서비스 */}
          <div className="w-full rounded-lg border border-neutral-700/80 bg-neutral-900/60 shadow-md p-2.5 sm:p-3 shrink-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5 text-xs sm:text-[12px] font-serif-kr">
              {INDIGO_PAGE_DETAIL.profileDetails.map((detail, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <span className="text-[11px] font-semibold text-neutral-400 shrink-0 min-w-[58px]">
                    {detail.label}
                  </span>
                  <span className="text-neutral-200 leading-snug break-keep text-[11.5px] sm:text-xs">
                    {detail.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Center: Host Quote */}
          <div className="pt-2 pb-0.5 text-center border-t border-neutral-800/70 shrink-0">
            <p className="text-sm sm:text-base font-serif-kr text-neutral-200 italic tracking-wide">
              {INDIGO_PAGE_DETAIL.quote}
            </p>
          </div>
        </div>
      );
    }
    if (spreadIdx === 7) {
      // Page 16: 호스트 리오 상세 정보
      return (
        <div className="h-full flex flex-col justify-between space-y-3">
          {/* Top-most: Nickname & Real Name (Left-aligned at top) */}
          <div className="flex items-baseline gap-2 shrink-0">
            <h3 className="text-2xl sm:text-3xl font-serif-kr font-bold text-neutral-100 tracking-wide">
              {RIO_PAGE_DETAIL.nickname}
            </h3>
            <span className="text-xs sm:text-sm font-serif-kr text-neutral-400/80">
              {RIO_PAGE_DETAIL.realName}
            </span>
          </div>

          {/* Side-by-side Section: Image & 12 Body Specs Table (Completely Unified Height) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 items-stretch flex-1 min-h-0">
            {/* Left: Host Image (Identical height to spec table) */}
            <div className="relative rounded-lg overflow-hidden border border-neutral-700/80 bg-neutral-950 shadow-md h-full flex items-center justify-center">
              <img
                src={hop00Img}
                alt="리오 (이호승)"
                draggable={false}
                onDragStart={(e) => e.preventDefault()}
                className="w-full h-full object-cover select-none pointer-events-none"
              />
            </div>

            {/* Right: 12 Body Specs Table (Height completely unified with image, zero empty space under shoe size) */}
            <div className="rounded-lg border border-neutral-700/80 bg-neutral-900/60 shadow-md p-2.5 sm:p-3 h-full flex flex-col justify-between min-h-0">
              <div className="h-full flex flex-col justify-between divide-y divide-neutral-800/60 font-serif-kr">
                {RIO_PAGE_DETAIL.bodySpecs.map((spec, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between text-xs sm:text-[12px] flex-1 py-0.5"
                  >
                    <span className="text-neutral-400">{spec.label}</span>
                    <span className="text-neutral-200 font-mono font-medium">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Middle Section: Full-width Box for 나이, 성격, 호불호, 애교 서비스 */}
          <div className="w-full rounded-lg border border-neutral-700/80 bg-neutral-900/60 shadow-md p-2.5 sm:p-3 shrink-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5 text-xs sm:text-[12px] font-serif-kr">
              {RIO_PAGE_DETAIL.profileDetails.map((detail, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <span className="text-[11px] font-semibold text-neutral-400 shrink-0 min-w-[58px]">
                    {detail.label}
                  </span>
                  <span className="text-neutral-200 leading-snug break-keep text-[11.5px] sm:text-xs">
                    {detail.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Center: Host Quote */}
          <div className="pt-2 pb-0.5 text-center border-t border-neutral-800/70 shrink-0">
            <p className="text-sm sm:text-base font-serif-kr text-neutral-200 italic tracking-wide">
              {RIO_PAGE_DETAIL.quote}
            </p>
          </div>
        </div>
      );
    }
    if (spreadIdx === 8) {
      // Page 18: 중앙 로고 (메뉴북 최종 18페이지)
      return (
        <div className="w-full h-full min-h-[460px] sm:min-h-[520px] flex flex-col items-center justify-center p-4 sm:p-8 select-none my-auto">
          <div className="w-full max-w-[340px] sm:max-w-[420px] flex flex-col items-center justify-center text-center">
            <img
              src={logoImg}
              alt="버니카페 로고"
              draggable={false}
              onDragStart={(e) => e.preventDefault()}
              className="w-full h-auto max-h-[460px] sm:max-h-[500px] object-contain select-none pointer-events-none drop-shadow-[0_0_35px_rgba(255,255,255,0.12)]"
            />
          </div>
        </div>
      );
    }

    return null;
  };

  // Determine which page content is on underlying surfaces vs active turning page
  const isTurningNext = flipProgress < 0;
  const isTurningPrev = flipProgress > 0;
  const flipAngle = flipProgress * 180;

  // Active spread indexes for base layer
  const leftBaseSpread = isTurningPrev ? currentSpread - 1 : currentSpread;
  const rightBaseSpread = isTurningNext ? currentSpread + 1 : currentSpread;

  return (
    <div className="relative w-full min-h-screen bg-black text-neutral-200 flex flex-col justify-between overflow-x-hidden select-none">
      {/* Background Modern Bar Ambience */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <img
          src={backgroundImage}
          alt="Modern Bar Background"
          referrerPolicy="no-referrer"
          draggable={false}
          onDragStart={(e) => e.preventDefault()}
          className="w-full h-full object-cover filter brightness-[0.25] contrast-[1.05] saturate-[0.8] blur-[1px] select-none pointer-events-none"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0f] via-[#0d0d0f]/80 to-[#0d0d0f]/90" />
      </div>

      {/* Top Bar Navigation (Following Top Bar Contract) */}
      <header className="relative z-30 flex items-center justify-between gap-8 px-6 md:px-12 py-4 border-b border-neutral-800/80 bg-[#0d0d0f]/85 backdrop-blur-md">
        {/* Zone 1: Single text element wordmark */}
        <button
          onClick={handleCloseAndStopAudio}
          className="text-lg md:text-xl font-cinzel font-bold tracking-[0.2em] text-neutral-100 hover:text-white transition-colors whitespace-nowrap shrink-0 text-left"
        >
          BUNNY CAFE
        </button>

        {/* Zone 2: clean single-line nav links */}
        <nav className="flex items-center gap-2.5 sm:gap-6 text-xs tracking-wider font-serif-kr text-stone-300 overflow-x-auto py-1 max-w-[60vw] sm:max-w-none scrollbar-none">
          <button
            onClick={() => goToSpread(0)}
            className={`whitespace-nowrap shrink-0 hover:text-white transition-colors pb-0.5 ${
              currentSpread === 0 ? 'text-white border-b border-neutral-400 font-semibold' : 'text-neutral-400'
            }`}
          >
            01. 카페 소개
          </button>
          <button
            onClick={() => goToSpread(1)}
            className={`whitespace-nowrap shrink-0 hover:text-white transition-colors pb-0.5 ${
              currentSpread === 1 || currentSpread === 2 ? 'text-white border-b border-neutral-400 font-semibold' : 'text-neutral-400'
            }`}
          >
            02. 식사 메뉴
          </button>
          <button
            onClick={() => goToSpread(3)}
            className={`whitespace-nowrap shrink-0 hover:text-white transition-colors pb-0.5 ${
              currentSpread >= 3 && currentSpread <= 7 ? 'text-white border-b border-neutral-400 font-semibold' : 'text-neutral-400'
            }`}
          >
            03. 호스트 메뉴
          </button>
          <button
            onClick={() => goToSpread(8)}
            className={`whitespace-nowrap shrink-0 hover:text-white transition-colors pb-0.5 ${
              currentSpread === 8 ? 'text-white border-b border-neutral-400 font-semibold' : 'text-neutral-400'
            }`}
          >
            04. 안내 사항
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={handleCloseAndStopAudio}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-serif-kr font-medium text-neutral-200 bg-neutral-900 border border-neutral-800 rounded hover:bg-neutral-800 hover:text-white transition-all whitespace-nowrap shrink-0 shadow-md active:scale-95"
          >
            <BookOpen className="w-3.5 h-3.5 text-neutral-400" />
            <span>메뉴판 덮기</span>
          </button>
        </div>
      </header>

      {/* Main Book Experience Container */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-2 sm:px-4 md:px-8 py-4 sm:py-6 max-w-7xl mx-auto w-full">
        {/* Hidden Audio Element for BGM */}
        <audio ref={audioRef} src={bgmAudioUrl} loop preload="auto" />

        {/* BGM Controller HUD Strip (Directly above the book) */}
        <div className="w-full max-w-[1340px] mb-3 flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-2.5 bg-[#141418]/90 border border-neutral-800 rounded-xl backdrop-blur-md shadow-lg">
          {/* Track Info & Status */}
          <div className="flex items-center gap-3 text-xs text-neutral-300 font-serif-kr">
            <div className="w-7 h-7 rounded-full bg-neutral-900 border border-neutral-700/80 flex items-center justify-center">
              <Music className={`w-3.5 h-3.5 ${isPlaying ? 'text-neutral-100 animate-pulse' : 'text-neutral-500'}`} />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-cinzel text-xs font-semibold tracking-wider text-neutral-100">
                BGM: Bunny Cafe Lounge
              </span>
              <span className="text-neutral-600">·</span>
              <span className="text-[11px] text-neutral-400">
                {isPlaying ? '재생 중' : '일시정지 / 정지됨'}
              </span>
            </div>
          </div>

          {/* Controls: Play / Pause / Stop & Volume HUD */}
          <div className="flex items-center gap-3">
            {/* Play, Pause, Stop Buttons */}
            <div className="flex items-center gap-1 bg-neutral-950 p-1 rounded-lg border border-neutral-800">
              <button
                onClick={handlePlayBgm}
                title="재생 (Play)"
                className={`p-1.5 rounded transition-all ${
                  isPlaying ? 'bg-neutral-800 text-white shadow-sm' : 'text-neutral-400 hover:text-white'
                }`}
              >
                <Play className="w-3.5 h-3.5 fill-current" />
              </button>
              <button
                onClick={handlePauseBgm}
                title="일시정지 (Pause)"
                className={`p-1.5 rounded transition-all ${
                  !isPlaying ? 'bg-neutral-800 text-white shadow-sm' : 'text-neutral-400 hover:text-white'
                }`}
              >
                <Pause className="w-3.5 h-3.5 fill-current" />
              </button>
              <button
                onClick={handleStopBgm}
                title="정지 (Stop)"
                className="p-1.5 rounded text-neutral-400 hover:text-rose-400 hover:bg-neutral-900 transition-all"
              >
                <Square className="w-3.5 h-3.5 fill-current" />
              </button>
            </div>

            {/* Volume Control Slider */}
            <div className="flex items-center gap-2 bg-neutral-950 px-3 py-1.5 rounded-lg border border-neutral-800 text-xs">
              <button
                onClick={handleToggleMute}
                title={isMuted ? '음소거 해제' : '음소거'}
                className="text-neutral-400 hover:text-white transition-colors"
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="w-4 h-4 text-rose-400" />
                ) : volume < 0.5 ? (
                  <Volume1 className="w-4 h-4 text-neutral-200" />
                ) : (
                  <Volume2 className="w-4 h-4 text-neutral-200" />
                )}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={isMuted ? 0 : volume}
                onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                className="w-20 sm:w-28 h-1.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-neutral-200"
              />
              <span className="font-mono text-[10px] text-neutral-400 w-8 tabular-nums text-right">
                {isMuted ? '0%' : `${Math.round(volume * 100)}%`}
              </span>
            </div>
          </div>
        </div>

        {/* 3D Perspective Book Wrapper */}
        <div
          ref={bookContainerRef}
          className="relative w-full max-w-[1340px] min-h-[580px] lg:min-h-[640px] xl:min-h-[680px] bg-[#141418] rounded-xl border border-neutral-800 book-shadow flex flex-col lg:flex-row overflow-hidden perspective-1500"
          onMouseDown={(e) => handleDragStart(e.clientX)}
          onTouchStart={(e) => {
            if (e.touches.length > 0) handleDragStart(e.touches[0].clientX);
          }}
          style={{
            cursor: isDragging ? 'grabbing' : 'grab',
          }}
        >
          {/* UNDERLYING LEFT PAGE BASE */}
          <div className="relative flex-1 p-5 sm:p-7 md:p-9 bg-[#141418] flex flex-col justify-between book-spine-shadow-right overflow-y-auto max-h-[680px]">
            <div className="flex items-center justify-between text-[11px] font-cinzel text-neutral-400 border-b border-neutral-800 pb-2 mb-4">
              <span className="tracking-widest">BUNNY CAFE</span>
              <span>PAGE {String(leftBaseSpread * 2 + 1).padStart(2, '0')}</span>
            </div>

            <div className="flex-1">{renderLeftPageContent(leftBaseSpread)}</div>

            {/* Dynamic cast shadow from backward turning page */}
            {isTurningPrev && (
              <div
                className="absolute inset-0 pointer-events-none bg-gradient-to-l from-black/85 via-black/40 to-transparent z-20"
                style={{ opacity: Math.max(0, 1 - flipProgress * 1.5) * 0.7 }}
              />
            )}
          </div>

          {/* UNDERLYING RIGHT PAGE BASE */}
          <div className="relative flex-1 p-5 sm:p-7 md:p-9 bg-[#141418] flex flex-col justify-between book-spine-shadow overflow-y-auto max-h-[680px]">
            <div className="flex items-center justify-between text-[11px] font-cinzel text-neutral-400 border-b border-neutral-800 pb-2 mb-4">
              <span>{rightBaseSpread === 8 ? 'BUNNY CAFE' : rightBaseSpread >= 3 ? 'HOST MENU' : 'MENU'}</span>
              <span className="tracking-widest">PAGE {String(rightBaseSpread * 2 + 2).padStart(2, '0')}</span>
            </div>

            <div className="flex-1 flex flex-col min-h-0">{renderRightPageContent(rightBaseSpread)}</div>

            {/* Dynamic cast shadow on the revealing right page */}
            {isTurningNext && (
              <div
                className="absolute inset-0 pointer-events-none bg-gradient-to-r from-black/85 via-black/40 to-transparent z-20"
                style={{ opacity: Math.max(0, 1 + flipProgress * 1.5) * 0.7 }}
              />
            )}
          </div>

          {/* ACTIVE 3D TURNING PAGE LEAF (TURNING FORWARD TO NEXT PAGE) */}
          {isTurningNext && currentSpread < totalSpreads - 1 && (
            <div
              className="hidden lg:block absolute top-0 bottom-0 left-1/2 w-1/2 transform-style-3d origin-left pointer-events-none z-30"
              style={{
                transform: `rotateY(${flipAngle}deg)`,
              }}
            >
              {/* Front of Turning Leaf: Current Right Page */}
              <div className="absolute inset-0 backface-hidden bg-[#141418] border-r border-neutral-800 p-5 sm:p-7 md:p-9 overflow-hidden flex flex-col justify-between shadow-2xl">
                <div className="flex items-center justify-between text-[11px] font-cinzel text-neutral-400 border-b border-neutral-800 pb-2 mb-4">
                  <span>{currentSpread === 8 ? 'BUNNY CAFE' : currentSpread >= 3 ? 'HOST MENU' : 'MENU'}</span>
                  <span className="tracking-widest">PAGE {String(currentSpread * 2 + 2).padStart(2, '0')}</span>
                </div>
                <div className="flex-1 overflow-hidden">{renderRightPageContent(currentSpread)}</div>
                {/* 3D Page Curl Lighting & Shadow */}
                <div
                  className="absolute inset-0 bg-gradient-to-l from-black/70 via-black/20 to-transparent pointer-events-none"
                  style={{ opacity: Math.sin(-flipProgress * Math.PI) * 0.8 }}
                />
              </div>

              {/* Back of Turning Leaf: Next Left Page (Rotated 180deg) */}
              <div
                className="absolute inset-0 backface-hidden bg-[#141418] border-l border-neutral-800 p-5 sm:p-7 md:p-9 overflow-hidden flex flex-col justify-between shadow-2xl"
                style={{ transform: 'rotateY(180deg)' }}
              >
                <div className="flex items-center justify-between text-[11px] font-cinzel text-neutral-400 border-b border-neutral-800 pb-2 mb-4">
                  <span className="tracking-widest">BUNNY CAFE</span>
                  <span>PAGE {String((currentSpread + 1) * 2 + 1).padStart(2, '0')}</span>
                </div>
                <div className="flex-1 overflow-hidden">{renderLeftPageContent(currentSpread + 1)}</div>
                {/* 3D Page Curl Lighting & Shadow */}
                <div
                  className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/20 to-transparent pointer-events-none"
                  style={{ opacity: Math.sin(-flipProgress * Math.PI) * 0.8 }}
                />
              </div>
            </div>
          )}

          {/* ACTIVE 3D TURNING PAGE LEAF (TURNING BACKWARD TO PREVIOUS PAGE) */}
          {isTurningPrev && currentSpread > 0 && (
            <div
              className="hidden lg:block absolute top-0 bottom-0 right-1/2 w-1/2 transform-style-3d origin-right pointer-events-none z-30"
              style={{
                transform: `rotateY(${flipAngle}deg)`,
              }}
            >
              {/* Front of Turning Leaf: Current Left Page */}
              <div className="absolute inset-0 backface-hidden bg-[#141418] border-l border-neutral-800 p-5 sm:p-7 md:p-9 overflow-hidden flex flex-col justify-between shadow-2xl">
                <div className="flex items-center justify-between text-[11px] font-cinzel text-neutral-400 border-b border-neutral-800 pb-2 mb-4">
                  <span className="tracking-widest">BUNNY CAFE</span>
                  <span>PAGE {String(currentSpread * 2 + 1).padStart(2, '0')}</span>
                </div>
                <div className="flex-1 overflow-hidden">{renderLeftPageContent(currentSpread)}</div>
                {/* 3D Page Curl Lighting & Shadow */}
                <div
                  className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/20 to-transparent pointer-events-none"
                  style={{ opacity: Math.sin(flipProgress * Math.PI) * 0.8 }}
                />
              </div>

              {/* Back of Turning Leaf: Previous Right Page (Rotated 180deg) */}
              <div
                className="absolute inset-0 backface-hidden bg-[#141418] border-r border-neutral-800 p-5 sm:p-7 md:p-9 overflow-hidden flex flex-col justify-between shadow-2xl"
                style={{ transform: 'rotateY(180deg)' }}
              >
                <div className="flex items-center justify-between text-[11px] font-cinzel text-neutral-400 border-b border-neutral-800 pb-2 mb-4">
                  <span>{(currentSpread - 1) === 8 ? 'BUNNY CAFE' : (currentSpread - 1) >= 3 ? 'HOST MENU' : 'MENU'}</span>
                  <span>PAGE {String((currentSpread - 1) * 2 + 2).padStart(2, '0')}</span>
                </div>
                <div className="flex-1 overflow-hidden">{renderRightPageContent(currentSpread - 1)}</div>
                {/* 3D Page Curl Lighting & Shadow */}
                <div
                  className="absolute inset-0 bg-gradient-to-l from-black/70 via-black/20 to-transparent pointer-events-none"
                  style={{ opacity: Math.sin(flipProgress * Math.PI) * 0.8 }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Bottom Pagination Dots & Fast Jump Bar */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={handlePrevPage}
            disabled={currentSpread === 0 || isFlipping}
            className={`p-2 rounded-full border transition-all ${
              currentSpread === 0 || isFlipping
                ? 'opacity-30 cursor-not-allowed border-neutral-800'
                : 'border-neutral-700 text-neutral-300 hover:bg-neutral-800'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2 px-3.5 py-1 bg-neutral-900 border border-neutral-800 rounded-full text-xs font-serif-kr text-neutral-300 shadow-sm">
            <span className="text-[11px] text-neutral-400">
              {currentSpread === 0
                ? '01. 카페 소개'
                : currentSpread <= 2
                ? '02. 식사 메뉴'
                : currentSpread <= 7
                ? `03. 호스트 메뉴 (${currentSpread - 2}/5)`
                : '04. 안내 사항'}
            </span>
            <span className="text-neutral-600">·</span>
            <span className="font-mono text-neutral-200 tabular-nums">
              PAGE {String(currentSpread * 2 + 1).padStart(2, '0')} - {String(currentSpread * 2 + 2).padStart(2, '0')}
            </span>
            <span className="text-neutral-500 font-mono text-[11px]">/ 18</span>
          </div>

          <button
            onClick={handleNextPage}
            disabled={currentSpread === totalSpreads - 1 || isFlipping}
            className={`p-2 rounded-full border transition-all ${
              currentSpread === totalSpreads - 1 || isFlipping
                ? 'opacity-30 cursor-not-allowed border-neutral-800'
                : 'border-neutral-700 text-neutral-300 hover:bg-neutral-800'
            }`}
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </main>

      {/* Lightbox Modal for Gallery CG cuts */}
      {lightboxImage && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-4"
          onClick={() => setLightboxImage(null)}
        >
          <button
            onClick={() => setLightboxImage(null)}
            className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          <div
            className="relative max-w-4xl max-h-[85vh] rounded-lg overflow-hidden border border-neutral-800 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={lightboxImage.src}
              alt={lightboxImage.caption}
              referrerPolicy="no-referrer"
              draggable={false}
              onDragStart={(e) => e.preventDefault()}
              className="w-full h-full object-contain max-h-[80vh] select-none"
            />
            <div className="p-3 bg-neutral-900 border-t border-neutral-800 text-center text-xs font-serif-kr text-neutral-200">
              {lightboxImage.caption}
            </div>
          </div>
        </div>
      )}



      {/* Footer */}
      <footer className="relative z-30 px-6 py-4 flex flex-col sm:flex-row items-center justify-between text-[11px] text-neutral-500 border-t border-neutral-800 bg-[#0d0d0f] backdrop-blur-md">
        <div>© 2026 BUNNY CAFE PROJECT. All Rights Reserved.</div>
        <div className="flex items-center gap-3 mt-1 sm:mt-0">
          <span>합법 인가 유흥주점</span>
          <span>·</span>
          <span>Seoul Modern Bar</span>
        </div>
      </footer>
    </div>
  );
};

'use client';
import { useOutsideClick } from '@/hooks/use-outside-click';
import { cn } from '@/lib/utils';
import {
  IconArrowNarrowLeft,
  IconArrowNarrowRight,
  IconX,
} from '@tabler/icons-react';
import {
  AnimatePresence,
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
} from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import Image, { ImageProps } from 'next/image';
import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

type Card = {
  src: string;
  coverSrc?: string;
  title: string;
  shortTitle?: string;
  category: string;
  content: React.ReactNode;
};

export const CarouselContext = createContext<{
  onCardClose: (index: number) => void;
  currentIndex: number;
}>({
  onCardClose: () => {},
  currentIndex: 0,
});

export const Carousel = ({
  items,
  initialScroll = 0,
}: {
  items: React.ReactNode[];
  initialScroll?: number;
}) => {
  const carouselRef = React.useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = React.useState(false);
  const [canScrollRight, setCanScrollRight] = React.useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (carouselRef.current) {
      carouselRef.current.scrollLeft = initialScroll;
      checkScrollability();
    }
  }, [initialScroll]);

  const checkScrollability = () => {
    if (carouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth);
    }
  };

  // Get the card width and gap based on viewport size
  const getScrollDistance = () => {
    // Card width (w-56 = 224px) + gap-4 (16px)
    const cardWidth = 224;
    const gap = 16;
    const totalWidth = cardWidth + gap;

    // Scroll by 2 cards on desktop, 1 on mobile
    const cardsToScroll = 1;
    return totalWidth * cardsToScroll;
  };

  const scrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({
        left: -getScrollDistance(),
        behavior: 'smooth',
      });
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({
        left: getScrollDistance(),
        behavior: 'smooth',
      });
    }
  };

  const handleCardClose = (index: number) => {
    if (carouselRef.current) {
      const cardWidth = 224; // w-56 (224px)
      const gap = isMobile() ? 16 : 16; // gap-4 (16px)
      const scrollPosition = (cardWidth + gap) * index;
      carouselRef.current.scrollTo({
        left: scrollPosition,
        behavior: 'smooth',
      });
      setCurrentIndex(index);
    }
  };

  const isMobile = () => {
    return window && window.innerWidth < 768;
  };

  return (
    <CarouselContext.Provider
      value={{ onCardClose: handleCardClose, currentIndex }}
    >
      <div className="relative w-full">
        <div
          className="flex w-full overflow-x-scroll overscroll-x-auto scroll-smooth py-10 [scrollbar-width:none]"
          ref={carouselRef}
          onScroll={checkScrollability}
        >
          <div
            className={cn(
              'absolute right-0 z-[10] h-auto w-[5%] overflow-hidden bg-gradient-to-l'
            )}
          ></div>

          <div
            className={cn(
              'flex flex-row justify-start gap-4',
              'mx-auto max-w-7xl' // remove max-w-4xl if you want the carousel to span the full width of its container
            )}
          >
            {items.map((item, index) => (
              <motion.div
                initial={{ opacity: 0, y: 32, scale: 0.94 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  transition: {
                    duration: 0.6,
                    delay: 0.1 * index,
                    ease: [0.19, 1, 0.22, 1],
                  },
                }}
                key={'card' + index}
                className="rounded-3xl last:pr-[5%] md:last:pr-[33%]"
              >
                {item}
              </motion.div>
            ))}
          </div>
        </div>
        <div className="mr-10 flex justify-end gap-2 md:mr-20">
          <motion.button
            whileHover={canScrollLeft ? { scale: 1.08 } : undefined}
            whileTap={canScrollLeft ? { scale: 0.92 } : undefined}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            className="relative z-40 flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 disabled:opacity-40 dark:bg-neutral-800"
            onClick={scrollLeft}
            disabled={!canScrollLeft}
          >
            <IconArrowNarrowLeft className="h-6 w-6 text-gray-500 dark:text-neutral-300" />
          </motion.button>
          <motion.button
            whileHover={canScrollRight ? { scale: 1.08 } : undefined}
            whileTap={canScrollRight ? { scale: 0.92 } : undefined}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            className="relative z-40 flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 disabled:opacity-40 dark:bg-neutral-800"
            onClick={scrollRight}
            disabled={!canScrollRight}
          >
            <IconArrowNarrowRight className="h-6 w-6 text-gray-500 dark:text-neutral-300" />
          </motion.button>
        </div>
      </div>
    </CarouselContext.Provider>
  );
};

export const Card = ({
  card,
  index,
  layout = false,
}: {
  card: Card;
  index: number;
  layout?: boolean;
}) => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { onCardClose, currentIndex } = useContext(CarouselContext);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        handleClose();
      }
    }

    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open]);

  //@ts-ignore
  useOutsideClick(containerRef, () => handleClose());

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    onCardClose(index);
  };

  // 3D tilt + image parallax + cursor-glow — all driven off one mousemove so
  // there's a single source of truth for "how far into the card is the cursor".
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const springRotateX = useSpring(rotateX, { stiffness: 200, damping: 20 });
  const springRotateY = useSpring(rotateY, { stiffness: 200, damping: 20 });

  const imageX = useMotionValue(0);
  const imageY = useMotionValue(0);
  const springImageX = useSpring(imageX, { stiffness: 150, damping: 18 });
  const springImageY = useSpring(imageY, { stiffness: 150, damping: 18 });

  const glowX = useMotionValue(50);
  const glowY = useMotionValue(50);
  const springGlowX = useSpring(glowX, { stiffness: 120, damping: 22 });
  const springGlowY = useSpring(glowY, { stiffness: 120, damping: 22 });
  const glowBackground = useMotionTemplate`radial-gradient(220px circle at ${springGlowX}% ${springGlowY}%, rgba(59,130,246,0.35), transparent 70%)`;

  const handleTiltMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    rotateY.set(px * 14);
    rotateX.set(py * -14);
    // Parallax: artwork drifts opposite the tilt, a few px of depth.
    imageX.set(px * -10);
    imageY.set(py * -10);
    glowX.set((px + 0.5) * 100);
    glowY.set((py + 0.5) * 100);
  };

  const handleTiltLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
    imageX.set(0);
    imageY.set(0);
  };

  return (
    <>
      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-52 h-screen overflow-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 h-full w-full bg-black/80 backdrop-blur-lg"
            />
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              ref={containerRef}
              layoutId={layout ? `card-${card.title}` : undefined}
              className="relative z-[60] mx-auto my-10 h-fit max-w-5xl rounded-3xl bg-white font-sans dark:bg-neutral-900"
            >
              {/* Sticky close button */}
              <div className="sticky top-4 z-52 flex justify-end px-8 pt-8 md:px-14 md:pt-8">
                <button
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-black/90 shadow-md dark:bg-white/90"
                  onClick={handleClose}
                >
                  <IconX className="h-6 w-6 text-neutral-100 dark:text-neutral-900" />
                </button>
              </div>

              {/* Header section with consistent padding */}
              <div className="relative px-8 pt-2 pb-0 md:px-14">
                <div>
                  <motion.p
                    layoutId={layout ? `category-${card.title}` : undefined}
                    className="text-base font-medium text-black dark:text-white"
                  >
                    {card.category}
                  </motion.p>
                  <motion.p
                    layoutId={layout ? `title-${card.title}` : undefined}
                    className="mt-4 text-2xl font-semibold text-neutral-700 md:text-5xl dark:text-white"
                  >
                    {card.title}
                  </motion.p>
                </div>
              </div>

              {/* Content with consistent padding */}
              <div className="px-8 pt-8 pb-14 md:px-14">{card.content}</div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <motion.div
        style={{ perspective: 1000 }}
        onMouseMove={handleTiltMove}
        onMouseLeave={handleTiltLeave}
        initial="rest"
        whileHover="hover"
        animate="rest"
        className="group"
      >
        <motion.button
          layoutId={layout ? `card-${card.title}` : undefined}
          onClick={handleOpen}
          style={{ rotateX: springRotateX, rotateY: springRotateY }}
          variants={{ rest: { y: 0 }, hover: { y: -8 } }}
          transition={{ type: 'spring', stiffness: 300, damping: 22 }}
          className="relative z-10 flex h-80 w-56 flex-col items-start justify-end overflow-hidden rounded-3xl bg-gray-100 shadow-md transition-shadow duration-300 group-hover:shadow-2xl dark:bg-neutral-900"
        >
          {/* Cursor-tracking soft blue glow */}
          <motion.div
            aria-hidden
            style={{ background: glowBackground }}
            variants={{ rest: { opacity: 0 }, hover: { opacity: 1 } }}
            transition={{ duration: 0.3 }}
            className="pointer-events-none absolute inset-0 z-20"
          />

          {/* Artwork, with a touch of parallax drift + hover zoom */}
          <motion.div
            style={{ x: springImageX, y: springImageY }}
            variants={{ rest: { scale: 1 }, hover: { scale: 1.08 } }}
            transition={{ type: 'spring', stiffness: 200, damping: 22 }}
            className="absolute -inset-2"
          >
            <BlurImage
              src={card.coverSrc || card.src}
              alt={card.title}
              fill
              sizes="224px"
              className="object-cover"
            />
          </motion.div>

          {/* Legibility gradient */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-2/3 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

          {/* Bottom text overlay — sized to fit the card, never pushes layout */}
          <motion.div
            variants={{ rest: { y: 0 }, hover: { y: -6 } }}
            transition={{ type: 'spring', stiffness: 300, damping: 24 }}
            className="relative z-30 w-full p-5"
          >
            <motion.p
              layoutId={layout ? `category-${card.category}` : undefined}
              className="text-left font-sans text-[11px] font-medium tracking-wide text-white/70 uppercase"
            >
              {card.category}
            </motion.p>
            <motion.p
              layoutId={layout ? `title-${card.title}` : undefined}
              className="mt-1 line-clamp-2 text-left font-sans text-lg leading-tight font-semibold text-white"
            >
              {card.shortTitle || card.title}
            </motion.p>
            <motion.span
              variants={{
                rest: { opacity: 0, y: 4 },
                hover: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.2 }}
              className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-white/90"
            >
              View Project
              <ArrowUpRight className="h-3.5 w-3.5" />
            </motion.span>
          </motion.div>
        </motion.button>
      </motion.div>
    </>
  );
};

export const BlurImage = ({
  height,
  width,
  src,
  className,
  alt,
  ...rest
}: ImageProps) => {
  const [isLoading, setLoading] = useState(true);
  return (
    <Image
      className={cn(
        'transition duration-300',
        isLoading ? 'blur-sm' : 'blur-0',
        className
      )}
      onLoad={() => setLoading(false)}
      src={src}
      width={width}
      height={height}
      loading="lazy"
      decoding="async"
      blurDataURL={typeof src === 'string' ? src : undefined}
      alt={alt ? alt : 'Background of a beautiful view'}
      {...rest}
    />
  );
};

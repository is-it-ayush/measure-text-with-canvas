'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const MOBILE_BREAKPOINT = 768;

interface ParallaxTextProps extends React.HTMLProps<HTMLDivElement> {
  children: React.ReactNode;
  desktopWidth: number;
  mobileWidth: number;
}

interface ComputeParallaxProps {
  words: string[];
  wordLengths: number[];
  whitespaceApproximation: number;
}

export const ParallaxText = ({
  children,
  desktopWidth,
  mobileWidth,
  className,
}: ParallaxTextProps) => {
  const [lines, setLines] = useState<string[]>([]);

  // Initialize the parallax effect.
  useEffect(() => {
    if (typeof children !== 'string') {
      throw new Error('ParallaxText only accepts string children.');
    }
    const { ctx } = createCanvas();
    const text = children;
    const words = text
      .trim()
      .split(' ')
      .map((word) => word.trim());
    const wordLengths = words.map((word) => {
      const metrics = ctx.measureText(word);
      return (
        Math.abs(metrics.actualBoundingBoxLeft) +
        Math.abs(metrics.actualBoundingBoxRight)
      );
    });
    const whitespaceApproximation = getCharacterLength('s', ctx); // assumption 2
    function handleResize() {
      computeParallax({ words, wordLengths, whitespaceApproximation });
    }

    // Compute the parallax effect on mount.
    handleResize();

    // Add event listener for resizing.
    window.addEventListener('resize', handleResize);

    () => {
      window.removeEventListener('resize', handleResize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only run once
  }, []);

  // Compute the parallax effect for the text.
  function computeParallax({
    words,
    wordLengths,
    whitespaceApproximation,
  }: ComputeParallaxProps) {
    const containerWidth = computeLineWidth() / 2; // assumption 1
    const lines: string[] = [];
    let currentLine = '';
    let currentLength = 0;
    for (let i = 0; i <= words.length; i++) {
      const word = words[i];
      const wordLength = wordLengths[i] ?? 0;
      const newLength = currentLength + wordLength;
      if (i === words.length) {
        lines.push(currentLine);
        break;
      }
      if (newLength < containerWidth) {
        currentLine += `${word} `;
        currentLength += wordLength + whitespaceApproximation;
      } else {
        lines.push(currentLine);
        currentLine = `${word} `;
        currentLength = wordLength + whitespaceApproximation;
      }
    }
    setLines(lines);
  }

  /// Linearlly interpolate the line width between mobile and desktop.
  function computeLineWidth() {
    const windowWidth = window.innerWidth;
    if (windowWidth >= MOBILE_BREAKPOINT) {
      return desktopWidth;
    }
    if (windowWidth <= mobileWidth) {
      return mobileWidth;
    }
    const ratio = (MOBILE_BREAKPOINT - windowWidth) / (MOBILE_BREAKPOINT - mobileWidth);
    return desktopWidth - (ratio * (desktopWidth - mobileWidth));
  }

  // Measure the length of a character in pixels.
  function getCharacterLength(
    character: string,
    ctx: CanvasRenderingContext2D,
  ): number {
    const metric = ctx.measureText(character);
    return (
      Math.abs(metric.actualBoundingBoxLeft) +
      Math.abs(metric.actualBoundingBoxRight)
    );
  }

  // Create canvas and context for measuring text.
  function createCanvas(): {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
  } {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error(
        'Canvas context is null. Is canvas supported in this environment?',
      );
    }
    ctx.font = '16px var(--font-poppins)';
    return { canvas, ctx };
  }

  return (
    <motion.div className={className}>
      {lines.map((line, index) => (
        <motion.span
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 30 }}
          transition={{ duration: 0.3, delay: 0.1 * index }}
          key={index}
          className=""
        >
          {line}
        </motion.span>
      ))}
    </motion.div>
  );
};

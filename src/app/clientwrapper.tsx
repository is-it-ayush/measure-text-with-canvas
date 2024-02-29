'use client';

import { useEffect, useRef, useState } from "react";
import { motion, } from "framer-motion";

export const ClientWrapper = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [lines, setLines] = useState<string[]>([]);

  useEffect(() => {
    if (!containerRef.current) return;
    const { ctx } = createCanvas();
    const container = containerRef.current;
    const containerWidth = container.clientWidth / 2; // the hack; dividing by 2 splits the text approximately closer to the orignal browser render. (assumption 1)
    const text = container.textContent ?? "";
    const words = text.trim().split(" ").map((word) => word.trim());
    const wordLengths = words.map((word) => {
      const metrics = ctx.measureText(word)
      const width = Math.abs(metrics.actualBoundingBoxLeft) + Math.abs(metrics.actualBoundingBoxRight);
      return width;
    });
    const getCharacterLength = (char: string) => {
      const metric = ctx.measureText(char);
      return Math.abs(metric.actualBoundingBoxLeft) + Math.abs(metric.actualBoundingBoxRight);
    }
    const whitespaceApproximation = getCharacterLength("s"); // s is approximately the width of a whitespace; i eyed it. (assumption 2)
    const lines: string[] = [];
    let currentLine = "";
    let currentLength = 0;
    for (let i = 0; i <= words.length; i++) {
      let word = words[i];
      const wordLength = wordLengths[i] ?? 0;
      const newLength = currentLength + wordLength;
      if (i === words.length) {
        lines.push(currentLine);
        break;
      }
      if (newLength < containerWidth) {
        currentLine += word + " ";
        currentLength += wordLength + whitespaceApproximation;
      } else {
        lines.push(currentLine);
        currentLine = word + " ";
        currentLength = wordLength + whitespaceApproximation;
      }
    }
    setLines(lines);
  }, []);

  // Create canvas and context for measuring text.
  function createCanvas(): { canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D } {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      throw new Error("Canvas context is null. Is canvas supported in this environment?");
    }
    ctx.font = "16px var(--font-poppins)";
    return { canvas, ctx };
  }

  return (
    <main className="flex flex-col lg:flex-row h-[200vh] w-full lg:justify-between p-10 gap-5 bg-black text-white">
      <div className="flex flex-col gap-2 lg:items-start">
        <span className="text-2xl font-semibold">Original Text</span>
        <div ref={containerRef} className="flex max-w-lg p-5 bg-amber-500/5 rounded-md">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec
          consectetur, ligula ut tincidunt posuere, arcu libero lacinia nunc, non
          tincidunt libero justo euismod nunc. Nulla facilisi. Sed auctor, nunc
          eget aliquam elementum, ligula libero tincidunt libero, quis laoreet
          libero nunc in libero.
        </div>
      </div>
      <div className="flex flex-col gap-2 lg:items-end">
        <span className="text-2xl font-semibold">Prallaxed Text (Line Split)</span>
        <motion.div className="flex flex-col w-fit bg-green-500/5 rounded-md p-5">
          {
            lines.map((line, index) => (
              <motion.span
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 30 }}
                transition={{ duration: 0.3, delay: 0.1 * (index) }}
                key={index}
                className=""
              >
                {line}
              </motion.span>
            ))
          }
        </motion.div>
        <div className="p-5 text-xs">
          <pre>
            {JSON.stringify(lines, null, 2)}
          </pre>
        </div>
      </div>
      <div className="fixed flex bottom-10 left-0  px-5  w-full bg-white/5">
        <span className="text-xs text-white">
          The parallax is scroll triggered. Scroll down and back up to reveal the text again.
        </span>
      </div>
    </main>
  )
};

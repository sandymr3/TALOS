"use client";

import Image from "next/image";
import logo from "./../../../app/taloslogo.png";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import ScrollFloat from "@/components/ui/ScrollFloat";

export default function MascotSection() {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const rotateX = useTransform(scrollYProgress, [0, 0.5, 1], [15, 0, -15]);
  const rotateY = useTransform(scrollYProgress, [0, 0.5, 1], [-15, 0, 15]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 0.8]);
  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  return (
    <section ref={containerRef} className="relative w-full bg-black overflow-hidden perspective-1000">
      <div className="absolute inset-0 bg-gradient-to-br from-black via-black to-red-950/40" />

      <div className="absolute right-1/3 top-1/2 -translate-y-1/2 w-[300px] md:w-[650px] h-[300px] md:h-[650px] bg-red-600/25 blur-[100px] md:blur-[180px] rounded-full pointer-events-none" />

      <div className="relative z-10 container mx-auto px-6 py-20 md:py-32">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">

          <div className="flex justify-center md:justify-start perspective-1000">
            <motion.div
              style={{
                rotateX,
                rotateY,
                scale,
                y,
                opacity,
                transformStyle: "preserve-3d",
              }}
              className="relative w-full max-w-[280px] md:max-w-none flex justify-center"
            >
              <Image
                src={logo}
                alt="TALOS Logo"
                priority
                className="w-full md:w-[52rem] h-auto select-none drop-shadow-[0_0_40px_rgba(220,38,38,0.4)] md:drop-shadow-[0_0_60px_rgba(220,38,38,0.55)]"
              />
            </motion.div>
          </div>
          <div className="text-center md:text-left relative z-20">
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <h3 className="text-white bbh-bartle-black tracking-[0.4em] text-sm md:text-xl mb-4">
                WE ARE
              </h3>

              <h2 className="text-red-600 bbh-bartle-black text-5xl md:text-8xl tracking-tight mb-8 md:mb-10">
                TALOS
              </h2>

              <div className="text-gray-300 font-medium zen-dots-regular leading-relaxed text-sm md:text-lg max-w-xl mx-auto md:mx-0 flex flex-wrap gap-1">
                <ScrollFloat
                  as="span"
                  animationDuration={1}
                  ease='back.inOut(2)'
                  scrollStart='center bottom+=50%'
                  scrollEnd='bottom bottom-=40%'
                  stagger={0.03}
                  containerClassName='inline-block'
                  textClassName='!text-sm md:!text-lg text-white font-bold !leading-relaxed'
                >
                  TALOS
                </ScrollFloat>
                <span className="inline-block"> – </span>
                <ScrollFloat
                  as="span"
                  animationDuration={1}
                  ease='back.inOut(2)'
                  scrollStart='center bottom+=50%'
                  scrollEnd='bottom bottom-=40%'
                  stagger={0.03}
                  containerClassName='inline-block'
                  textClassName='!text-sm md:!text-lg text-red-500 !leading-relaxed'
                >
                  Towards Advance Level Of Science
                </ScrollFloat>
                <ScrollFloat
                  as="span"
                  animationDuration={1}
                  ease='back.inOut(2)'
                  scrollStart='center bottom+=50%'
                  scrollEnd='bottom bottom-=40%'
                  stagger={0.01}
                  containerClassName='inline'
                  textClassName='!text-sm md:!text-lg text-gray-300 !leading-relaxed text-left'
                >
                  is an annual occurrence conducted by the Department of Artificial Intelligence and Data Science to showcase the importance of the domain. A wave of fun and technical events will be conducted throughout the day.
                </ScrollFloat>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}

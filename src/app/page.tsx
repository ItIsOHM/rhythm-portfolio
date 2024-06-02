"use client"

import dynamic from "next/dynamic";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { FlipWords } from "@/components/ui/flip-words";
import {motion} from "framer-motion";
import { cn } from "@/utils/cn";
const Scene = dynamic(() => import("../components/Scene"), {
  ssr: false
})

export default function Home() {

  const words = ["software dev.", "digital artist.", "film-maker."]

  return (
    <main className={cn("h-screen")}>
      <Scene/>
      <AuroraBackground showRadialGradient={false} className="dark">
        <motion.div
          initial={{ opacity: 0.0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.3,
            duration: 0.8,
            ease: "easeInOut",
          }}
          className="relative flex flex-col gap-4 items-start justify-center px-4 text-left"
        >
          <div className="h-[40rem] flex justify-center items-center px-4">
            <div className="text-7xl mx-auto font-normal text-neutral-600 dark:text-neutral-200 font-display">
              and I&apos;m a <FlipWords words={words} duration={1000} /><br />
              Welcome to my portfolio :)
            </div>
          </div>
        </motion.div>
      </AuroraBackground>
    </main>
  )
}
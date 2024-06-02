"use client";

import React, { Suspense, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import Model from "./Model";
import extension from "@theatre/r3f/dist/extension";
import studio from "@theatre/studio";
import {
  Environment,
  ScrollControls,
  OrbitControls,
  Html,
  useProgress,
  useScroll,
  Text,
  Text3D,
  Backdrop
} from "@react-three/drei";
import { EffectComposer, SSAO, TiltShift2, DepthOfField } from "@react-three/postprocessing";
import { getProject, val } from "@theatre/core";
import {
  SheetProvider,
  PerspectiveCamera,
  useCurrentSheet,
} from "@theatre/r3f";
import { useControls } from "leva";
import { cn } from "@/utils/cn";

studio.extend(extension);

function Effects() {
  return (
    <EffectComposer>
      {/* <TiltShift2 blur={0.1} /> */}
      <DepthOfField focalLength={0.001} bokehScale={2} focusDistance={20}/>
    </EffectComposer>
  );
}

function Loader() {
  const { progress } = useProgress();
  return <Html center>{progress} % loaded</Html>;
}

export default function Scene() {
  const sheet = getProject("rhythm-portfolio").sheet("Scene");
  const canvasRef = useRef(null);

  return (
    <Canvas ref={canvasRef} >
      <Suspense fallback={<Loader/>} >
        <ScrollControls pages={2} >
          <SheetProvider sheet={sheet}>
            <SceneHelper />
          </SheetProvider>
        </ScrollControls>
      </Suspense>
    </Canvas>
  );
}

function SceneHelper() {
  const sheet = useCurrentSheet();
  const scroll = useScroll();

  useFrame(() => {
    const sequenceLength = val<number>(sheet.sequence.pointer.length);
    sheet.sequence.position = scroll.offset * sequenceLength;
  });

  return (
    <>
      {/* <ambientLight intensity={1} /> */}
      {/* <directionalLight position={[-5, 5, -5]} intensity={15} /> */}
      <PerspectiveCamera
        theatreKey="Camera"
        makeDefault
        position={[0, 20, 0]}
        rotation={[4.72, 0, 0]}
        fov={25}
        near={0.1}
        far={70}
      />
      <Environment preset="city" background backgroundRotation={[90, 0, 0]}/>
      {/* <Effects/> */}
      {/* <OrbitControls/> */}
      <Model />
      {/* <Text3D font={"fonts/Roobert_Regular.json"} rotation={[-1, 0, 0]}>
        Hi, my name is
        <meshBasicMaterial/>
      </Text3D> */}
    </>
  );
}

"use client"

import { useFBX, useScroll } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import React, { useEffect, useRef, useMemo } from "react";
import * as THREE from "three";
import { MeshTransmissionMaterial } from "@react-three/drei";

export default function Model() {
  const textFBX = useFBX("/medias/Model.fbx");
  const mixer = useRef<THREE.AnimationMixer | null>(null);
  const actionRef = useRef<THREE.AnimationAction | null>(null);
  const scroll = useScroll(); // Access the scroll object
  const { viewport } = useThree(); // Access the viewport

  // Create the transmission material
  const transmissionMaterial = useMemo(() => new THREE.MeshPhysicalMaterial({
    transmission: 1.0,
    roughness: 0.1,
    thickness: 1,
    ior: 1.2,
    reflectivity: 0.5,
    color: new THREE.Color(0xffffff),
  }), []);

  useEffect(() => {
    if (textFBX.animations.length > 0) {
      mixer.current = new THREE.AnimationMixer(textFBX);
      const action = mixer.current.clipAction(textFBX.animations[0]);
      action.play();
      action.paused = true; // Pause the action to control it manually
      actionRef.current = action;
    }

    // Normalize and apply the custom transmission material to each mesh in the model
    textFBX.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        // Normalize the geometry
        mesh.geometry.normalizeNormals();
        mesh.geometry.computeVertexNormals();
        
        // Apply the custom material
        mesh.material = transmissionMaterial;
      }
    });

    return () => {
      if (mixer.current) {
        mixer.current.stopAllAction();
      }
    };
  }, [textFBX, transmissionMaterial]);

  useFrame((state, delta) => {
    if (mixer.current && actionRef.current) {
      const scrollPosition = scroll.offset; // Get the normalized scroll offset
      const duration = actionRef.current.getClip().duration;
      actionRef.current.time = scrollPosition * duration;
      mixer.current.update(delta);
    }
  });

  // Dynamically set scale based on viewport width
  const scale = viewport.width * 0.0015; // Adjust the multiplier as needed

  return <primitive object={textFBX} scale={scale}/>;
}

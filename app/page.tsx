'use client';

import React, { useRef, useState, useEffect, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { OrbitControls } from '@react-three/drei';
import { useTexture, shaderMaterial } from "@react-three/drei";
import axios from "axios";
import './styles.css'

interface RotatingCubeProps {
  vertex: string;
  fragment: string;
}

function RotatingCube({ vertex, fragment }: RotatingCubeProps): JSX.Element {
  const cubeRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const [hovered, setHover] = useState(false);
  const [clicked, click] = useState(false);
  
  // Rotate the cube in the render loop
  useFrame(() => {
    if (cubeRef.current) {
      cubeRef.current.rotation.x += 0.00;
      cubeRef.current.rotation.y += 0.00;
    }
  });

    // Load the noise texture and update the shader uniform
  const noiseTexture = useTexture("noise2.png");
  useFrame((state) => {
    let time = state.clock.getElapsedTime();
    if (materialRef.current) {
      materialRef.current.uniforms.iTime.value = time + 250;
    }
  });

    // Define the shader uniforms with memoization to optimize performance
    const uniforms = useMemo(
      () => ({
        iTime: {
          type: "f",
          value: 1.0,
        },
        iResolution: {
          type: "v2",
          value: new THREE.Vector2(2, 1.5),
        },
        iChannel0: {
          type: "t",
          value: noiseTexture,
        },
      }),
      []
    );


  return (
    <mesh
      ref={cubeRef}
      position={[0, 0, 0]} 
      scale={1}
      onClick={(event) => click(!clicked)}
      onPointerOver={() => setHover(true)}
      onPointerOut={() => setHover(false)}
    >
      <planeGeometry args={[75, 75]} />
      <shaderMaterial
        ref={materialRef}
        uniforms={uniforms}
        fragmentShader={fragment}
        vertexShader={vertex}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

function ThreeScene(): JSX.Element {
   
  // State variables to store the vertex and fragment shaders as strings
   const [vertex, setVertexShader] = useState("");
   const [fragment, setFragmentShader] = useState("");

   // Fetch the shaders once the component mounts
  useEffect(() => {
    // fetch the vertex and fragment shaders from public folder 
    axios.get("/vertexShader.glsl").then((res) => setVertexShader(res.data));
    axios.get("/fragmentShader.glsl").then((res) => setFragmentShader(res.data));
  }, []);

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
    <Canvas>
      <ambientLight />
      <RotatingCube vertex={vertex} fragment={fragment} />
    </Canvas>
    </div>
  );
}

export default ThreeScene;

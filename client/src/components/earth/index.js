import React, { useRef, useState } from 'react';
import { useLoader, useFrame } from '@react-three/fiber';
import { TextureLoader } from 'three';
import { OrbitControls, Stars } from '@react-three/drei';
import * as THREE from 'three';

import EarthDayMap from '../../assets/textures/8k_earth_daymap.jpg';
import EarthNormalMap from '../../assets/textures/8k_earth_normal_map.jpg';
import EarthSpecularMap from '../../assets/textures/8k_earth_specular_map.jpg';
import EarthCloudsMap from '../../assets/textures/8k_earth_clouds.jpg';
// import EarthNightMap from '../../assets/textures/8k_earth_nightmap.jpg';

export function Earth(props) {
  const [colorMap, normalMap, specularMap, cloudsMap] = useLoader(
    TextureLoader,
    [EarthDayMap, EarthNormalMap, EarthSpecularMap, EarthCloudsMap]
  );

  const coordRef = useRef();
  const [hovered, setHover] = useState(false);
  const [active, setActive] = useState(false);

  //north/east are positive and west/south are negative
  function convertLatLngToCortesian(p) {
    let phi = (90 - p.lat) * (Math.PI / 180);
    let theta = (p.lng + 180) * (Math.PI / 180);

    let x = -(Math.sin(phi) * Math.cos(theta));
    let y = Math.sin(phi) * Math.sin(theta);
    let z = Math.cos(phi);
    return {
      x,
      y,
      z,
    };
  }

  function createMesh(city) {
    var pos = convertLatLngToCortesian(city);

    return (
      <mesh
        ref={coordRef}
        {...props}
        onPointerOver={(event) => {
          setHover(true);
          console.log(event);
        }}
        onPointerOut={(event) => setHover(false)}
        position={[pos.x, pos.z, pos.y]}
        userData={city}
      >
        <sphereGeometry args={[0.01, 20, 20]} />
        <meshBasicMaterial color={hovered ? 'red' : 'orange'} />
      </mesh>
    );
  }

  //los angeles
  let point1 = {
    name: 'Los Angeles',
    lat: 34.0522,
    lng: -118.2437,
  };

  //chicago
  let point2 = {
    name: 'Chicago',
    lat: 41.8781,
    lng: -87.6298,
  };

  //barcelona
  let point3 = {
    name: 'Barcelona',
    lat: 41.3874,
    lng: 2.1686,
  };

  //san salvador
  let point4 = {
    name: 'San Salvador',
    lat: 13.6929,
    lng: -89.2182,
  };

  let cities = [point1, point2, point3, point4];

  return (
    <>
      {/* light from all directions */}
      <ambientLight intensity={2} />

      {/* stars background effect */}
      <Stars
        radius={300}
        depth={60}
        count={20000}
        factor={7}
        saturation={0}
        fade={true}
      />

      {/* cloud wrapper */}
      <mesh>
        <sphereGeometry args={[1.005, 32, 32]} />
        <meshPhongMaterial
          map={cloudsMap}
          opacity={0.3}
          depthWrite={true}
          transparent={true}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* coordinates */}
      {cities.map((c) => createMesh(c))}

      {/* earth wrapper */}
      <mesh>
        <sphereGeometry args={[1, 32, 32]} />
        <meshPhongMaterial specularMap={specularMap} />
        <meshStandardMaterial
          map={colorMap}
          normalMap={normalMap}
          metalness={0.7}
        />

        {/* click and rotate earth controls */}
        <OrbitControls
          enableZoom={true}
          enablePan={true}
          enableRotate={true}
          zoomSpeed={0.6}
          panSpeed={0.5}
          rotationSpeed={0.4}
        />
      </mesh>
    </>
  );
}

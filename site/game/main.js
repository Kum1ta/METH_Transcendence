/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   main.js                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: hubourge <hubourge@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/07/30 13:50:49 by edbernar          #+#    #+#             */
/*   Updated: 2024/08/08 16:33:16 by hubourge         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { sendRequest } from './websocket.js';
import { MoveObject } from './controls.js';
import * as THREE from 'three';
import Stats from 'stats.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { createSpotLight, refreshSpotLight, createLightAmbient, createLightPoint, refreshLightPoint } from './light.js';
import { createMap } from './map.js';
import { createBox } from './elements.js';
import { createBall } from './elements.js';
import { RectAreaLightUniformsLib } from 'three/examples/jsm/lights/RectAreaLightUniformsLib.js';

let time = Date.now();

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// ------------------- Stats -------------------- //
const stats = new Stats();
stats.showPanel(0); // 0: fps, 1: ms, 2: mémoire
document.body.appendChild(stats.dom);

// ------------------- Scene -------------------- //
scene.background = new THREE.Color(0x1a1a1a);

// ------------------- Shadow ------------------- //
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap; 

// ------------------- Camera ------------------- //
camera.position.z = 4;
camera.position.y = 3;
camera.rotation.x = -(Math.PI / 4);

// ------------------- Ball --------------------- //
const geometryBall = new THREE.SphereGeometry(0.1, 32, 32);
const materialBall = new THREE.MeshPhysicalMaterial({ color: 0xffffff });

const ball1 = createBall(scene, 0, 0.1, 0, geometryBall, materialBall);
const ball2 = createBall(scene, 2, 0.1, 0, geometryBall, materialBall);
const ball3 = createBall(scene, 2, 0.1, 2, geometryBall, materialBall);
const ball4 = createBall(scene, 0, 0.1, 0, geometryBall, materialBall);
const ball5 = createBall(scene, 2, 0.1, -1.5, geometryBall, materialBall);

// ------------------- RectAreaLight ------------ //
RectAreaLightUniformsLib.init();
let width = 9;
let height = 1;
let intensity = 10;
const rectLightUp = new THREE.RectAreaLight( 0xff0000, intensity,  width, height );
rectLightUp.position.set( 0, 0, -2.24);
rectLightUp.rotation.y = Math.PI;
scene.add( rectLightUp )

width = 9;
height = 1;
intensity = 5;
const rectLightDown = new THREE.RectAreaLight( 0x0000ff, intensity,  width, height );
rectLightDown.position.set( 0, 0, 2.24);
scene.add( rectLightDown )

// --------------- Box Constrols -------------- //
const boxLeft = createBox(scene, -4.45, 0.1 / 2, 0);
const boxRight = createBox(scene, 4.45, 0.1 / 2, 0);
const controlBoxLeft = new MoveObject(boxLeft);

let spotLight = createSpotLight(0xffffff, ball4, scene);
let lightAmbient = createLightAmbient(scene);
let lightPoint = createLightPoint(scene);
createMap(scene);

const controls = new OrbitControls(camera, renderer.domElement);
camera.position.set(0, 4, 5);
controls.update();

function animate() {
	stats.begin();
	if (Date.now() - time > 10000)
	{
		time = Date.now();
		spotLight = refreshSpotLight(scene, spotLight, ball4);
		lightPoint = refreshLightPoint(scene, lightPoint);
	}
	// controls.update();
	updateBalls();
	renderer.render(scene, camera);
	controlBoxLeft.update();
	stats.end();
}

function updateBalls() {
	ball1.position.z = Math.sin(Date.now() * 0.001) * 2;

	ball2.position.x = Math.sin(Date.now() * 0.001) * 3.5;

	ball3.position.x = Math.sin(Date.now() * 0.001) * 3.5;
	ball3.position.z = Math.sin(Date.now() * 0.001) * 2;

	ball4.position.z = Math.sin(Date.now() * 0.001) * 2;
	ball4.position.x = Math.cos(Date.now() * 0.001) * 2;

	ball5.position.y = Math.sin(Date.now() * 0.001) * 0.5 + 0.7;
}


renderer.setAnimationLoop(animate)

document.addEventListener("wheel", onDocumentWheel, false);
function onDocumentWheel(event) {
	camera.position.z += event.deltaY * 0.01;
}

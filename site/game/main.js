/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   main.js                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: hubourge <hubourge@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/07/30 13:50:49 by edbernar          #+#    #+#             */
/*   Updated: 2024/08/07 16:26:11 by hubourge         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { sendRequest } from './websocket.js';
import { MoveObject } from './controls.js';
import { createBox } from './elements.js';
import * as THREE from 'three';
import Stats from 'stats.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { createSpotLight, refreshSpotLight, createLightAmbient, createLightPoint, refreshLightPoint } from './light.js';
import { createMap } from './map.js';

let time = Date.now();

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// ------------------- Stats ------------------- //
const stats = new Stats();
stats.showPanel(0); // 0: fps, 1: ms, 2: mémoire
document.body.appendChild(stats.dom);

// ------------------- Scene ------------------- //
scene.background = new THREE.Color(0x1a1a1a);

// ------------------- Shadow ------------------- //
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap; 

// ------------------- Camera ------------------- //
camera.position.z = 4;
camera.position.y = 3;
camera.rotation.x = -(Math.PI / 4);

// ------------------- Ball ------------------- //
const geometryBall = new THREE.SphereGeometry(0.1, 32, 32);
const materialBall = new THREE.MeshLambertMaterial({ color: 0xffffff });
const ball = new THREE.Mesh(geometryBall, materialBall);
ball.position.y = 0.1;
ball.castShadow = true;
scene.add(ball);
const controlBall = new MoveObject(ball);

// --------------- Box Constrols -------------- //
const boxLeft = createBox(scene, -4.45, 0.1 / 2, 0);
const boxRight = createBox(scene, 4.45, 0.1 / 2, 0);
const controlBoxLeft = new MoveObject(boxLeft);
const controlBoxRight = new MoveObject(boxRight);

let spotLight = createSpotLight(0xffffff, ball, scene);
let lightAmbient = createLightAmbient(scene);
let lightPoint = createLightPoint(scene);
createMap(scene);


const controls = new OrbitControls(camera, renderer.domElement);
camera.position.set(0, 1, 5);
controls.update();



function animate() {
	stats.begin();
	if (Date.now() - time > 10000)
	{
		time = Date.now();
		spotLight = refreshSpotLight(scene, spotLight, ball);
		lightPoint = refreshLightPoint(scene, lightPoint);
	}
	// controls.update();
    ball.position.x = Math.sin(Date.now() * 0.001) * 2;
	ball.position.z = Math.cos(Date.now() * 0.001) * 2;
	renderer.render(scene, camera);
	controlBall.update();
    stats.end();
}

renderer.setAnimationLoop(animate)
document.addEventListener("keydown", onDocumentKeyDown, false);
function onDocumentKeyDown(event) {
    var keyCode = event.which;
    if (keyCode == 87) {
        camera.position.z -= 0.1;
    } else if (keyCode == 83) {
        camera.position.z += 0.1;
    } else if (keyCode == 65) {
        camera.position.x -= 0.1;
    } else if (keyCode == 68) {
        camera.position.x += 0.1;
    } else if (keyCode == 32) {
        camera.position.set(0, 0, 0);
    } else if (keyCode == 37) {
		camera.rotation.y += 0.1;
	} else if (keyCode == 39) {
		camera.rotation.y -= 0.1;
	} else if (keyCode == 38) {
		camera.position.y += 0.1;
	} else if (keyCode == 40) {
		camera.position.y -= 0.1;
	}
};

document.addEventListener("wheel", onDocumentWheel, false);
function onDocumentWheel(event) {
	camera.position.z += event.deltaY * 0.01;
}

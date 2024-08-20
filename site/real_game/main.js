/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   main.js                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: hubourge <hubourge@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/08/18 00:53:53 by edbernar          #+#    #+#             */
/*   Updated: 2024/08/20 17:28:36 by hubourge         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import * as THREE from 'three';
import { Player } from './class/Player'
import { Map } from './class/Map'
import { OrbitControls } from 'three/examples/jsm/Addons.js';
import { update } from 'three/examples/jsm/libs/tween.module.js';

function createBarPlayer(color)
{
	const geometry	= new THREE.BoxGeometry(1, 0.1, 0.1);
	const material	= new THREE.MeshPhysicalMaterial({color: color});
	const mesh		= new THREE.Mesh(geometry, material);

	mesh.position.set(0, 0.2, 0);
	return (mesh);
}

function loop()
{
	player.update();
	renderer.render(scene, player.camera);
	
	// ===== test ball =====
	updateBall();
}

function createMap()
{
	const geometry	= new THREE.PlaneGeometry(10, 10);
	const material	= new THREE.MeshPhysicalMaterial();
	const mesh		= new THREE.Mesh(geometry, material);

	mesh.rotateX(-(Math.PI / 2));
	return (mesh);
}


const scene			= new THREE.Scene();
const map			= new Map(scene, 13);
const bar			= createBarPlayer(0xed56ea);
const renderer		= new THREE.WebGLRenderer({antialias: true});
const player		= new Player(bar);
const spotLight		= new THREE.SpotLight(0xffffff, 10000, 0, Math.PI / 4);
const ambiantLight	= new THREE.AmbientLight(0xffffff, 1);

// ===== test ball =====
const geometryBall = new THREE.SphereGeometry(0.15, 32, 32);
const materialBall = new THREE.MeshPhysicalMaterial({color: 0xff0000});
const ball = new THREE.Mesh(geometryBall, materialBall);
ball.position.x = map.centerPos.x;
ball.position.y = map.centerPos.y + 0.15;
ball.position.z = map.centerPos.z;
ball.receiveShadow = true;
ball.castShadow = true;
scene.add(ball);

function updateBall()
{
	// pressedButton	= [];
	let i 				= 0;
	let interval		= null;
	let speed			= 0.01;
	const limits = {
		up : 3,
		down: 0.2,
		left: -3,
		right: 3,
	}

	document.addEventListener('keypress', (e) => {
		if (e.key == '9')
		{
				ball.position.z += speed;
				console.log(e.key);
		}
	});
}
// =====================

scene.add(player.object);
scene.add(ambiantLight);
spotLight.position.set(0, 100, 0);
scene.add(spotLight);
scene.background = new THREE.Color(0x1a1a1a);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

document.addEventListener('keypress', (e) => {
	if (e.key == 'g')
		player.pointAnimation(scene);
})

renderer.setAnimationLoop(loop)

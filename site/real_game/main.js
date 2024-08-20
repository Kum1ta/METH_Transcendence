/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   main.js                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: hubourge <hubourge@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/08/18 00:53:53 by edbernar          #+#    #+#             */
/*   Updated: 2024/08/20 16:11:26 by hubourge         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import * as THREE from 'three';
import { Player } from './class/Player'
import { Map } from './class/Map'
import { OrbitControls } from 'three/examples/jsm/Addons.js';

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

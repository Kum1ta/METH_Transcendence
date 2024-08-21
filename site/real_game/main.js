/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   main.js                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: hubourge <hubourge@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/08/18 00:53:53 by edbernar          #+#    #+#             */
/*   Updated: 2024/08/21 16:39:17 by hubourge         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import * as THREE from 'three';
import { Player } from './class/Player'
import { Map } from './class/Map'
import { Ball } from './class/Ball'
import { Opponent } from './class/Opponent'
import { OrbitControls } from 'three/examples/jsm/Addons.js';

/*
Controls :
	- w : monter
	- s : descendre
	- a : gauche
	- d : droite

	- g : animation de point
	- h : animation de point pour l'adversaire
	- c : switch entre la vue du joueur et la vue de la caméra

	- 8 : avance la balle
	- 2 : recule la balle
	- 4 : balle vers la gauche
	- 6 : balle vers ladroite
	- 9 : inversion gravite
*/

let	debug = true;

function createBarPlayer(color)
{
	const geometry	= new THREE.BoxGeometry(1, 0.1, 0.1);
	const material	= new THREE.MeshPhysicalMaterial({color: color});
	const mesh		= new THREE.Mesh(geometry, material);

	mesh.castShadow = true;
	return (mesh);
}

function loop()
{
	player.update();
	map.update(ball.object);
	if (debug)
	{
		controls.update();
		renderer.render(scene, cameraTmp);
	}
	else
		renderer.render(scene, player.camera);
	
}

const scene			= new THREE.Scene();
const map			= new Map(scene, 13);
const bar1			= createBarPlayer(0xed56ea);
const renderer		= new THREE.WebGLRenderer({antialias: true});
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
const player		= new Player(bar1, map);
const spotLight		= new THREE.SpotLight(0xffffff, 10000, 0, 0.2);
spotLight.castShadow = true;
const ambiantLight	= new THREE.AmbientLight(0xffffff, 0.5);
const ball			= new Ball(scene, map);
const bar2			= createBarPlayer(0xf3e11e);
const opponent		= new Opponent(bar2, map);


scene.add(player.object);
scene.add(opponent.object);
console.log(player.object.position);
console.log(opponent.object.position);
scene.add(ambiantLight);
spotLight.position.set(0, 100, 0);
scene.add(spotLight);
scene.background = new THREE.Color(0x1a1a1a);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
ball.initMoveBallTmp();
map.ballObject = ball.object;

// map.addDecor('blender/exported/map1.glb')
// map.createGravityChanger(1, 1, false);



/*---------------DEBUG----------------*/
const cameraTmp = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight);
const controls = new OrbitControls(cameraTmp, renderer.domElement);
cameraTmp.position.set(5, 3, 5);
controls.target = new THREE.Vector3(map.centerPos.x, 0, map.centerPos.z);

/*------------------------------------*/

document.addEventListener('keypress', (e) => {
	if (e.key == 'g')
		player.pointAnimation(map);
	if (e.key == 'h')
		player.pointOpponentAnimation(map, opponent.object);
	if (e.key == 'c')
		debug = !debug;
})

renderer.setAnimationLoop(loop)

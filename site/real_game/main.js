/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   main.js                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: edbernar <edbernar@student.42angouleme.    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/08/18 00:53:53 by edbernar          #+#    #+#             */
/*   Updated: 2024/08/27 15:21:49 by edbernar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import * as THREE from 'three';
// import * as THREE from '/static/javascript/three/build/three.module.js';
import { Player } from './class/Player'
import { Map } from './class/Map'
import { Ball } from './class/Ball'
import { Opponent } from './class/Opponent'
import { OrbitControls } from 'three/examples/jsm/Addons.js';
import Stats from 'stats.js';

/*
Controls :
	- w : monter
	- s : descendre
	- a : gauche
	- d : droite

	- g : animation de point
	- h : animation de point pour l'adversaire
	- c : switch entre la vue du joueur et la vue de la caméra
	- q : lancer animation sur les jumpers

	- 8 : avance la balle
	- 2 : recule la balle
	- 4 : balle vers la gauche
	- 6 : balle vers ladroite
	- 9 : inversion gravite
*/

let	debug = false;
const fpsLocker = {
	status: false,
	limit: 60,
};
let previousTime		= 0;
let scene				= null;
let map					= null;
let bar1				= null;
let renderer			= null;
let player				= null;
let spotLight			= null;
let ambiantLight		= null; 
let ball				= null;
let bar2				= null;
let opponent			= null;

// ------------------- (need to be remove) -------------------- //
const stats = new Stats();
stats.showPanel(0);
document.body.appendChild(stats.dom);

const cameraTmp = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight);
let controls = null;
// ------------------------------------------------------------ //

class Game
{
	static create()
	{
		previousTime = Date.now();
		scene	= new THREE.Scene()
		map		= new Map(scene, 13, true);
		bar1	= createBarPlayer(0xed56ea);
		renderer = new THREE.WebGLRenderer({antialias: true});
		renderer.shadowMap.enabled = true;
		renderer.shadowMap.type = THREE.PCFSoftShadowMap;
		player = new Player(bar1, map);
		spotLight = new THREE.SpotLight(0xffffff, 10000, 0, 0.2);
		spotLight.castShadow	= true;
		ambiantLight = new THREE.AmbientLight(0xffffff, 0.5);
		ball = new Ball(scene, map);
		bar2 = createBarPlayer(0xf3e11e);
		opponent = new Opponent(bar2, map);
		debug = false;

		scene.add(player.object);
		scene.add(opponent.object);
		scene.add(ambiantLight);
		spotLight.position.set(0, 100, 0);
		scene.add(spotLight);
		scene.background = new THREE.Color(0x1a1a1a);
		renderer.setSize(window.innerWidth, window.innerHeight);
		document.body.appendChild(renderer.domElement);
		ball.initMoveBallTmp();
		map.ballObject = ball.object;

		controls = new OrbitControls(cameraTmp, renderer.domElement)
		cameraTmp.position.set(5, 3, 5);
		controls.target = new THREE.Vector3(map.centerPos.x, 0, map.centerPos.z);

		document.addEventListener('keypress', (e) => {
			if (e.key == 'g')
				player.pointAnimation(map);
			if (e.key == 'h')
				player.pointOpponentAnimation(map, opponent.object);
			if (e.key == 'c')
				debug = !debug;
		})

		renderer.setAnimationLoop(loop)
	}

	static dispose()
	{
		scene = null;
		debug = false;
	}
}


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
	stats.begin();
	// ===== FPS locker ===== //
	if (fpsLocker.status)
	{
		const currentTime = Date.now();
		if (currentTime - previousTime < 1000 / 60)
			return ;
		previousTime = currentTime;
	}
	// ====================== //

	player.update();
	map.update(ball);
	if (debug)
	{
		controls.update();
		renderer.render(scene, cameraTmp);
	}
	else
		renderer.render(scene, player.camera);

	stats.end();
}

Game.create();
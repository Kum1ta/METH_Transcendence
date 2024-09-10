/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   MultiGame.js                                       :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: hubourge <hubourge@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/08/18 00:53:53 by edbernar          #+#    #+#             */
/*   Updated: 2024/09/10 18:32:10 by hubourge         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import * as THREE from 'three';
// import * as THREE from '/static/javascript/three/build/three.module.js';
import { Player } from './multiClass/Player'
import { Map } from './multiClass/Map'
import { Ball } from './multiClass/Ball'
import { Opponent } from './multiClass/Opponent'
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

	- p : clear video
	- o : goal video
	- i : outstanding video
	- u : 16 video
	- y : 8 video
	- t : 4 video
*/

let	debug = false;
const fpsLocker = {
	status: false,
	limit: 60,
};
let previousTime		= 0;
let scene				= null;
let map					= null;
let ball				= null;
let renderer			= null;
let player				= null;
let spotLight			= null;
let ambiantLight		= null;
let opponent			= null;

// ------------------- (need to be remove) -------------------- //
const stats = new Stats();
stats.showPanel(0);
document.body.appendChild(stats.dom);

const cameraTmp = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight);
let controls = null;
// ------------------------------------------------------------ //

class MultiGame
{
	static create()
	{
		const bar1		= createBarPlayer(0xed56ea);
		const bar2		= createBarPlayer(0xf3e11e);

		previousTime	= Date.now();
		scene			= new THREE.Scene()
		map				= new Map(scene, 13, true);
		renderer		= new THREE.WebGLRenderer({antialias: true});
		renderer.shadowMap.enabled = true;
		renderer.shadowMap.type = THREE.PCFSoftShadowMap;
		player			= new Player(bar1, map);
		spotLight		= new THREE.SpotLight(0xffffff, 10000, 0, 0.2);
		spotLight.castShadow = true;
		ambiantLight	= new THREE.AmbientLight(0xffffff, 0.5);
		ball			= new Ball(scene, map);
		opponent		= new Opponent(bar2, map);
		debug			= false;

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
			if (e.key == 'p')
				map.putVideoOnCanvas(0, null);
			if (e.key == 'o')
				map.putVideoOnCanvas(3, 'goal');
			if (e.key == 'i')
				map.putVideoOnCanvas(3, 'outstanding');
			if (e.key == 'u')
				map.putVideoOnCanvas(3, 3);
			if (e.key == 'y')
				map.putVideoOnCanvas(2, 3);
			if (e.key == 't')
				map.putVideoOnCanvas(1, 3);
		})

		renderer.setAnimationLoop(loop)
	}

	static dispose()
	{
		debug = false;

		if (renderer)
			renderer.dispose();
		renderer = null;
		if (map)
			map.dispose();
		map = null;
		if (ball)
			ball.dispose();
		ball = null;
		if (player)
			player.dispose();
		player = null;
		if (opponent)
			opponent.dispose();
		opponent = null;
		if (scene)
		{
			scene.children.forEach(child => {
				if (child.geometry)
					child.geometry.dispose();
				if (child.material)
					child.material.dispose();
				if (child.texture)
					child.texture.dispose();
				scene.remove(child);
			});
		}
		scene = null;
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

function changeBarColor(bar, color)
{
	bar.material.color.set(color);
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

export { MultiGame, stats };

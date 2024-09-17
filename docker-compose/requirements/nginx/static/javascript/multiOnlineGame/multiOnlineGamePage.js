/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   multiOnlineGamePage.js                             :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: edbernar <edbernar@student.42angouleme.    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/08/18 00:53:53 by edbernar          #+#    #+#             */
/*   Updated: 2024/09/17 15:04:18 by edbernar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { createNotification as CN } from "/static/javascript/notification/main.js";
import * as THREE from '/static/javascript/three/build/three.module.js'
import { sendRequest } from "/static/javascript/websocket.js";
import { Player } from '/static/javascript/multiOnlineGame/Player.js'
import { Map } from '/static/javascript/multiOnlineGame/Map.js'
import { Ball } from '/static/javascript/multiOnlineGame/Ball.js'
import { pageRenderer } from '/static/javascript/main.js'
import { Opponent } from '/static/javascript/multiOnlineGame/Opponent.js'

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

let scene				= null;
let map					= null;
let ball				= null;
let renderer			= null;
let player				= null;
let spotLight			= null;
let ambiantLight		= null;
let opponent			= null;
let	interval			= null;

class MultiOnlineGamePage
{
	static create()
	{
		const bar1		= createBarPlayer(0xed56ea);
		const bar2		= createBarPlayer(0xf3e11e);

		document.body.setAttribute('style', '');
		scene			= new THREE.Scene()
		map				= new Map(scene, 13, true);
		renderer		= new THREE.WebGLRenderer({antialias: true});
		renderer.shadowMap.enabled = true;
		renderer.shadowMap.type = THREE.PCFSoftShadowMap;
		renderer.domElement.style.animation = 'fadeOutStartGames 1s';
		renderer.domElement.style.filter = 'brightness(1)';
		player			= new Player(bar1, map);
		spotLight		= new THREE.SpotLight(0xffffff, 10000, 0, 0.2);
		spotLight.castShadow = true;
		ambiantLight	= new THREE.AmbientLight(0xffffff, 0.5);
		ball			= new Ball(scene, map);
		opponent		= new Opponent(bar2, map);

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
		sendRequest('game', {action: 1});
		let lastPosition = player.object.position.x;
		interval = setInterval(() => {
			if (player && player.object.position.x != lastPosition)
			{
				lastPosition = player.object.position.x;
				sendRequest('game', {action: 3, pos: player.object.position.x, up: player.isUp});
			}
		}, 1000 / 20);
	}

	static dispose()
	{
		if (interval)
			clearInterval(interval);
		interval = null;
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

	static opponentDisconnect()
	{
		pageRenderer.changePage('lobbyPage');
		setTimeout(() => {
			CN.new("Game", "Opponent disconnect", CN.defaultIcon.error);
		}, 1000);
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
	player.update();
	opponent.update();
	ball.update();
	map.update(ball);
	renderer.render(scene, player.camera);
}

export { MultiOnlineGamePage, opponent, ball };

/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   multiOnlineGamePage.js                             :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: edbernar <edbernar@student.42angouleme.    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/08/18 00:53:53 by edbernar          #+#    #+#             */
/*   Updated: 2024/09/29 01:35:50 by edbernar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { availableSkins } from '/static/javascript/lobbyPage/3d.js';
import * as THREE from '/static/javascript/three/build/three.module.js'
import { OrbitControls } from '/static/javascript/three/examples/jsm/Addons.js';
import { sendRequest } from "/static/javascript/websocket.js";
import { Player } from '/static/javascript/multiOnlineGame/Player.js'
import { Map } from '/static/javascript/multiOnlineGame/Map.js'
import { Ball } from '/static/javascript/multiOnlineGame/Ball.js'
import { pageRenderer, isMobile } from '/static/javascript/main.js'
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

	- l : recreate et augmente le score de player
	- k : recreate et augmente le score de opponent
*/

const	scoreMax		= 5;

let scene				= null;
let map					= null;
let ball				= null;
let renderer			= null;
let player				= null;
let spotLight			= null;
let ambiantLight		= null;
let opponent			= null;
let	interval			= null;
let	intervalPing		= null;
let debug				= false;
let	lastPingTime		= 0;
let	lastFpsTime			= 0;
let lastFpsDisplayed	= 0;

// ------------------- (need to be remove) -------------------- //
const cameraTmp = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight);
let controls = null;
// ------------------------------------------------------------ //

class MultiOnlineGamePage
{
	static create(skin)
	{
		if (!skin)
			skin = {player: 0, opponent: 0};
		const bar1		= createBarPlayer(availableSkins[skin.player]);
		const bar2		= createBarPlayer(availableSkins[skin.opponent]);

		console.log(document.body.getAttribute('style'));
		document.body.setAttribute('style', '');
		scene					= new THREE.Scene()
		map						= new Map(scene, 13, false);
		renderer				= new THREE.WebGLRenderer({antialias: true});
		renderer.shadowMap.enabled = true;
		renderer.shadowMap.type = THREE.PCFSoftShadowMap;
		renderer.domElement.style.animation = 'fadeOutStartGames 1s';
		renderer.domElement.style.filter = 'brightness(1)';
		opponent				= new Opponent(bar2, map, Math.floor(Math.random() * 100 % 6));
		player					= new Player(bar1, map, opponent, Math.floor(Math.random() * 100 % 6));
		spotLight				= new THREE.SpotLight(0xffffff, 10000, 0, 0.2);
		spotLight.castShadow	= true;
		ambiantLight			= new THREE.AmbientLight(0xffffff, 0.5);
		ball					= new Ball(scene, map);

		window.addEventListener('resize', windowUpdater);
		scene.add(player.object);
		scene.add(opponent.object);
		scene.add(ambiantLight);
		spotLight.position.set(0, 100, 0);
		scene.add(spotLight);
		scene.background = new THREE.Color(0x1a1a1a);
		renderer.setSize(window.innerWidth, window.innerHeight);
		document.body.appendChild(renderer.domElement);
		renderer.domElement.setAttribute('id', 'canvasMultiGameOnline');
		map.ballObject = ball.object;
		if (isMobile)
			player.mobileMode();

		//////////////////////////
		controls = new OrbitControls(cameraTmp, renderer.domElement)
		cameraTmp.position.set(5, 3, 5);
		controls.target = new THREE.Vector3(map.centerPos.x, 0, map.centerPos.z);
		//////////////////////////

		document.addEventListener('keypress', (e) => {
			if (e.key == 'g')
			{
				player.pointAnimation(map);
				map.animationGoal(ball.object.position.x, ball.object.position.y, ball.object.position.z, player.playerGoalAnimation);
				console.log('player.playerGoalAnimation', player.playerGoalAnimation);
			}
			if (e.key == 'h')
			{
				player.pointOpponentAnimation(map, opponent.object);
				map.animationGoal(ball.object.position.x, ball.object.position.y, ball.object.position.z, opponent.playerGoalAnimation);
				console.log('player.playerGoalAnimation', opponent.playerGoalAnimation);
			}
			if (e.key == 'c')
				debug = !debug;
			if (e.key == 'p')
				map.putVideoOnCanvas(0, null);
			if (e.key == 'o')
			{
				map.putVideoOnCanvas(3, 'goal');
			}
			if (e.key == 'i')
				map.putVideoOnCanvas(3, 'outstanding');
			if (e.key == 'u')
				map.putVideoOnCanvas(3, 3);
			if (e.key == 'y')
				map.putVideoOnCanvas(2, 3);
			if (e.key == 't')
				map.putVideoOnCanvas(1, 3);
			if (e.key == 'l')
				map.reCreate("player");
			if (e.key == 'k')
				map.reCreate("opponent");
		})

		renderer.setAnimationLoop(loop)
		sendRequest('game', {action: 1});
		
		let lastPosition = player.object.position.x;
		let lastUp = player.isUp;
		interval = setInterval(() => {
			if (player && player.object.position.x != lastPosition || player.isUp != lastUp)
			{
				lastPosition = player.object.position.x;
				lastUp = player.isUp;
				sendRequest('game', {action: 3, pos: player.object.position.x, up: player.isUp});
			}
		}, 1000 / 20);
		intervalPing = setInterval(() => {
			if (!lastPingTime)
			{
				sendRequest('game', {action: 4});
				lastPingTime = Date.now();
			}
		}, 800);
	}

	static dispose()
	{
		window.addEventListener('resize', windowUpdater);
		if (interval)
			clearInterval(interval);
		interval = null;
		if (intervalPing)
			clearInterval(intervalPing);
		intervalPing = null;
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
	}

	static ping()
	{
		const	text	=	document.getElementById('ping');
		const	ping	=	Date.now() - lastPingTime;

		if (ping < 90)
			text.style.color = 'white';
		else if (ping >= 90 && ping < 150)
			text.style.color = 'orange';
		else
			text.style.color = 'red';
		text.innerText = ping + ' ms';
		lastPingTime = null;
	}

	static endGame(win)
	{
		const	endGameDiv	=	document.getElementById('endGameDiv');
		const	scoreText	=	document.getElementById('endGameScore');
		const	simpleText	=	document.getElementById('endGameSimpleText');
		let		intervalEnd	=	null;
		let		time		=	4;

		endGameScore.innerText = `${map.score.player} - ${map.score.opponent}`;
		if (win)
			endGameText.innerText = "You win !"
		endGameDiv.style.display = 'flex';
		intervalEnd = setInterval(() => {
			simpleText.innerText = `You will be redirected to the lobby in ${time} seconds`
			time--;
			if (time == -1)
			{
				clearInterval(intervalEnd);
				setTimeout(() => pageRenderer.changePage('lobbyPage'), 500);
			}
		}, 1000);
	}
}

function createBarPlayer(skin)
{
	const	geometry	= new THREE.BoxGeometry(1, 0.1, 0.1);
	let		material	= null;

	if (skin.color)
		material = new THREE.MeshPhysicalMaterial({color: skin.color});
	else
		material = new THREE.MeshPhysicalMaterial({map: new THREE.TextureLoader().load(skin.texture)});
	const mesh		= new THREE.Mesh(geometry, material);

	mesh.castShadow = true;
	return (mesh);
}

function windowUpdater()
{
	renderer.setSize(window.innerWidth, window.innerHeight);
	player.camera.aspect = window.innerWidth / window.innerHeight;
	player.camera.updateProjectionMatrix();
};

function loop()
{
	showFps();
	player.update();
	opponent.update();
	ball.update();
	map.update(ball);
	if (debug)
	{
		controls.update();
		renderer.render(scene, cameraTmp);
	}
	else
		renderer.render(scene, player.camera);
}

let	lastFpsArr = [10, 3, 5];

function showFps()
{
	const	fps		=	document.getElementById('fps')
	const	now		=	Date.now();

	if (now > lastFpsDisplayed + 800)
	{
		fps.innerText = Math.round(lastFpsArr.reduce((a, b) => a + b, 0) / lastFpsArr.length) + ' fps';
		lastFpsDisplayed = now;
		lastFpsArr = [];
	}
	else
		lastFpsArr.push(Math.floor(1000 / (now - lastFpsTime)));
	lastFpsTime = now;
}

export { MultiOnlineGamePage, player, opponent, ball, map};
/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   multiOnlineGamePage.js                             :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: edbernar <edbernar@student.42angouleme.    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/08/18 00:53:53 by edbernar          #+#    #+#             */
/*   Updated: 2024/11/15 17:07:44 by edbernar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { OrbitControls } from '/static/javascript/three/examples/jsm/controls/OrbitControls.js'
import { availableSkins, lastSelectedGoal } from '/static/javascript/lobbyPage/3d.js';
import { VRButton } from "/static/javascript/three/examples/jsm/webxr/VRButton.js"
import { Opponent } from '/static/javascript/multiOnlineGame/Opponent.js'
import * as THREE from '/static/javascript/three/build/three.module.js'
import { Player } from '/static/javascript/multiOnlineGame/Player.js'
import { pageRenderer, isMobile, isOnChrome } from '/static/javascript/main.js'
import { Ball } from '/static/javascript/multiOnlineGame/Ball.js'
import { Map } from '/static/javascript/multiOnlineGame/Map.js'
import { sendRequest } from "/static/javascript/websocket.js";
import { files } from '/static/javascript/filesLoader.js';

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

let 	scene				= null;
let 	map					= null;
let 	ball				= null;
let		renderer			= null;
let		player				= null;
let		spotLight			= null;
let 	ambiantLight		= null;
let 	opponent			= null;
let		interval			= null;
let		intervalPing		= null;
let 	debug				= false;
let		lastPingTime		= 0;
let		lastFpsTime			= 0;
let 	lastFpsDisplayed	= 0;
let		lastFpsArr			= [60];
let		VrButton			= null;
let		isInVrMode			= false;

const	observer = new MutationObserver((mutationsList) => {
	mutationsList.forEach((mutation) => {
		if (VrButton.innerText == 'VR NOT SUPPORTED')
			document.getElementById('newButtonVr').style.display = 'none';
		if (mutation.attributeName === 'style')
			VrButton.style.display = 'none';
	});
});

// ------------------- (need to be remove) -------------------- //
const cameraTmp = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight);
let controls = null;
// ------------------------------------------------------------ //

class MultiOnlineGamePage
{
	static create(skin)
	{
		if (!skin)
		{
			skin = {player: 4, opponent: 0};
			availableSkins[4].texture = files.skinOneTexture;
			availableSkins[5].texture = files.skinTwoTexture;
			availableSkins[6].texture = files.skinThreeTexture;
			availableSkins[7].texture = files.skinFourTexture;
		}
		const bar1		= createBarPlayer(availableSkins[skin.player]);
		const bar2		= createBarPlayer(availableSkins[skin.opponent]);

		document.body.setAttribute('style', '');
		scene					= new THREE.Scene()
		map						= new Map(scene, 13, false, skin.pfp, skin.pfpOpponent);
		renderer				= new THREE.WebGLRenderer({antialias: true});
		renderer.shadowMap.enabled = true;
		renderer.shadowMap.type = THREE.PCFSoftShadowMap;
		renderer.domElement.style.animation = 'fadeOutStartGames 1s';
		renderer.domElement.style.filter = 'brightness(1)';
		
		vrMode();
		opponent				= new Opponent(bar2, map, Math.floor(Math.random() * 100 % 6));
		player					= new Player(bar1, map, opponent, Math.floor(Math.random() * 100 % 6), skin.opponentGoaldId);
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
		})

		renderer.setAnimationLoop(loop)
		sendRequest('game', {action: 1});
		if (!isMobile && isOnChrome)
			map.putVideoOnCanvas(2, 3);
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
		const session = renderer.xr.getSession();

		if (session)
			session.end();
		observer.disconnect();
		map.putVideoOnCanvas(0, null);
		VrButton = null;
		window.removeEventListener('resize', windowUpdater);
		if (interval)
			clearInterval(interval);
		interval = null;
		if (intervalPing)
			clearInterval(intervalPing);
		lastPingTime = 0;
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
				if (child.material && child.material.dispose)
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

	static endGame(content)
	{
		const	endGameDiv		=	document.getElementById('endGameDiv');
		const	scoreText		=	document.getElementById('endGameText');
		const	endGameScore	=	document.getElementById('endGameScore');
		const	simpleText		=	document.getElementById('endGameSimpleText');
		let		intervalEnd		=	null;
		let		time			=	4;

		if (renderer && renderer.xr && renderer.xr.getSession())
			renderer.xr.getSession().end();
		if (!map)
			return ;
		if (map && map.score)
			endGameScore.innerText = `${map.score.player} - ${map.score.opponent}`;
		if (content.won)
			scoreText.innerText = "You won !"
		endGameDiv.style.display = 'flex';
		intervalEnd = setInterval(() => {
			if (content.opponentLeft)
				simpleText.innerText = `Your opponent has given up...\nYou will be redirected to the ` + (content.tournamentCode ?  "tournament" : "lobby") + ` in ${time} seconds`
			else
				simpleText.innerText = `You will be redirected to the ` + (content.tournamentCode ?  "tournament" : "lobby") + ` in ${time} seconds`
			time--;
			if (time == -1)
			{
				clearInterval(intervalEnd);
				if (content.tournamentCode)
					setTimeout(() => pageRenderer.changePage('tournamentPage', false, content.tournamentCode), 500);
				else
					setTimeout(() => pageRenderer.changePage('lobbyPage'), 500);
			}
		}, 1000);
	}
}

function createBarPlayer(skin)
{
	const	geometry		= new THREE.BoxGeometry(1, 0.1, 0.1);
	let		material		= null;

	if (skin.color)
		material = new THREE.MeshPhysicalMaterial({color: skin.color});
	else
	{
		if (typeof skin.texture !== 'object')
			material = new THREE.MeshPhysicalMaterial({map: new THREE.TextureLoader().load(skin.texture)});
		else
		{
			material = [
				new THREE.MeshPhysicalMaterial({map: new THREE.TextureLoader().load(skin.texture.left)}),
				new THREE.MeshPhysicalMaterial({map: new THREE.TextureLoader().load(skin.texture.right)}),
				new THREE.MeshPhysicalMaterial({map: new THREE.TextureLoader().load(skin.texture.top)}),
				new THREE.MeshPhysicalMaterial({map: new THREE.TextureLoader().load(skin.texture.bottom)}),
				new THREE.MeshPhysicalMaterial({map: new THREE.TextureLoader().load(skin.texture.front)}),
				new THREE.MeshPhysicalMaterial({map: new THREE.TextureLoader().load(skin.texture.back)}),
			]
		}
	}
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

function vrMode()
{
	const	supportsXR	=	'xr' in window.navigator;
	const	newButton	=	configButton();

	if (!supportsXR)
		return ;
	renderer.xr.enabled = true;
	document.body.appendChild( VRButton.createButton(renderer) );
	VrButton = document.getElementById('VRButton');
	observer.observe(VrButton, { attributes: true });
	if (VrButton.innerText !== 'VR NOT SUPPORTED')
		document.body.append(newButton);
}

function configButton()
{
	const	newButton = document.createElement('button');
	const	cameraGroup	=	new THREE.Group();

	cameraGroup.name = "vrHeadset";
	newButton.innerText = "Vr mode";
	newButton.setAttribute('id', 'newButtonVr');
	newButton.addEventListener('click', () => {
		VrButton.click();
		scene.add(cameraGroup);
		scene.remove(player.camera);
		player.configureVrController();
		cameraGroup.add(player.camera);
		cameraGroup.position.set(0, 0.5, 7.5);
		isInVrMode = true;
	});
	return (newButton);
}


export { MultiOnlineGamePage, player, opponent, ball, map, scene, renderer, isInVrMode, createBarPlayer };
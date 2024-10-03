/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Player.js                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: edbernar <edbernar@student.42angouleme.    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/08/18 00:30:31 by edbernar          #+#    #+#             */
/*   Updated: 2024/10/03 14:48:51 by edbernar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import * as THREE from '/static/javascript/three/build/three.module.js'
import { layoutSelected } from '/static/javascript/lobbyPage/main.js'
import { lastSelectedGoal, availableGoals } from '/static/javascript/lobbyPage/3d.js';

/*
	Explication du code :
		- Un seul joueur peut etre instancié, sinon ça throw une erreur
		- Lorsqu'une touche est pressée, celle-ci sera ajoutée à la variable "pressedButton"
		  Exemple : w et a sont pressées -> pressedButton =  ['w', 'a']
		- Les lignes avec cleanup sont l'êquivalent d'un destructeur en CPP
		- Pour appliquer des actions sur les touches, il suffit de faire ça dans la fonction
		  update en regardant si la touche voulue est dans la variable "pressedButton"
		- Par défaut, la caméra est accrochée, si on veut qu'elle ne bouge plus, il faut
		  modifier "cameraFixed" à true (se fait avec la touche 'm' en jeu)
		- Si on utilise une touche qui ne sera utilisée que pour un appui simple, il faudra la
		  mettre dans 'addEventListerner('keypress') et pas dans update() pour eviter les
		  problèmes de touche non détecté
		- La variable "limits" sert à délimiter les mouvements de la barre
*/

/*
	Todo (Eddy) :
		- Ajouter une camera sur l'object (OK)
		- Faire une fonction pour changer le mode de la camera (fix ou accrochée) (OK)
		- Ajouter une rotation quand la caméra est fixe (OK)
		- Corriger bug quand changement de caméra (camera qui se remet au dessus
		  quand on repasse au dessus alors qu'elle devrait être en dessous vu que la
		  barre est en haut). Mais peut etre faire ça quand la barre aura des mouvements
		  définis sur la hauteur. (OK)
		- Ajouter les mouvements définis sur l'axe y (OK)
		- Faire une fonction qui change de camera quand il y a un but avec un fondu en noir (OK)
		- Ajouter un zoom sur la camera de la fonction pointAnimation (OK)
		- Ajouter une fonction pour l'animation de point marqué (OK)
*/

let	playerExist			= false;
let	isOnPointAnim		= false;
let	pressedButton		= [];
let mapLength			= 0;
const goalAnimation		= ["triangle", "cylinder", "star", "box", "rectangle", "ring"];
let	key					= null;

class Player
{
	isUp				= false;
	object				= null;
	camera				= null;
	speed				= 4;
	cameraFixed			= false;
	interval			= null;
	limits				= {};
	previousTime		= Date.now();	
	deltaTime			= 1;
	mapVar				= null;
	opponent			= null;
	playerGoalAnimation = null;
	opponentGoal		= null;
	
	constructor (object, map, opponent, indexGoalAnimation, goalIdOppenent)
	{
		this.mapVar = map;
		this.opponent = opponent;
		if (playerExist)
			throw Error("Player is already init.");
		playerExist = true;
		isOnPointAnim = false;
		pressedButton = [];
		console.log(layoutSelected);
		key			= {up: layoutSelected.US ? "w" : "z", down: "s", left: layoutSelected.US ? "a" : "q", right: "d"};
		console.warn("Remettre opponentGoal = availableGoals[goalIdOppenent] qaund le serveur le permettra");
		this.opponentGoal = availableGoals[0];
		// opponentGoal = availableGoals[goalIdOppenent];
		this.object = object;
		this.limits = map.playerLimits;
		this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 10000);
		this.object.position.set(0, this.limits.down, map.mapLength / 2 - 0.2);
		this.playerGoalAnimation = goalAnimation[indexGoalAnimation];
		mapLength = map.mapLength;
		this.setCameraPosition(
			this.object.position.x,
			this.object.position.y + 0.7,
			this.object.position.z + 1.5
		);
		document.addEventListener('keydown', addKeyInArr);
		document.addEventListener('keyup', remKeyInArr);
		document.addEventListener('keypress', simplePressKey);
	}

	mobileMode()
	{
		showGamePad();
	}

	dispose()
	{
		playerExist = false;
		isOnPointAnim = false;
		document.removeEventListener('keydown', addKeyInArr);
		document.removeEventListener('keyup', remKeyInArr);
		document.removeEventListener('keypress', simplePressKey);
		pressedButton = [];
		if (this.interval)
			clearInterval(this.interval);
		key = null;
	}

	reserCameraPlayer()
	{
		this.setCameraPosition(
			this.object.position.x,
			this.object.position.y + 0.7,
			this.object.position.z + 1.5
		);
	}

	resetScaleplayers()
	{
		this.object.scale.set(1, 1, 1);
		if (this.opponent)
			this.opponent.object.scale.set(1, 1, 1);
	}

	makeAnimation(isOpponent)
	{
		this.mapVar.putVideoOnCanvas(3, 'goal');
		setTimeout(() => {
			this.mapVar.putVideoOnCanvas(0, null);
		}, 4000);
		if (isOpponent)
		{
			this.mapVar.reCreate("opponent");
			this.pointOpponentAnimation(this.mapVar, this.opponent.object);
		}
		else
		{
			this.mapVar.reCreate("player");
			this.pointAnimation(this.mapVar);
		}
	}

	pointAnimation(map)
	{
		const	canvasIndex = document.getElementsByTagName('canvas').length - 1;
		const	tmpCamera	= new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 10000);
		const	tmp			= this.camera;
		let		interval	= null;
		const	startColor	= this.object.material.color.clone();
		let		hue			= 0;

		document.getElementsByTagName('canvas')[canvasIndex].style.animation = null;
		document.getElementsByTagName('canvas')[canvasIndex].style.animation = 'fadeInGames 0.199s';
		document.getElementsByTagName('canvas')[canvasIndex].style.filter = 'brightness(0)';

		setTimeout(() => {
			document.getElementsByTagName('canvas')[canvasIndex].style.animation = null;
			document.getElementsByTagName('canvas')[canvasIndex].style.animation = 'fadeOutGames 0.199s';
			document.getElementsByTagName('canvas')[canvasIndex].style.filter = 'brightness(1)';
		}, 300)

		setTimeout(() => {

			tmpCamera.position.set(this.limits.left, this.limits.up / 2 + 0.5, map.centerPos.z);
			isOnPointAnim = true;
			this.camera = tmpCamera;
			interval = setInterval(() => {
				tmpCamera.lookAt(this.object.position);
				hue += 0.01;
				if (hue > 1)
					hue = 0;
				this.object.material.color.setHSL(hue, 1, 0.5);
				tmpCamera.fov -= 0.05;
				tmpCamera.updateProjectionMatrix();
			}, 10);

			setTimeout(() => {
				console.log("Player : " + lastSelectedGoal);
				map.animationGoal(this.object.position.x, this.object.position.y, this.object.position.z, this.playerGoalAnimation, lastSelectedGoal ? lastSelectedGoal : availableGoals[0]);
			}, 1000);

			setTimeout(() => {
				clearInterval(interval);
				document.getElementsByTagName('canvas')[canvasIndex].style.animation = null;
				document.getElementsByTagName('canvas')[canvasIndex].style.animation = 'fadeInGames 0.99s';
				document.getElementsByTagName('canvas')[canvasIndex].style.filter = 'brightness(0)';

				setTimeout(() => {
					this.camera = tmp;
					this.object.material.color.copy(startColor);
					isOnPointAnim = false;
					if (!this.cameraFixed)
					{
						this.setCameraPosition(
							this.object.position.x,
							this.object.position.y - (this.object.position.y >= this.limits.up ? 0.7 : -0.7),
							this.object.position.z + 1.5
						);
					}
					document.getElementsByTagName('canvas')[canvasIndex].style.animation = null;
					document.getElementsByTagName('canvas')[canvasIndex].style.animation = 'fadeOutGames 0.99s';
					document.getElementsByTagName('canvas')[canvasIndex].style.filter = 'brightness(1)';
				}, 400);
			}, 4000);
		}, 200)
	}

	pointOpponentAnimation(map, oppponentObject)
	{
		const	canvasIndex = document.getElementsByTagName('canvas').length - 1;
		const	tmpCamera	= new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 10000);
		const	tmp			= this.camera;
		let		interval	= null;
		const	startColor	= oppponentObject.material.color.clone();
		let		hue			= 0;

		document.getElementsByTagName('canvas')[canvasIndex].style.animation = null;
		document.getElementsByTagName('canvas')[canvasIndex].style.animation = 'fadeInGames 0.199s';
		document.getElementsByTagName('canvas')[canvasIndex].style.filter = 'brightness(0)';
		
		setTimeout(() => {
			document.getElementsByTagName('canvas')[canvasIndex].style.animation = null;
			document.getElementsByTagName('canvas')[canvasIndex].style.animation = 'fadeOut 0.199s';
			document.getElementsByTagName('canvas')[canvasIndex].style.filter = 'brightness(1)';
		}, 300)
		setTimeout(() => {
			tmpCamera.position.set(this.limits.left, this.limits.up / 2 + 0.5, map.centerPos.z);
			isOnPointAnim = true;
			this.camera = tmpCamera;
			interval = setInterval(() => {
				tmpCamera.lookAt(oppponentObject.position);
				hue += 0.01;
				if (hue > 1)
					hue = 0;
				oppponentObject.material.color.setHSL(hue, 1, 0.5);
				tmpCamera.fov -= 0.05;
				tmpCamera.updateProjectionMatrix();
			}, 10);

			console.log("Oppenent : " + this.opponentGoal);
			setTimeout(() => {
				map.animationGoal(this.opponent.object.position.x, this.opponent.object.position.y, this.opponent.object.position.z, this.opponent.playerGoalAnimation, this.opponentGoal);
			}, 1000);
			
			setTimeout(() => {
				clearInterval(interval);
				document.getElementsByTagName('canvas')[canvasIndex].style.animation = null;
				document.getElementsByTagName('canvas')[canvasIndex].style.animation = 'fadeInGames 0.99s';
				document.getElementsByTagName('canvas')[canvasIndex].style.filter = 'brightness(0)';
				
				setTimeout(() => {
					this.camera = tmp;
					oppponentObject.material.color.copy(startColor);
					isOnPointAnim = false;
					if (!this.cameraFixed)
					{
						this.setCameraPosition(
							this.object.position.x,
							this.object.position.y - (this.object.position.y >= this.limits.up ? 0.7 : -0.7),
							this.object.position.z + 1.5
						);
					}
					document.getElementsByTagName('canvas')[canvasIndex].style.animation = null;
					document.getElementsByTagName('canvas')[canvasIndex].style.animation = 'fadeOutGames 0.99s';
					document.getElementsByTagName('canvas')[canvasIndex].style.filter = 'brightness(1)';
				}, 400);
			}, 4000);
		}, 200)
	}

	update()
	{
		const currentTime = Date.now();
		this.deltaTime = (currentTime - this.previousTime) / 1000;
		this.previousTime = currentTime;
		
		let i;

		i = 0;
		while (i < pressedButton.length)
		{
			if (pressedButton[i] == key.up && this.object.position.y < this.limits.up)
			{
				this.isUp = true;
				if (this.interval)
					clearInterval(this.interval);
				this.interval = setInterval(() => {
					this.object.position.y += this.speed / 40;
					if (!this.cameraFixed && !isOnPointAnim)
						this.camera.position.y += (this.speed / 80);
					if (this.object.position.y >= this.limits.up)
					{
						clearInterval(this.interval);
						this.interval = null;
					}
				}, 5);
			}
			if (pressedButton[i] == key.down && this.object.position.y > this.limits.down)
			{
				this.isUp = false;
				if (this.interval)
					clearInterval(this.interval);
				this.interval = setInterval(() => {
					this.object.position.y -= this.speed / 40;
					if (!this.cameraFixed && !isOnPointAnim)
						this.camera.position.y -= (this.speed / 80);
					if (this.object.position.y <= this.limits.down)
					{
						clearInterval(this.interval);
						this.interval = null;
						this.object.position.y = this.limits.down;
					}
				}, 5);
			}
			if (pressedButton[i] == key.right && this.object.position.x < this.limits.right)
			{
				this.object.position.x += this.speed * this.deltaTime;
				if (!this.cameraFixed && !isOnPointAnim)
					this.camera.position.x += this.speed * this.deltaTime;
			}
			if (pressedButton[i] == key.left && this.object.position.x > this.limits.left)
			{
				this.object.position.x -= this.speed * this.deltaTime;
				if (!this.cameraFixed && !isOnPointAnim)
					this.camera.position.x -= this.speed * this.deltaTime;
			}
			i++;
		}
	}

	setCameraPosition(x, y, z)
	{
		this.camera.position.set(x, y, z);
	}

	scalePlayer(isOpponent)
	{
		let object;
		if (isOpponent)
			object = this.opponent.object;
		else
			object = this.object;

		const value = 0.004;

		for (let i = 1; i < 10; i++)
		{
			setTimeout(() => {
				object.scale.z += value;
				object.scale.x += value * 2;
			}, i * 10);
		}

		for (let i = 10; i < 20; i++)
		{
			setTimeout(() => {
				object.scale.z -= value;
				object.scale.x -= value * 2;
			}, i * 10);
		}
	}
};

function addKeyInArr(e)
{
	const	key	= e.key.toLowerCase();
	let		i;

	i = 0;
	while (i < pressedButton.length && key != pressedButton[i])
		i++;
	if (i == pressedButton.length)
		pressedButton.push(e.key.toLowerCase());
}

function remKeyInArr(e)
{
	const	key	= e.key.toLowerCase();
	let		i;

	i = 0;
	while (i < pressedButton.length && key != pressedButton[i])
		i++;
	if (i != pressedButton.length)
		pressedButton.splice(i, 1);
}

function simplePressKey(e)
{
	if (e.key == 'm' && !isOnPointAnim)
	{
		this.cameraFixed = !this.cameraFixed;
		if (!this.cameraFixed)
		{
			this.setCameraPosition(
				this.object.position.x,
				this.object.position.y - (this.object.position.y >= this.limits.up ? 0.7 : -0.7),
				this.object.position.z + 1.5
			);
			this.camera.rotation.set(0, 0, 0);
		}
		else
			this.setCameraPosition(0, 1.5, this.object.position.z + 3);
	}				
}

function goFullscreen()
{
	const	elem	= document.documentElement;

	if (elem.requestFullscreen)
		elem.requestFullscreen();
	else if (elem.mozRequestFullScreen)
		elem.mozRequestFullScreen();
	else if (elem.webkitRequestFullscreen)
		elem.webkitRequestFullscreen();
	else if (elem.msRequestFullscreen)
		elem.msRequestFullscreen();
}

function showGamePad()
{
	const	gamePad		=	document.getElementsByClassName('gamePad')[0];
	const	canvas		=	document.getElementById('canvasMultiGameOnline');
	const	keyList		=	['padLeft', 'padRight', 'padTop', 'padBottom']
	const	keyAction	=	[key.left, key.right, key.up, key.down];

	canvas.addEventListener('touchstart', function(e) {
		e.preventDefault();
	});
	canvas.addEventListener('mousedown', function(e) {
		e.preventDefault();
	});
	document.getElementById('fullscreen').addEventListener('click', () => {
		goFullscreen();
	});
	gamePad.style.display = 'flex';
	document.addEventListener('touchstart', (event) => {
		const	key			=	event.target.getAttribute("id");
		

		for (let i = 0; i < keyList.length; i++)
		{
			if (keyList[i] == key)
				addKeyInArr({key: keyAction[i]})
		}
	});
	document.addEventListener('touchend', (event) => {
		const	key	=	event.target.getAttribute("id");

		for (let i = 0; i < keyList.length; i++)
		{
			if (keyList[i] == key)
				remKeyInArr({key: keyAction[i]})
		}
	});
}

export { Player, playerExist, goalAnimation};

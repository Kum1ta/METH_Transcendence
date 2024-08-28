/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Player.js                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: edbernar <edbernar@student.42angouleme.    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/08/18 00:30:31 by edbernar          #+#    #+#             */
/*   Updated: 2024/08/28 11:38:45 by edbernar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import * as THREE from 'three';
// import * as THREE from '/static/javascript/three/build/three.module.js';

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

class Player
{
	object			= null;
	camera			= null;
	speed			= 4;
	cameraFixed		= false;
	interval		= null;
	limits			= {};
	previousTime	= Date.now();	
	deltaTime		= 1;

	constructor (object, map)
	{
		if (playerExist)
			throw Error("Player is already init.");
		playerExist = true;
		isOnPointAnim = false;
		pressedButton = [];
		this.object = object;
		this.limits = map.playerLimits;
		this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 10000);
		this.object.position.set(0, this.limits.down, map.mapLength / 2 - 0.2);
		this.setCameraPosition(
			this.object.position.x,
			this.object.position.y + 0.7,
			this.object.position.z + 1.5
		);
		document.addEventListener('keydown', addKeyInArr);
		document.addEventListener('keyup', remKeyInArr);
		document.addEventListener('keypress', simplePressKey);
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
			clearInterval(interval);
	}

	pointAnimation(map)
	{
		const	tmpCamera	= new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 10000);
		const	tmp			= this.camera;
		let		interval	= null;
		const	startColor	= this.object.material.color.clone();
		let		hue			= 0;

		document.getElementsByTagName('canvas')[0].style.animation = 'fadeIn 0.199s';
		document.getElementsByTagName('canvas')[0].style.filter = 'brightness(0)';
		setTimeout(() => {
			document.getElementsByTagName('canvas')[0].style.animation = 'fadeOut 0.199s';
			document.getElementsByTagName('canvas')[0].style.filter = 'brightness(1)';
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
				clearInterval(interval);
				document.getElementsByTagName('canvas')[0].style.animation = null;
				document.getElementsByTagName('canvas')[0].style.animation = 'fadeIn 0.19s';
				document.getElementsByTagName('canvas')[0].style.filter = 'brightness(0)';
				setTimeout(() => {
					this.camera = tmp;
					this.object.material.color.copy(startColor);
					isOnPointAnim = false;
					if (!this.cameraFixed)
					{
						this.setCameraPosition(
							this.object.position.x,
							this.object.position.y - (this.object.position.y >= this.limits.up ? 0.7 : -0.7),
							this.object.position.z + 2
						);
					}
					document.getElementsByTagName('canvas')[0].style.animation = 'fadeOut 0.199s';
					document.getElementsByTagName('canvas')[0].style.filter = 'brightness(1)';
				}, 200);
			}, 4000);
		}, 200)
	}

	pointOpponentAnimation(map, oppponentObject)
	{
		const	tmpCamera	= new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 10000);
		const	tmp			= this.camera;
		let		interval	= null;
		const	startColor	= oppponentObject.material.color.clone();
		let		hue			= 0;

		document.getElementsByTagName('canvas')[0].style.animation = 'fadeIn 0.199s';
		document.getElementsByTagName('canvas')[0].style.filter = 'brightness(0)';
		setTimeout(() => {
			document.getElementsByTagName('canvas')[0].style.animation = 'fadeOut 0.199s';
			document.getElementsByTagName('canvas')[0].style.filter = 'brightness(1)';
		}, 300)
		setTimeout(() => {
			tmpCamera.position.set(this.limits.left, this.limits.up / 2 + 0.5, map.centerPos.z);
			isOnPointAnim = true;
			this.camera = tmpCamera;
			interval = setInterval(() => {
				tmpCamera.lookAt(oppponentObject.position);
				console.log(tmpCamera.position)
				hue += 0.01;
				if (hue > 1)
					hue = 0;
				oppponentObject.material.color.setHSL(hue, 1, 0.5);
				tmpCamera.fov -= 0.05;
				tmpCamera.updateProjectionMatrix();
			}, 10);
			setTimeout(() => {
				clearInterval(interval);
				document.getElementsByTagName('canvas')[0].style.animation = null;
				document.getElementsByTagName('canvas')[0].style.animation = 'fadeIn 0.19s';
				document.getElementsByTagName('canvas')[0].style.filter = 'brightness(0)';
				setTimeout(() => {
					this.camera = tmp;
					oppponentObject.material.color.copy(startColor);
					isOnPointAnim = false;
					if (!this.cameraFixed)
					{
						this.setCameraPosition(
							this.object.position.x,
							this.object.position.y - (this.object.position.y >= this.limits.up ? 0.7 : -0.7),
							this.object.position.z + 2
						);
					}
					document.getElementsByTagName('canvas')[0].style.animation = 'fadeOut 0.199s';
					document.getElementsByTagName('canvas')[0].style.filter = 'brightness(1)';
				}, 200);
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
			if (pressedButton[i] == 'w' && this.object.position.y < this.limits.up)
			{
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
			if (pressedButton[i] == 's' && this.object.position.y > this.limits.down)
			{
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
			if (pressedButton[i] == 'd' && this.object.position.x < this.limits.right)
			{
				this.object.position.x += this.speed * this.deltaTime;
				if (!this.cameraFixed && !isOnPointAnim)
					this.camera.position.x += this.speed * this.deltaTime;
			}
			if (pressedButton[i] == 'a' && this.object.position.x > this.limits.left)
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
};

function addKeyInArr(e)
{
	let i;

	i = 0;
	while (i < pressedButton.length && e.key != pressedButton[i])
		i++;
	if (i == pressedButton.length)
		pressedButton.push(e.key);
}

function remKeyInArr(e)
{
	let i;

	i = 0;
	while (i < pressedButton.length && e.key != pressedButton[i])
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

export { Player, playerExist };
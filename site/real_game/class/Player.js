/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Player.js                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: edbernar <edbernar@student.42angouleme.    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/08/18 00:30:31 by edbernar          #+#    #+#             */
/*   Updated: 2024/08/20 17:01:01 by edbernar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import * as THREE from 'three';

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
	Information :
		- La map devra faire maximum 8 largueur car ça pose des problèmes avec la caméra fixe


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
*/

let playerExist = false;
const limits = {
	up : 3,
	down: 0.2,
	left: -3,
	right: 3,
}

class Player
{
	pressedButton	= [];
	object			= null;
	camera			= null;
	speed			= 0.1;
	cameraFixed		= false;
	interval		= null;
	isOnPointAnim	= false;

	constructor (object)
	{
		if (playerExist)
			throw Error("Player is already init.");
		playerExist = true;
		this.object = object;
		this.camera = new THREE.PerspectiveCamera(80, window.innerWidth / window.innerHeight, 0.1, 10000);
		this.setCameraPosition(
			this.object.position.x,
			this.object.position.y + 0.7,
			this.object.position.z + 1
		);
		this.cleanup = new FinalizationRegistry((heldValue) => {
			playerExist = false;
		})
		this.cleanup.register(this, null);

		document.addEventListener('keydown', (e) => {
			let i;

			i = 0;
			while (i < this.pressedButton.length && e.key != this.pressedButton[i])
				i++;
			if (i == this.pressedButton.length)
				this.pressedButton.push(e.key);
		});

		document.addEventListener('keyup', (e) => {
			let i;

			i = 0;
			while (i < this.pressedButton.length && e.key != this.pressedButton[i])
				i++;
			if (i != this.pressedButton.length)
				this.pressedButton.splice(i, 1);
		});

		document.addEventListener('keypress', (e) => {
			if (e.key == 'm' && !this.isOnPointAnim)
			{
				this.cameraFixed = !this.cameraFixed;
				if (!this.cameraFixed)
				{
					this.setCameraPosition(
						this.object.position.x,
						this.object.position.y - (this.object.position.y >= limits.up ? 0.7 : -0.7),
						this.object.position.z + 1
					);
					this.camera.rotation.set(0, 0, 0);
				}
				else
					this.setCameraPosition(0, 1.5, 2.6);
			}				
		});
	}

	pointAnimation(scene)
	{
		const	tmpCamera	= new THREE.PerspectiveCamera(80, window.innerWidth / window.innerHeight, 0.1, 10000);
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
			tmpCamera.position.set(-3, 3, -3);
			this.isOnPointAnim = true;
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
					this.isOnPointAnim = false;
					if (!this.cameraFixed)
					{
						this.setCameraPosition(
							this.object.position.x,
							this.object.position.y - (this.object.position.y >= limits.up ? 0.7 : -0.7),
							this.object.position.z + 1
						);
					}
					document.getElementsByTagName('canvas')[0].style.animation = 'fadeOut 0.199s';
					document.getElementsByTagName('canvas')[0].style.filter = 'brightness(1)';
				}, 200);
				// document.getElementsByTagName('canvas')[0].style.filter = 'brightness(0)';
				// setTimeout(() => {
				// 	document.getElementsByTagName('canvas')[0].style.animation = 'fadeOut 0.199s';
				// }, 300)
			}, 4000);
		}, 200)
	}

	update()
	{
		let i;

		i = 0;
		while (i < this.pressedButton.length)
		{
			if (this.pressedButton[i] == 'w' && this.object.position.y < limits.up)
			{
				if (this.interval)
					clearInterval(this.interval);
				this.interval = setInterval(() => {
					this.object.position.y += this.speed;
					if (!this.cameraFixed && !this.isOnPointAnim)
						this.camera.position.y += (this.speed / 2);
					if (this.object.position.y >= limits.up)
					{
						clearInterval(this.interval);
						this.interval = null;
					}
				}, 5);
			}
			if (this.pressedButton[i] == 's' && this.object.position.y > limits.down)
			{
				if (this.interval)
					clearInterval(this.interval);
				this.interval = setInterval(() => {
					this.object.position.y -= this.speed;
					if (!this.cameraFixed && !this.isOnPointAnim)
						this.camera.position.y -= (this.speed / 2);
					if (this.object.position.y <= limits.down)
					{
						clearInterval(this.interval);
						this.interval = null;
					}
				}, 5);
			}
			if (this.pressedButton[i] == 'd' && this.object.position.x < limits.right)
			{
				this.object.position.x += this.speed;
				if (!this.cameraFixed && !this.isOnPointAnim)
					this.camera.position.x += this.speed;
			}
			if (this.pressedButton[i] == 'a' && this.object.position.x > limits.left)
			{
				this.object.position.x -= this.speed;
				if (!this.cameraFixed && !this.isOnPointAnim)
					this.camera.position.x -= this.speed;
			}
			i++;
		}
	}

	setCameraPosition(x, y, z)
	{
		this.camera.position.set(x, y, z);
	}
};

export { Player };
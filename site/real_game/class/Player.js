/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Player.js                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: edbernar <edbernar@student.42angouleme.    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/08/18 00:30:31 by edbernar          #+#    #+#             */
/*   Updated: 2024/08/19 00:42:13 by edbernar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as THREE from 'three';

/*
	Explication du code :
		- Un seul joueur peut etre instancié, sinon ça throw une erreur
		- Lorsqu'une touche est pressée, celle-ci sera ajoutée à la variable "pressedButton"
		  Exemple : w et a sont pressées -> pressedButton =  ['w', 'a']
		- Les lignes avec cleanup sont l'êquivalent d'un destructeur en CPP
		- Pour appliquer des actions sur les touches, il suffit de faire ça dans la fonction
		  update en regardant si la touche voulue est dans la variable "pressedButton"
		- Par défaut, la caméra est accroché, si on veut qu'elle ne bouge plus, il faut
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
		  définis sur la hauteur.
*/

let playerExist = false;
const limits = {
	up : 2,
	down: 0.2,
	left: -4,
	right: 4,
}

class Player
{
	pressedButton	= [];
	object			= null;
	camera			= null;
	speed			= 0.1;
	cameraFixed		= false;

	constructor (object, renderer)
	{
		if (playerExist)
			throw Error("Player is already init.");
		playerExist = true;
		this.object = object;
		this.camera = new THREE.PerspectiveCamera(80, window.innerWidth / window.innerHeight, 0.1, 10000);

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
			if (e.key == 'm')
			{
				this.cameraFixed = !this.cameraFixed;
				if (!this.cameraFixed)
				{
					this.setCameraPosition(
						this.object.position.x,
						this.object.position.y + 0.5,
						this.object.position.z + 1
					);
					this.camera.rotation.set(0, 0, 0);
				}
				else
					this.setCameraPosition(0, 1, 0.7)
			}
		});
	}

	update()
	{
		let i;

		i = 0;
		if (this.cameraFixed)
			this.camera.lookAt(new THREE.Vector3(this.object.position.x / 4, (this.object.position.y + 1) / 1.75, this.object.position.z - 1.5));
		while (i < this.pressedButton.length)
		{
			if (this.pressedButton[i] == 'w' && this.object.position.y < limits.up)
			{
				this.object.position.y += this.speed;
				if (!this.cameraFixed)
					this.camera.position.y += (this.speed / 2);
			}
			if (this.pressedButton[i] == 's' && this.object.position.y > limits.down)
			{
				this.object.position.y -= this.speed;
				if (!this.cameraFixed)
					this.camera.position.y -= (this.speed / 2);
			}
			if (this.pressedButton[i] == 'd' && this.object.position.x < limits.right)
				{
					this.object.position.x += this.speed;
					if (!this.cameraFixed)
						this.camera.position.x += this.speed;
				}
			if (this.pressedButton[i] == 'a' && this.object.position.x > limits.left)
			{
				this.object.position.x -= this.speed;
				if (!this.cameraFixed)
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
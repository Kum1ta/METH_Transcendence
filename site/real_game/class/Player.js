/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Player.js                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: edbernar <edbernar@student.42angouleme.    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/08/18 00:30:31 by edbernar          #+#    #+#             */
/*   Updated: 2024/08/18 16:17:18 by edbernar         ###   ########.fr       */
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
		  update en regardant si la touche voulue est pressée dans la variable "pressedButton"
		- Par défaut, la caméra est accroché, si on veut qu'elle ne bouge plus, il faut
		  modifier "cameraFixed" à true
		- Si on utilise une touche qui ne sera utilisée que pour un appui simple, il faudra la
		  mettre dans 'addEventListerner('keypress') et pas dans update()
*/

/*
	Todo (Eddy) :
		- Ajouter une camera sur l'object (OK)
		- Faire une fonction pour changer le mode de la camera (fix ou accrochée) (OK)
		- Ajouter une rotation quand la caméra est fixe (OK)
*/

let playerExist = false;

class Player
{
	pressedButton	= [];
	object			= null;
	camera			= null;
	speed			= 0.05;
	cameraFixed		= false;
	orbital			= null;

	constructor (object, renderer)
	{
		if (playerExist)
			throw Error("Player is already init.");
		playerExist = true;
		this.object = object;
		this.camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 10000);
		this.orbital = new OrbitControls(this.camera, renderer.domElement);

		this.orbital.enableZoom = false;

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
					this.setCameraPosition(
						this.object.position.x,
						this.object.position.y + 0.5,
						this.object.position.z + 1
					);
				else
					this.setCameraPosition(0, 1, 1)
			}
		});
	}

	update()
	{
		let i;

		i = 0;
		if (this.cameraFixed)
		{
			this.orbital.target = new THREE.Vector3(this.object.position.x, this.object.position.y, this.object.position.z - 5);
			this.orbital.update();
		}
		else
			this.camera.rotation.set(0, 0, 0);
		while (i < this.pressedButton.length)
		{
			if (this.pressedButton[i] == 'w' || this.pressedButton[i] == 's')
			{
				this.object.position.y += (this.pressedButton[i] == 'w' ? this.speed : -this.speed);
				if (!this.cameraFixed)
					this.camera.position.y += (this.pressedButton[i] == 'w' ? this.speed : -this.speed);
			}
			if (this.pressedButton[i] == 'a' || this.pressedButton[i] == 'd')
			{
				this.object.position.x += (this.pressedButton[i] == 'a' ? -this.speed : this.speed);
				if (!this.cameraFixed)
					this.camera.position.x += (this.pressedButton[i] == 'a' ? -this.speed : this.speed);
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
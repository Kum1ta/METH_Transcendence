/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   SoloGame.js                                        :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: hubourge <hubourge@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/08/28 12:07:39 by edbernar          #+#    #+#             */
/*   Updated: 2024/09/10 17:16:02 by hubourge         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import * as THREE from 'three';
import { Map, ground } from './soloClass/Map.js'
import { Players, player1, player2 } from './soloClass/Players.js'
import { Ball } from './soloClass/Ball.js'

import { stats } from './MultiGame.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

let	scene		= 	null;
let	renderer	=	null;
let	camera		=	null;
let	controls	= 	null;

/*
Controls :
	- w : monter player1
	- s : descendre player1

	- haut : monter player2
	- bas : descendre player2

	- a : restart quand score debug
*/

class SoloGame
{
	static create()
	{
		scene = new THREE.Scene();
		renderer = new THREE.WebGLRenderer({antialias: true});
		renderer.domElement.style.animation = 'fadeOutStart 1s';
		renderer.domElement.style.filter = 'brightness(1)';
		document.getElementById('score').style.animation = 'fadeOutStart 1s';

		renderer.shadowMap.enabled = true;
		renderer.shadowMap.type = THREE.PCFSoftShadowMap;
		Ball.create(scene);
		Map.create(scene);
		camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight);
		camera.rotation.x = -Math.PI / 2;
		renderer.setSize(window.innerWidth, window.innerHeight);
		scene.background = new THREE.Color(0x252525);
		document.body.appendChild(renderer.domElement);
		Players.create(scene);

		controls = new OrbitControls(camera, renderer.domElement);
		camera.position.set(0, 30, 0);
		// camera.position.set(20, 5, 25);

		document.addEventListener('keypress', (e) => {
			if (e.key == 'a')
				Map.reCreate(true);
		})

		renderer.setAnimationLoop(loop);
	}

	static dispose()
	{
		Map.dispose();
		if (renderer)
			renderer.dispose();
		renderer = null;
		camera = null;
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
};

function loop()
{
	stats.begin();
	controls.update();
	Ball.update();
	Map.update();
	Players.update();
	renderer.render(scene, camera);
	stats.end();
}

export { SoloGame };

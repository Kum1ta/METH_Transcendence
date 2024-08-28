/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   SoloGame.js                                        :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: edbernar <edbernar@student.42angouleme.    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/08/28 12:07:39 by edbernar          #+#    #+#             */
/*   Updated: 2024/08/29 00:19:01 by edbernar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import * as THREE from 'three';
import { Map } from './soloClass/Map.js'
import { Players } from './soloClass/Players.js'
import { Ball } from './soloClass/Ball.js'

import { stats } from './MultiGame.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

let	scene		= 	null;
let	renderer	=	null;
let	camera		=	null;

let	controls	= 	null;

class SoloGame
{
	static create()
	{
		scene = new THREE.Scene();
		renderer = new THREE.WebGLRenderer({antialias: true});
		renderer.shadowMap.enabled = true;
		renderer.shadowMap.type = THREE.PCFSoftShadowMap;
		Map.create(scene);
		camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight);
		camera.rotation.x = -Math.PI / 2;
		renderer.setSize(window.innerWidth, window.innerHeight);
		scene.background = new THREE.Color(0x252525);
		document.body.appendChild(renderer.domElement);
		Players.create(scene);
		Ball.create(scene);

		controls = new OrbitControls(camera, renderer.domElement);
		camera.position.set(0, 20, 0);
		renderer.setAnimationLoop(loop);

		setTimeout(() => {
			Ball.moveBall();
		}, 1000);
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
	Players.update();
	renderer.render(scene, camera);
	stats.end();
}

export { SoloGame };
/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   SoloGame.js                                        :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: edbernar <edbernar@student.42angouleme.    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/08/28 12:07:39 by edbernar          #+#    #+#             */
/*   Updated: 2024/08/28 14:07:55 by edbernar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import * as THREE from 'three';
import { Map } from './soloClass/Map.js'
import { stats } from './MultiGame.js';

let	scene		= 	null;
let	renderer	=	null;
let	camera		=	null;
let	map			=	null;

class SoloGame
{
	static create()
	{
		scene = new THREE.Scene();
		renderer = new THREE.WebGLRenderer({antialias: true});
		map = new Map(scene);
		camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerWidth);
		camera.rotation.x = -Math.PI / 2;
		renderer.setSize(window.innerWidth, window.innerWidth);
		scene.background = new THREE.Color(0xaaaaaa);
		document.body.appendChild(renderer.domElement);
		scene.add(new THREE.AmbientLight(0xffffff, 1));
		renderer.setAnimationLoop(loop)
	}

	static dispose()
	{
		if (map)
			map.dispose();
		map = null;
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
	renderer.render(scene, camera);
	stats.end();
}

export { SoloGame };
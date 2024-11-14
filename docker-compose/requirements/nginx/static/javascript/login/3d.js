/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   3d.js                                              :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: edbernar <edbernar@student.42angouleme.    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/11/13 11:36:46 by edbernar          #+#    #+#             */
/*   Updated: 2024/11/14 10:44:15 by edbernar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { files } from "/static/javascript/filesLoader.js";
import * as THREE from "/static/javascript/three/build/three.module.js";
import { GLTFLoader } from "/static/javascript/three/examples/jsm/loaders/GLTFLoader.js";

let camera = null;
let scene = null;
let renderer = null;

function main3d()
{
	const	loader		= new GLTFLoader();
	const	canvas		= document.getElementById('canvas-left-side');
	const	div			= document.getElementById('left-side');
	const	objectList	= [files.lampModel, files.plantModel, files.gameboyModel, files.tvModel];

	renderer = new THREE.WebGLRenderer({canvas: canvas});
	renderer.setSize(canvas.clientWidth, canvas.clientHeight);
	scene = new THREE.Scene();
	camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
	camera.position.z = 5;
	camera.position.y = 2;
	scene.add(camera);
	scene.background = new THREE.Color(0x696969);
	scene.add(new THREE.AmbientLight(0xffffff, 0.5));
	const light = new THREE.DirectionalLight(0xffffff, 1);
	light.position.set(0, 5, 5);
	scene.add(light);
	const nb = Math.floor(Math.random() * objectList.length);
	loader.load(objectList[nb], (gltf) => {
		const group = new THREE.Group();
		const material =  new THREE.MeshPhysicalMaterial({color: 0x2e2e2e});

		gltf.scene.children.forEach(elem => {
			elem.traverse((child) => {
				if (child.isMesh) {
					child.material = material;
					child.receiveShadow = true;
					child.castShadow = true;
				}
			});
			group.add(elem);
		});

		if (nb == 0)
			lampSettings(group);
		else if (nb == 1)
			plantSettings(group);
		else if (nb == 2)
			gameBoySettings(group);
		else if (nb == 3)
			tvSettings(group);
		scene.add(group);
	});
	renderer.setAnimationLoop(loop);

	window.addEventListener('resize', resizeCanvas);
}

function resizeCanvas()
{
	const canvas = document.getElementById('canvas-left-side');

	canvas.style.width = '100%';
	canvas.style.height = '100%';
	renderer.setSize(canvas.clientWidth, canvas.clientHeight);
	camera.aspect = canvas.clientWidth / canvas.clientHeight;
	camera.updateProjectionMatrix();
};

function dispose3d()
{
	window.removeEventListener('resize', resizeCanvas);
	if (renderer)
		renderer.dispose();
	if (scene)
	{
		for (let i = scene.children.length - 1; i >= 0; i--)
		{
			const obj = scene.children[i];
			if (obj.type === 'Group')
			{
				for (let j = obj.children.length - 1; j >= 0; j--)
				{
					const child = obj.children[j];
					if (child.type === 'Mesh')
					{
						child.geometry.dispose();
						child.material.dispose();
						obj.remove(child);
					}
				}
				scene.remove(obj);
			}
		}
	}
	renderer = null;
	scene = null;
	camera = null;
}

function loop()
{
	renderer.render(scene, camera);
	if (scene.children[3])
		scene.children[3].rotation.y += 0.005;
}

function lampSettings(group)
{
	group.scale.set(3, 3, 3);
}

function plantSettings(group)
{
	group.scale.set(0.5, 0.5, 0.5);
}

function gameBoySettings(group)
{
	group.scale.set(0.7, 0.7, 0.7);
	group.rotation.set(0, 0, -1.5);
	group.position.set(0, 2, 0);
}

function tvSettings(group)
{
	group.scale.set(0.25, 0.25, 0.25);
	group.position.set(0, 1.5, 0);
}

export { main3d, dispose3d };
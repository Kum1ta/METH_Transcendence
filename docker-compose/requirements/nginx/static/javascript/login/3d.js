/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   3d.js                                              :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: edbernar <edbernar@student.42angouleme.    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/11/13 11:36:46 by edbernar          #+#    #+#             */
/*   Updated: 2024/11/20 22:47:44 by edbernar         ###   ########.fr       */
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
	const	objectList	= [files.plantModel, files.gameboyModel, files.tvModel];

	renderer = new THREE.WebGLRenderer({canvas: canvas});
	renderer.setSize(canvas.clientWidth, canvas.clientHeight);
	scene = new THREE.Scene();
	camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
	camera.position.z = 5;
	camera.position.y = 2;
	scene.add(camera);
	scene.background = new THREE.Color(0xD3D3D3);
	scene.add(new THREE.AmbientLight(0xffffff, 0.5));
	const light = new THREE.DirectionalLight(0xffffff, 1);
	light.position.set(0, 5, 5);
	scene.add(light);
	const nb = Math.floor(Math.random() * objectList.length);
	loader.load(objectList[nb], (gltf) => {
		const group = new THREE.Group();
		const material =  new THREE.MeshPhysicalMaterial({color: 0x5e5e5e});

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
			plantSettings(group);
		else if (nb == 1)
			gameBoySettings(group);
		else if (nb == 2)
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
	{
		renderer.setAnimationLoop(null);
		renderer.dispose();
	}
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
	if (!renderer)
	{
		dispose3d();
		return ;
	}
	renderer.render(scene, camera);
	if (scene.children[3])
		scene.children[3].rotation.y += 0.005;
}

function plantSettings(group)
{
	group.scale.set(0.8, 0.8, 0.8);
	group.position.set(0, -0.8, 0);
}

function gameBoySettings(group)
{
	let i = 0;

	group.children[0].children.forEach(elem => {
		if (i == 0)
			elem.material = new THREE.MeshPhysicalMaterial({color: 0x3e3e3e});
		if (i == 4)
			elem.material = new THREE.MeshPhysicalMaterial({color: 0x9e9e9e});
		elem.position.x = -20;
		i++;
	});
	group.scale.set(0.9, 0.9, 0.9);
	group.rotation.set(0, -2, -1.5);
	group.position.set(0, 2, 0);
}

function tvSettings(group)
{
	group.scale.set(0.34, 0.34, 0.34);
	group.position.set(0, 1.5, 0);
	group.rotation.set(0, 2.8, 0);
}

export { main3d, dispose3d };
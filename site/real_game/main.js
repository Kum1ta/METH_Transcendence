/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   main.js                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: edbernar <edbernar@student.42angouleme.    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/08/18 00:53:53 by edbernar          #+#    #+#             */
/*   Updated: 2024/08/19 00:37:34 by edbernar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import * as THREE from 'three';
import { Player } from './class/Player'

function createBarPlayer(color)
{
	const geometry	= new THREE.BoxGeometry(1, 0.1, 0.1);
	const material	= new THREE.MeshPhysicalMaterial({color: color});
	const mesh		= new THREE.Mesh(geometry, material);

	mesh.position.set(0, 0.2, 0);
	return (mesh);
}

function loop()
{
	player.update();
	renderer.render(scene, player.camera);
}

function createMap()
{
	const geometry	= new THREE.PlaneGeometry(10, 10);
	const material	= new THREE.MeshPhysicalMaterial();
	const mesh		= new THREE.Mesh(geometry, material);

	mesh.rotateX(-(Math.PI / 2));
	return (mesh);
}


const scene			= new THREE.Scene();
const bar			= createBarPlayer(0xed56ea);
const renderer		= new THREE.WebGLRenderer();
const player		= new Player(bar, renderer);
const spotLight		= new THREE.SpotLight(0xffffff, 1000, 0, Math.PI / 4);
const map			= createMap();

scene.add(player.object);
spotLight.position.set(0, 100, 0);
scene.add(spotLight);
scene.add(map);
scene.background = new THREE.Color(0x1a1a1a);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
player.setCameraPosition(0, 0.5, 1)
renderer.setAnimationLoop(loop)

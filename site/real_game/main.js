/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   main.js                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: edbernar <edbernar@student.42angouleme.    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/08/18 00:53:53 by edbernar          #+#    #+#             */
/*   Updated: 2024/08/18 15:52:03 by edbernar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import * as THREE from 'three';
import { Player } from './class/Player'

function createBarPlayer(color)
{
	const geometry	= new THREE.BoxGeometry(1, 0.1, 0.1);
	const material	= new THREE.MeshPhysicalMaterial({color: color});
	const mesh		= new THREE.Mesh(geometry, material);

	return (mesh);
}

function loop()
{
	// controls.update();
	player.update();
	renderer.render(scene, player.camera);
}


const scene			= new THREE.Scene();
const bar			= createBarPlayer(0xed56ea);
const renderer		= new THREE.WebGLRenderer();
const player		= new Player(bar, renderer);
const spotLight		= new THREE.SpotLight(0xffffff, 1, 0, Math.PI / 4);
const helper		= new THREE.SpotLightHelper(spotLight);
// const controls		= new OrbitControls(player.camera, renderer.domElement);

scene.add(player.object);
spotLight.target = player.object;
scene.add(spotLight);
scene.add(helper);
scene.background = new THREE.Color(0x1a1a1a);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
player.setCameraPosition(0, 0.5, 1)
renderer.setAnimationLoop(loop)

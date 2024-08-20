/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   main.js                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: edbernar <edbernar@student.42angouleme.    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/08/18 00:53:53 by edbernar          #+#    #+#             */
/*   Updated: 2024/08/21 00:10:46 by edbernar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import * as THREE from 'three';
import { Player } from './class/Player'
import { Map } from './class/Map'
import { Ball } from './class/Ball'

function createBarPlayer(color)
{
	const geometry	= new THREE.BoxGeometry(1, 0.1, 0.1);
	const material	= new THREE.MeshPhysicalMaterial({color: color});
	const mesh		= new THREE.Mesh(geometry, material);

	mesh.position.set(0, 0.2, 0);
	mesh.castShadow = true;
	return (mesh);
}

function loop()
{
	player.update();
	map.update(ball.object);
	renderer.render(scene, player.camera);
	
}

const scene			= new THREE.Scene();
const map			= new Map(scene, 13);
const bar			= createBarPlayer(0xed56ea);
const renderer		= new THREE.WebGLRenderer({antialias: true});
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
const player		= new Player(bar, map);
const spotLight		= new THREE.SpotLight(0xffffff, 10000, 0, 0.2);
spotLight.castShadow = true;
const ambiantLight	= new THREE.AmbientLight(0xffffff, 0.5);
const ball			= new Ball(scene, map)


scene.add(player.object);
scene.add(ambiantLight);
spotLight.position.set(0, 100, 0);
scene.add(spotLight);
scene.background = new THREE.Color(0x1a1a1a);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
ball.initMoveBallTmp();

document.addEventListener('keypress', (e) => {
	if (e.key == 'g')
		player.pointAnimation(scene);
})

renderer.setAnimationLoop(loop)

/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   map.js                                             :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: hubourge <hubourge@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/07/30 13:50:51 by edbernar          #+#    #+#             */
/*   Updated: 2024/08/07 16:26:17 by hubourge         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import * as THREE from 'three';

function createMap(scene) {
	let	wallUp;
	let	wallDown;
	let	ground;
	let boxLeft;
	let boxRight;
	
	wallUp = createWall(scene, 0, 0.25, -2.3, 0.1);
	wallDown = createWall(scene, 0, 0.25, 2.3, 0.1);
	ground = createGround(scene);
}

function createWall(scene, x, y, z, thickness) {
	const geometryWall = new THREE.BoxGeometry(9, 0.5, thickness);
	const materialWall = new THREE.MeshLambertMaterial({
		color: 0x3b3b3b,
	});
	const wall = new THREE.Mesh(geometryWall, materialWall);
	wall.position.set(x, y, z);
	wall.receiveShadow = true;
	scene.add(wall);
	return wall;
}

function createGround(scene) {
	const geometry = new THREE.PlaneGeometry(9, 4.5, 1);
	const material = new THREE.MeshLambertMaterial({
		color: 0x3b3b3b,
	});
	const plane = new THREE.Mesh(geometry, material);
	plane.rotation.x = - (Math.PI / 2);
	plane.receiveShadow = true;
	scene.add(plane);
	return plane;
}

export { createMap };

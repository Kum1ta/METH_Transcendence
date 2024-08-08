/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   elements.js                                        :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: hubourge <hubourge@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/08/07 16:07:51 by hubourge          #+#    #+#             */
/*   Updated: 2024/08/08 15:37:06 by hubourge         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import * as THREE from 'three';

/* --- Box items --- */
let BoxWidth = 1;
let BoxHeight = 0.1;
let BoxThickness = 0.1;

function createBox(scene, x, y, z)
{
	const geometryBox = new THREE.BoxGeometry(BoxWidth, BoxHeight, BoxThickness);
	const materialBox = new THREE.MeshPhysicalMaterial({
		color: 0xff0000,
	});
	const box = new THREE.Mesh(geometryBox, materialBox);
	box.position.set(x, y, z);
	box.rotateY(Math.PI / 2);
	box.receiveShadow = true;
	scene.add(box);
	return box;
}

function createBall(scene, x, y, z, geometryBall, materialBall) {
	const ball = new THREE.Mesh(geometryBall, materialBall);
	ball.position.x = x;
	ball.position.y = y;
	ball.position.z = z;
	ball.castShadow = true;
	scene.add(ball);
	return ball;
}

export { createBall };
export { createBox };
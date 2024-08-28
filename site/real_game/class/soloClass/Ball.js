/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Ball.js                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: edbernar <edbernar@student.42angouleme.    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/08/28 15:58:03 by edbernar          #+#    #+#             */
/*   Updated: 2024/08/28 17:30:09 by edbernar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import * as THREE from 'three';
import { wallTop, wallBottom } from './Map.js';

let		ball		=	null;
let		speed		=	0.3;
// max 0.3 (sinon ca sort);
let		dir			=	-1;

class Ball
{
	static create(scene)
	{

		ball = createBall();

		scene.add(ball);
		ball.rotateY(0.3);

	}

	static dispose()
	{
		ball = null;
	}

	static update()
	{
		moveForward(ball, speed, false);
		bounceWallTop();
		bounceWallTBottom();
	}
}

function moveForward(object, speed, bounceTop)
{
	const direction = new THREE.Vector3(0, 0, dir);
	direction.applyQuaternion(object.quaternion);
	object.position.add(direction.multiplyScalar(speed));
}

function createBall()
{
	const	geometry	= new THREE.SphereGeometry(0.3);
	const	material	= new THREE.MeshPhysicalMaterial({color: 0xffffff});
	const	mesh		= new THREE.Mesh(geometry, material);

	mesh.position.y += 0.3;

	mesh.position.set (0, mesh.position.y, 0);
	return (mesh);
}

function bounceWallTop()
{
	const origin = new THREE.Vector3(ball.position.x, ball.position.y, ball.position.z);
	const direction = new THREE.Vector3(ball.position.x, ball.position.y, ball.position.z - 1);

	direction.normalize();
	const raycaster = new THREE.Raycaster(origin, direction);
	const objects = [ wallTop ];
	const intersects = raycaster.intersectObjects(objects);

	if (intersects.length > 0)
	{
		console.log("Distance du rayon à l'objet : ", intersects[0].distance);
		if (intersects[0].distance <= 0.5)
		{
			ball.rotation.y = Math.PI - ball.rotation.y
		}
	}
}

function bounceWallTBottom()
{
	const origin = new THREE.Vector3(ball.position.x, ball.position.y, ball.position.z);
	const direction = new THREE.Vector3(ball.position.x, ball.position.y, ball.position.z + 1);

	direction.normalize();
	const raycaster = new THREE.Raycaster(origin, direction);
	const objects = [ wallBottom ];
	const intersects = raycaster.intersectObjects(objects);

	if (intersects.length > 0)
	{
		console.log("Distance du rayon à l'objet : ", intersects[0].distance);
		if (intersects[0].distance <= 0.5)
		{
			ball.rotation.y = Math.PI - ball.rotation.y;
		}
	}
}

export { Ball };
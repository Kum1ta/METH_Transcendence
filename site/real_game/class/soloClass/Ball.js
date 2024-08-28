/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Ball.js                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: edbernar <edbernar@student.42angouleme.    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/08/28 15:58:03 by edbernar          #+#    #+#             */
/*   Updated: 2024/08/29 00:44:26 by edbernar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import * as THREE from 'three';
import { wallTop, wallBottom } from './Map.js';
import { player1, player2 } from './Players.js';

let		ball		=	null;
let		speed		=	0.15;
let		dir			=	-1;
let		interval	=	null;

class Ball
{
	static create(scene)
	{

		ball = createBall();

		scene.add(ball);
		ball.rotateY(0.8);
		
	}

	static dispose()
	{
		ball = null;
	}

	static moveBall()
	{
		createInterval();
	}


	static stopBall()
	{
		if (interval)
			clearInterval(interval);
	}
}

function createInterval()
{
	interval = setInterval(() => {
		console.log(ball.position);
		moveForward();
		bounceWallTop();
		bounceWallTBottom();
		bouncePlayer1();
	}, 16);
}

function moveForward()
{
	const direction = new THREE.Vector3(0, 0, dir);
	direction.applyQuaternion(ball.quaternion);
	
	ball.position.add(direction.multiplyScalar(speed));
}

function createBall()
{
	const	geometry	= new THREE.SphereGeometry(0.3);
	const	material	= new THREE.MeshPhysicalMaterial({color: 0xffffff});
	const	mesh		= new THREE.Mesh(geometry, material);

	mesh.position.y += 0.3;
	mesh.castShadow = true;
	mesh.receiveShadow = true;
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
		if (intersects[0].distance <= 0.5)
			ball.rotation.y = Math.PI - ball.rotation.y
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
		if (intersects[0].distance <= 0.4)
			ball.rotation.y = Math.PI - ball.rotation.y;
	}
}

function bouncePlayer1()
{
	const origin = new THREE.Vector3(ball.position.x, ball.position.y, ball.position.z);
	const direction = new THREE.Vector3(ball.position.x - 1, ball.position.y, ball.position.z);

	direction.normalize();
	const raycaster = new THREE.Raycaster(origin, direction);
	const objects = [ player1 ];
	const intersects = raycaster.intersectObjects(objects);

	if (intersects.length > 0)
	{
		if (intersects[0].distance <= 0.4)
			ball.rotation.y = Math.PI - ball.rotation.y;
	}
}

export { Ball };
/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Map.js                                             :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: edbernar <edbernar@student.42angouleme.    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/08/28 12:23:48 by edbernar          #+#    #+#             */
/*   Updated: 2024/08/29 18:42:55 by edbernar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import * as CANNON from 'cannon-es';
import * as THREE from 'three';
import { ball } from './Ball.js'

const	width			=	25;
const	height			=	12.5;
let		ground			=	null;
let		spotLight		=	null;
let		wallTop			=	null;
let		wallBottom		=	null;
let		world			=	null;
const	timeStep		=	1 / 60;
let		groundBody		=	null;
let		wallTopBody		=	null;
let		wallBottomBody	=	null;
let		ballBody		=	null;

class Map
{
	static create(scene)
	{
		world = new CANNON.World({
			gravity: new CANNON.Vec3(0, -9.81, 0),
		});
		ground = createGround(scene);
		wallBottom = createWall(false);
		wallTop = createWall(true);
		spotLight = new THREE.SpotLight({color: 0xffffff});
		spotLight.castShadow = true;
		spotLight.position.y = 10;
		spotLight.intensity = 200;
		scene.add(spotLight);
		scene.add(wallTop);
		scene.add(wallBottom);
		scene.add(new THREE.AmbientLight(0xffffff, 0.5));
		wallTopBody = new CANNON.Body({
			shape: new CANNON.Box(new CANNON.Vec3(width, 0.7, 0.2)),
			type: CANNON.Body.STATIC,
		})
		wallTopBody.position.z = -6.15;
		wallTopBody.position.y += 0.35;
		world.addBody(wallTopBody);
		wallBottomBody = new CANNON.Body({
			shape: new CANNON.Box(new CANNON.Vec3(width, 0.7, 0.2)),
			type: CANNON.Body.STATIC,
		})
		wallBottomBody.position.z = 6.15;
		wallBottomBody.position.y += 0.35;
		world.addBody(wallBottomBody);
		groundBody = new CANNON.Body({
			shape: new CANNON.Plane(),
			type: CANNON.Body.STATIC,
		});
		groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
		world.addBody(groundBody);
		ballBody = new CANNON.Body({
			shape: new CANNON.Sphere(0.3),
			mass: 1
		});
		ballBody.position.set(0, 2, 0);
		ballBody.velocity.set(0, 0, 0);
		world.addBody(ballBody);
	}

	static dispose()
	{
		if (spotLight)
			spotLight.dispose();
		spotLight = null;
	}

	static update()
	{
		world.step(timeStep);
		ground.position.copy(groundBody.position);
		ground.quaternion.copy(groundBody.quaternion);
		ball.position.copy(ballBody.position);
		ball.quaternion.copy(ballBody.quaternion);
		wallBottom.position.copy(wallBottomBody.position);
		wallBottom.quaternion.copy(wallBottomBody.quaternion);
		wallTop.position.copy(wallTopBody.position);
		wallTop.quaternion.copy(wallTopBody.quaternion);
	}
}

function createGround(scene)
{
	const	geometry	=	new THREE.PlaneGeometry(width, height);
	const	material	=	new THREE.MeshPhysicalMaterial({color: 0x222222});
	const	mesh		=	new THREE.Mesh(geometry, material);

	mesh.rotateX(-Math.PI / 2);
	mesh.position.set(0, 0, 0);
	scene.add(mesh);
	return (mesh);
}

function createWall(onTop)
{
	const	geometry	=	new THREE.BoxGeometry(width, 0.7, 0.2);
	const	material	=	new THREE.MeshPhysicalMaterial({color: 0x333333});
	const	mesh		=	new THREE.Mesh(geometry, material);

	// if (onTop)
	// 	mesh.position.z = -6.15;
	// else
	// 	mesh.position.z = 6.15;
	// mesh.position.y += 0.35;
	return (mesh);
}

export { Map, wallBottom, wallTop };
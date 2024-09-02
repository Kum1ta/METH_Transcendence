/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Map.js                                             :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: hubourge <hubourge@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/08/28 12:23:48 by edbernar          #+#    #+#             */
/*   Updated: 2024/09/02 18:08:13 by hubourge         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import * as CANNON from 'cannon-es';
import * as THREE from 'three';
import { ball } from './Ball.js'
import { player1, player2 } from './Players.js';

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
let		vec3 = {x:0, y:0, z:0};
let		player1Body		=	null;
let		player2Body		=	null;
let		speed			=	3;
let		initialZ		=	0;
let		score			=	{player1: 0, player2: 0};

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
			shape: new CANNON.Box(new CANNON.Vec3(width / 2, 0.35, 0.1)),
			type: CANNON.Body.STATIC,
		})
		wallTopBody.position.z = -6.15;
		wallTopBody.position.y += 0.35;
		wallTopBody.name = "wall";
		world.addBody(wallTopBody);

		wallBottomBody = new CANNON.Body({
			shape: new CANNON.Box(new CANNON.Vec3(width / 2, 0.35, 0.1)),
			type: CANNON.Body.STATIC,
		})
		wallBottomBody.position.z = 6.15;
		wallBottomBody.position.y += 0.35;
		wallBottomBody.name = "wall";
		world.addBody(wallBottomBody);

		groundBody = new CANNON.Body({
			shape: new CANNON.Plane(0,0),
			type: CANNON.Body.STATIC,
		});
		groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
		world.addBody(groundBody);

		player1Body = new CANNON.Body({
			shape: new CANNON.Box(new CANNON.Vec3(0.3, 0.4, 1.25)),
			type: CANNON.Body.STATIC,
		});
		player1Body.position.set(-12, 0.4, 0);
		player1Body.name = "player";
		world.addBody(player1Body);

		player2Body = new CANNON.Body({
			shape: new CANNON.Box(new CANNON.Vec3(0.3, 0.4, 1.25)),
			type: CANNON.Body.STATIC,
		});
		player2Body.position.set(12, 0.4, 0);
		player2Body.name = "player";
		world.addBody(player2Body);

		ballBody = new CANNON.Body({
			shape: new CANNON.Sphere(0.3),
			mass: 10,
		});
		ballBody.position.set(0, 0.15, 0);
		ballBody.velocity.set(vec3.x, vec3.y, vec3.z);
		world.addBody(ballBody);

		ballBody.addEventListener("collide", function(e) {
		let relativeVelocity = e.contact.getImpactVelocityAlongNormal();

		let bodyA = e.contact.bi;
		let bodyB = e.contact.bj;
		let collided = (bodyA === ballBody) ? bodyB : bodyA;

		switch(collided.name) {
			case "wall":
				vec3.z = -vec3.z;
				break;
			case "player":
				vec3.x = -vec3.x;
				if (Math.abs(vec3.z) - Math.abs(initialZ) > 0.3)
					break;
				if (Math.random() > 0.5)
					vec3.z -= 0.1;
				if (Math.random() < 0.5)
					vec3.z += 0.1;
				break;
			}
		});

		ground.position.copy(groundBody.position);
		ground.quaternion.copy(groundBody.quaternion);
		wallBottom.position.copy(wallBottomBody.position);
		wallBottom.quaternion.copy(wallBottomBody.quaternion);
		wallTop.position.copy(wallTopBody.position);
		wallTop.quaternion.copy(wallTopBody.quaternion);

		speed = 3;
		if (Math.random() > 0.5)
		{
			vec3.x = -3;
			vec3.y = 0;
			vec3.z = Math.random() * 10 % 4 - 2;
		}
		else
		{
			vec3.x = 3;
			vec3.y = 0;
			vec3.z = Math.random() * 10 % 4 - 2;
		}
		initialZ = vec3.z;
		ballBody.velocity.set(vec3.x, vec3.y, vec3.z);
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

		if (ballBody.position.x > 20)
			return (Map.reCreate(false));
		if (ballBody.position.x < -20)
			return (Map.reCreate(true));
		ball.position.copy(ballBody.position);
		player1Body.position.copy(player1.position);
		player2Body.position.copy(player2.position);

		if (speed < 10)
			speed += 0.003;
		ballBody.velocity.set(vec3.x * speed, vec3.y * speed, vec3.z * speed);
	}

	static reCreate(dirLeft)
	{
		ballBody.position.set(0, 0.15, 0);
		ball.position.copy(ballBody.position);
		player1Body.position.set(-12, 0.4, 0);
		player1.position.copy(player1Body.position);
		player2Body.position.set(12, 0.4, 0);
		player2.position.copy(player2Body.position);

		speed = 3;
		if (dirLeft)
		{
			score.player2++;
			vec3.x = -3;
			vec3.y = 0;
			vec3.z = Math.random() * 10 % 4 - 2;
		}
		else
		{
			score.player1++;
			vec3.x = 3;
			vec3.y = 0;
			vec3.z = Math.random() * 10 % 4 - 2;
		}
		initialZ = vec3.z;
		ballBody.velocity.set(vec3.x, vec3.y, vec3.z);

		console.log("score", score);
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
	return (mesh);
}

export { Map, wallBottom, wallTop };

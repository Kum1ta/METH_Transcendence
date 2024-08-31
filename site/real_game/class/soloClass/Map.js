/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Map.js                                             :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: edbernar <edbernar@student.42angouleme.    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/08/28 12:23:48 by edbernar          #+#    #+#             */
/*   Updated: 2024/08/31 15:03:26 by edbernar         ###   ########.fr       */
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
let		needUpdate		=	false;
let		speed			=	3;

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
		wallTopBody.name = "wall";
		world.addBody(wallTopBody);

		wallBottomBody = new CANNON.Body({
			shape: new CANNON.Box(new CANNON.Vec3(width, 0.7, 0.2)),
			type: CANNON.Body.STATIC,
		})
		wallBottomBody.position.z = 6.15;
		wallBottomBody.position.y += 0.35;
		wallBottomBody.name = "wall";
		world.addBody(wallBottomBody);

		groundBody = new CANNON.Body({
			shape: new CANNON.Plane(),
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
			mass: 1
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
					console.log("Collision avec un mur", relativeVelocity);
					needUpdate = true;
					vec3.z = -vec3.z;
					break;
				case "player":
					console.log("Collision avec un joueur", relativeVelocity);
					needUpdate = true;
					vec3.x = -vec3.x;
					if (vec3.z > 0.5)
						aaaa = 2;
					if (vec3.z < 0)
						aaaa = -2;
					console.log(vec3.z);
					vec3.z = (vec3.z + 0.01) * aaaa;
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
		if (1) // player1 (right) lose
		{
			vec3.x = -3;
			vec3.y = 0;
			vec3.z = 0;
			// vec3.z = Math.floor(Math.random() * 7) - 3;
		}
		else
		{
			vec3.x = 3;
			vec3.y = 0;
			vec3.z = Math.floor(Math.random() * 6) - 3;
		}
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
		
		ball.position.copy(ballBody.position);
		// ball.quaternion.copy(ballBody.quaternion);
		player1Body.position.copy(player1.position);
		// player1Body.quaternion.copy(player1.quaternion);
		player2Body.position.copy(player2.position);
		// player2Body.quaternion.copy(player2.quaternion);
		
		// if (needUpdate)
		// {
		// 	console.log("vec3", vec3);
		// 	needUpdate = false;
		// }
		// console.log(ballBody.velocity.length());
		speed += 0.003;
		ballBody.velocity.set(vec3.x * speed, vec3.y * speed, vec3.z * speed);
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

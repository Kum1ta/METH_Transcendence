/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Map.js                                             :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: hubourge <hubourge@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/08/28 12:23:48 by edbernar          #+#    #+#             */
/*   Updated: 2024/08/30 16:49:53 by hubourge         ###   ########.fr       */
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
let		vec3 = {x:0.1, y:0, z:3};
let		player1Body		=	null;
let		player2Body		=	null;
let		wallBottomId = -1;
let		wallTopId = -1;
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
		wallTopId = wallTopBody.id;

		wallBottomBody = new CANNON.Body({
			shape: new CANNON.Box(new CANNON.Vec3(width, 0.7, 0.2)),
			type: CANNON.Body.STATIC,
		})
		wallBottomBody.position.z = 6.15;
		wallBottomBody.position.y += 0.35;
		world.addBody(wallBottomBody);
		wallBottomId = wallBottomBody.id;

		groundBody = new CANNON.Body({
			shape: new CANNON.Plane(),
			type: CANNON.Body.STATIC,
		});
		groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
		world.addBody(groundBody);

		player1Body = new CANNON.Body({
			shape: new CANNON.Box(new CANNON.Vec3(0.3, 0.4, 2.5)),
			type: CANNON.Body.STATIC,
		});
		player1Body.position.set(-12, 0.4, 0);
		world.addBody(player1Body);

		player2Body = new CANNON.Body({
			shape: new CANNON.Box(new CANNON.Vec3(0.3, 0.4, 2.5)),
			type: CANNON.Body.STATIC,
		});
		player2Body.position.set(12, 0.4, 0);
		world.addBody(player2Body);

		ballBody = new CANNON.Body({
			shape: new CANNON.Sphere(0.3),
			mass: 1
		});
		ballBody.position.set(0, 0.15, 0);
		ballBody.velocity.set(vec3.x, vec3.y, vec3.z);
		world.addBody(ballBody);

		ballBody.addEventListener("collide",function(e){
		var relativeVelocity = e.contact.getImpactVelocityAlongNormal();
			console.log("e.contact : ", e.contact);
			console.log("id: ", e.contact.id );
			console.log("player1Body.id: ", player1Body.id );
			if (e.contact.id == player1Body.id || e.contact.id == player2Body.id)
				vec3.x = -vec3.x;
			if (e.contact.id == wallBottomId || e.contact.id == wallTopId)
				vec3.z = -vec3.z;
		});
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
		// Deplacer les update des objet fixe dans le constructeur pour ne pas update a chaque frame
		ground.position.copy(groundBody.position);
		ground.quaternion.copy(groundBody.quaternion);
		ball.position.copy(ballBody.position);
		ball.quaternion.copy(ballBody.quaternion);
		wallBottom.position.copy(wallBottomBody.position);
		wallBottom.quaternion.copy(wallBottomBody.quaternion);
		wallTop.position.copy(wallTopBody.position);
		wallTop.quaternion.copy(wallTopBody.quaternion);
		////////
		ballBody.velocity.set(vec3.x, vec3.y, vec3.z);
		player1.position.copy(player1Body.position);
		player1.quaternion.copy(player1Body.quaternion);
		player2.position.copy(player2Body.position);
		player2.quaternion.copy(player2Body.quaternion);
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

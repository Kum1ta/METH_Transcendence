/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Map.js                                             :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: hubourge <hubourge@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/08/28 12:23:48 by edbernar          #+#    #+#             */
/*   Updated: 2024/09/13 17:03:55 by hubourge         ###   ########.fr       */
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
let		vec3 			= 	{x:0, y:0, z:0};
let		player1Body		=	null;
let		player2Body		=	null;
let		speed			=	3;
let		initialZ		=	0;
let		score			=	{player1: 0, player2: 0};
let		onUpdate		=	false;
const	scoreElement	=	document.getElementById('score');
let		initialSpeed	=	3;
let		gameEndStatus	=	false;

class Map
{
	static create(scene)
	{
		world = new CANNON.World({
			gravity: new CANNON.Vec3(0, -9.81, 0),
		});
		ground = createGround(scene, 0x222222);
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
		player1Body.name = "player1";
		world.addBody(player1Body);

		player2Body = new CANNON.Body({
			shape: new CANNON.Box(new CANNON.Vec3(0.3, 0.4, 1.25)),
			type: CANNON.Body.STATIC,
		});
		player2Body.position.set(12, 0.4, 0);
		player2Body.name = "player2";
		world.addBody(player2Body);

		ballBody = new CANNON.Body({
			shape: new CANNON.Sphere(0.3),
			mass: 10,
		});
		ballBody.position.set(0, 0.15, 0);
		world.addBody(ballBody);

		this.#collision();

		ground.position.copy(groundBody.position);
		ground.quaternion.copy(groundBody.quaternion);
		wallBottom.position.copy(wallBottomBody.position);
		wallBottom.quaternion.copy(wallBottomBody.quaternion);
		wallTop.position.copy(wallTopBody.position);
		wallTop.quaternion.copy(wallTopBody.quaternion);

		speed = 3;
		if (Math.random() > 0.5)
		{
			vec3.z = Math.random() * 10 % 4 - 2;
			vec3.x = -Math.sqrt(initialSpeed * initialSpeed - vec3.z * vec3.z);
		}
		else
		{
			vec3.z = Math.random() * 10 % 4 - 2;
			vec3.x = Math.sqrt(initialSpeed * initialSpeed - vec3.z * vec3.z);
		}

		initialZ = vec3.z;
		ballBody.velocity.set(vec3.x, vec3.y, vec3.z);
		onUpdate = true;

		setTimeout(() => {
			scoreElement.innerHTML = '3';
		}, 1000);
		setTimeout(() => {
			scoreElement.innerHTML = '2';
		}, 1750);
		setTimeout(() => {
			scoreElement.innerHTML = '1';
		}, 2500);

		setTimeout(() => {
			scoreElement.innerHTML = score.player1 + '-' +score.player2;
		}, 3250);

		setTimeout(() => {
			onUpdate = false;
		}, 4000);
	}

	static dispose()
	{
		if (spotLight)
			spotLight.dispose();
		spotLight = null;
	}

	static update()
	{
		if (onUpdate)
			return ;
		world.step(timeStep);

		if (ballBody.position.x > 13)
			ball.material.opacity = 1 - ((ball.position.x - 13) / 2);
		if (ballBody.position.x < -13)
			ball.material.opacity = 1 - (-(ball.position.x + 13) / 2);

		if (ballBody.position.x > 23)
			return (Map.reCreate(false));
		if (ballBody.position.x < -23)
			return (Map.reCreate(true));

		ball.position.copy(ballBody.position);
		player1Body.position.copy(player1.position);
		player2Body.position.copy(player2.position);

		if (speed < 7)
			speed += 0.003;

		ballBody.velocity.set(vec3.x * speed, vec3.y * speed, vec3.z * speed);
	}

	static #collision()
	{
		let playerPosition;
		let relativePosition;
		let playerHalfExtents;
		let sideTouched;
		let ballPosition;
		let step = 0.75;

		ballBody.addEventListener("collide", function(e) {
			let bodyA = e.contact.bi;
			let bodyB = e.contact.bj;
			let collided = (bodyA === ballBody) ? bodyB : bodyA;

			switch(collided.name) {
				case "wall":
					vec3.z = -vec3.z;
					return;
				case "player1":
					collidedPlayer1(collided, e);
					return;
				case "player2":
					collidedPlayer2(collided, e);
					return;
				}
		});

		function collidedPlayer1(collided, e)
		{
			scalePlayer(player1);
			ballPosition = ballBody.position;
			playerPosition = collided.position;
			relativePosition = ballPosition.vsub(playerPosition);
			playerHalfExtents = collided.shapes[0].halfExtents;
			if (Math.abs(relativePosition.x) > playerHalfExtents.x)
				sideTouched = (relativePosition.x > 0) ? 'right' : 'left';
			else if (Math.abs(relativePosition.z) > playerHalfExtents.z)
				sideTouched = (relativePosition.z > 0) ? 'front' : 'back';
			if (sideTouched == 'front' || sideTouched == 'back')
			{
				vec3.z = -vec3.z;
				return ;
			}

			initialSpeed = Math.sqrt(vec3.x * vec3.x + vec3.z * vec3.z);
			let random = Math.random();
			if (random > 0.5)
			{
				vec3.z -= step;
				vec3.x = Math.sqrt(initialSpeed * initialSpeed - vec3.z * vec3.z);
			}
			else if (random < 0.5)
			{
				vec3.z += step;
				vec3.x = Math.sqrt(initialSpeed * initialSpeed - vec3.z * vec3.z);
			}
		}

		function collidedPlayer2(collided, e)
		{
			scalePlayer(player2);
			ballPosition = ballBody.position;
			playerPosition = collided.position;
			relativePosition = ballPosition.vsub(playerPosition);
			playerHalfExtents = collided.shapes[0].halfExtents;
			if (Math.abs(relativePosition.x) > playerHalfExtents.x)
				sideTouched = (relativePosition.x > 0) ? 'right' : 'left';
			else if (Math.abs(relativePosition.z) > playerHalfExtents.z)
				sideTouched = (relativePosition.z > 0) ? 'front' : 'back';
			if (sideTouched == 'front' || sideTouched == 'back')
			{
				vec3.z = -vec3.z;
				return ;
			}

			initialSpeed = Math.sqrt(vec3.x * vec3.x + vec3.z * vec3.z);
			let random = Math.random();
			if (random > 0.5)
			{
				vec3.z -= step;
				vec3.x = -Math.sqrt(initialSpeed * initialSpeed - vec3.z * vec3.z);
			}
			else if (random < 0.5)
			{
				vec3.z += step;
				vec3.x = -Math.sqrt(initialSpeed * initialSpeed - vec3.z * vec3.z);
			}
		}

		function scalePlayer(player)
		{
			const value = 0.01;

			for (let i = 1; i < 10; i++)
			{
				setTimeout(() => {
					player.scale.z += value;
					player.scale.x += value * 2;
				}, i * 10);
			}

			for (let i = 10; i < 20; i++)
			{
				setTimeout(() => {
					player.scale.z -= value;
					player.scale.x -= value * 2;
				}, i * 10);
			}
		}
	}

	static reCreate(player1Lose)
	{
		onUpdate = true;
		document.getElementsByTagName('canvas')[3].style.animation = 'fadeIn 0.199s';
		document.getElementsByTagName('canvas')[3].style.filter = 'brightness(0)';
		scoreElement.style.animation = 'fadeInText 0.199s';
		scoreElement.style.color = 'rgb(255, 255, 255, 1)';

		setTimeout(() => {
			if (player1Lose)
				score.player2++;
			else
				score.player1++;
			scoreElement.innerHTML = score.player1 + '-' +score.player2;
		}, 500);

		if ((player1Lose && score.player2 >= 2) || (!player1Lose && score.player1 >= 2))
			return (this.#endGame());

		setTimeout(() => {
			speed = 3;
			initialSpeed = Math.sqrt(vec3.x * vec3.x + vec3.z * vec3.z);
			if (player1Lose)
			{
				vec3.z = Math.random() * 10 % 4 - 2;
				vec3.x = -Math.sqrt(initialSpeed * initialSpeed - vec3.z * vec3.z);
			}
			else
			{
				vec3.z = Math.random() * 10 % 4 - 2;
				vec3.x = Math.sqrt(initialSpeed * initialSpeed - vec3.z * vec3.z);
			}
			initialZ = vec3.z;

			onUpdate = false;
		}, 1700);

		setTimeout(() => {
			ballBody.velocity.set(0,0,0);
			ballBody.position.set(0, 0.15, 0);
			ball.position.copy(ballBody.position);
			ball.material.opacity = 1;
			player1Body.position.set(-12, 0.4, 0);
			player1.position.copy(player1Body.position);
			player2Body.position.set(12, 0.4, 0);
			player2.position.copy(player2Body.position);

			scoreElement.style.animation = 'fadeOut 0.199s';
			document.getElementsByTagName('canvas')[3].style.filter = 'brightness(1)';
			scoreElement.style.animation = 'fadeOutText 0.399s';
			scoreElement.style.color = 'rgb(255, 255, 255, 0.1)';
		}, 1200);
	}

	static changeGround(ground, texture)
	{
		if (ground.material)
			ground.material.dispose();
		if (typeof(texture) == 'string')
		{
			const textureLoader = new THREE.TextureLoader();
			texture = textureLoader.load(texture);
			ground.material.map = texture;
		}
		else if (typeof(texture) == 'number')
			ground.material.color.set(texture);
	}

	static #endGame()
	{
		speed = 3;
		vec3.x = 0;
		vec3.y = 0;
		vec3.z = 0
		initialZ = vec3.z;
		setTimeout(() => {
			ballBody.velocity.set(0,0,0);
			ballBody.position.set(0, 0.15, 0);
			ball.position.copy(ballBody.position);
			ball.material.opacity = 1;
			player1Body.position.set(-12, 0.4, 0);
			player1.position.copy(player1Body.position);
			player2Body.position.set(12, 0.4, 0);
			player2.position.copy(player2Body.position);

			scoreElement.style.animation = 'fadeOut 0.199s';
			document.getElementsByTagName('canvas')[3].style.filter = 'brightness(1)';
			scoreElement.style.animation = 'fadeOutText 0.399s';
			scoreElement.style.color = 'rgb(255, 255, 255, 0.1)';
			onUpdate = false;
			gameEndStatus = true;
		}, 1200);
	}
}

function createGround(scene, texture)
{
	const	geometry	=	new THREE.PlaneGeometry(width, height);
	let		material	=	null;
	let		mesh		=	null;

	if (typeof(texture) == 'string')
	{
		const textureLoader = new THREE.TextureLoader();
		texture = textureLoader.load(texture);
		material = new THREE.MeshPhysicalMaterial({ map: texture });
	}
	else if (typeof(texture) == 'number')
		material = new THREE.MeshPhysicalMaterial({ color: texture });
	else
		material = new THREE.MeshPhysicalMaterial({color: 0x222222});

	mesh = new THREE.Mesh(geometry, material);
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

export { Map, wallBottom, wallTop, ground, gameEndStatus };

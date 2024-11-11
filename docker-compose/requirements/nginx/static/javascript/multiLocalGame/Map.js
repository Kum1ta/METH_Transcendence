/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Map.js                                             :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: hubourge <hubourge@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/08/28 12:23:48 by edbernar          #+#    #+#             */
/*   Updated: 2024/11/11 18:02:49 by hubourge         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import * as CANNON from '/static/javascript/cannon-es/dist/cannon-es.js'
import * as THREE from '/static/javascript/three/build/three.module.js'
import { ball } from '/static/javascript/multiLocalGame/Ball.js'
import { player1, player2 } from '/static/javascript/multiLocalGame/Players.js';

const	width			=	25;
const	height			=	12.5;
let		ground			=	null;
let		spotLight		=	null;
let		wallTop			=	null;
let		wallBottom		=	null;
const	timeStep		=	1 / 60;
let		vec2 			= 	{x:0, z:0};
let		score			=	{player1: 0, player2: 0};
let		onUpdate		=	false;
let		scoreElement	=	null;
let		initialSpeed	=	0;
let		speed			=	0;
let		gameEndStatus	=	false;
const	scoreToWin		=	2; //+1 for real score to win

class Map
{
	static create(scene)
	{
		onUpdate = true;
		scoreElement = document.getElementById('score');

		spotLight = new THREE.SpotLight({color: 0xffffff});
		spotLight.castShadow = true;
		spotLight.position.y = 10;
		spotLight.intensity = 200;
		scene.add(spotLight);
		scene.add(new THREE.AmbientLight(0xffffff, 0.5));

		ground = createGround(scene, 0x222222);
		scene.add(ground);

		wallBottom = createWall(false);
		scene.add(wallBottom);

		wallTop = createWall(true);
		scene.add(wallTop);

		initialSpeed = 0.15;
		speed = 1;
		if (Math.random() > 0.5)
		{
			vec2.z = (Math.random() * 0.8 - 0.4) * initialSpeed;
			vec2.x = Math.sqrt(initialSpeed * initialSpeed - vec2.z * vec2.z);
		}
		else
		{
			vec2.z = (Math.random() * 0.8 - 0.4) * initialSpeed;
			vec2.x = Math.sqrt(initialSpeed * initialSpeed - vec2.z * vec2.z);
		}

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
		score.player1 = 0;
		score.player2 = 0;
		gameEndStatus = false;
	}

	static update()
	{
		if (onUpdate)
			return ;
		
		// collision wall top and bottom
		if (ball.position.z > 5.7 || ball.position.z < -5.7)
			vec2.z *= -1;

		// collision player2 left
		if (ball.position.x > 11.45 && ball.position.x < 12.2)
		{
			if (ball.position.z < player2.position.z + 1.25 && ball.position.z > player2.position.z - 1.25)
			{
				Map.scalePlayer(player2);
				vec2.x *= -1;
				// Ca bug donc je le laisse en commentaire
				// if (ball.position.z < player2.position.z + 0.5)
				// {
				// 	vec2.z -= 0.05;
				// 	vec2.x += 0.05;
				// }
				// else if (ball.position.z > player2.position.z + 0.5)
				// {
				// 	vec2.z += 0.05;
				// 	vec2.x -= 0.05;
				// }
			}
		} // collision player1 right
		else if (ball.position.x < -11.45 && ball.position.x > -12.2)
		{
			if (ball.position.z < player1.position.z + 1.25 && ball.position.z > player1.position.z - 1.25)
			{	
				Map.scalePlayer(player1);
				vec2.x *= -1;
				// Ca bug donc je le laisse en commentaire
				// if (ball.position.z < player1.position.z + 0.5)
				// {
				// 	vec2.z -= 0.05;
				// 	vec2.x += 0.05;
				// }
				// else if (ball.position.z > player1.position.z + 0.5)
				// {
				// 	vec2.z += 0.05;
				// 	vec2.x -= 0.05;
				// }
			}
		}

		// velocity
		ball.position.x += vec2.x * speed;
		ball.position.z += vec2.z * speed;
		if (speed < 3)
			speed += 0.0025;

		// ball opacity
		if (ball.position.x > 12.3)
		{
			ball.material.opacity -= 0.1;
			if (ball.position.x > 14)
				return (Map.reCreate(false));
		}
		else if (ball.position.x < -12.3)
		{
			ball.material.opacity -= 0.1;
			if (ball.position.x < -14)
				return (Map.reCreate(true));
		}
	}

	static scalePlayer(player)
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

	static reCreate(player1Lose)
	{
		onUpdate = true;
		document.getElementsByTagName('canvas')[0].style.animation = 'fadeInGames 0.199s';
		document.getElementsByTagName('canvas')[0].style.filter = 'brightness(0)';
		scoreElement.style.animation = 'fadeInTextGames 0.199s';
		scoreElement.style.color = 'rgb(255, 255, 255, 1)';

		setTimeout(() => {
			if (player1Lose)
				score.player2++;
			else
				score.player1++;
			scoreElement.innerHTML = score.player1 + '-' +score.player2;
		}, 500);

		if ((player1Lose && score.player2 >= scoreToWin) || (!player1Lose && score.player1 >= scoreToWin))
			return (this.#endGame());

		setTimeout(() => {
			if (player1Lose)
			{
				initialSpeed = 0.2;
				vec2.z = (Math.random() * 0.8 - 0.4) * initialSpeed;
				vec2.x = -Math.sqrt(initialSpeed * initialSpeed - vec2.z * vec2.z);
			}
			else
			{
				initialSpeed = 0.2;
				vec2.z = (Math.random() * 0.8 - 0.4) * initialSpeed;
				vec2.x = Math.sqrt(initialSpeed * initialSpeed - vec2.z * vec2.z);
			}

			onUpdate = false;
		}, 1700);

		setTimeout(() => {
			ball.material.opacity = 1;
			ball.position.set(0, 0.3, 0);
			speed = 1;

			scoreElement.style.animation = 'fadeOutGames 0.199s';
			document.getElementsByTagName('canvas')[0].style.filter = 'brightness(1)';
			scoreElement.style.animation = 'fadeOutTextGames 0.399s';
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
		setTimeout(() => {
			ball.material.opacity = 1;

			scoreElement.style.animation = 'fadeOutGames 0.199s';
			document.getElementsByTagName('canvas')[0].style.filter = 'brightness(1)';
			scoreElement.style.animation = 'fadeOutTextGames 0.399s';
			scoreElement.style.color = 'rgb(255, 255, 255, 0.1)';
			onUpdate = false;
			gameEndStatus = true;
		}, 1200);
	}
}

function createGround(texture)
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
	return (mesh);
}

function createWall(onTop)
{
	const	geometry	=	new THREE.BoxGeometry(width, 0.7, 0.2);
	const	material	=	new THREE.MeshPhysicalMaterial({color: 0x333333});
	const	mesh		=	new THREE.Mesh(geometry, material);
	if (onTop)
	{
		mesh.position.z = -6.15;
		mesh.position.y += 0.35;
	}
	else
	{
		mesh.position.z = 6.15;
		mesh.position.y += 0.35;
	}
	return (mesh);
}

export { Map, wallBottom, wallTop, ground, gameEndStatus, score, scoreElement };

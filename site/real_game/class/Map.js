/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Map.js                                             :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: edbernar <edbernar@student.42angouleme.    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/08/20 14:52:55 by hubourge          #+#    #+#             */
/*   Updated: 2024/08/22 01:02:41 by edbernar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

/*
	Todo (Eddy) :
		- Ajouter la transparence sur les murs sur la distance de la balle (OK)
		- Ajouter des textures selon le type : number pour couleur, string pour img (OK)
		- Ajouter une fonctione pour modifier la gravité (OK)
*/

const loader = new GLTFLoader();

class Map
{
	scene = null;
	arrObject = [];
	ballObject = null;
	mapLength = 0;
	centerPos = {
		x: -1,
		y: -1,
		z:-1
	};
	playerLimits = {
		up : 3,
		down: 0.3,
		left: -3,
		right: 3,
	};
	ballIsOnJumper = {
		can: true
	};

	constructor(scene, length, obstacles)
	{
		this.scene = scene;
		this.centerPos.x = 0;
		this.centerPos.y = 0.15;
		this.centerPos.z = -length / 2 + length / 2;
		this.mapLength = length;
		scene.add(this.#createPlanes(7.5, length, -(Math.PI / 2), "planeBottom", true, '/textures/pastel.jpg'));
		scene.add(this.#createPlanes(7.5, length, (Math.PI / 2), "planeTop", false, '/textures/pastel.jpg'));
		scene.add(this.#createWall(-3.5, 0.4, -length/2, "wallLeft"));
		scene.add(this.#createWall(3.5, 0.4, -length/2, "wallRight"));
		scene.add(this.#createWallObstacle(1, 1, 1, false));
		scene.add(this.#createWallObstacle(-1, 1, 1, true));
		scene.add(this.#createBanner(10, 1))
		if (obstacles)
			this.#generateObstacle();


		/***** JUST FOR TEST *****/
		document.addEventListener('keypress', (e) => {
			if (e.key == 'q')
			{
				for (let i = 0; i < this.arrObject.length; i++)
				{
					if (this.arrObject[i].type == 'jumper')
						this.#animationGravityChanger(this.arrObject[i].mesh)
				}
			}
		})
		/*************************/
	};

	#createPlanes(x, y, rot, name, isBottom, visual)
	{
		for (let i = 0; i < this.arrObject.length; i++)
		{
			if (this.arrObject[i].name == name)
				throw Error("Name already exist.");
		}

		const	geometry	= new THREE.PlaneGeometry(x, y);
		let		material	= null;
		let		mesh		= null;

		if (typeof(visual) == 'string')
		{
			const textureLoader = new THREE.TextureLoader();
			const texture = textureLoader.load(visual);
			material = new THREE.MeshPhysicalMaterial({ map: texture });
		}
		else if (typeof(visual) == 'number')
			material = new THREE.MeshPhysicalMaterial({ color: visual });
		else
			material = new THREE.MeshPhysicalMaterial();
		mesh = new THREE.Mesh(geometry, material);
		mesh.rotateX(rot);
		if (isBottom)
			mesh.position.set(0, 0.15, 0);
		else
			mesh.position.set(0, 3.15, 0);
		this.arrObject.push({mesh: mesh, name: name, type: "plane"});
		mesh.receiveShadow = true;
		return (mesh);
	};

	#createWall(x, y, z, name)
	{
		for (let i = 0; i < this.arrObject.length; i++)
		{
			if (this.arrObject[i].name == name)
				throw Error("Name already exist.");
		}
		const geometry	= new THREE.BoxGeometry(0.05, 0.5, 0.75);
		const material	= new THREE.MeshPhysicalMaterial();
		const mesh		= new THREE.Mesh(geometry, material);

		mesh.position.set(x, y, z);
		material.transparent = true;
		material.opacity = 0.5;
		this.arrObject.push({mesh: mesh, name: name, type: "wall"});
		return (mesh);
	};

	#createGravityChanger(x, y, z, name, onTop)
	{
		for (let i = 0; i < this.arrObject.length; i++)
		{
			if (this.arrObject[i].name == name + "1")
				throw Error("Name already exist.");
		}
		const geometry0	= new THREE.CircleGeometry(0.2, 24);
		const material0	= new THREE.MeshPhysicalMaterial({color: 0xaaffaa});
		const circle1		= new THREE.Mesh(geometry0, material0);
		circle1.rotateX(-Math.PI / 2);
		circle1.position.set(x, y - 0.048, z);
		
		const geometry	= new THREE.CircleGeometry(0.24, 24);
		const material	= new THREE.MeshPhysicalMaterial({color: 0x00ff00});
		const circle2		= new THREE.Mesh(geometry, material);
		circle2.rotateX(-Math.PI / 2);
		circle2.position.set(x, y - 0.049, z);
		
		const geometry1	= new THREE.TorusGeometry(1, 0.1, 12, 24);
		const material1	= new THREE.MeshPhysicalMaterial({color: 0x00ff00});
		const ring1		= new THREE.Mesh(geometry1, material1);
		ring1.rotateX(-Math.PI / 2);
		ring1.position.set(x, y, z);
		ring1.scale.set(0.2, 0.2, 0.2);
		material1.transparent = true;
		material1.opacity = 0.75;
		
		const geometry2	= new THREE.TorusGeometry(1, 0.1, 12, 24);
		const material2	= new THREE.MeshPhysicalMaterial({color: 0x00ff00});
		const ring2		= new THREE.Mesh(geometry2, material2);
		ring2.rotateX(-Math.PI / 2);
		ring2.position.set(x, y + 0.1, z);
		ring2.scale.set(0.18, 0.18, 0.18);
		material2.transparent = true;
		material2.opacity = 0.65;

		const geometry3	= new THREE.TorusGeometry(1, 0.1, 12, 24);
		const material3	= new THREE.MeshPhysicalMaterial({color: 0x00ff00});
		const ring3		= new THREE.Mesh(geometry3, material3);
		ring3.rotateX(-Math.PI / 2);
		ring3.position.set(x, y + 0.2, z);
		ring3.scale.set(0.16, 0.16, 0.16);
		material3.transparent = true;
		material3.opacity = 0.35;
	
		const geometry4	= new THREE.CylinderGeometry(0.15, 0.15, 0.4);
		const material4	= new THREE.MeshPhysicalMaterial({color: 0x00ff00});
		const collider		= new THREE.Mesh(geometry4, material4);
		collider.position.set(x, y + 0.1, z);
		material4.transparent = true;
		material4.opacity = 0.1;

		const group = new THREE.Group();
		group.add(circle1);
		group.add(circle2);
		group.add(ring1);
		group.add(ring2);
		group.add(ring3);
		group.add(collider);

		if (onTop)
		{
			group.rotateX(Math.PI);
			group.translateY(-6.3);
		}
		this.arrObject.push({mesh: group, name: name, type: 'jumper'});

		this.scene.add(group);
	};

	#createWallObstacle(x, y, size, onTop)
	{
		const	geometry	= new THREE.BoxGeometry(size, 0.5, 0.1);
		const	material	= new THREE.MeshPhysicalMaterial({color: 0xaaaafe});
		const	mesh		= new THREE.Mesh(geometry, material);


		if (onTop)
			mesh.position.set(x, this.playerLimits.up - 0.1, y);
		else
			mesh.position.set(x, 0.4, y);
		return (mesh);
	}

	#createBanner(radius, height)
	{
		return (null);
	}

	#animationGravityChanger(group)
	{
		const geometry1		= new THREE.TorusGeometry(1.5, 0.05, 12, 24);
		const material1		= new THREE.MeshPhysicalMaterial({color: 0x00ff00});
		const ring1			= new THREE.Mesh(geometry1, material1);
		const landmark		= group.children[0];
		let	interval		= null;
		let	speed			= 0.1;

		ring1.rotateX(-Math.PI / 2);
		ring1.position.set(landmark.position.x, landmark.position.y, landmark.position.z);
		ring1.scale.set(0.2, 0.2, 0.2);
		ring1.material.transparent = true;
		this.scene.add(ring1);

		interval = setInterval(() => {
			ring1.position.y += speed;
			ring1.material.opacity -= 0.02;
			speed *= 0.90;
			if (ring1.material.opacity == 0)
				clearInterval(interval);
		}, 10);
	}

	#generateObstacle()
	{
		this.#createGravityChanger(-1.5, 0.2, this.mapLength / 4, "gravityChangerGroupBottom1", 0);

		// let randomNumber;
		// if (Math.random() < 0.5)
		// {
		// 	randomNumber = Math.random();
		// 	if (randomNumber < 0.5)
		// 		this.#createGravityChanger(-1.5, 0.2, this.mapLength / 4, "gravityChangerGroupBottom1", 0);
		// 	else
		// 		this.#createGravityChanger(1.5, 0.2, this.mapLength / 4, "gravityChangerGroupBottom2", 0);
		// }
		// if (Math.random() < 0.5)
		// {
		// 	randomNumber = Math.random();
		// 	if (randomNumber < 0.5)
		// 		this.#createGravityChanger(-1.5, 0.2, -this.mapLength / 4, "gravityChangerGroupBottom3", 0);
		// 	else
		// 		this.#createGravityChanger(1.5, 0.2, -this.mapLength / 4, "gravityChangerGroupBottom4", 0);
		// }
		// if (Math.random() < 0.5)
		// {
		// 	randomNumber = Math.random();
		// 	if (randomNumber < 0.5)
		// 		this.#createGravityChanger(-1.5, 3.2, this.mapLength / 4, "gravityChangerGroupTop1", 1);
		// 	else
		// 		this.#createGravityChanger(1.5, 3.2, this.mapLength / 4, "gravityChangerGroupTop2", 1);
		// }
		// if (Math.random() < 0.5)
		// {
		// 	randomNumber = Math.random();
		// 	if (randomNumber < 0.5)
		// 		this.#createGravityChanger(-1.5, 3.2, -this.mapLength / 4, "gravityChangerGroupTop3", 1);
		// 	else
		// 		this.#createGravityChanger(1.5, 3.2, -this.mapLength / 4, "gravityChangerGroupTop4", 1);
		// }
	};

	update(ball)
	{
		for (let i = 0; i < this.arrObject.length; i++)
		{
			if (this.arrObject[i].name == "wallLeft")
			{
				if (ball.object.position.z < 0.1 && ball.object.position.z > -this.mapLength + 1)
					this.arrObject[i].mesh.position.z = ball.object.position.z;
				this.arrObject[i].mesh.position.y = ball.object.position.y;
			}
			if (this.arrObject[i].name == "wallRight")
			{
				if (ball.object.position.z < 0.1 && ball.object.position.z > -this.mapLength + 1)
					this.arrObject[i].mesh.position.z = ball.object.position.z;
				this.arrObject[i].mesh.position.y = ball.object.position.y;
			}
			if (this.arrObject[i].name == "wallLeft")
			{
				let	diff = ball.object.position.x - this.arrObject[i].mesh.position.x - 0.1;

				if (diff > 2)
					this.arrObject[i].mesh.material.opacity = 0;
				else
					this.arrObject[i].mesh.material.opacity = 1 - (diff / 2);
			}
			if (this.arrObject[i].name == "wallRight")
			{
				let	diff = this.arrObject[i].mesh.position.x - ball.object.position.x - 0.1;

				if (diff > 2)
					this.arrObject[i].mesh.material.opacity = 0;
				else
					this.arrObject[i].mesh.material.opacity = 1 - (diff / 2);
			}
			if (this.arrObject[i].type == 'jumper')
			{
				const cylinder	= this.arrObject[i].mesh.children[5];
				const distance	= ball.object.position.distanceTo(cylinder.position);
				const speed		= 0.1

				if (distance < 0.25 && this.ballIsOnJumper.can)
				{
					this.ballIsOnJumper.can = false;
					ball.changeGravity(this.ballIsOnJumper);
					this.#animationGravityChanger(this.arrObject[i].mesh);
				}
			}
			if (this.arrObject[i].name == "gravityChangerGroupBottom1")
			{
				for (let j = 2; j < this.arrObject[i].mesh.children.length - 1; j++)
				{
					
					this.arrObject[i].mesh.children[j].rotation.x = Math.sin(Date.now() * 0.001 + (j - 2) * 5) * 0.1 + Math.PI / 2;
					this.arrObject[i].mesh.children[j].rotation.y = Math.sin(Date.now() * 0.001 + (j - 2) * 5) * 0.1 + Math.cos(Date.now() * 0.001) * 0.1;;
					this.arrObject[i].mesh.children[j].position.y = Math.sin(Date.now() * 0.001 + (j - 2) * 5) * 0.03 + ( 0.25 * (j - 2) / 2) + 0.25;
				}
			}
			if (this.arrObject[i].name == "gravityChangerGroupBottom2")
			{
				for (let j = 2; j < this.arrObject[i].mesh.children.length - 1; j++)
				{
					
					this.arrObject[i].mesh.children[j].rotation.x = Math.sin(Date.now() * 0.001 + (j - 2) * 5) * 0.1 + Math.PI / 2;
					this.arrObject[i].mesh.children[j].rotation.y = Math.sin(Date.now() * 0.001 + (j - 2) * 5) * 0.1 + Math.cos(Date.now() * 0.001) * 0.1;;
					this.arrObject[i].mesh.children[j].position.y = Math.sin(Date.now() * 0.001 + (j - 2) * 5) * 0.03 + ( 0.25 * (j - 2) / 2) + 0.25;
				}
			}
			if (this.arrObject[i].name == "gravityChangerGroupBottom3")
			{
				for (let j = 2; j < this.arrObject[i].mesh.children.length - 1; j++)
				{
					this.arrObject[i].mesh.children[j].rotation.x = Math.sin(Date.now() * 0.001 + (j - 2) * 5) * 0.1 + Math.PI / 2;
					this.arrObject[i].mesh.children[j].rotation.y = Math.sin(Date.now() * 0.001 + (j - 2) * 5) * 0.1 + Math.cos(Date.now() * 0.001) * 0.1;;
					this.arrObject[i].mesh.children[j].position.y = Math.sin(Date.now() * 0.001 + (j - 2) * 5) * 0.03 + ( 0.25 * (j - 2) / 2) + 0.25;
				}
			}
			if (this.arrObject[i].name == "gravityChangerGroupBottom4")
			{
				for (let j = 2; j < this.arrObject[i].mesh.children.length - 1; j++)
				{
					this.arrObject[i].mesh.children[j].rotation.x = Math.sin(Date.now() * 0.001 + (j - 2) * 5) * 0.1 + Math.PI / 2;
					this.arrObject[i].mesh.children[j].rotation.y = Math.sin(Date.now() * 0.001 + (j - 2) * 5) * 0.1 + Math.cos(Date.now() * 0.001) * 0.1;;
					this.arrObject[i].mesh.children[j].position.y = Math.sin(Date.now() * 0.001 + (j - 2) * 5) * 0.03 + ( 0.25 * (j - 2) / 2) + 0.25;
				}
			}
			if (this.arrObject[i].name == "gravityChangerGroupTop1")
			{
				for (let j = 2; j < this.arrObject[i].mesh.children.length - 1; j++)
				{
					
					this.arrObject[i].mesh.children[j].rotation.x = Math.sin(Date.now() * 0.001 + (j - 2) * 5) * 0.1 + Math.PI / 2;
					this.arrObject[i].mesh.children[j].rotation.y = Math.sin(Date.now() * 0.001 + (j - 2) * 5) * 0.1 + Math.cos(Date.now() * 0.001) * 0.1;;
					this.arrObject[i].mesh.children[j].position.y = Math.sin(Date.now() * 0.001 + (j - 2) * 5) * 0.03 + ( 0.25 * (j - 2) / 2) + 3.25;
				}
			}
			if (this.arrObject[i].name == "gravityChangerGroupTop2")
			{
				for (let j = 2; j < this.arrObject[i].mesh.children.length - 1; j++)
				{
					
					this.arrObject[i].mesh.children[j].rotation.x = Math.sin(Date.now() * 0.001 + (j - 2) * 5) * 0.1 + Math.PI / 2;
					this.arrObject[i].mesh.children[j].rotation.y = Math.sin(Date.now() * 0.001 + (j - 2) * 5) * 0.1 + Math.cos(Date.now() * 0.001) * 0.1;;
					this.arrObject[i].mesh.children[j].position.y = Math.sin(Date.now() * 0.001 + (j - 2) * 5) * 0.03 + ( 0.25 * (j - 2) / 2) + 3.25;;
				}
			}
			if (this.arrObject[i].name == "gravityChangerGroupTop3")
			{
				for (let j = 2; j < this.arrObject[i].mesh.children.length - 1; j++)
				{
					this.arrObject[i].mesh.children[j].rotation.x = Math.sin(Date.now() * 0.001 + (j - 2) * 5) * 0.1 + Math.PI / 2;
					this.arrObject[i].mesh.children[j].rotation.y = Math.sin(Date.now() * 0.001 + (j - 2) * 5) * 0.1 + Math.cos(Date.now() * 0.001) * 0.1;;
					this.arrObject[i].mesh.children[j].position.y = Math.sin(Date.now() * 0.001 + (j - 2) * 5) * 0.03 + ( 0.25 * (j - 2) / 2) + 3.25;
				}
			}
			if (this.arrObject[i].name == "gravityChangerGroupTop4")
			{
				for (let j = 2; j < this.arrObject[i].mesh.children.length - 1; j++)
				{
					this.arrObject[i].mesh.children[j].rotation.x = Math.sin(Date.now() * 0.001 + (j - 2) * 5) * 0.1 + Math.PI / 2;
					this.arrObject[i].mesh.children[j].rotation.y = Math.sin(Date.now() * 0.001 + (j - 2) * 5) * 0.1 + Math.cos(Date.now() * 0.001) * 0.1;;
					this.arrObject[i].mesh.children[j].position.y = Math.sin(Date.now() * 0.001 + (j - 2) * 5) * 0.03 + ( 0.25 * (j - 2) / 2) + 3.25;;
				}
			}
		}
	};
};

export { Map };
/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Map.js                                             :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: hubourge <hubourge@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/08/20 14:52:55 by hubourge          #+#    #+#             */
/*   Updated: 2024/08/21 17:03:56 by hubourge         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

/*
	Todo (Eddy) :
		- Ajouter la transparence sur les murs sur la distance de la balle (OK)
		- Ajouter des textures selon le type : number pour couleur, string pour img (OK)
		- Ajouter une fonctione pour modifier la gravité
*/

const loader = new GLTFLoader();

class Map
{
	scene = null;
	arrObject = [];
	ballObject = null;
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
	mapLength = 0;

	constructor(scene, length)
	{
		this.scene = scene;
		this.centerPos.x = 0;
		this.centerPos.y = 0.15;
		this.centerPos.z = -length / 2 + length / 2;
		this.mapLength = length;
		scene.add(this.#createPlanes(7.5, length, -(Math.PI / 2), "planeBottom", true, 0xaaffff));
		scene.add(this.#createPlanes(7.5, length, (Math.PI / 2), "planeTop", false, '/textures/testTmp.jpg'));
		scene.add(this.#createWall(-3.5, 0.4, -length/2, "wallLeft"));
		scene.add(this.#createWall(3.5, 0.4, -length/2, "wallRight"));
		this.#createGravityChanger(0, 0.2, 4, "gravityChangerGroup1");
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
		this.arrObject.push({mesh: mesh, name: name});
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
		this.arrObject.push({mesh: mesh, name: name});
		return (mesh);
	};

	#createGravityChanger(x, y, z, name)
	{
		for (let i = 0; i < this.arrObject.length; i++)
		{
			if (this.arrObject[i].name == name + "1")
				throw Error("Name already exist.");
		}
		const geometry0	= new THREE.CircleGeometry(0.2, 24);
		const material0	= new THREE.MeshPhysicalMaterial({color: 0xaaffaa});
		const mesh0		= new THREE.Mesh(geometry0, material0);
		mesh0.rotateX(-Math.PI / 2);
		mesh0.position.set(x, y - 0.048, z);
		
		const geometry	= new THREE.CircleGeometry(0.24, 24);
		const material	= new THREE.MeshPhysicalMaterial({color: 0x00ff00});
		const mesh		= new THREE.Mesh(geometry, material);
		mesh.rotateX(-Math.PI / 2);
		mesh.position.set(x, y - 0.049, z);
		
		const geometry1	= new THREE.TorusGeometry(1, 0.1, 12, 24);
		const material1	= new THREE.MeshPhysicalMaterial({color: 0x00ff00});
		const mesh1		= new THREE.Mesh(geometry1, material1);
		mesh1.rotateX(-Math.PI / 2);
		mesh1.position.set(x, y, z);
		mesh1.scale.set(0.2, 0.2, 0.2);
		material1.transparent = true;
		material1.opacity = 0.75;
		
		const geometry2	= new THREE.TorusGeometry(1, 0.1, 12, 24);
		const material2	= new THREE.MeshPhysicalMaterial({color: 0x00ff00});
		const mesh2		= new THREE.Mesh(geometry2, material2);
		mesh2.rotateX(-Math.PI / 2);
		mesh2.position.set(x, y + 0.1, z);
		mesh2.scale.set(0.18, 0.18, 0.18);
		material2.transparent = true;
		material2.opacity = 0.65;

		const geometry3	= new THREE.TorusGeometry(1, 0.1, 12, 24);
		const material3	= new THREE.MeshPhysicalMaterial({color: 0x00ff00});
		const mesh3		= new THREE.Mesh(geometry3, material3);
		mesh3.rotateX(-Math.PI / 2);
		mesh3.position.set(x, y + 0.2, z);
		mesh3.scale.set(0.16, 0.16, 0.16);
		material3.transparent = true;
		material3.opacity = 0.35;
	
		// collider
		const geometry4	= new THREE.CylinderGeometry(0.15, 0.15, 0.5);
		const material4	= new THREE.MeshPhysicalMaterial({color: 0x00ff00});
		const mesh4		= new THREE.Mesh(geometry4, material4);
		mesh4.position.set(x, y + 0.2, z);
		material4.transparent = true;
		material4.opacity = 0.1;
		
		const group = new THREE.Group();
		group.add(mesh0);
		group.add(mesh);
		group.add(mesh1);
		group.add(mesh2);
		group.add(mesh3);
		group.add(mesh4);
		this.arrObject.push({mesh: group, name: name});

		this.scene.add(group);
	};

	// createGravityChanger(ball, x, z, onTop)
	// {
	// 	if (this.ballObject == null)
	// 		throw Error("Ball is not init");
		
	// }

	update(ball)
	{
		for (let i = 0; i < this.arrObject.length; i++)
		{
			if (this.arrObject[i].name == "wallLeft")
			{
				if (ball.position.z < 0.1 && ball.position.z > -this.mapLength + 1)
					this.arrObject[i].mesh.position.z = ball.position.z;
				this.arrObject[i].mesh.position.y = ball.position.y;
			}
			if (this.arrObject[i].name == "wallRight")
			{
				if (ball.position.z < 0.1 && ball.position.z > -this.mapLength + 1)
					this.arrObject[i].mesh.position.z = ball.position.z;
				this.arrObject[i].mesh.position.y = ball.position.y;
			}
			if (this.arrObject[i].name == "wallLeft")
			{
				let	diff = ball.position.x - this.arrObject[i].mesh.position.x - 0.1;

				if (diff > 2)
					this.arrObject[i].mesh.material.opacity = 0;
				else
					this.arrObject[i].mesh.material.opacity = 1 - (diff / 2);
			}
			if (this.arrObject[i].name == "wallRight")
			{
				let	diff = this.arrObject[i].mesh.position.x - ball.position.x - 0.1;

				if (diff > 2)
					this.arrObject[i].mesh.material.opacity = 0;
				else
					this.arrObject[i].mesh.material.opacity = 1 - (diff / 2);
			}
			if (this.arrObject[i].name == "gravityChangerGroup1")
			{
				for (let j = 2; j < this.arrObject[i].mesh.children.length - 1; j++)
				{
					
					this.arrObject[i].mesh.children[j].rotation.x = Math.sin(Date.now() * 0.001 + (j - 2) * 5) * 0.1 + Math.PI / 2;
					this.arrObject[i].mesh.children[j].rotation.y = Math.sin(Date.now() * 0.001 + (j - 2) * 5) * 0.1 + Math.cos(Date.now() * 0.001) * 0.1;;
					this.arrObject[i].mesh.children[j].position.y = Math.sin(Date.now() * 0.001 + (j - 2) * 5) * 0.03 + ( 0.25 * (j - 2) / 2) + 0.25;
				}
			}
		}
	};
};

export { Map };
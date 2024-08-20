/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Map.js                                             :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: edbernar <edbernar@student.42angouleme.    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/08/20 14:52:55 by hubourge          #+#    #+#             */
/*   Updated: 2024/08/21 00:59:01 by edbernar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import * as THREE from 'three';

/*
	Todo (Eddy) :
		- Ajouter la transparence sur les murs sur la distance de la balle (OK)
		- Ajouter des textures selon le type : number pour couleur, string pour img (OK)
*/

class Map
{
	scene = null;
	arrObject = [];
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
		scene.add(this.#createPlanes(7.5, length, -(Math.PI / 2), "planeBottom", true, 0xaaffff));
		scene.add(this.#createPlanes(7.5, length, (Math.PI / 2), "planeTop", false, '/textures/testTmp.jpg'));
		scene.add(this.#createWall(-3.5, 0.4, -length/2, "wallLeft"));
		scene.add(this.#createWall(3.5, 0.4, -length/2, "wallRight"));
		this.centerPos.x = 0;
		this.centerPos.y = 0.15;
		this.centerPos.z = -length/2;
		this.mapLength = length;
	};

	#createPlanes(x, y, rot, name, isBottom, visual) // passer un materiel
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
		{
			console.log("kjdsjksd");
			material = new THREE.MeshPhysicalMaterial();
		}
		mesh = new THREE.Mesh(geometry, material);
		mesh.rotateX(rot);
		if (isBottom)
			mesh.position.set(0, 0.15, -6);
		else
			mesh.position.set(0, 3.15, -6);
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
		mesh.material.transparent = true;
		mesh.material.opacity = 0.5;
		this.arrObject.push({mesh: mesh, name: name});
		return (mesh);
	};

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
		}
	}
};

export { Map };
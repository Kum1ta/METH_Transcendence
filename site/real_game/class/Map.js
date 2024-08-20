/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Map.js                                             :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: hubourge <hubourge@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/08/20 14:52:55 by hubourge          #+#    #+#             */
/*   Updated: 2024/08/20 17:24:15 by hubourge         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import * as THREE from 'three';



class Map
{
	scene = null;
	arrObject = [];
	centerPos = {x:-1,y:-1,z:-1}

	constructor(scene, length)
	{
		this.scene = scene;
		scene.add(this.#createPlanes(7.5, length, -(Math.PI / 2), "planeBottom", true));
		scene.add(this.#createPlanes(7.5, length, (Math.PI / 2), "planeTop", false));
		scene.add(this.#createWall(-3.5, 0.15, -length/2, "wallLeft"));
		scene.add(this.#createWall(3.5, 0.15, -length/2, "wallRight"));
		this.centerPos.x = 0;
		this.centerPos.y = 0.15;
		this.centerPos.z = -length/2;
	};

	#createPlanes(x, y, rot, name, isBottom) // passer un materiel
	{
		for (let i = 0; i < this.arrObject.length; i++)
		{
			if (this.arrObject[i].name == name)
				throw Error("Name already exist.");
		}
		const geometry	= new THREE.PlaneGeometry(x, y);
		const material	= new THREE.MeshPhysicalMaterial()
		const mesh		= new THREE.Mesh(geometry, material);

		mesh.rotateX(rot);
		if (isBottom)
			mesh.position.set(0, 0.15, -6);
		else
			mesh.position.set(0, 3.05, -6);
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
		const geometry	= new THREE.BoxGeometry(0.05, 1, 1.25);
		const material	= new THREE.MeshPhysicalMaterial();
		const mesh		= new THREE.Mesh(geometry, material);

		mesh.position.set(x, y, z);
		this.arrObject.push({mesh: mesh, name: name});
		return (mesh);
	};
};

export { Map };
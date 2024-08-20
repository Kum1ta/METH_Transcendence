/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Map.js                                             :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: hubourge <hubourge@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/08/20 14:52:55 by hubourge          #+#    #+#             */
/*   Updated: 2024/08/20 16:34:25 by hubourge         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import * as THREE from 'three';



class Map
{
	scene = null;
	arrObject = [];

	constructor(scene, length)
	{
		this.scene = scene;
		scene.add(this.#createPlanes(7.5, length, -(Math.PI / 2), "plane1"));
		// scene.add(this.#createWalls(0, 0, 0, "wallLeft"));
	};

	#createPlanes(x, y, rot, name) // passer un materiel
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
		mesh.position.set(0, 0.15, -6);
		this.arrObject.push({mesh: mesh, name: name});
		return (mesh);
	};

	// #createWalls(x, y, z, name)
	// {
	// 	const geometry	= new THREE.BoxGeometry(20, 20, 20);
	// 	const material	= new THREE.MeshPhysicalMaterial();
	// 	const mesh		= new THREE.Mesh(geometry, material);

	// 	mesh.position.set(x, y, z);
	// 	this.arrObject.push({mesh: mesh, name: name});
	// 	return (mesh);
	// };
};

export { Map };
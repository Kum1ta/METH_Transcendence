/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Map.js                                             :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: edbernar <edbernar@student.42angouleme.    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/08/28 12:23:48 by edbernar          #+#    #+#             */
/*   Updated: 2024/08/28 17:01:17 by edbernar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import * as THREE from 'three';

const	width		=	25;
const	height		=	12.5;
let		spotLight	=	null;
let		wallTop		=	null;
let		wallBottom	=	null;

class Map
{
	static create(scene)
	{
		createGround(scene);
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
	}

	static dispose()
	{
		if (spotLight)
			spotLight.dispose();
		spotLight = null;
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
}

function createWall(onTop)
{
	const	geometry	=	new THREE.BoxGeometry(width, 0.7, 0.2);
	const	material	=	new THREE.MeshPhysicalMaterial({color: 0x333333});
	const	mesh		=	new THREE.Mesh(geometry, material);

	if (onTop)
		mesh.position.z = -6.15;
	else
		mesh.position.z = 6.15;
	mesh.position.y += 0.35;
	return (mesh);
}

export { Map, wallBottom, wallTop };
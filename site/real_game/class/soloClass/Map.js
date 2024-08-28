/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Map.js                                             :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: edbernar <edbernar@student.42angouleme.    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/08/28 12:23:48 by edbernar          #+#    #+#             */
/*   Updated: 2024/08/28 14:01:24 by edbernar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import * as THREE from 'three';

class Map
{
	constructor(scene)
	{
		createGround(scene);
	}

	dispose()
	{
		
	}
}

function createGround(scene)
{
	const	geometry	=	new THREE.PlaneGeometry(window.innerWidth / 100, window.innerHeight / 100);
	const	material	=	new THREE.MeshPhysicalMaterial();
	const	mesh		=	new THREE.Mesh(geometry, material);

	scene.add(mesh);
}

export { Map };
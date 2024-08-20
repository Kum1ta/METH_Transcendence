/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Ball.js                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: edbernar <edbernar@student.42angouleme.    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/08/20 17:02:47 by edbernar          #+#    #+#             */
/*   Updated: 2024/08/20 17:23:41 by edbernar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import * as THREE from 'three';

const centerPos = {
	x: 0,
	y: 0.3,
	z: -0.1
}

class Ball
{
	object = null;

	constructor(scene)
	{
		this.object = this.#createBall();

		scene.add(this.object);
	}

	#createBall()
	{
		const	geometry	= new THREE.SphereGeometry(0.15);
		const	material	= new THREE.MeshPhysicalMaterial({ color: 0xff5555 });
		const	mesh		= new THREE.Mesh(geometry, material);

		mesh.receiveShadow = true;
		mesh.castShadow = true;
		mesh.position.set(centerPos.x, centerPos.y, centerPos.z);
		return (mesh);
	}
}

export { Ball };
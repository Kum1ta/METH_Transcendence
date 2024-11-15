/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Ball.js                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: hubourge <hubourge@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/08/28 15:58:03 by edbernar          #+#    #+#             */
/*   Updated: 2024/11/14 15:34:44 by hubourge         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import * as THREE from '/static/javascript/three/build/three.module.js'
import { wallTop, wallBottom } from '/static/javascript/multiLocalGame/Map.js'

let		ball		=	null;
let		speed		=	0.15;
let		dir			=	-1;
let		interval	=	null;

class Ball
{
	static create(scene)
	{
		ball = createBall();

		scene.add(ball);
		ball.rotateY(2.39);
	}

	static dispose()
	{
		ball = null;
	}

	static update()
	{
	}

}

function createBall()
{
	const	geometry	= new THREE.SphereGeometry(0.3);
	const	material	= new THREE.MeshPhysicalMaterial({color: 0xffffff});
	const	mesh		= new THREE.Mesh(geometry, material);

	mesh.castShadow = true;
	mesh.receiveShadow = true;
	mesh.material.transparent = true;
	mesh.position.set (0, 0.3, 0);
	return (mesh);
}

export { Ball, ball };

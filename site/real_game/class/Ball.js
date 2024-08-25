/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Ball.js                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: edbernar <edbernar@student.42angouleme.    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/08/20 17:02:47 by edbernar          #+#    #+#             */
/*   Updated: 2024/08/24 23:47:26 by edbernar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import * as THREE from '/static/javascript/three/build/three.module.js';

/*
	Todo (Eddy) :
		- Ajouter fonction pour changer la gravité de la balle (OK)
		- Ajouter un effet plus naturel pour le déplacement de la balle (OK)
		
*/

class Ball
{
	object		= null;
	centerPos	= {};
	limits		= {};
	interval	= null;

	constructor(scene, map)
	{
		this.object = this.#createBall();
		this.centerPos = map.centerPos;
		this.centerPos.y += this.object.geometry.parameters.radius;
		this.limits = map.playerLimits;
		this.resetPosBall();
		scene.add(this.object);
	}

	#createBall()
	{
		const	geometry	= new THREE.SphereGeometry(0.15);
		const	material	= new THREE.MeshPhysicalMaterial({ color: 0xff5555 });
		const	mesh		= new THREE.Mesh(geometry, material);

		mesh.receiveShadow = true;
		mesh.castShadow = true;
		mesh.position.set(this.centerPos.x, this.centerPos.y, this.centerPos.z);
		return (mesh);
	}

	resetPosBall()
	{
		this.setPosition(this.centerPos.x, this.centerPos.y, this.centerPos.z);
	}

	setPosition(x, y, z)
	{
		this.object.position.set(x, y, z);
	}

	changeGravity(ballIsOnJumper)
	{
		let		diffTop	= this.limits.up - this.object.position.y;
		let		diffBot	= this.object.position.y - this.limits.down;
		let		speed	= 0.15;
		const	slower	= speed / 3;

		if (diffBot > diffTop)
			speed *= -1;
		if (this.interval)
			clearInterval(this.interval);
		this.interval = setInterval(() => {
			this.object.position.y += speed;
			if ((speed > 0 && this.object.position.y >= this.limits.up)
				|| (speed < 0 && this.object.position.y <= this.limits.down))
			{
				clearInterval(this.interval);
				this.interval = null;
				if (speed > 0)
					this.setPosition(this.object.position.x, this.limits.up, this.object.position.z);
				else
					this.setPosition(this.object.position.x, this.limits.down, this.object.position.z);
				ballIsOnJumper.can = true;
			}
			speed -= speed * slower;
		}, 10);
	}

	/*---------------- FUNCTION FOR TEST ----------------*/
	initMoveBallTmp()
	{
		console.warn("Don't forget to remove function initMoveBallTmp");
		const	speedBallTmp	=	0.1;
		
		document.addEventListener('keypress', (e) => {
			if (e.key == '4')
				this.object.position.x -= speedBallTmp;
			if (e.key == '6')
				this.object.position.x += speedBallTmp;
			if (e.key == '8')
				this.object.position.z -= speedBallTmp;
			if (e.key == '2')
				this.object.position.z += speedBallTmp;
			if (e.key == '9')
				this.changeGravity();
		});
	}
	/*---------------------------------------------------*/
}


export { Ball };
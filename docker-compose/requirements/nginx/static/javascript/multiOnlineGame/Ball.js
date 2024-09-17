/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Ball.js                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: edbernar <edbernar@student.42angouleme.    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/08/20 17:02:47 by edbernar          #+#    #+#             */
/*   Updated: 2024/09/17 15:13:50 by edbernar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import * as CANNON from '/static/javascript/cannon-es/dist/cannon-es.js'
import * as THREE from '/static/javascript/three/build/three.module.js'

const	timeStep		=	1 / 60;

class Ball
{
	object		= null;
	centerPos	= {};
	limits		= {};
	interval	= null;
	world		= null;
	ballBody	= null;

	constructor(scene, map)
	{
		this.object = this.#createBall();
		this.centerPos = map.centerPos;
		this.centerPos.y += this.object.geometry.parameters.radius;
		this.limits = map.playerLimits;
		this.resetPosBall();
		scene.add(this.object);
		this.world = new CANNON.World();
		this.ballBody = new CANNON.Body({
			shape: new CANNON.Sphere(0.15),
			mass: 10,
		});
		this.ballBody.position.copy(this.object.position);
		this.world.addBody(this.ballBody);
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
		let		warn = false;
		
		document.addEventListener('keypress', (e) => {
			if (!this.object && !warn)
			{
				console.warn("EventListener in initMoveBallTmp() is still here");
				warn = true;
				return ;
			}
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

	updatePos(content)
	{
		// {action: 5, pos: [ball.object.position.x, ball.object.position.z], velocity: [ball.object.velocity.x, ball.object.velocity.z]}

		this.ballBody.position.x = content.pos[0];
		this.ballBody.position.z = content.pos[1];
		this.ballBody.velocity.set(content.velocity[0], 0, content.velocity[1]);
	}

	update()
	{
		this.world.step(timeStep);
		this.object.position.copy(this.ballBody.position);
		this.object.quaternion.copy(this.ballBody.quaternion);
	}

	dispose()
	{
		if (this.interval)
			clearInterval(this.interval);
		this.interval = null;
		if (this.object)
		{
			if (this.object.geometry)
				this.object.geometry.dispose();
			if (this.object.material)
				this.object.material.dispose();
			if (this.object.texture)
				this.object.texture.dispose();
		}
		this.object = null;
	}
}


export { Ball };
/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Ball.js                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: madegryc <madegryc@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/08/20 17:02:47 by edbernar          #+#    #+#             */
/*   Updated: 2024/09/30 19:17:05 by madegryc         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import * as THREE from '/static/javascript/three/build/three.module.js'

class Ball
{
	object		= null;
	centerPos	= {};
	limits		= {};
	interval	= null;
	lastTime	= 0;
	velocity	= [0, 0];
	lastPos		= [0, 0, 0];

	constructor(scene, map)
	{
		this.object = this.#createBall();
		this.centerPos = map.centerPos;
		this.centerPos.y += this.object.geometry.parameters.radius;
		this.limits = map.playerLimits;
		this.resetPosBall();
		scene.add(this.object);
		// this.world = new CANNON.World();
		// this.ballBody = new CANNON.Body({
		// 	shape: new CANNON.Sphere(0.15),
		// 	mass: 10,
		// });
		// this.ballBody.position.copy(this.object.position);
		// this.world.addBody(this.ballBody);
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

	resetScaleBall()
	{
		this.object.scale.set(1, 1, 1);
	};

	setPosition(x, y, z)
	{
		this.object.position.set(x, y, z);
	}

	changeGravity()
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
			}
			speed -= speed * slower;
		}, 10);
	}

	updatePos(content)
	{
		this.lastTime = new Date().getTime();
		this.lastPos = [content.pos[0], this.object.position.y, content.pos[1]];
		this.velocity = content.velocity;
	}

	update()
	{
		const	deltaTime = ((new Date().getTime()) - this.lastTime) / 1000;
		const	x = this.lastPos[0] + (deltaTime * this.velocity[0]);
		const	z = this.lastPos[2] + (deltaTime * this.velocity[1]);
		this.object.position.set(x, this.object.position.y, z);
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
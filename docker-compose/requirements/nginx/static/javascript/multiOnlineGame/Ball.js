/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Ball.js                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: edbernar <edbernar@student.42angouleme.    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/08/20 17:02:47 by edbernar          #+#    #+#             */
/*   Updated: 2024/10/06 15:57:46 by edbernar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import * as THREE from '/static/javascript/three/build/three.module.js'
import { map, opponent, player} from '/static/javascript/multiOnlineGame/multiOnlineGamePage.js'


class Ball
{
	object		= null;
	centerPos	= {};
	limits		= {};
	interval	= null;
	start		= 0;
	srvPos		= {
		time : 0,
		pos : [0, 0, 1],
		vel : [0, 0] 
	}
	ballRadius = 0.15

	mapLimits = {
		left : -3.5 + this.ballRadius,
		right : 3.5 - this.ballRadius,
		back : -6.25 + this.ballRadius,
		front : 6.25 - this.ballRadius
	}

	wallWidth = 0.1
	wallLength = 1

	playerLength = 1 + (this.ballRadius * 4) 

	constructor(scene, map)
	{
		this.object = this.#createBall();
		this.centerPos = map.centerPos;
		this.centerPos.y = this.object.geometry.parameters.radius;
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
		this.setPosition(this.centerPos.x, this.object.geometry.parameters.radius * 2, this.centerPos.z);
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
		if(content.game_time == 0)
			this.start = performance.now()
		let gameTime = performance.now() - this.start
		if(content.game_time > gameTime)
			this.start -= content.game_time - gameTime 
		this.srvPos = {
			time : content.game_time,
			pos : [content.pos[0], content.pos[1]],
			vel : content.velocity
		}
	}

	getBetterPositions()
	{
		let walls = []
//		let jumpers = []
		for(let x = 0; x < map.arrObject.length; x++)
		{
//			if(map.arrObject[x].type == "jumperBottom" || map.arrObject[x].type == "jumperTop")
//			{
//				let jumper = map.arrObject[x]
//				jumpers.push({pos:[jumper.mesh.children[0].position.x,jumper.mesh.children[0].position.z],
//				isUp : jumper.type == "jumperTop"})
//			}
			if(map.arrObject[x].type == "wallObstacle")
			{
				let wall = map.arrObject[x]
				walls.push({pos:[wall.mesh.position.x, wall.mesh.position.z],isUp:wall.isUp})
			}
		}
		return({walls:walls/*,jumpers:jumpers*/})
	}

	hitPlayer(ballSlope, ballOffset, ballVel)
	{
		let playerPos = ballVel[0] < 0 ? opponent.object.position.x : player.object.position.x
		let limit = this.mapLimits.front
		if(ballVel[1] < 0)	
			limit *= -1
		let hitPos = this.lineIntersect(limit, ballSlope, ballOffset)
		let relPos = hitPos - playerPos
		return(Math.abs(relPos) < this.playerLength / 2)
	}

	closestTimeMapLimit(ballSlope, ballOffset, ballPos, ballVel)
	{
		let time = Infinity;
		let tmpTime = Infinity;

		if(ballVel[0] < 0)
		{
			let dist = ballPos[0] - this.mapLimits.left
			time = dist / Math.abs(ballVel[0])
		}	
		else if(ballVel[0] > 0)
		{
			let dist = this.mapLimits.right - ballPos[0]
			time = dist / Math.abs(ballVel[0])
		}

		if(ballVel[1] < 0)
		{
			let dist = ballPos[1] - this.mapLimits.back
			tmpTime = dist / Math.abs(ballVel[1])
		}
		if(ballVel[1] > 0)
		{
			let dist = this.mapLimits.front - ballPos[1]
			tmpTime = dist / Math.abs(ballVel[1])
		}
		if(tmpTime < time && this.hitPlayer(ballSlope, ballOffset, ballVel))
			return([2, tmpTime])
		return([1, time])
	}

	lineIntersect(line, ballSlope, ballOffset)
	{
		return((line - ballOffset) / ballSlope)
	}

	getWallHitTime(walls, ballSlope, ballOffset, ballPos, ballVel, ballUp)
	{
		let wallSide = (this.wallWidth / 2) + this.ballRadius
		if(ballVel[1] > 0)
			wallSide *= -1
		let hitPos = this.lineIntersect(wallSide, ballSlope, ballOffset)
		let finalTime = Infinity
		for(let i = 0; i < walls.length; i++)
		{
			if(walls[i].isUp != ballUp)
				continue;
			let relPos = walls[i].pos[0] - hitPos
			if(Math.abs(relPos) < (this.wallLength / 2) + this.ballRadius)
			{
				let time = (hitPos - ballPos[0]) / ballVel[0]
				if(time > 0 && time < finalTime)
					finalTime = time
			}
		}
		return(finalTime)
	}

	getNextPosTime(obstacles, ballPos,ballVel, ballUp)
	{
		let hitDir;
		let time;
		let nextPos = [ballPos[0] + ballVel[0], ballPos[1] + ballVel[1]]
		let ballSlope = (nextPos[1] - ballPos[1]) / (nextPos[0] - ballPos[0])
		let ballOffset = ballPos[1] - (ballSlope * ballPos[0]);

		[hitDir, time] = this.closestTimeMapLimit(ballSlope, ballOffset, ballPos, ballVel)
		let wallHitTime = this.getWallHitTime(obstacles.walls, ballSlope, ballOffset, ballPos, ballVel, ballUp)
		if(wallHitTime > 0 && wallHitTime < time)
			[hitDir ,time] = [2, wallHitTime]
		ballVel[hitDir - 1] *= -1
		return([time, ballVel])
	}

	calcNewPos(delta,obstacles, ballPos, ballVel, ballUp)
	{
		//kill me
		let iter = 0
		if((ballVel[0] == 0 && ballVel[1] == 0) || delta <= 0)
			return(ballPos)
		while(1)
		{
			let time;
			let nextVel;

			[time, nextVel] = this.getNextPosTime(obstacles, ballPos, [...ballVel], ballUp)
			if((time * 1000) > delta)
				return([ballPos[0] + (ballVel[0] * (delta / 1000)),ballPos[1] + (ballVel[1] * (delta /1000))])
			ballPos[0] += ballVel[0] * time
			ballPos[1] += ballVel[1] * time
			ballVel = nextVel
			delta -= time * 1000
			this.object.material.color.set(0xffffff)
			iter++;
			if(iter == 50)
				return([0,0])
		}
	}

	update()
	{
		// TODO: m[ae]th
		this.object.material.color.set(0xff5555)
		let gameTime = performance.now() - this.start
		let lastPosDelta = gameTime - this.srvPos.time
		let ballPos = [...this.srvPos.pos];
		let ballVel = [...this.srvPos.vel];
		let ballUp = this.object.position.y > (this.limits.up / 2)
		let betterPositions = this.getBetterPositions()
		let newPos = this.calcNewPos(lastPosDelta,betterPositions, ballPos, ballVel, ballUp)
		this.object.position.set(newPos[0], this.object.position.y, newPos[1]);
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

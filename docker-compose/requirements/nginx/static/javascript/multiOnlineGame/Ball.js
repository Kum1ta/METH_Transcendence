/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Ball.js                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: edbernar <edbernar@student.42angouleme.    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/08/20 17:02:47 by edbernar          #+#    #+#             */
/*   Updated: 2024/10/11 10:43:04 by edbernar         ###   ########.fr       */
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
		makeParticules(scene);
	}

	#createBall()
	{
		const	geometry	= new THREE.SphereGeometry(0.15);
		const	material	= new THREE.MeshPhysicalMaterial({ color: 0xff5555 });
		const	mesh		= new THREE.Mesh(geometry, material);

		mesh.receiveShadow = true;
		mesh.castShadow = true;
		mesh.material.transparent = true;
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

	setVisibility(bool)
	{
		if (bool)
			this.object.material.opacity = 1;
		else
			this.object.material.opacity = 0;
	}

	setCastShadow(bool)
	{
		if (bool)
			this.object.castShadow = true;
		else 
			this.object.castShadow = false;
	}

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
		{
			speed *= -1;
			this.setCastShadow(true);
		}
		else
			this.setCastShadow(false);
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
		this.updateTrail();
	}

	updateTrail() {
		const trailColors = trailGeometry.attributes.customColor.array;
	
		for (let i = trailPositions.length - 3; i >= 3; i--)
			trailPositions[i] = trailPositions[i - 3];
		trailPositions[0] = this.object.position.x;
		trailPositions[1] = this.object.position.y;
		trailPositions[2] = this.object.position.z;
	
		for (let i = 0; i < 33; i++)
			trailSizes[i] = Math.max(0.5 * (1 - i / 33), 0.1);
	
		const velocityMagnitude = Math.sqrt(
			this.srvPos.vel[0] * this.srvPos.vel[0] +
			this.srvPos.vel[1] * this.srvPos.vel[1]
		);
		
		// Normalisation de la vitesse entre 0 (lente) et 1 (rapide)
		const speedFactor = Math.min(velocityMagnitude / 10, 1); // Divisé par 10 pour ajuster l'échelle
		for (let i = 0; i < 33; i++) {
			const alpha = Math.max(1 - i / 33, 0);
			
			// Couleur entre blanc et rouge selon la vitesse
			const r = 1; // Rouge maximum
			const g = 1 - speedFactor; // Moins de vert avec l'augmentation de la vitesse
			const b = 1 - speedFactor; // Moins de bleu avec l'augmentation de la vitesse
	
			// Appliquer la couleur
			trailColors[i * 4] = r;
			trailColors[i * 4 + 1] = g;
			trailColors[i * 4 + 2] = b;
			trailColors[i * 4 + 3] = alpha;
		}
	
		// Marquer les attributs comme nécessitant une mise à jour
		trailGeometry.attributes.position.needsUpdate = true;
		trailGeometry.attributes.size.needsUpdate = true;
		trailGeometry.attributes.customColor.needsUpdate = true;
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

let trailGeometry = null;
let trailPositions = null;
let trailMaterial = null;
let trailSizes = null;
let trail = null;

const vertexShader = `
	attribute float size;
	attribute vec4 customColor;
	varying vec4 vColor;
	void main() {
		vColor = customColor; // Envoie la couleur de la particule
		vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
		gl_PointSize = size * (300.0 / -mvPosition.z);
		gl_Position = projectionMatrix * mvPosition;
	}
`;

const fragmentShader = `
	varying vec4 vColor; // Reçoit la couleur et l'alpha du vertex shader
	void main() {
		gl_FragColor = vColor; // Utilise la couleur avec l'alpha
	}
`;

function makeParticules(scene) {
	trailGeometry = new THREE.BufferGeometry();

	trailPositions = new Float32Array(99);
	trailGeometry.setAttribute('position', new THREE.BufferAttribute(trailPositions, 3));

	trailSizes = new Float32Array(33);
	trailGeometry.setAttribute('size', new THREE.BufferAttribute(trailSizes, 1));

	const trailColors = new Float32Array(132);
    trailGeometry.setAttribute('customColor', new THREE.BufferAttribute(trailColors, 4));

	trailMaterial = new THREE.ShaderMaterial({
		vertexShader: vertexShader,
		fragmentShader: fragmentShader,
		transparent: true,
        blending: THREE.AdditiveBlending
	});

	trail = new THREE.Points(trailGeometry, trailMaterial);
	scene.add(trail);
}


export { Ball };

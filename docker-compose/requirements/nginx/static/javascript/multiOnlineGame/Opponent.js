/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Opponent.js                                        :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: edbernar <edbernar@student.42angouleme.    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/08/21 10:34:49 by edbernar          #+#    #+#             */
/*   Updated: 2024/09/17 00:22:47 by edbernar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { goalAnimation } from '/static/javascript/multiOnlineGame/Player.js'

let opponentExist = false;
let mapLength = 0;

class Opponent
{
	object		= null;
	speed		= 4;
	interval	= null;
	interval2	= null;
	limits = {
		up : 3,
		down: 0.3,
		left: -3,
		right: 3,
	};
	last		= false;
	playerGoalAnimation = null;

	constructor (object, map, indexGoalAnimation)
	{
		if (opponentExist)
			throw Error("Opponent is already init.");
		opponentExist = true;
		this.object = object;
		this.object.position.set(0, 0.3, -map.mapLength / 2 + 0.2);
		mapLength = map.mapLength;
		this.playerGoalAnimation = goalAnimation[indexGoalAnimation];
	}

	dispose()
	{
		opponentExist = false;
	}

	update()
	{
	}

	resetPosOpponent()
	{
		this.object.position.set(0, 0.3, -mapLength / 2 + 0.2);
	}

	movePlayer(content)
	{
		const lerp			= (start, end, t) => start + (end - start) * t;
		const thisClass		= this;
		const speedFactor	= 0.5;

		if (thisClass.animationFrame)
			cancelAnimationFrame(thisClass.animationFrame);
		const animate = () => {
			this.object.position.x = lerp(this.object.position.x, content.pos, speedFactor);
			if (Math.abs(this.object.position.x - content.pos) < 0.01)
				this.object.position.x = content.pos;
			else
				thisClass.animationFrame = requestAnimationFrame(animate);
		};

		thisClass.animationFrame = requestAnimationFrame(animate);
	
		if (content.up && thisClass.object.position.y < thisClass.limits.up)
		{
			if (this.interval)
				clearInterval(this.interval);
			thisClass.interval = setInterval(() => {
				thisClass.object.position.y += thisClass.speed / 40;
				if (thisClass.object.position.y >= thisClass.limits.up)
				{
					clearInterval(thisClass.interval);
					thisClass.interval = null;
				}
			}, 5);
		}
		else if (!content.up && thisClass.object.position.y > thisClass.limits.down)
		{
			if (this.interval)
				clearInterval(this.interval);
			this.interval = setInterval(() => {
				thisClass.object.position.y -= thisClass.speed / 40;
				if (thisClass.object.position.y <= thisClass.limits.down)
				{
					clearInterval(thisClass.interval);
					thisClass.interval = null;
					thisClass.object.position.y = thisClass.limits.down;
				}
			}, 5);
		}
	}
}

export { Opponent };
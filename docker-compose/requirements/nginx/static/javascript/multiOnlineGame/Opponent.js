/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Opponent.js                                        :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: edbernar <edbernar@student.42angouleme.    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/08/21 10:34:49 by edbernar          #+#    #+#             */
/*   Updated: 2024/09/16 15:51:15 by edbernar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

let opponentExist = false;

class Opponent
{
	object		= null;
	speed		= 4;
	interval	= null;
	limits = {
		up : 3,
		down: 0.3,
		left: -3,
		right: 3,
	};
	last		= false;

	constructor (object, map)
	{
		if (opponentExist)
			throw Error("Opponent is already init.");
		opponentExist = true;
		this.object = object;
		this.object.position.set(0, 0.3, -map.mapLength / 2 + 0.2);
	}

	dispose()
	{
		opponentExist = false;
	}

	update()
	{
		console.log(this.object.position);
	}

	movePlayer(content)
	{
		const thisClass = this;
		this.object.position.x = content.pos;
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
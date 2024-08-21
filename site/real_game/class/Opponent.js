/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Opponent.js                                        :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: edbernar <edbernar@student.42angouleme.    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/08/21 10:34:49 by edbernar          #+#    #+#             */
/*   Updated: 2024/08/21 14:38:44 by edbernar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { playerExist } from './Player'
import * as THREE from 'three';

let opponentExist = false;

class Opponent
{
	object		= null;
	speed		= 0.1;
	interval	= null;
	limits		= {};
	player		= null;

	constructor (object, map)
	{
		if (!playerExist)
			throw Error('Player need to be init before opponent.')
		if (opponentExist)
			throw Error("Opponent is already init.");
		opponentExist = true;
		this.object = object;
		this.limits = map.limits;
		this.object.position.set(0, 0.3, -map.mapLength / 2 + 0.2);
		this.cleanup = new FinalizationRegistry((heldValue) => {
			playerExist = false;
		})
		this.cleanup.register(this, null);
	}

	update()
	{
		//en attente du serveur
	}
}

export { Opponent };
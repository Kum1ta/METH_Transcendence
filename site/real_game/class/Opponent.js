/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Opponent.js                                        :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: hubourge <hubourge@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/08/21 10:34:49 by edbernar          #+#    #+#             */
/*   Updated: 2024/08/26 17:19:16 by hubourge         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { playerExist } from './Player'
// import * as THREE from '/static/javascript/three/build/three.module.js';
import * as THREE from '/node_modules/three/build/three.module.js';


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
		if (opponentExist)
			throw Error("Opponent is already init.");
		opponentExist = true;
		this.object = object;
		this.limits = map.limits;
		this.object.position.set(0, 0.3, -map.mapLength / 2 + 0.2);
		this.cleanup = new FinalizationRegistry((heldValue) => {
			opponentExist = false;
		})
		this.cleanup.register(this, null);
	}

	update()
	{
		//en attente du serveur
	}
}

export { Opponent };
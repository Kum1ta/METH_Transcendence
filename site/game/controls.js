/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   controls.js                                        :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: hubourge <hubourge@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/08/07 15:20:55 by hubourge          #+#    #+#             */
/*   Updated: 2024/08/07 16:53:34 by hubourge         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import	{ sendRequest } from "./websocket.js";
import * as THREE from 'three';

class Moves {
	wPress = false;
	sPress = false;
	constructor() {};


}

class MoveObject {
	#moves = null;
	#object = null;
	#speed = 0.05;

	constructor(object)
	{
		let			key				= ['w', 's'];
		let			movesValueDown	= [
			() => { this.moves.wPress = true; },
			() => { this.moves.sPress = true; }
		];
		let			movesValueUp	= [
			() => { this.moves.wPress = false; },
			() => { this.moves.sPress = false; }
		];


		this.moves			= new Moves();
		this.object			= object;
		document.addEventListener("keydown", (event) => {
			for (let i = 0; i < key.length; i++)
			{
				if (event.key == key[i])
				{
					(movesValueDown[i])();
					return ;
				}
			}
		});
		document.addEventListener("keyup", (event) => {
			for (let i = 0; i < key.length; i++)
			{
				if (event.key == key[i])
				{
					(movesValueUp[i])();
					return ;
				}
			}
		});
	};
	
	update()
	{
		if (this.moves.wPress)
		{
			this.object.position.z -= this.#speed;
			sendRequest("playerMove", {x: this.object.position.x, y: this.object.position.y, z: this.object.position.z});
		}
		if (this.moves.sPress)
		{
			this.object.position.z += this.#speed;
			sendRequest("playerMove", {x: this.object.position.x, y: this.object.position.y, z: this.object.position.z});
		}
	};
}

export { MoveObject };
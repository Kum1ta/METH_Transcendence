/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   controls.js                                        :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: hubourge <hubourge@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/08/07 15:20:55 by hubourge          #+#    #+#             */
/*   Updated: 2024/08/07 15:58:16 by hubourge         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import * as THREE from 'three';

class Moves {
	wPress = false;
	sPress = false;
	constructor() {};
}

class MoveObject {
	#moves = null;
	#object = null;
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
				if (event.key == '-')
				{
					console.log(this.moves.wPress);
					console.log(this.moves.sPress);
					return ;
				}
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
	
	update() {};
}

export { MoveObject };
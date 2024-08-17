/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Player.js                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: edbernar <edbernar@student.42angouleme.    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/08/18 00:30:31 by edbernar          #+#    #+#             */
/*   Updated: 2024/08/18 01:47:15 by edbernar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

/*
	Explication du code :
		- Un seul joueur peut etre instancié, sinon ça throw une erreur
		- Lorsqu'une touche est pressée, celle-ci sera ajoutée à la variable "pressedButton"
		  Exemple : w et a sont pressées -> pressedButton =  ['w', 'a']
		- Les lignes avec cleanup sont l'êquivalent d'un destructeur en CPP
		- Pour appliquer des actions sur les touches, il suffit de faire ça dans la fonction
		  update en regardant si la touche voulue est pressée dans la variable "pressedButton"
*/

/*
	Todo (Eddy) :
		- Ajouter une camera sur l'object
		- Faire une fonction pour changer le mode de la camera (fix ou accrochée)
*/

let playerExist = false;

class Player
{
	pressedButton = [];
	constructor (object)
	{
		if (playerExist)
			throw Error("Player is already init.");
		playerExist = true;
		this.cleanup = new FinalizationRegistry((heldValue) => {
			playerExist = false;
		})
		this.cleanup.register(this, null);

		document.addEventListener('keydown', (e) => {
			let i;

			i = 0;
			while (i < this.pressedButton.length && e.key != this.pressedButton[i])
				i++;
			if (i == this.pressedButton.length)
				this.pressedButton.push(e.key);
		});

		document.addEventListener('keyup', (e) => {
			let i;

			i = 0;
			while (i < this.pressedButton.length && e.key != this.pressedButton[i])
				i++;
			if (i != this.pressedButton.length)
				this.pressedButton.splice(i, 1);
		});
	}

	update()
	{
		let i;

		i = 0;
		while (i < this.pressedButton.length)
		{
			if (this.pressedButton[i] == 'a')
				console.log('A is pressed !');
			i++;
		}
	}
};


export { Player };
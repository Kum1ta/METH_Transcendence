/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Players.js                                         :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: edbernar <edbernar@student.42angouleme.    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/08/28 15:12:25 by edbernar          #+#    #+#             */
/*   Updated: 2024/08/28 16:29:28 by edbernar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import * as THREE from 'three';

const	speed			=	0.25;
let		player1			=	null;
let		player2			=	null;
let		pressedButton	=	[];

class Players
{
	static create(scene)
	{
		player1	= newBarPlayer(1);
		player2	= newBarPlayer(2);

		scene.add(player1);
		scene.add(player2);
		document.addEventListener('keydown', addKeyInArr);
		document.addEventListener('keyup', remKeyInArr);
	}

	static dispose()
	{
		document.removeEventListener('keydown', addKeyInArr);
		document.removeEventListener('keyup', remKeyInArr);
		player1	= null;
		player2	= null;
	}

	static update()
	{
		let		i	= 0;

		while (i < pressedButton.length)
		{
			if (pressedButton[i] == 'w' && player1.position.z > -5.05)
				player1.position.z -= speed;
			else if (pressedButton[i] == 's' && player1.position.z < 5.05)
				player1.position.z += speed;
			else if (pressedButton[i] == 'ArrowUp' && player2.position.z > -5.05)
				player2.position.z -= speed;
			else if (pressedButton[i] == 'ArrowDown' && player2.position.z < 5.05)
				player2.position.z += speed;
			i++;
		}		
	}
}

function newBarPlayer(nbPlayer)
{
	const	geometry	=	new THREE.BoxGeometry(0.1, 0.2, 2);
	const	material	=	new THREE.MeshPhysicalMaterial({color: 0xffffff});
	const	mesh		=	new THREE.Mesh(geometry, material);

	if (nbPlayer == 1)
		mesh.position.set(-12, 0.2, 0);
	else
		mesh.position.set(12, 0.2, 0);
	return (mesh);
}

function addKeyInArr(e)
{
	let i;

	i = 0;
	while (i < pressedButton.length && e.key != pressedButton[i])
		i++;
	if (i == pressedButton.length)
		pressedButton.push(e.key);
}

function remKeyInArr(e)
{
	let i;

	i = 0;
	while (i < pressedButton.length && e.key != pressedButton[i])
		i++;
	if (i != pressedButton.length)
		pressedButton.splice(i, 1);
}

export { Players };
/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   TournamentPage.js                                  :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: edbernar <edbernar@student.42angouleme.    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/10/01 13:42:29 by edbernar          #+#    #+#             */
/*   Updated: 2024/10/01 14:15:12 by edbernar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

const	playerNb	=	[1, 2, 4, 5, 13, 14, 15, 16];
const	playerList	=	{
	player1: {id: 0, name: null, pfp: null},
	player2: {id: 0, name: null, pfp: null},
	player3: {id: 0, name: null, pfp: null},
	player4: {id: 0, name: null, pfp: null},
	player13: {id: 0, name: null, pfp: null},
	player14: {id: 0, name: null, pfp: null},
	player15: {id: 0, name: null, pfp: null},
	player16: {id: 0, name: null, pfp: null},
};

class TournamentPage
{
	static create(code)
	{
		console.log("Code game : ", code);
	}

	static dispose()
	{
		
	}

	static newOpponent(content)
	{
		let	found	=	false;
		let	i		=	0;
	
		Object.values(playerList).forEach((info) => {
			if (info.id == 0)
				found = true;
			if (!found)
				i++;				
		});
		if (!found)
		{
			console.warn("Tournament is full.");
			return ;
		}
		console.warn('Put pfp on player' + playerNb[i]);
		console.warn('Put username on player' + playerNb[i]);
		playerList['player' + playerNb[i]].id = content.id;
		playerList['player' + playerNb[i]].pfp = content.pfp;
		playerList['player' + playerNb[i]].username = content.username;
	}

	static leaveOpponent(content)
	{
		let	found	=	false;
		let	i		=	0;
	
		Object.values(playerList).forEach((info) => {
			if (info.id == content.id)
				found = true;
			if (!found)
				i++;				
		});
		if (!found)
		{
			console.warn(`Opponent can't be remove cause he is not in this tournament`);
			return ;
		}
		while (i < playerNb.length - 1)
		{
			playerList['player' + playerNb[i]] = playerList['player' + playerNb[i + 1]];
			i++;
		}
		playerList['player' + playerNb[i]] = {id: 0, name: null, pfp: null};
	}
}

export { TournamentPage }
/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   main.js                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: edbernar <edbernar@student.42angouleme.    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/09/14 21:20:45 by edbernar          #+#    #+#             */
/*   Updated: 2024/09/28 02:08:21 by edbernar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { lastSelected } from '/static/javascript/lobbyPage/3d.js';
import { sendRequest } from "/static/javascript/websocket.js";
import { pageRenderer } from '/static/javascript/main.js'

let	intervalPoints	= null;
let timeout			= null;

class WaitingGamePage
{
	static create(opponentInfo)
	{
		const	returnButton	= document.getElementById('returnToLobbyButton');
		const	sentence		= document.getElementById('sentence');
		let		text			= sentence.innerText;
		let		points			= "";

		document.body.style.opacity = 1;
		for (let i = 0; i < document.body.children.length; i++)
		{
			document.body.children[i].style.animation = 'animShowMenuDiv 0.5s';
		}
		if (opponentInfo)
			text = text.replace("other players", opponentInfo.username);
		intervalPoints = setInterval(() => {
			if (points.length < 3)
				points += '.';
			else
				points = '';
			sentence.innerText = text + points;
		}, 500);
		timeout = setTimeout(() => {
			if (opponentInfo)
				sendRequest("game", {action: 0, skinId: lastSelected ? lastSelected.id : 0, opponent: opponentInfo.id});
			else
				sendRequest("game", {action: 0, skinId: lastSelected ? lastSelected.id : 0});
			timeout = null;
		}, 1500);
		returnButton.addEventListener('click', returnToLobby);
	}

	static dispose()
	{
		const	returnButton	= document.getElementById('returnToLobbyButton');

		if (intervalPoints)
			clearInterval(intervalPoints);
		intervalPoints = null;
		if (timeout)
			clearTimeout(timeout);
		timeout = null;
		if (returnButton)
			returnButton.removeEventListener('click', returnToLobby);
	}

	static showOpponent(content)
	{
		const	returnButton	= document.getElementById('returnToLobbyButton');
		const	sentence		= document.getElementById('sentence');

		if (intervalPoints)
			clearInterval(intervalPoints);
		intervalPoints = null;
		sentence.style.animation = 'anim3 0.5s';
		sentence.style.opacity = 0;
		setTimeout(() => {
			sentence.innerText = "Your opponent is " + content.username;
			sentence.style.animation = 'animShowMenuDiv 0.5s';
			sentence.style.opacity = 1;
			setTimeout(() => {
				document.body.style.animation = 'anim3 0.5s';
				document.body.style.opacity = 0;
				pageRenderer.changePage("multiOnlineGamePage", false, {player: lastSelected.id, opponent: content.skin});
			}, 1000);
		}, 500);
		document.body.removeChild(returnButton);
	}
}

function returnToLobby()
{
	if (timeout)
	{
		clearTimeout(timeout);
		timeout = null;
	}
	else
		sendRequest("game", {action: 2});
	for (let i = 0; i < document.body.children.length; i++)
	{
		document.body.children[i].style.animation = "anim3 0.6s";
	}
	setTimeout(() => {
		pageRenderer.changePage('lobbyPage');
	}, 500);
}

export { WaitingGamePage };
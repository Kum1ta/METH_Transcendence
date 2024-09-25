/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   main.js                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: edbernar <edbernar@student.42angouleme.    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/09/14 21:20:45 by edbernar          #+#    #+#             */
/*   Updated: 2024/09/25 09:06:34 by edbernar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { lastSelected } from '/static/javascript/lobbyPage/3d.js';
import { sendRequest } from "/static/javascript/websocket.js";
import { pageRenderer } from '/static/javascript/main.js'

let	intervalPoints	= null;
let timeout			= null;

class WaitingGamePage
{
	static create()
	{
		const	returnButton	= document.getElementById('returnToLobbyButton');
		const	sentence		= document.getElementById('sentence');
		const	text			= sentence.innerText;
		let		points			= "";

		document.body.style.opacity = 1;
		for (let i = 0; i < document.body.children.length; i++)
		{
			document.body.children[i].style.animation = 'animShowMenuDiv 0.5s';
		}
		intervalPoints = setInterval(() => {
			if (points.length < 3)
				points += '.';
			else
				points = '';
			sentence.innerText = text + points;
		}, 500);
		console.log(lastSelected)
		timeout = setTimeout(() => {
			sendRequest("game", {action: 0, skinId: lastSelected.id});
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

	static showOpponent(username)
	{
		const	returnButton	= document.getElementById('returnToLobbyButton');
		const	sentence		= document.getElementById('sentence');

		if (intervalPoints)
			clearInterval(intervalPoints);
		intervalPoints = null;
		sentence.style.animation = 'anim3 0.5s';
		sentence.style.opacity = 0;
		setTimeout(() => {
			sentence.innerText = "Your opponent is " + username;
			sentence.style.animation = 'animShowMenuDiv 0.5s';
			sentence.style.opacity = 1;
			setTimeout(() => {
				document.body.style.animation = 'anim3 0.5s';
				document.body.style.opacity = 0;
				pageRenderer.changePage("multiOnlineGamePage");
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
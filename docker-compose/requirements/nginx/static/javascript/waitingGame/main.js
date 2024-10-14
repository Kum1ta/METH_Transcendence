/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   main.js                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: edbernar <edbernar@student.42angouleme.    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/09/14 21:20:45 by edbernar          #+#    #+#             */
/*   Updated: 2024/10/14 22:09:18 by edbernar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { lastSelected, lastSelectedGoal, availableGoals } from '/static/javascript/lobbyPage/3d.js';
import { withBot } from '/static/javascript/lobbyPage/main.js';
import { sendRequest } from "/static/javascript/websocket.js";
import { pageRenderer } from '/static/javascript/main.js'

let	intervalPoints	= null;
let timeout			= null;
let	waitOpponentId	= 0;

class WaitingGamePage
{
	static create(opponentInfo)
	{
		const	returnButton	= document.getElementById('returnToLobbyButton');
		const	sentence		= document.getElementById('sentence');
		const	isTournament	= opponentInfo && typeof(opponentInfo) != 'boolean' && opponentInfo.isTournament;
		let		text			= sentence.innerText;
		let		points			= "";
		let		goalId			= goalIdSelect();

		document.body.style.opacity = 1;
		for (let i = 0; i < document.body.children.length; i++)
		{
			document.body.children[i].style.animation = 'animShowMenuDiv 0.5s';
		}
		if (opponentInfo && typeof(opponentInfo) != 'boolean')
			text = text.replace("other players", opponentInfo.username);
		intervalPoints = setInterval(() => {
			if (points.length < 3)
				points += '.';
			else
				points = '';
			sentence.innerText = text + points;
		}, 500);
		timeout = setTimeout(() => {
			if (!isTournament)
			{
				if (opponentInfo && typeof(opponentInfo) != 'boolean')
					sendRequest("game", {action: 0, skinId: lastSelected ? lastSelected.id : 0, goalId: goalId, opponent: opponentInfo.id});
				else
					sendRequest("game", {action: 0, skinId: lastSelected ? lastSelected.id : 0, goalId: goalId, isRanked: opponentInfo ? true : false, with_bot: withBot});
			}
			else
			{
				this.showOpponent(opponentInfo);
			}
			timeout = null;
		}, isTournament ? 1500 : 500);
		if (!opponentInfo || !isTournament)
			returnButton.addEventListener('click', returnToLobby);
		else
		{
			waitOpponentId = opponentInfo.id;
			returnButton.remove();
		}
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
		timeout = setTimeout(() => {
			sentence.innerText = "Your opponent is " + content.username;
			sentence.style.animation = 'animShowMenuDiv 0.5s';
			sentence.style.opacity = 1;
			timeout = setTimeout(() => {
				document.body.style.animation = 'anim3 0.5s';
				document.body.style.opacity = 0;
				if (content.isTournament)
					pageRenderer.changePage("multiOnlineGamePage", false, {player: lastSelected ? lastSelected.id : 0, opponent: content.id, opponentGoaldId: content.content.goal, pfp: content.content.selfPfp, pfpOpponent: content.content.pfp});
				else
					pageRenderer.changePage("multiOnlineGamePage", false, {player: lastSelected ? lastSelected.id : 0, opponent: content.skin, opponentGoaldId: content.goal, pfp: content.pfpSelf, pfpOpponent: content.pfpOpponent});
			}, 1000);
		}, 500);
		if (returnButton)
			document.body.removeChild(returnButton);
	}

	static opponentHasQuit(opponentId)
	{
		if (waitOpponentId == opponentId)
			pageRenderer.changePage('tournamentPage', false, null);
	}

	static opponentLeft(content)
	{
		pageRenderer.changePage('lobbyPage');	
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

function goalIdSelect()
{
	for (let i = 0; i < availableGoals.length; i++)
	{
		if (availableGoals[i] == lastSelectedGoal)
			return (i);
	}
	return (0);
}

export { WaitingGamePage };
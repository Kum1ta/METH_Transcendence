/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   TournamentPage.js                                  :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: edbernar <edbernar@student.42angouleme.    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/10/01 13:42:29 by edbernar          #+#    #+#             */
/*   Updated: 2024/10/12 23:26:19 by edbernar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { sendRequest } from "/static/javascript/websocket.js";
import { pageRenderer } from '/static/javascript/main.js';

const	playerNb	=	[1, 2, 4, 5, 13, 14, 15, 16];
const	playerList	=	{
	player1: {id: 0, username: null, pfp: null},
	player2: {id: 0, username: null, pfp: null},
	player4: {id: 0, username: null, pfp: null},
	player5: {id: 0, username: null, pfp: null},
	player13: {id: 0, username: null, pfp: null},
	player14: {id: 0, username: null, pfp: null},
	player15: {id: 0, username: null, pfp: null},
	player16: {id: 0, username: null, pfp: null},
};
let		divTopInfo	= null;	
let		divInfo		= null;
let		divChat		= null;

class TournamentPage
{
	static create(code)
	{
		document.body.removeAttribute('style');
		for (let i = 0; i < document.body.children.length; i++)
		{
			document.body.children[i].style.animation = 'animShowMenuDiv 0.5s';
		}
		setTimeout(() => {
			for (let i = 0; i < document.body.children.length; i++)
			{
				document.body.children[i].style.animation = 'none';
			}
		}, 500);
		divTopInfo = document.getElementById('actuality-tournament');
		divInfo = document.getElementsByClassName('infoo')[0];
		divChat = document.getElementsByClassName('chat')[0];
		document.getElementById('code-tournament').innerText = "Code : " + code;
		sendRequest("tournament", {action: 3});
		divTopInfo.innerText = 'Tournament';
		initTournamentChat();
		document.getElementById('quitButton').addEventListener('click', () => {
			sendRequest("tournament", {action: 1});
			pageRenderer.changePage("lobbyPage", false);
		});
	}

	static dispose()
	{
		divTopInfo = null;
		divInfo = null;
		divChat = null;
		Object.values(playerList).forEach((info) => {
			info.id = 0;
			info.username = null;
			info.pfp = null;
		});
	}

	static newOpponent(content)
	{
		let		found				=	false;
		let		alreadyConnected	=	false;
		let		i					=	0;
	
		Object.values(playerList).forEach((info) => {
			if (!found && info.id == 0 || info.id == content.id)
			{
				found = true;
				alreadyConnected = info.id == content.id;
			}
			if (!found)
				i++;				
		});
		if (!found)
		{
			console.warn("Tournament is full.");
			return ;
		}
		if (alreadyConnected)
		{
			console.warn("Player is already in game.");
			return ;
		}
		newInfo(`${content.username} joined the tournament.`);
		document.getElementById('user-' + playerNb[i]).innerText = content.username;
		document.getElementById('pfp-' + playerNb[i]).style.backgroundImage = `url(${content.pfp})`;
		playerList['player' + playerNb[i]].id = content.id;
		playerList['player' + playerNb[i]].pfp = content.pfp;
		playerList['player' + playerNb[i]].username = content.username;
	}

	static leaveOpponent(content)
	{
		let		found	=	false;
		let		i		=	0;
	
		Object.values(playerList).forEach((info) => {
			if (!found && info.id == content.id)
				found = true;
			if (!found)
				i++;				
		});
		if (!found)
		{
			console.warn(`Opponent can't be remove cause he is not in this tournament`);
			return ;
		}
		newInfo(`${playerList['player' + playerNb[i]].username} left the tournament.`);
		document.getElementById('user-' + playerNb[i]).innerText = "Nobody";
		document.getElementById('pfp-' + playerNb[i]).style.backgroundImage = null;
		while (i < playerNb.length - 1)
		{
			playerList['player' + playerNb[i]] = playerList['player' + playerNb[i + 1]];
			playerList['player' + playerNb[i]].id--;
			document.getElementById('user-' + playerNb[i]).innerText = playerList['player' + playerNb[i]].username;
			document.getElementById('pfp-' + playerNb[i]).style.backgroundImage = `url(${playerList['player' + playerNb[i]].pfp})`;
			i++;
		}
		playerList['player' + playerNb[i]] = {id: 0, username: null, pfp: null};
		document.getElementById('user-' + playerNb[i]).innerText = playerList['player' + playerNb[i]].username;
		document.getElementById('pfp-' + playerNb[i]).style.backgroundImage = `url(${playerList['player' + playerNb[i]].pfp})`;
	}

	static newMessage(content)
	{
		const	newText	= document.createElement('p');

		newText.innerText = `${content.username} : ${content.message}`;
		divChat.appendChild(newText);
	}

	static fetchAllData(content)
	{
		for (let i = 0; i < content.messages.length; i++)
			this.newMessage(content.messages[i]);
		for (let i = 0; i < content.players.length; i++)
			this.newOpponent(content.players[i]);
	}

	static startGame(content)
	{
		pageRenderer.changePage("waitingGamePage", false, {username: content.username, id: content.id, isTournament: true})
	}
}

function newInfo(message)
{
	const	newDiv	=	document.createElement('div');
	
	newDiv.setAttribute('class', 'alert-info');
	newDiv.innerHTML = `<p>${message}</p>`
	divInfo.appendChild(newDiv);
}

function initTournamentChat()
{
	const	inputMessage	= document.getElementById('inputMessage');
	const	sendButton		= document.getElementById("sendButton");

	sendButton.style.cursor = "pointer";
	sendButton.addEventListener("click", () => {
		sendRequest("tournament", {action: 2, message: inputMessage.value});
		inputMessage.value = "";
		inputMessage.focus();
	});
	inputMessage.addEventListener("keyup", (event) => {
		if (event.key === "Enter" && inputMessage.value.trim() !== "")
		{
			event.preventDefault();
			sendRequest("tournament", {action: 2, message: inputMessage.value});
			inputMessage.value = "";
			inputMessage.focus();
		}
	});
	inputMessage.addEventListener("keydown", (event) => {
		if (event.key === "Enter")
			event.preventDefault();
	});
}

export { TournamentPage }
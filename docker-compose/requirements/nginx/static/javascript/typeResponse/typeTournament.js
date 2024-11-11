/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   typeTournament.js                                  :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: edbernar <edbernar@student.42angouleme.    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/10/01 13:29:50 by edbernar          #+#    #+#             */
/*   Updated: 2024/11/11 11:41:31 by edbernar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { TournamentPage } from "/static/javascript/tournamentPage/TournamentPage.js"
import { createNotification as CN } from "/static/javascript/notification/main.js";
import { WaitingGamePage } from "/static/javascript/waitingGame/main.js";
import { LobbyPage } from '/static/javascript/lobbyPage/main.js';
import { pageRenderer } from '/static/javascript/main.js'

function typeTournament(content)
{
	console.log("New tournament request : ", content);
	if (pageRenderer.actualPage == LobbyPage)
	{
		if (content.action == 0)
			joinTournament(content);
	}
	else if (pageRenderer.actualPage == WaitingGamePage)
	{
		if (content.action == 2)
			WaitingGamePage.opponentHasQuit(content.id);
	}
	else if (pageRenderer.actualPage == TournamentPage)
	{
		if (content.action == 1)
			TournamentPage.newOpponent(content);
		else if (content.action == 2)
			TournamentPage.leaveOpponent(content);
		else if (content.action == 3)
			TournamentPage.newMessage(content);
		else if (content.action == 4)
			TournamentPage.startGame(content);
		else if (content.action == 5)
			TournamentPage.fetchAllData(content);
		else if (content.action == 6)
			TournamentPage.newEndGame(content);
		else if (content.action == 7)
			TournamentPage.end(content);
	}
	else
		console.warn("Request tournament not for this page...");
}

function joinTournament(content)
{
	if (content.exist != undefined && !content.exist)
		CN.new("Information", "No game for this code");
	else if (content.isFull != undefined && content.isFull)
		CN.new("Information", "Cannot join because the game is full");
	else if (content.started != undefined && content.started)
		CN.new("Information", "This tournament has already started");
	else
	{
		document.body.style.animation = "none";
		document.body.style.animation = "startGameAnim 0.5s";
		setTimeout(() => {
			pageRenderer.changePage('tournamentPage', false, content.code);
		}, 400);
	}
}

export { typeTournament };
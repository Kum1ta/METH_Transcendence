/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   typeGame.js                                        :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: edbernar <edbernar@student.42angouleme.    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/09/15 12:00:01 by edbernar          #+#    #+#             */
/*   Updated: 2024/10/08 03:07:37 by edbernar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { MultiOnlineGamePage, opponent, ball, player, map } from "/static/javascript/multiOnlineGame/multiOnlineGamePage.js"
import { WaitingGamePage } from "/static/javascript/waitingGame/main.js"
import { pageRenderer } from '/static/javascript/main.js'


function typeGame(content)
{
	console.log(`New game ${content.action} content: `, content);
	if (pageRenderer.actualPage == WaitingGamePage)
	{
		if (content.action == 1)
			WaitingGamePage.showOpponent(content);
		else if (content.action == 10)
			WaitingGamePage.opponentLeft(content)
	}
	else if (pageRenderer.actualPage == MultiOnlineGamePage)
	{
		if (content.action == 3 && content.is_opponent)
			opponent.movePlayer(content);
		else if (content.action == 4)
			player.scalePlayer(content.is_opponent);
		else if (content.action == 5 && ball)
			ball.updatePos(content);
		else if (content.action == 6)
			player.makeAnimation(content.is_opponent);
		else if (content.action == 7)
			map.placeObject(content);
		else if (content.action == 8)
			map.activeJumper(content.name);
		else if (content.action == 9)
			MultiOnlineGamePage.ping();
		else if (content.action == 10)
			MultiOnlineGamePage.endGame(content)
	}
}

export { typeGame };


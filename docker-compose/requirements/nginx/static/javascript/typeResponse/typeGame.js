/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   typeGame.js                                        :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: edbernar <edbernar@student.42angouleme.    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/09/15 12:00:01 by edbernar          #+#    #+#             */
/*   Updated: 2024/09/17 14:38:06 by edbernar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { MultiOnlineGamePage, opponent } from "/static/javascript/multiOnlineGame/multiOnlineGamePage.js"
import { ball } from "/static/javascript/multiOnlineGame/multiOnlineGamePage.js"
import { WaitingGamePage } from "/static/javascript/waitingGame/main.js"
import { pageRenderer } from '/static/javascript/main.js'

function typeGame(content)
{
	if (content.action == 1 && pageRenderer.actualPage == WaitingGamePage)
		WaitingGamePage.showOpponent(content.username);
	else if (content.action == 3 && pageRenderer.actualPage == MultiOnlineGamePage)
	{
		if (content.is_opponent)
			opponent.movePlayer(content);
	}
	else if (content.action == 4 && pageRenderer.actualPage == MultiOnlineGamePage)
		MultiOnlineGamePage.opponentDisconnect();
	else if (content.action == 5 && pageRenderer.actualPage == MultiOnlineGamePage)
		ball.updatePos(content);
}

export { typeGame };


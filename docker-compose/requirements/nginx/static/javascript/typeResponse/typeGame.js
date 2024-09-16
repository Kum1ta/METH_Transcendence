/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   typeGame.js                                        :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: edbernar <edbernar@student.42angouleme.    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/09/15 12:00:01 by edbernar          #+#    #+#             */
/*   Updated: 2024/09/16 15:05:01 by edbernar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { MultiOnlineGamePage, opponent } from "/static/javascript/multiOnlineGame/multiOnlineGamePage.js"
import { WaitingGamePage } from "/static/javascript/waitingGame/main.js"
import { pageRenderer } from '/static/javascript/main.js'

function typeGame(content)
{
	if (content.action == 1)
	{
		if (pageRenderer.actualPage == WaitingGamePage)
			WaitingGamePage.showOpponent(content.username);
	}
	else if (content.action == 3)
	{
		if (pageRenderer.actualPage == MultiOnlineGamePage)
		{
			if (content.is_opponent)
				opponent.movePlayer(content);
		}
	}
}

export { typeGame };


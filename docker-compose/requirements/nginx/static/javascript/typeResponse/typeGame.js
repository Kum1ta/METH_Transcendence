/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   typeGame.js                                        :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: edbernar <edbernar@student.42angouleme.    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/09/15 12:00:01 by edbernar          #+#    #+#             */
/*   Updated: 2024/09/15 14:23:31 by edbernar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { WaitingGamePage } from "/static/javascript/waitingGame/main.js"
import { pageRenderer } from '/static/javascript/main.js'

function typeGame(content)
{
	console.log("New action game : " + content.action);
	if (content.action == 1)
	{
		if (pageRenderer.actualPage == WaitingGamePage)
			WaitingGamePage.showOpponent(content.username);
	}
}

export { typeGame };


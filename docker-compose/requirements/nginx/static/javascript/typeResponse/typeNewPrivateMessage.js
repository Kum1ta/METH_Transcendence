/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   typeNewPrivateMessage.js                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: edbernar <edbernar@student.42angouleme.    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/08/04 15:15:49 by edbernar          #+#    #+#             */
/*   Updated: 2024/08/30 15:47:44 by edbernar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { sendRequest } from "/static/javascript/websocket.js";
import { messageList, infoPanel } from "/static/javascript/typeResponse/typePrivateListMessage.js";
import { userMeInfo } from "/static/javascript/typeResponse/typeLogin.js";

function typeNewPrivateMessage(content)
{
	console.log(content);
	messageList.push(content);
	if (infoPanel.isOpen && infoPanel.id === content.channel)
	{
		infoPanel.divMessage.insertAdjacentHTML('beforeend', `
			<div class="${content.from === userMeInfo.id ? "meMessage" : "opponentMessage"}">
			<p class="content">${content.content}</p>
			<p class="time">${content.date}</p>
			</div>
		`);
		infoPanel.divMessage.scrollTop = infoPanel.divMessage.scrollHeight;
	}
}

export { typeNewPrivateMessage };
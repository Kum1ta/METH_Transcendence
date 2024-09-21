/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   typeNewPrivateMessage.js                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: edbernar <edbernar@student.42angouleme.    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/08/04 15:15:49 by edbernar          #+#    #+#             */
/*   Updated: 2024/09/21 22:19:26 by edbernar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { messageList, infoPanel } from "/static/javascript/typeResponse/typePrivateListMessage.js";
import { createNotification as CN } from "/static/javascript/notification/main.js";
import { waitForUserInfo } from '/static/javascript/typeResponse/typeUserInfo.js'
import { userMeInfo } from "/static/javascript/typeResponse/typeLogin.js";
import { sendRequest } from "/static/javascript/websocket.js";

function typeNewPrivateMessage(content)
{
	if (infoPanel.isOpen && infoPanel.id === content.channel)
	{
		messageList.push(content);
		infoPanel.divMessage.insertAdjacentHTML('beforeend', `
			<div class="${content.from === userMeInfo.id ? "meMessage" : "opponentMessage"}">
			<p class="content">${content.content}</p>
			<p class="time">${content.date}</p>
			</div>
		`);
		infoPanel.divMessage.scrollTop = infoPanel.divMessage.scrollHeight;
	}
	else if (content.from != userMeInfo.id)
	{
		sendRequest("get_user_info", {id: content.from});
		waitForUserInfo().then((userInfo) => {
			CN.new("Message", "New message from " + userInfo.username);
		});
	}
}

export { typeNewPrivateMessage };
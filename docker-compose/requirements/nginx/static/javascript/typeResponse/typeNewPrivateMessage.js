/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   typeNewPrivateMessage.js                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: edbernar <edbernar@student.42angouleme.    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/08/04 15:15:49 by edbernar          #+#    #+#             */
/*   Updated: 2024/10/08 02:53:30 by edbernar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { messageList, infoPanel } from "/static/javascript/typeResponse/typePrivateListMessage.js";
import { createNotification as CN } from "/static/javascript/notification/main.js";
import { waitForUserInfo } from '/static/javascript/typeResponse/typeUserInfo.js'
import { userMeInfo } from "/static/javascript/typeResponse/typeLogin.js";
import { sendRequest } from "/static/javascript/websocket.js";

let	interval	= null;

function typeNewPrivateMessage(content)
{
	let	notifBadgeChat	= document.getElementsByClassName('notification-badge')[0];

	if (infoPanel.isOpen && infoPanel.id === content.channel)
	{
		const	div	= document.createElement('div');

		if (content.from != userMeInfo.id)
			sendRequest("read_message", {id: content.from});
		messageList.push(content);
		div.className = content.from === userMeInfo.id ? "meMessage" : "opponentMessage";
		div.innerHTML = `
			<p class="content"></p>
			<p class="time">${content.date}</p>
		`;
		div.getElementsByClassName('content')[0].innerText = content.content;
		infoPanel.divMessage.appendChild(div);
		infoPanel.divMessage.scrollTop = infoPanel.divMessage.scrollHeight;
	}
	else if (content.from != userMeInfo.id)
	{
		if (notifBadgeChat)
			notifBadgeChat.style.display = 'flex';
		else
		{
			if (interval)
				clearInterval(interval);
			interval = setInterval(() => {
				notifBadgeChat	= document.getElementsByClassName('notification-badge')[0];
				if (notifBadgeChat)
				{
					notifBadgeChat.style.display = 'flex';
					clearInterval(interval);
				}
			}, 1000);
		}
		sendRequest("get_user_info", {id: content.from});
		waitForUserInfo().then((userInfo) => {
			CN.new("Message", "New message from " + userInfo.username);
		});
	}
}

export { typeNewPrivateMessage };
/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   main.js                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: edbernar <edbernar@student.42angouleme.    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/08/04 19:19:10 by edbernar          #+#    #+#             */
/*   Updated: 2024/10/02 05:00:50 by edbernar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { userListUnread } from "/static/javascript/typeResponse/typePrivateListUser.js";
import { infoPanel } from "/static/javascript/typeResponse/typePrivateListMessage.js";
import { showListUser } from "/static/javascript/liveChat/showUserList.js";
import { userMeInfo } from "/static/javascript/typeResponse/typeLogin.js";

let		chatButton = null;
let		topChatHomeCross = null;

class LiveChat
{
	static create()
	{
		chatButton = document.getElementById("chatButton");
		topChatHomeCross = document.getElementById("topChatCross");
		
		chatButton.addEventListener("click", showChatMenu);
		topChatHomeCross.addEventListener("click", hideChatMenu);
	}

	static dispose()
	{
		chatButton.removeEventListener("click", showChatMenu);
		topChatHomeCross.removeEventListener("click", hideChatMenu);
		chatButton = null;
		topChatHomeCross = null;
	}
	
}

function showChatMenu()
{
	const infoChat = document.getElementById("infoChat");

	chatDiv.style.display = "flex";
	if (userMeInfo.id !== -1)
		showListUser();
}

function hideChatMenu()
{
	const	notifBadgeChat	= document.getElementsByClassName('notification-badge')[0];

	chatDiv.style.display = "none";
	infoPanel.isOpen = false;
	if (!userListUnread.length)
		notifBadgeChat.style.display = 'none';
	else
		notifBadgeChat.style.display = 'flex';
}

export { LiveChat, showChatMenu };
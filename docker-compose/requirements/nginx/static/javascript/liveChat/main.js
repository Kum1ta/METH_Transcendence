/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   main.js                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: edbernar <edbernar@student.42angouleme.    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/08/04 19:19:10 by edbernar          #+#    #+#             */
/*   Updated: 2024/09/21 22:41:48 by edbernar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { infoPanel } from "/static/javascript/typeResponse/typePrivateListMessage.js";
import { showActualGameMessage } from "/static/javascript/liveChat/showActualGameMessage.js";
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
	chatDiv.style.display = "none";
	infoPanel.isOpen = false;
}

export { LiveChat, showChatMenu };
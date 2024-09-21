/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   showUserList.js                                    :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: edbernar <edbernar@student.42angouleme.    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/08/04 19:21:10 by edbernar          #+#    #+#             */
/*   Updated: 2024/09/21 17:15:11 by edbernar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { waitForUserList } from "/static/javascript/typeResponse/typePrivateListUser.js";
import { waitForallListUser } from "/static/javascript/typeResponse/typeAllListUser.js";
import { userList } from "/static/javascript/typeResponse/typePrivateListUser.js";
import { showPrivateChat } from "/static/javascript/liveChat/showPrivateChat.js";
import { sendRequest } from "/static/javascript/websocket.js";

function	showListUser() {
	const	buttons	= document.getElementById('buttonTypeChatHome');
	const	infoChat = document.getElementById("infoChat");
	const	divMessageListChatHome = document.getElementById("messageListChatHome");
	let		divUser;
	let		userList;

	sendRequest("get_private_list_user", {});
	waitForUserList().then((userList) => {
		if (!userList.length)
			infoChat.innerText = "No conversation"
		else
		{
			divMessageListChatHome.style.height = "100%";
			divMessageListChatHome.style.paddingBottom = "10px";
			divMessageListChatHome.innerHTML = '';
			divMessageListChatHome.scrollTop = 0;
			if (infoChat)
				infoChat.remove();
			if (buttons)
				buttons.remove();
			userList.forEach(element => {
				let user = document.createElement("div");
				user.classList.add("user");
				user.innerHTML = `
					<div class="status ${element.status}">
							<img>
					</div>
					<h3></h3>
				`
				user.querySelector("img").src = element.pfp;
				user.querySelector("h3").innerText = element.name;
				divMessageListChatHome.appendChild(user);
			});
			divUser = divMessageListChatHome.children;
			for (let i = 0; i < divUser.length; i++) {
				divUser[i].addEventListener("click", async () => {
					showPrivateChat(userList[i]);
				});
			}
		}
	});
}

export { showListUser };
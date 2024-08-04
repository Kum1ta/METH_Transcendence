/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   showUserList.js                                    :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: edbernar <edbernar@student.42angouleme.    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/08/04 19:21:10 by edbernar          #+#    #+#             */
/*   Updated: 2024/08/04 19:29:20 by edbernar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { waitForUserList } from "../typeResponse/typePrivateListUser.js";
import { userList } from "../typeResponse/typePrivateListUser.js";
import { launchPrivateChat } from "./launchPrivateChat.js";
import { sendRequest } from "../websocket.js";

async function	showListUser() {
	const	divMessageListChatHome = document.getElementById("messageListChatHome");
	let		divUser;

	sendRequest("get_private_list_user", {});
	await waitForUserList();
	divMessageListChatHome.style.height = "100%";
	divMessageListChatHome.style.paddingBottom = "10px";
	divMessageListChatHome.innerHTML = '';
	divMessageListChatHome.scrollTop = 0;
	if (JSON.stringify(userList) !== "{}")
	{
		userList.forEach(element => {
			divMessageListChatHome.innerHTML += `
				<div class="user">
					<div class="status ${element.status}">
						<img src="${element.pfp}">
					</div>
					<h3>${element.name}</h3>
				</div>
			`;		
		});
	}
	divMessageListChatHome.innerHTML += "<p style='text-align: center; margin-top: 20px;'>New conversation +</p>";
	divUser = document.getElementsByClassName("user");
	for (let i = 0; i < divUser.length; i++) {
		divUser[i].addEventListener("click", async () => {
			await launchPrivateChat(userList[i]);
		});
	}
}

export { showListUser };
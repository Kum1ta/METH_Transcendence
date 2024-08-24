/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   showUserList.js                                    :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: edbernar <edbernar@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/08/04 19:21:10 by edbernar          #+#    #+#             */
/*   Updated: 2024/08/05 14:28:31 by edbernar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { waitForUserList } from "../typeResponse/typePrivateListUser.js";
import { userList } from "../typeResponse/typePrivateListUser.js";
import { showPrivateChat } from "./showPrivateChat.js";
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
	}
	divMessageListChatHome.innerHTML += "<p style='text-align: center; margin-top: 20px;'>New conversation +</p>";
	divUser = document.getElementsByClassName("user");
	for (let i = 0; i < divUser.length; i++) {
		divUser[i].addEventListener("click", async () => {
			await showPrivateChat(userList[i]);
		});
	}
}

export { showListUser };
/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   main.js                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: edbernar <edbernar@student.42angouleme.    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/08/04 19:19:10 by edbernar          #+#    #+#             */
/*   Updated: 2024/08/04 19:49:19 by edbernar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { infoPanel } from "../typeResponse/typePrivateListMessage.js";
import { showListUser } from "./showUserList.js";

/*
	Todo (Eddy) :
		- add a function to "New conversation +"
		- game message when game will be implemented
		- fix the bug on button "private" and "game"
*/

function	liveChat()
{
	const	chatButton = document.getElementById("chatButton");
	const	chatDiv = document.getElementById("chatDiv");
	const	topChatHomeCross = document.getElementById("topChatCross");
	const	privateButtonChatHome = document.getElementById("buttonTypeChatHome").getElementsByTagName("h2")[0];
	const	gameButtonChatHome= document.getElementById("buttonTypeChatHome").getElementsByTagName("h2")[1];

	chatButton.addEventListener("click", async () => {
		chatDiv.style.display = "flex";
		gameButtonChatHome.removeAttribute("id");
		privateButtonChatHome.setAttribute("id", "selected");
		await showListUser();
	});
	topChatHomeCross.addEventListener("click", () => {
		chatDiv.style.display = "none";
		infoPanel.isOpen = false;
	});
	privateButtonChatHome.addEventListener("click", async () => {
		gameButtonChatHome.removeAttribute("id");
		privateButtonChatHome.setAttribute("id", "selected");
		await showListUser();
	});
	gameButtonChatHome.addEventListener("click", () => {
		privateButtonChatHome.removeAttribute("id");
		gameButtonChatHome.setAttribute("id", "selected");
		showActualGameMessage();
	});
}

export { liveChat };
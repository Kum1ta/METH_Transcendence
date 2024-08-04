/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   main.js                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: edbernar <edbernar@student.42angouleme.    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/08/04 19:19:10 by edbernar          #+#    #+#             */
/*   Updated: 2024/08/04 23:10:18 by edbernar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { infoPanel } from "../typeResponse/typePrivateListMessage.js";
import { showActualGameMessage } from "./showActualGameMessage.js";
import { showListUser } from "./showUserList.js";

/*
	Todo (Eddy) :
		- add a function to "New conversation +"
		- game message when game will be implemented
*/

function	addDefaultButton()
{
	const	newDiv = document.createElement("div");
	const	newPrivateButton = document.createElement("h2");
	const	newGameButton = document.createElement("h2");
	const	divMessageListChatHome = document.createElement("div");

	newDiv.setAttribute("id", "buttonTypeChatHome");
	newPrivateButton.textContent = "Private";
	newGameButton.textContent = "Game";
	newPrivateButton.setAttribute("id", "selected");
	newDiv.appendChild(newPrivateButton);
	newDiv.appendChild(newGameButton);
	document.getElementById("chatDiv").appendChild(newDiv);
	divMessageListChatHome.setAttribute("id", "messageListChatHome");
	document.getElementById("chatDiv").appendChild(divMessageListChatHome);

	newPrivateButton.addEventListener("click", async () => {
		newGameButton.removeAttribute("id");
		newPrivateButton.setAttribute("id", "selected");
		await showListUser();
	});
	newGameButton.addEventListener("click", () => {
		newPrivateButton.removeAttribute("id");
		newGameButton.setAttribute("id", "selected");
		showActualGameMessage();
	});
}

function	removeButtonIfExist()
{
	const	divButtonTypeChatHome = document.getElementById("buttonTypeChatHome");

	if (divButtonTypeChatHome)
	{
		divButtonTypeChatHome.remove();
		document.getElementById("messageListChatHome").remove();
	}
}

function	liveChat()
{
	const	chatButton = document.getElementById("chatButton");
	const	chatDiv = document.getElementById("chatDiv");
	const	topChatHomeCross = document.getElementById("topChatCross");
	
	chatButton.addEventListener("click", async () => {
		chatDiv.style.display = "flex";
		removeButtonIfExist();
		addDefaultButton();
		await showListUser();
	});
	topChatHomeCross.addEventListener("click", () => {
		chatDiv.style.display = "none";
		infoPanel.isOpen = false;
	});
}

export { liveChat };
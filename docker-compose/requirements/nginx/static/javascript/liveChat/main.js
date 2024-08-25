/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   main.js                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: edbernar <edbernar@student.42angouleme.    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/08/04 19:19:10 by edbernar          #+#    #+#             */
/*   Updated: 2024/08/25 18:26:52 by edbernar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { infoPanel } from "/static/javascript/typeResponse/typePrivateListMessage.js";
import { showActualGameMessage } from "/static/javascript/liveChat/showActualGameMessage.js";
import { showListUser } from "/static/javascript/liveChat/showUserList.js";

/*
	Todo (Eddy) :
		- add a function to "New conversation +"
		- game message when game will be implemented
*/

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

async function showChatMenu()
{
	chatDiv.style.display = "flex";
	removeButtonIfExist();
	addDefaultButton();
	await showListUser();
}

function hideChatMenu()
{
	chatDiv.style.display = "none";
	infoPanel.isOpen = false;
}

export { LiveChat };
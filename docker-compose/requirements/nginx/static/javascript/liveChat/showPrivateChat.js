/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   showPrivateChat.js                                 :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: edbernar <edbernar@student.42angouleme.    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/08/04 19:17:54 by edbernar          #+#    #+#             */
/*   Updated: 2024/08/25 21:24:06 by edbernar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { messageList, infoPanel, waitForMessageList } from "/static/javascript/typeResponse/typePrivateListMessage.js";
import { userMeInfo } from "/static/javascript/typeResponse/typeLogin.js";
import { showListUser } from "/static/javascript/liveChat/showUserList.js";
import { sendRequest } from "/static/javascript/websocket.js";

let savedButtons = [];

async function	showPrivateChat(user)
{
	const	divMessageListChatHome = document.getElementById("messageListChatHome");

	sendRequest("get_private_list_message", {id: user.id});
	await waitForMessageList();
	infoPanel.id = user.id;
	infoPanel.isOpen = true;
	infoPanel.divMessage = divMessageListChatHome;
	await changeButton(user);
	await displayAllMessage(divMessageListChatHome);
	await displayInputBar(divMessageListChatHome, user);
}

async function	restoreButton()
{
	const	divButtonTypeChatHome = document.getElementById("buttonTypeChatHome");

	divButtonTypeChatHome.innerHTML = '';
	savedButtons.forEach(element => {
		divButtonTypeChatHome.appendChild(element);
	});
}

async function	changeButton(user)
{
	const	divButtonTypeChatHome	= document.getElementById("buttonTypeChatHome");
	const	h2Username				= document.createElement("h2");
	const	h2UsernameNode			= document.createTextNode(user.name);
	let		returnButton 			= null;
	let		h2Button				= null;
	let		lenh2Button				= 0;

	h2Button = divButtonTypeChatHome.getElementsByTagName("h2");
	lenh2Button = h2Button.length;
	savedButtons.splice(0, savedButtons.length);
	for (let i = 0; i < lenh2Button; i++) {
		savedButtons.push(h2Button[0]);
		h2Button[0].remove();
	}
	h2Username.appendChild(h2UsernameNode);
	divButtonTypeChatHome.appendChild(h2Username);
	divButtonTypeChatHome	.innerHTML += `
		<p id="returnButton" style="margin: 8px 10px 0 0; text-align: right;">Return</p>
	`;
	h2Button[0].style.cursor = "default";
	returnButton = document.getElementById("returnButton");
	returnButton.style.cursor = "pointer";
	returnButton.addEventListener("click", () => {
		restoreButton();
		infoPanel.isOpen = false;
		showListUser();
	});
}

async function	displayAllMessage(divMessageListChatHome)
{
	let		newDiv				= null;
	let		contentNode			= null;
	let		dateNode			= null;
	let		tmp					= null;

	divMessageListChatHome.style.height = "230px";
	divMessageListChatHome.style.paddingBottom = "20px";
	divMessageListChatHome.innerHTML = '';
	messageList.forEach(element => {
		newDiv = document.createElement("div");
		contentNode = document.createTextNode(element.content);
		dateNode = document.createTextNode(element.date);
		console.log(element.from, userMeInfo.id);
		newDiv.classList.add(element.from === userMeInfo.id ? "meMessage" : "opponentMessage");
		tmp = document.createElement("p");
		tmp.classList.add("content");
		tmp.appendChild(contentNode);
		newDiv.appendChild(tmp);
		tmp = document.createElement("p");
		tmp.classList.add("time");
		tmp.appendChild(dateNode);
		newDiv.appendChild(tmp);
		divMessageListChatHome.appendChild(newDiv);
	});
	divMessageListChatHome.scrollTop = divMessageListChatHome.scrollHeight;
}

async function	displayInputBar(divMessageListChatHome, user)
{
	let		sendButton;
	let		inputMessage;

	divMessageListChatHome.innerHTML += `
		<div id="inputMessageDiv">
			<textarea type="text" id="inputMessage" placeholder="Enter your message here"></textarea>
			<p id="sendButton"">\></p>
		</div>
	`;
	sendButton = document.getElementById("sendButton");
	sendButton.style.cursor = "pointer";
	sendButton.addEventListener("click", () => {
		sendMessage(user);
		inputMessage.value = "";
		inputMessage.focus();
	});
	inputMessage = document.getElementById("inputMessage");
	inputMessage.addEventListener("keyup", (event) => {
		if (event.key === "Enter" && !event.shiftKey && inputMessage.value.trim() !== "")
		{
			event.preventDefault();
			sendMessage(user);
			inputMessage.value = "";
			inputMessage.focus();
		}
	});
	inputMessage.addEventListener("keydown", (event) => {
		if (event.key === "Enter")
			event.preventDefault();
	});
	inputMessage.focus();
}

function	sendMessage(user)
{
	const	inputMessage = document.getElementById("inputMessage");
	let 	message;

	message = {
		to: user.id,
		content: inputMessage.value,
	};
	sendRequest("send_private_message", message);
}

export { showPrivateChat };
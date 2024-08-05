/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   showPrivateChat.js                                 :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: edbernar <edbernar@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/08/04 19:17:54 by edbernar          #+#    #+#             */
/*   Updated: 2024/08/05 16:51:04 by edbernar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { messageList, infoPanel, waitForMessageList } from "../typeResponse/typePrivateListMessage.js";
import { userMeInfo } from "../typeResponse/typeLogin.js";
import { showListUser } from "./showUserList.js";
import { sendRequest } from "../websocket.js";

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
	const	divButtonTypeChatHome = document.getElementById("buttonTypeChatHome");
	let		returnButton;
	let		h2Button;
	let		lenh2Button;

	h2Button = divButtonTypeChatHome.getElementsByTagName("h2");
	lenh2Button = h2Button.length;
	savedButtons.splice(0, savedButtons.length);
	for (let i = 0; i < lenh2Button; i++) {
		savedButtons.push(h2Button[0]);
		h2Button[0].remove();
	}
	divButtonTypeChatHome.innerHTML += `
		<h2>${user.name}</h2>
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
	divMessageListChatHome.style.height = "230px";
	divMessageListChatHome.style.paddingBottom = "20px";
	divMessageListChatHome.innerHTML = '';
	messageList.forEach(element => {
		divMessageListChatHome.innerHTML += `
		<div class="${element.from === userMeInfo.id ? "meMessage" : "opponentMessage"}">
		<p class="content">${element.content}</p>
		<p class="time">${element.date}</p>
		</div>
		`;
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
		from: userMeInfo.id,
		to: user.id,
		content: inputMessage.value,
		time: new Date()
	};
	sendRequest("send_private_message", message);
}

export { showPrivateChat };
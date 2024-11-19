/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   showPrivateChat.js                                 :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: edbernar <edbernar@student.42angouleme.    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/08/04 19:17:54 by edbernar          #+#    #+#             */
/*   Updated: 2024/11/19 15:51:55 by edbernar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { messageList, infoPanel, waitForMessageList } from "/static/javascript/typeResponse/typePrivateListMessage.js";
import { userListUnread } from "/static/javascript/typeResponse/typePrivateListUser.js";
import { userMeInfo } from "/static/javascript/typeResponse/typeLogin.js";
import { showListUser } from "/static/javascript/liveChat/showUserList.js";
import { sendRequest } from "/static/javascript/websocket.js";

function	showPrivateChat(user)
{
	const	divMessageListChatHome = document.getElementById("messageListChatHome");

	sendRequest("get_private_list_message", {id: user.id});
	waitForMessageList().then(() => {
		try {
			userListUnread.splice(userListUnread.indexOf(user.id), 1);
		}
		catch (e) {};			
		infoPanel.id = user.id;
		infoPanel.isOpen = true;
		infoPanel.divMessage = divMessageListChatHome;
		sendRequest("read_message", {id: user.id});
		changeButton(user);
		displayAllMessage(divMessageListChatHome);
		displayInputBar(divMessageListChatHome, user);
	})
}

function	changeButton(user)
{
	const	divMessageListChatHome 	= document.getElementById("messageListChatHome");
	const	h2Username				= document.createElement("h2");
	const	h2UsernameNode			= document.createTextNode(user.name);
	const	buttonTypeChatHome		= document.getElementById('buttonTypeChatHome');
	const	div						= document.createElement('div');
	let		returnButton 			= null;

	if (buttonTypeChatHome)
		buttonTypeChatHome.remove();
	divMessageListChatHome.before(div);
	div.innerHTML = `
		<p id="returnButton" style="margin: 8px 10px 0 0; text-align: right;">Return</p>
	`;
	div.setAttribute('id', 'buttonTypeChatHome');
	h2Username.appendChild(h2UsernameNode);
	returnButton = document.getElementById("returnButton");
	returnButton.before(h2Username);
	returnButton.style.cursor = "pointer";
	returnButton.addEventListener("click", () => {
		infoPanel.isOpen = false;
		showListUser();
	});
}

function	displayAllMessage(divMessageListChatHome)
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

function	displayInputBar(divMessageListChatHome, user)
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
		if (inputMessage.value === "")
			return ;
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
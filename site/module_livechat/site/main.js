/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   main.js                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: edbernar <edbernar@student.42angouleme.    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/07/30 13:50:35 by edbernar          #+#    #+#             */
/*   Updated: 2024/08/03 23:44:10 by edbernar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { sendRequest } from "./websocket.js";
import { userList, waitForUserList } from "./typeResponse/typePrivateListUser.js";
import { messageList, waitForMessageList } from "./typeResponse/typePrivateListMessage.js";
import { userMeInfo } from "./typeResponse/typeLogin.js";

document.addEventListener('DOMContentLoaded', () => {
	liveChat();
});

function	liveChat() {
	const	chatButton = document.getElementById("chatButton");
	const	chatDiv = document.getElementById("chatDiv");
	const	topChatHomeCross = document.getElementById("topChatCross");
	const	privateButtonChatHome = document.getElementById("buttonTypeChatHome").getElementsByTagName("h2")[0];
	const	gameButtonChatHome= document.getElementById("buttonTypeChatHome").getElementsByTagName("h2")[1];

	chatButton.addEventListener("click", async () => {
		chatDiv.style.display = "flex";
		gameButtonChatHome.removeAttribute("id");
		privateButtonChatHome.setAttribute("id", "selected");
		await showListUserMessage();
	});
	topChatHomeCross.addEventListener("click", () => {
		chatDiv.style.display = "none";
	});
	
	privateButtonChatHome.addEventListener("click", async () => {
		gameButtonChatHome.removeAttribute("id");
		privateButtonChatHome.setAttribute("id", "selected");
		await showListUserMessage();
	});
	gameButtonChatHome.addEventListener("click", () => {
		privateButtonChatHome.removeAttribute("id");
		gameButtonChatHome.setAttribute("id", "selected");
		showActualGameMessage();
	});
}

async function	showListUserMessage() {
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

function	showActualGameMessage(id) {
	const	divMessageListChatHome = document.getElementById("messageListChatHome");
	let		me = "Kumita";
	let		request = {
		isInGame: false,
		opponent: {
			name: "Astropower",
			pfp: "https://ashisheditz.com/wp-content/uploads/2024/03/cool-anime-pfp-demon-slayer-HD.jpg"
		},
		listMessage: [
			{
				from: "Astropower",
				content: "Hello !",
				date: "19:21 30/07/2024"
			},
			{
				from: "Kumita",
				content: "Hey",
				date: "19:21 30/07/2024"
			},
			{
				from: "Astropower",
				content: "Do you want play ?",
				date: "19:22 30/07/2024"
			},
			{
				from: "Kumita",
				content: "Yes, i'm ready !",
				date: "19:22 30/07/2024"
			},
			{
				from: "Kumita",
				content: "The game was too hard but well played",
				date: "19:27 30/07/2024"
			},
			{
				from: "Astropower",
				content: "Yeah but you still won. See you soon",
				date: "19:27 30/07/2024"
			},
		]
	}; //Remplace temporairement la requete qui devra être de la meme forme


	divMessageListChatHome.style.height = "230px";
	divMessageListChatHome.style.paddingBottom = "20px";
	divMessageListChatHome.innerHTML = '';
	if (request.isInGame === false)
	{
		divMessageListChatHome.innerHTML = "<p style='text-align: center; margin-top: 20px;'>You are currently not in a game.</p>";
		return ;	
	}
	request.listMessage.forEach(element => {
		divMessageListChatHome.innerHTML += `
		<div class="${element.from === me ? "meMessage" : "opponentMessage"}">
		<p class="content">${element.content}</p>
		<p class="time">${element.date}</p>
		</div>
		`;
	});
	divMessageListChatHome.scrollTop = divMessageListChatHome.scrollHeight;
	divMessageListChatHome.innerHTML += `
		<div id="inputMessageDiv">
			<textarea type="text" id="inputMessage" placeholder="Enter your message here"></textarea>
			<p id="sendButton">\></p>
		</div>
	`;
}

async function	launchPrivateChat(user) {
	const	divMessageListChatHome = document.getElementById("messageListChatHome");
	const	divButtonTypeChatHome = document.getElementById("buttonTypeChatHome");
	let		returnButton;
	
	sendRequest("get_private_list_message", {id: user.id});
	await waitForMessageList();
	let h2Button = divButtonTypeChatHome.getElementsByTagName("h2");
	let len = h2Button.length;
	for (let i = 0; i < len; i++) {
		h2Button[i - i].remove();
	}
	divButtonTypeChatHome.innerHTML += `
		<h2>${user.name}</h2>
		<p id="returnButton" style="margin: 8px 10px 0 0; text-align: right;">Return</p>
	`;
	h2Button[0].style.cursor = "default";
	returnButton = document.getElementById("returnButton");
	returnButton.style.cursor = "pointer";
	returnButton.addEventListener("click", () => {
		divButtonTypeChatHome.innerHTML = `
			<h2 id="selected">Private</h2>
			<h2>Game</h2>
		`;
		showListUserMessage();
	});


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
	divMessageListChatHome.innerHTML += `
		<div id="inputMessageDiv">
			<textarea type="text" id="inputMessage" placeholder="Enter your message here"></textarea>
			<p id="sendButton">\></p>
		</div>
	`;

}

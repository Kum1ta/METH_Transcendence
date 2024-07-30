/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   main.js                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: edbernar <edbernar@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/07/30 13:50:35 by edbernar          #+#    #+#             */
/*   Updated: 2024/07/30 19:55:40 by edbernar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

document.addEventListener('DOMContentLoaded', () => {
	liveChat();
});

function	liveChat() {
	const	chatButton = document.getElementById("chatButton");
	const	chatDiv = document.getElementById("chatDiv");
	const	topChatHomeCross = document.getElementById("topChatCross");
	const	privateButtonChatHome = document.getElementById("buttonTypeChatHome").getElementsByTagName("h2")[0];
	const	gameButtonChatHome= document.getElementById("buttonTypeChatHome").getElementsByTagName("h2")[1];
	let	userList = [
		{
			name: "Nessundorma",
			status: "online",
			pfp: "https://wallpapers-clan.com/wp-content/uploads/2023/05/cool-pfp-02.jpg"
		},
		{
			name: "Succotash",
			status: "offline",
			pfp: "https://i.pinimg.com/200x/28/75/96/287596f98304bf1adc2c411619ae8fef.jpg"
		},
		{
			name: "Astropower",
			status: "online",
			pfp: "https://ashisheditz.com/wp-content/uploads/2024/03/cool-anime-pfp-demon-slayer-HD.jpg"
		},
		{
			name: "Assaultive",
			status: "offline",
			pfp: "https://i1.sndcdn.com/artworks-1Li0JIJrQGlojD3y-AEiNkw-t500x500.jpg"
		},
		{
			name: "Redshock",
			status: "offline",
			pfp: "https://cdn.pfps.gg/pfps/7094-boy-pfp.png"
		},
		{
			name: "Parley",
			status: "offline",
			pfp: "https://pbs.twimg.com/media/EscE6ckU0AA-Uhe.png"
		},
	]; //Remplace temporairement la requete qui devra être de la meme forme

	chatButton.addEventListener("click", () => {
		chatDiv.style.display = "flex";
	});
	topChatHomeCross.addEventListener("click", () => {
		chatDiv.style.display = "none";
	});

	// showListUserMessage(userList);
	console.warn("Retirer showActualGameMessage() et remettre showListUserMessage()")
	showActualGameMessage();
	privateButtonChatHome.addEventListener("click", () => {
		gameButtonChatHome.removeAttribute("id");
		privateButtonChatHome.setAttribute("id", "selected");
		showListUserMessage(userList);
	});
	gameButtonChatHome.addEventListener("click", () => {
		privateButtonChatHome.removeAttribute("id");
		gameButtonChatHome.setAttribute("id", "selected");
		showActualGameMessage();
	});
}

function	showListUserMessage(userList) {
	const	divMessageListChatHome = document.getElementById("messageListChatHome");

	divMessageListChatHome.innerHTML = '';
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

function	showActualGameMessage() {
	const	divMessageListChatHome = document.getElementById("messageListChatHome");
	let		me = "Kumita";
	let		request = {
		isInGame: true,
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
			// {
			// 	from: "Astropower",
			// 	content: "Do you want play ?",
			// 	date: "19:22 30/07/2024"
			// },
			// {
			// 	from: "Kumita",
			// 	content: "Yes, i'm ready !",
			// 	date: "19:22 30/07/2024"
			// },
			// {
			// 	from: "Kumita",
			// 	content: "The game was too hard but well played",
			// 	date: "19:27 30/07/2024"
			// },
			// {
			// 	from: "Astropower",
			// 	content: "Yeah but you still won. See you soon",
			// 	date: "19:27 30/07/2024"
			// },
		]
	}; //Remplace temporairement la requete qui devra être de la meme forme

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
	divMessageListChatHome.innerHTML += `
		<div id="inputDiv" placeholder="Enter your message here"></div>
	`;
	divMessageListChatHome.setAttribute("contenteditable", "true");
}

/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   showActualGameMessage.js                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: edbernar <edbernar@student.42angouleme.    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/08/04 19:21:55 by edbernar          #+#    #+#             */
/*   Updated: 2024/08/04 22:41:07 by edbernar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { sendRequest } from "../websocket.js";

function	showActualGameMessage()
{
	const	divMessageListChatHome = document.getElementById("messageListChatHome");
	let		me = "Kumita";
	let		request = {
		isInGame: false,
		opponent: {
			name: "Astropower",
			id: "301547"
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

export { showActualGameMessage };
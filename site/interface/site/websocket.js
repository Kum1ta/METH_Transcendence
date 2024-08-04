/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   websocket.js                                       :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: edbernar <edbernar@student.42angouleme.    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/07/31 22:17:24 by edbernar          #+#    #+#             */
/*   Updated: 2024/08/04 19:51:29 by edbernar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { typeLogin } from "./typeResponse/typeLogin.js";
import { typePrivateListUser } from "./typeResponse/typePrivateListUser.js";
import { typePrivateListMessage } from "./typeResponse/typePrivateListMessage.js";
import { typeNewPrivateMessage } from "./typeResponse/typeNewPrivateMessage.js";

/*
	Todo (Eddy) :
		- Request to connect by email and password. Waiting for the front to do it (already functional on the back side)
		  sendRequest("login", {type: "byPass", mail: "aa@aa.fr", password: "ABC123"});
		- Information: the 'token' variable is only used until the connection is fully implemented
*/

const socket = new WebSocket('ws://localhost:8000/');
const token = "IDSNCSDAd465sd13215421";

const typeResponse = ["login", "private_list_user", "private_list_message", "new_private_message"];
const functionResponse = [typeLogin, typePrivateListUser, typePrivateListMessage, typeNewPrivateMessage];

socket.onopen = () => {
	console.log('Connected');
	if (token)
		sendRequest("login", {"type": "byToken", "token": token});

};

socket.onmessage = (event) => {
	let response;

	try {
		response = JSON.parse(event.data);
	} catch {
		return ;
	}
	if (response.code >= 9000 && response.code <= 9999)
		console.warn(response);
	else
	{
		try {
			functionResponse[typeResponse.indexOf(response.type)](response.content);
		}
		catch {
			console.warn(response);
		}
	}
};

socket.onclose = () => {
	console.log('Disconnected');
};

function	sendRequest(type, content) {
	let coc = null;

	if (content instanceof Object)
		coc = JSON.stringify(content);
	else
		coc = content;
	socket.send(JSON.stringify({
		type: type,
		token: token,
		content: content
	}));
}

export { socket, token, sendRequest };
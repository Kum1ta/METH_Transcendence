/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   websocket.js                                       :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: edbernar <edbernar@student.42angouleme.    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/07/31 22:17:24 by edbernar          #+#    #+#             */
/*   Updated: 2024/08/25 18:09:25 by edbernar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { typeErrorUnknown42Account } from "/static/javascript/typeErrorResponse/typeErrorUnknown42Account.js";
import { typeErrorInvalidPassword } from "/static/javascript/typeErrorResponse/typeErrorInvalidPassword.js";
import { typeErrorInvalidToken42 } from "/static/javascript/typeErrorResponse/typeErrorInvalidToken42.js";
import { typePrivateListMessage } from "/static/javascript/typeResponse/typePrivateListMessage.js";
import { typeNewPrivateMessage } from "/static/javascript/typeResponse/typeNewPrivateMessage.js";
import { typePrivateListUser } from "/static/javascript/typeResponse/typePrivateListUser.js";
import { typeLogin } from "/static/javascript/typeResponse/typeLogin.js";

const	socket = new WebSocket('/ws');

const	typeResponse = ["logged_in", "login", "private_list_user", "private_list_message", "new_private_message"];
const	functionResponse = [typeLogin, typeLogin, typePrivateListUser, typePrivateListMessage, typeNewPrivateMessage];

const	errorCode = [9007, 9010, 9011];
const	errorFunction = [typeErrorInvalidPassword, typeErrorInvalidToken42, typeErrorUnknown42Account];

let		status = 0;

function getCookie(name)
{
	const	value = `; ${document.cookie}`;
	const	parts = value.split(`; ${name}=`);
	let		token = null;

	if (parts.length === 2)
	{
		token = parts.pop().split(';').shift();
		token = token.substring(1, token.length - 1);
	}
	return (token);
}

socket.onopen = () => {
	let	token	= getCookie("token");

	status = 1;
	console.log('Connected');
};

socket.onmessage = (event) => {
	let	response;

	try {
		response = JSON.parse(event.data);
	} catch {
		return ;
	}
	if (response.code >= 9000 && response.code <= 9999)
	{
		try {
			errorFunction[errorCode.indexOf(response.code)]();
		} catch {
			console.warn(response);
		}
	}
	else
	{
		try {
			functionResponse[typeResponse.indexOf(response.type)](response.content);
		} catch {
			console.warn(response);
		}
	}
};

socket.onclose = () => {
	status = 0;
	console.log('Disconnected');
};

function	sendRequest(type, content) {
	let coc = null;

	if (status === 0)
	{
		console.warn('Not connected');
		return ;
	}
	if (content instanceof Object)
		coc = JSON.stringify(content);
	else
		coc = content;
	if (getCookie("token"))
	{
		socket.send(JSON.stringify({
			type: type,
			token: getCookie("token"),
			content: content
		}));
	}
	else
	{
		socket.send(JSON.stringify({
			type: type,
			content: content
		}));
	}
}

export { socket, sendRequest };
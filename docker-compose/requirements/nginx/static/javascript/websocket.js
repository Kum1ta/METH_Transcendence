/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   websocket.js                                       :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: edbernar <edbernar@student.42angouleme.    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/07/31 22:17:24 by edbernar          #+#    #+#             */
/*   Updated: 2024/09/24 15:55:37 by edbernar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { typeErrorConnectedElsewhere } from "/static/javascript/typeErrorResponse/typeErrorConnectedElsewhere.js";
import { typeErrorUnknown42Account } from "/static/javascript/typeErrorResponse/typeErrorUnknown42Account.js";
import { typeErrorInvalidPassword } from "/static/javascript/typeErrorResponse/typeErrorInvalidPassword.js";
import { typeErrorInvalidToken42 } from "/static/javascript/typeErrorResponse/typeErrorInvalidToken42.js";
import { typePrivateListMessage } from "/static/javascript/typeResponse/typePrivateListMessage.js";
import { typeNewPrivateMessage } from "/static/javascript/typeResponse/typeNewPrivateMessage.js";
import { typePrivateListUser } from "/static/javascript/typeResponse/typePrivateListUser.js";
import { typeCreateAccount } from "/static/javascript/typeResponse/typeCreateAccount.js";
import { typeAllListUser }from "/static/javascript/typeResponse/typeAllListUser.js";
import { createNotification as CN } from "/static/javascript/notification/main.js";
import { typeSearchUser } from "/static/javascript/typeResponse/typeSearchUser.js";
import { typeChangePfp } from "/static/javascript/typeResponse/typeChangePfp.js";
import { typeUserInfo } from "/static/javascript/typeResponse/typeUserInfo.js";
import { typeLogin } from "/static/javascript/typeResponse/typeLogin.js";
import { typeGame } from "/static/javascript/typeResponse/typeGame.js"

let socket = null;
let	status = 0;


function launchSocket()
{
	let		lastError = 0;

	socket = new WebSocket('/ws');

	const	typeResponse = ["logged_in", "login", "private_list_user", "private_list_message", "new_private_message", "all_list_user", "create_account", "game", "search_user", "user_info", "change_pfp"];
	const	functionResponse = [typeLogin, typeLogin, typePrivateListUser, typePrivateListMessage, typeNewPrivateMessage, typeAllListUser, typeCreateAccount, typeGame, typeSearchUser, typeUserInfo, typeChangePfp];

	const	errorCode = [9007, 9010, 9011, 9013];
	const	errorFunction = [typeErrorInvalidPassword, typeErrorInvalidToken42, typeErrorUnknown42Account, typeErrorConnectedElsewhere];


	socket.onopen = () => {
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
			lastError = response.code;
			if (response.code >= 9014 && response.code <= 9025)
			{
				console.log(response);
				CN.new("Error", response.content);
			}
			else
			{
				try {
					errorFunction[errorCode.indexOf(response.code)]();
				} catch ( error )
				{
					console.warn(response);
				}
			}
		}
		else
		{
			try {
				functionResponse[typeResponse.indexOf(response.type)](response.content);
			} catch (error)
			{
				console.error(error);
				console.warn(response);
			}
		}
	};

	socket.onclose = () => {
		status = 0;
		console.log('Disconnected');
		if (lastError !=  9013)
		{
			setTimeout(() => {
				launchSocket();
			}, 500);
		}
	};
}

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
	socket.send(JSON.stringify({
		type: type,
		content: content
	}));
}

export { socket, sendRequest, launchSocket };
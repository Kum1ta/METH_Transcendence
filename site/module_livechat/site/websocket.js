/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   websocket.js                                       :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: edbernar <edbernar@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/07/31 22:17:24 by edbernar          #+#    #+#             */
/*   Updated: 2024/08/03 08:46:22 by edbernar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { typeLogin } from "./typeResponse/typeLogin.js";
import { typePrivateListUser } from "./typeResponse/typePrivateListUser.js";

const socket = new WebSocket('ws://localhost:8000/');
const token = "123456";

const typeResponse = ["login", "private_list_user"];
const functionResponse = [typeLogin, typePrivateListUser];

socket.onopen = () => {
	console.log('Connected');
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

export { socket, token};
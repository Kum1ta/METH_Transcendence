/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   websocket.js                                       :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: edbernar <edbernar@student.42angouleme.    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/07/31 22:17:24 by edbernar          #+#    #+#             */
/*   Updated: 2024/07/31 23:40:05 by edbernar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

const socket = new WebSocket('ws://localhost:8000/');

socket.onopen = () => {
	console.log('Connected');
	setInterval(() => {
		socket.send("Heartbeat");
	}, 10000);
};

socket.onmessage = (event) => {
	let response;

	try {
		response = JSON.parse(event.data);
	} catch {
		return ;
	}
	if (response.code >= 9000 && response.code <= 9999)
	{
		console.warn(response);
		return ;
	}
	console.log(response)
};
socket.onclose = () => {
	console.log('Disconnected');
};

function mainSocket() {
	
}

export { mainSocket };

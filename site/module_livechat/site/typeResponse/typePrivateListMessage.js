/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   typePrivateListMessage.js                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: edbernar <edbernar@student.42angouleme.    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/08/03 22:20:35 by edbernar          #+#    #+#             */
/*   Updated: 2024/08/03 23:23:42 by edbernar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

let messageList = [];
let messageListAvailable = false;
let messageListResolve = null;

function waitForMessageList() {
	return new Promise((resolve) => {
		if (messageListAvailable)
			resolve();
		else
			messageListResolve = resolve;
	});
}

function typePrivateListMessage(list) {
	messageList = list;
	messageListAvailable = true;
	if (messageListResolve)
	{
		messageListResolve();
		messageListResolve = null;
	}
}

export { messageList, typePrivateListMessage, waitForMessageList };
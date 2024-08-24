/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   typePrivateListMessage.js                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: edbernar <edbernar@student.42angouleme.    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/08/03 22:20:35 by edbernar          #+#    #+#             */
/*   Updated: 2024/08/04 18:58:45 by edbernar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

let infoPanel = {
	isOpen: false,
	id: -1,
	divMessage: null
}
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
		messageListAvailable = false;
	}
}

export { messageList, infoPanel, typePrivateListMessage, waitForMessageList };
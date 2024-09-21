/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   main.js                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: edbernar <edbernar@student.42angouleme.    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/09/19 23:08:31 by edbernar          #+#    #+#             */
/*   Updated: 2024/09/21 21:51:43 by edbernar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { createNotification as CN } from "/static/javascript/notification/main.js";
import { waitForUserInfo } from "/static/javascript/typeResponse/typeUserInfo.js";
import { showPrivateChat } from "/static/javascript/liveChat/showPrivateChat.js";
import { LiveChat, showChatMenu } from "/static/javascript/liveChat/main.js";
import { userMeInfo } from "/static/javascript/typeResponse/typeLogin.js";
import { sendRequest } from "/static/javascript/websocket.js";

class ProfilPage
{
	static create(userId)
	{
		const	username		=	document.getElementsByTagName('h2')[0];
		const	pfp				=	document.getElementsByClassName('profile-image')[0];
		const	banner			=	document.getElementsByClassName('background-card')[0];
		const	githubButton	=	document.getElementById('github');
		const	discordButton	=	document.getElementById('discord');
		const	convButton		=	document.getElementById('newConv');
		let		usernameText	=	null;

		LiveChat.create();
		sendRequest("get_user_info", {id: userId});
		waitForUserInfo().then((userInfo) => {
			usernameText = userInfo.username;
			username.innerText = userInfo.username + ' (status not implemented)';
			pfp.style.backgroundImage = `url("${userInfo.pfp}")`
			pfp.style.backgroundSize = "cover";
			pfp.style.backgroundRepeat = "no-repeat";
			banner.style.backgroundImage = `url("${userInfo.banner}")`
			banner.style.backgroundSize = "cover";
			banner.style.backgroundRepeat = "no-repeat";
			if (userId == userMeInfo.id)
			{
				pfp.innerHTML = `<div id='editPenPfpBg'><img class='editPenPfp' src='/static/img/profilPage/editPen.png'/></div>`
				banner.innerHTML = `<img class='editPen' src='/static/img/profilPage/editPen.png'/>`
			}	
		});
		convButton.addEventListener('click', () => {
			showChatMenu();
			showPrivateChat({id: userId, name: usernameText});
		});
	}

	static dispose()
	{
		LiveChat.dispose();
	}
	
}

export { ProfilPage };
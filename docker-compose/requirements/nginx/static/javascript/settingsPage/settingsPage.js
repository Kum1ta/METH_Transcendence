/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   settingsPage.js                                    :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: edbernar <edbernar@student.42angouleme.    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/09/25 17:00:35 by edbernar          #+#    #+#             */
/*   Updated: 2024/09/26 01:02:31 by edbernar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { waitForPrivateInfo } from "/static/javascript/typeResponse/typePrivateInfo.js"
import { sendRequest, status } from "/static/javascript/websocket.js";

class settingsPage
{
	static create()
	{
		const	emailInput				=	document.getElementById('email');
		const	discordInput			=	document.getElementById('discord');
		const	usernameInput			=	document.getElementById('username');
		const	passwordInput			=	document.getElementById('password');
		const	newPasswordInput		=	document.getElementById('new-password');
		const	confirmOasswordInput	=	document.getElementById('confirm-password');

		const	usernameSaveButton		=	document.getElementById('usernameButtonSave');
		const	discordSaveButton		=	document.getElementById('discordButtonSave');

		let		interval				=	null;

		emailInput.disabled = true;
		emailInput.style.backgroundColor = "#bbbbbb";
		interval = setInterval(() => {
			if (status)
			{
				sendRequest("get_private_info", {});
				clearInterval(interval);
			}
		}, 200);
		waitForPrivateInfo().then(data => {
			console.log(data);
			emailInput.value = data.mail ? data.mail : "Disabled because you have a 42 account."
			passwordInput.value = newPasswordInput.value = confirmOasswordInput.value = data.is42Account ? "Disabled because you have a 42 account." : null;
			if (data.is42Account)
			{
				passwordInput.style.backgroundColor = newPasswordInput.style.backgroundColor = confirmOasswordInput.style.backgroundColor = "#bbbbbb";
				passwordInput.type = newPasswordInput.type = confirmOasswordInput.type = 'text'; 
			}
			discordInput.value = data.discord_username;
			usernameInput.value = data.username;

			usernameSaveButton.addEventListener('click', () => {
				sendRequest("change_private_info", {username: usernameInput.value});
			});
			discordSaveButton.addEventListener('click', () => {
				sendRequest("change_private_info", {discord: discordInput.value});
			});
		});
		
	}

	static dispose()
	{
		
	}
}

export { settingsPage };
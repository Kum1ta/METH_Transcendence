/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   main.js                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: edbernar <edbernar@student.42angouleme.    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/09/19 23:08:31 by edbernar          #+#    #+#             */
/*   Updated: 2024/09/23 23:40:42 by edbernar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { createNotification as CN } from "/static/javascript/notification/main.js";
import { waitForUserInfo } from "/static/javascript/typeResponse/typeUserInfo.js";
import { showPrivateChat } from "/static/javascript/liveChat/showPrivateChat.js";
import { LiveChat, showChatMenu } from "/static/javascript/liveChat/main.js";
import { userMeInfo } from "/static/javascript/typeResponse/typeLogin.js";
import { sendRequest } from "/static/javascript/websocket.js";
import { pageRenderer } from '/static/javascript/main.js'

class ProfilPage
{
	static create(user)
	{
		const	username		=	document.getElementsByTagName('h2')[0];
		const	pfp				=	document.getElementsByClassName('profile-image')[0];
		const	banner			=	document.getElementsByClassName('background-card')[0];
		const	convButton		=	document.getElementById('newConv');
		const	crossProfil		=	document.getElementById('cross-profil');
		let		editPenPfpBg	=	null;
		let		inputPfp		=	null;
		let		interval		=	null;

		LiveChat.create();
		if (typeof(user) == 'string')
		{
			interval = setInterval(() => {
				if (userMeInfo.id > 0)
				{
					sendRequest("get_user_info", {username: user})
					clearInterval(interval);
				}
			}, 100);
			
		}
		else
			sendRequest("get_user_info", {id: user});
		crossProfil.addEventListener('click', () => {
			if (typeof(user) == 'string')
				pageRenderer.changePage('homePage');
			else
				pageRenderer.changePage('lobbyPage');
		});
		waitForUserInfo().then((userInfo) => {
			console.log(userInfo);
			if (userInfo == null)
			{
				pageRenderer.changePage('homePage');
				return ;
			}
			if (typeof(user) != 'string')
				history.replaceState({}, document.title, window.location.pathname + '/' + userInfo.username);
			username.innerHTML = userInfo.username + '<span class="online-status"></span>';
			if (!userInfo.online)
				document.getElementsByClassName('online-status')[0].style.backgroundColor = '#E74040';
			pfp.style.backgroundImage = `url("${userInfo.pfp}")`
			pfp.style.backgroundSize = "cover";
			pfp.style.backgroundRepeat = "no-repeat";
			banner.style.backgroundImage = `url("${userInfo.banner}")`
			banner.style.backgroundSize = "cover";
			banner.style.backgroundRepeat = "no-repeat";
			externButtons(userInfo)
			if (userInfo.id == userMeInfo.id)
			{
				pfp.innerHTML = `<div id='editPenPfpBg'><input style='display: none' id='inputPfp' type="file"><img class='editPenPfp' src='/static/img/profilPage/editPen.png'/></div>`
				banner.innerHTML = `<img class='editPen' src='/static/img/profilPage/editPen.png'/>`
				editPenPfpBg = document.getElementById('editPenPfpBg');
				inputPfp = document.getElementById('inputPfp');
				editPenPfpBg.addEventListener('click', () => {
					inputPfp.click();
				});
				inputPfp.setAttribute('accept', '.png, .jpeg, .jpg');
				inputPfp.addEventListener('change', (event) => {
					const reader		= new FileReader();
					const validTypes	=	['image/png', 'image/jpeg'];
					const file			=	event.target.files[0];

					function arrayBufferToBase64(buffer) {
						let binary = '';
						const bytes = new Uint8Array(buffer);
						const len = bytes.byteLength;
						for (let i = 0; i < len; i++) {
						  binary += String.fromCharCode(bytes[i]);
						}
						return window.btoa(binary);
					  }
					if (validTypes.includes(file.type))
					{
						reader.onload = (e) => {
							const arrayBuffer = e.target.result;

							console.log(arrayBuffer);
							sendRequest('change_pfp', {img: arrayBufferToBase64(arrayBuffer), type: file.type})
						}
						reader.readAsArrayBuffer(file);
					}
				  });
			}
			if (userInfo.id != userMeInfo.id)
			{
				convButton.addEventListener('click', () => {
					showChatMenu();
					showPrivateChat({id: userInfo.id, name: userInfo.username});
				});
			}
			else
				convButton.remove();
		});
	}

	static dispose()
	{
		LiveChat.dispose();
	}
}


function externButtons(userInfo)
{
	const	githubButton	=	document.getElementById('github');
	const	discordButton	=	document.getElementById('discord');

	if (userInfo.github)
		githubButton.setAttribute('href', userInfo.github);
	else
		githubButton.remove();
	if (userInfo.discord)
		discordButton.setAttribute('name', userInfo.discord);
	else
		discordButton.remove();
}

export { ProfilPage };
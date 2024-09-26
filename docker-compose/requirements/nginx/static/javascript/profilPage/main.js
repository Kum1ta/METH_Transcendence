/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   main.js                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: edbernar <edbernar@student.42angouleme.    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/09/19 23:08:31 by edbernar          #+#    #+#             */
/*   Updated: 2024/09/27 00:54:02 by edbernar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { waitForchangePfp } from "/static/javascript/typeResponse/typeChangePfp.js";
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
		const	inviteButton	=	document.getElementById('invite');
		const	crossProfil		=	document.getElementById('cross-profil');
		let		ctx				=	document.getElementById('stats').getContext('2d');
		let		editPenPfpBg	=	null;
		let		inputPfp		=	null;
		let		editPenBanner	=	null;
		let		inputBanner		=	null;
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
			externButtons(userInfo);
			createGraph(ctx, {win: 10, lose: 1});
			console.warn("Graph values are settled in code, please change it with data request")
			if (userInfo.id == userMeInfo.id)
			{
				inviteButton.remove();
				pfp.innerHTML = `<div id='editPenPfpBg'><input style='display: none' id='inputPfp' type="file"><img class='editPenPfp' src='/static/img/profilPage/editPen.png'/></div>`
				banner.innerHTML = `<img class='editPen' src='/static/img/profilPage/editPen.png'/><input style='display: none' id='inputBanner' type="file">`
				editPenPfpBg = document.getElementById('editPenPfpBg');
				inputPfp = document.getElementById('inputPfp');
				editPenPfpBg.addEventListener('click', () => {
					inputPfp.setAttribute('accept', '.png, .jpeg, .jpg, .gif');
					inputPfp.click();
				});
				inputPfp.setAttribute('accept', '.png, .jpeg, .jpg, .gif');
				inputPfp.addEventListener('change', () => inputChange(true));

				editPenBanner = document.getElementsByClassName('editPen')[0];
				inputBanner = document.getElementById('inputBanner');
				editPenBanner.addEventListener('click', () => {
					inputBanner.setAttribute('accept', '.png, .jpeg, .jpg, .gif');
					inputBanner.click();
				});
				inputBanner.setAttribute('accept', '.png, .jpeg, .jpg, .gif');
				inputBanner.addEventListener('change',  () => inputChange(false));
			}
			if (userInfo.id != userMeInfo.id)
			{
				convButton.addEventListener('click', () => {
					showChatMenu();
					showPrivateChat({id: userInfo.id, name: userInfo.username});
				});
				inviteButton.addEventListener('click', () => {
					if (!userInfo.online)
						CN.new("Invitation", `Can't invite ${userInfo.username} (offline)`)
					else
					{
						pageRenderer.changePage("waitingGamePage", false, {username: userInfo.username, id: userInfo.id});
					}
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

function inputChange(isPfp)
{
	const reader		= new FileReader();
	const validTypes	=	['image/png', 'image/jpeg', 'image/webp']
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

			if (isPfp)
				sendRequest('change_pfp', {img: arrayBufferToBase64(arrayBuffer), type: file.type})
			else
				sendRequest('change_banner', {img: arrayBufferToBase64(arrayBuffer), type: file.type})
			waitForchangePfp().then((content) => {
				if (isPfp)
					document.getElementsByClassName('profile-image')[0].style.backgroundImage = `url("${content.pfp}")`
				else
					document.getElementsByClassName('background-card')[0].style.backgroundImage = `url("${content.banner}")`
			});
		}
		reader.readAsArrayBuffer(file);
	}
}

function createGraph(ctx, data)
{
	new Chart(ctx, {
		type: 'pie',
		data: {
			labels: ['Win', 'Lose'],
			datasets: [{
				label: 'Couleurs',
				data: [data.win, data.lose],
				backgroundColor: ['#11ad11', '#E74040'],
				hoverOffset: 4
			}]
		},
		options: {
			responsive: true,
			plugins: {
				legend: {
					position: 'bottom',
				},
				tooltip: {
					enabled: true
				}
			}
		}
	});
}


export { ProfilPage };

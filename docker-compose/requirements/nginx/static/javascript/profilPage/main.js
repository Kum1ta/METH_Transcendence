/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   main.js                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: madegryc <madegryc@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/09/19 23:08:31 by edbernar          #+#    #+#             */
/*   Updated: 2024/11/21 13:18:52 by madegryc         ###   ########.fr       */
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
		const	elo				=	document.getElementById('player-elo');
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
			if (document.precedentPage)
				pageRenderer.changePage(document.precedentPage);
			else
				pageRenderer.changePage('homePage');
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
			elo.innerHTML = `Elo: ${userInfo.elo}`;
			externButtons(userInfo);
			showHistory(userInfo);
			buttonDashboard(userInfo);
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
				inputPfp.addEventListener('change', (event) => inputChange(true, event));

				editPenBanner = document.getElementsByClassName('editPen')[0];
				inputBanner = document.getElementById('inputBanner');
				editPenBanner.addEventListener('click', () => {
					inputBanner.setAttribute('accept', '.png, .jpeg, .jpg, .gif');
					inputBanner.click();
				});
				inputBanner.setAttribute('accept', '.png, .jpeg, .jpg, .gif');
				inputBanner.addEventListener('change',  (event) => inputChange(false, event));
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
						pageRenderer.changePage("waitingGamePage", false, {username: userInfo.username, id: userInfo.id, isTournament: false});
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
	{
		discordButton.setAttribute('name', userInfo.discord);
		discordButton.addEventListener('mouseover', () => {
			const	bound	= discordButton.getBoundingClientRect();
			const	div		= document.createElement('div');
			let		boundDiv;

			div.setAttribute('class', 'discord-username-settings');
			document.body.appendChild(div);
			div.style.top = `${bound.top + bound.height + 10}px`;
			div.style.opacity = 0;
			setTimeout(() => {
				boundDiv = div.getBoundingClientRect();
				div.style.left = `${bound.left - (boundDiv.width / 2) + (bound.width / 2)}px`;
				div.style.opacity = 1;
			}, 10);
			div.innerHTML = userInfo.discord;
		});
		discordButton.addEventListener('mouseout', () => {
			document.getElementsByClassName('discord-username-settings')[0].remove();
		});
	}
	else
		discordButton.remove();
}

function inputChange(isPfp, event)
{
	const reader		=	new FileReader();
	const validTypes	=	['image/png', 'image/jpeg', 'image/webp', 'image/gif'];
	const file			=	event.target.files[0];

	function arrayBufferToBase64(buffer) {
		let binary = '';
		const bytes = new Uint8Array(buffer);
		const len = bytes.byteLength;
		for (let i = 0; i < len; i++)
		  binary += String.fromCharCode(bytes[i]);
		return window.btoa(binary);
	}
	if (file && validTypes.includes(file.type))
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
			labels: [' Win ', ' Lose '],
			datasets: [{
				data: [data.win, data.lose],
				backgroundColor: ['#11ad11', '#E74040'],
				hoverOffset: 1,
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

function showHistory(userInfo)
{
	const	divHistory	=	document.getElementById('scroll-match');
	const	history		=	userInfo.history;

	history.forEach(element => {
		const	div	=	document.createElement('div');

		div.setAttribute('class', 'history-card');
		if (element.forfeit)
			div.style.backgroundColor = '#c45f0c';
		else if (element.won)
			div.style.backgroundColor = '#11ad11';
		div.innerHTML = `
		<div id="user-1">
			<div class="profile-img-history">
				<img src="${userInfo.pfp}">
			</div>
			<p>${userInfo.username}</p>
		</div>
		<p id="score-history">${element.p1.score} - ${element.p2.score}</p>
		<div id="user-2">
			<div class="profile-img-history">
				<img src="${element.p2.pfp}">
			</div>
			<p>${element.p2.username}</p>
		</div>`
		divHistory.appendChild(div);
	});
}

function buttonDashboard(userInfo)
{
	const	buttonLeft		=	document.getElementById('leftArrowDashboard');
	const	buttonRight		=	document.getElementById('rightArrowDashboard');
	const	contentStats	=	document.getElementsByClassName('contentStats')[0];
	let		actualPage		=	0;

	function changeDashboard()
	{
		contentStats.innerHTML = '';
		if (actualPage == 0)
		{
			contentStats.innerHTML = `<canvas id="stats"></canvas>`;
			const ctx = document.getElementById('stats').getContext('2d');
			createGraph(ctx, {win: userInfo.nbWin, lose: userInfo.nbLoss});
		}
		else if (actualPage == 1)
		{
			let	winrate = Math.round((userInfo.nbWin / (userInfo.nbWin + userInfo.nbLoss)) * 100);

			if (isNaN(winrate))
				winrate = 'Never played';
			contentStats.innerHTML = `
			<p class="dashboard-line">Winrate<span>${winrate == 'Never played' ? winrate : winrate + '%'}</span></p>
			<p class="dashboard-line">Opponent give up rate<span>${userInfo.forfeitRate}%</span></p>
			<p class="dashboard-line">Average goal number<span>${userInfo.avgGoals}</span></p>
			<p class="dashboard-line">Number of parties (last 30 days)<span>${userInfo.nbGames30Days}</span></p>
			`;
		}
	}

	buttonLeft.addEventListener('click', () => {
		actualPage = actualPage == 0 ? 1 : 0;
		changeDashboard();
	});
	buttonRight.addEventListener('click', () => {
		actualPage = actualPage == 0 ? 1 : 0;
		changeDashboard();
	});

	changeDashboard();
}
                   


export { ProfilPage };

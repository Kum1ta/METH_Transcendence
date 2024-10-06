/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   settingsPage.js                                    :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: edbernar <edbernar@student.42angouleme.    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/09/25 17:00:35 by edbernar          #+#    #+#             */
/*   Updated: 2024/10/06 17:02:12 by edbernar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { waitForPrivateInfo } from "/static/javascript/typeResponse/typePrivateInfo.js"
import { createNotification as CN } from "/static/javascript/notification/main.js";
import { userMeInfo } from "/static/javascript/typeResponse/typeLogin.js";
import { sendRequest, status } from "/static/javascript/websocket.js";
import { pageRenderer } from '/static/javascript/main.js'

class settingsPage
{
	static create()
	{
		const	emailInput				=	document.getElementById('email');
		const	discordInput			=	document.getElementById('discord');
		const	usernameInput			=	document.getElementById('username');
		const	passwordInput			=	document.getElementById('password');
		const	newPasswordInput		=	document.getElementById('new-password');
		const	confirmPasswordInput	=	document.getElementById('confirm-password');
		const	usernameDeleteInput		=	document.getElementById('username-delete');

		const	usernameSaveButton		=	document.getElementById('usernameButtonSave');
		const	discordSaveButton		=	document.getElementById('discordButtonSave');
		const	passwordSaveButton		=	document.getElementById('passwordButtonSave');
		const	deleteButton			=	document.getElementById('deleteButton');
		const	buttonShowDeleteMenu	=	document.getElementById('buttonShowDeleteMenu');

		const	loginButton				=	document.getElementById('loginButton').getElementsByTagName('p')[0];
		const	methButton				=	document.getElementById('homeButton');

		const	divDeleteAccount		=	document.getElementById('popup-background-delete');

		let		interval				=	null;

		emailInput.disabled = true;
		emailInput.style.backgroundColor = "#bbbbbb";
		interval = setInterval(() => {
			if (status)
			{
				sendRequest("get_private_info", {});
				clearInterval(interval);
				interval = setInterval(() => {
					if (userMeInfo.username != "")
					{
						loginButton.innerText = userMeInfo.username.length > 8 ? userMeInfo.username.substring(0, 8) + '...' : userMeInfo.username;
						clearInterval(interval);
					}
				}, 200);
			}
		}, 200);
		waitForPrivateInfo().then(data => {
			emailInput.value = data.mail ? data.mail : "Disabled because you have a 42 account."
			passwordInput.value = newPasswordInput.value = confirmPasswordInput.value = data.is42Account ? "Disabled because you have a 42 account." : null;
			if (data.is42Account)
			{
				passwordInput.style.backgroundColor = newPasswordInput.style.backgroundColor = confirmPasswordInput.style.backgroundColor = passwordSaveButton.style.backgroundColor = "#bbbbbb";
				passwordInput.type = newPasswordInput.type = confirmPasswordInput.type = 'text';
				passwordInput.disabled = true;
				newPasswordInput.disabled = true;
				confirmPasswordInput.disabled = true;
				passwordSaveButton.disabled = true;
			}
			discordInput.value = data.discord_username;
			usernameInput.value = data.username;

			usernameSaveButton.addEventListener('click', () => {
				sendRequest("change_private_info", {username: usernameInput.value});
			});
			discordSaveButton.addEventListener('click', () => {
				sendRequest("change_private_info", {discord: discordInput.value});
			});
			buttonShowDeleteMenu.addEventListener('click', () => {
				divDeleteAccount.style.display = 'flex';
				function hideMenu(e)
				{
					if (e.target.getAttribute('class') == "popup-background-delete")
					{
						divDeleteAccount.style.display = 'none';
						usernameDeleteInput.value = 'aaa';
						buttonShowDeleteMenu.removeEventListener('click', hideMenu);
					}
				};
				divDeleteAccount.addEventListener('click', hideMenu);
			});
			deleteButton.addEventListener('click', () => {
				if (usernameDeleteInput.value != userMeInfo.username)
				{
					CN.new("Error", "Username does not match", CN.error);
					return ;
				}
				sendRequest("change_private_info", {delete: true});
				userMeInfo.id = -1;
				setTimeout(() => {
					CN.new("Information", "Your account is delete.")
				}, 1000);
				pageRenderer.changePage('homePage', false);
			});
			if (!data.is42Account)
			{
				passwordSaveButton.addEventListener('click', () => {
					if (newPasswordInput.value != confirmPasswordInput.value)
					{
						CN.new("Error", "Passwords do not match", CN.defaultIcon.error);
						return ;
					}
					sendRequest("change_private_info", {old_password: passwordInput.value, new_password: newPasswordInput.value});
				});
			}
		});
		loginButton.addEventListener('click', showMenu);
		window.addEventListener('resize', movePopMenuLoginButton);
		movePopMenuLoginButton();
		initButtonPopMenuLogin();
		methButton.addEventListener('click', goBackHome);
	}

	static dispose()
	{
		const	loginButton				=	document.getElementById('loginButton').getElementsByTagName('p')[0];
		const	methButton				=	document.getElementById("homeButton");

		window.removeEventListener('resize', movePopMenuLoginButton);
		document.removeEventListener('click', hideMenu);
		loginButton.addEventListener('click', showMenu);
		methButton.addEventListener('click', goBackHome);
	}
}

function initButtonPopMenuLogin()
{
	const	buttons = document.getElementById('popMenuLoginButton').getElementsByTagName('p');

	buttons[0].addEventListener('click', () => {
		pageRenderer.changePage('profilPage', false, userMeInfo.id);
	});
	buttons[1].addEventListener('click', () => {
		pageRenderer.changePage('settingsPage', false);
	});
	buttons[2].addEventListener('click', () => {
		window.location.replace('/logout');
	});
}

function movePopMenuLoginButton()
{
	const	loginButton			= document.getElementById('loginButton');
	const	pos					= loginButton.getBoundingClientRect();
	const	popMenuLoginButton 	= document.getElementById('popMenuLoginButton');

	popMenuLoginButton.style.left = pos.left + "px";
	popMenuLoginButton.style.top = pos.top + pos.height + "px";
}

function showMenu()
{
	const	popMenuLoginButton 	= document.getElementById('popMenuLoginButton');
	const	loginButton			= document.getElementById('loginButton');
	
	popMenuLoginButton.style.display = 'flex';
	setTimeout(() => {
		document.addEventListener('click', hideMenu);
		loginButton.removeEventListener('click', showMenu);
		loginButton.addEventListener('click', hideMenu);
	}, 50);
}

function hideMenu()
{
	const	loginButton			= document.getElementById('loginButton');
	const	popMenuLoginButton 	= document.getElementById('popMenuLoginButton');
	
	popMenuLoginButton.style.display = 'none';
	setTimeout(() => {
		document.removeEventListener('click', hideMenu);
		loginButton.removeEventListener('click', hideMenu);
		loginButton.addEventListener('click', showMenu);
	}, 50);
}

function goBackHome()
{
	pageRenderer.changePage('homePage', false);
}

export { settingsPage };
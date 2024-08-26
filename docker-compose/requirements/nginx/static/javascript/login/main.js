/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   main.js                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: madegryc <madegryc@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/08/07 17:40:15 by edbernar          #+#    #+#             */
/*   Updated: 2024/08/26 18:10:12 by madegryc         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { createNotification as CN } from "/static/javascript/notification/main.js";
import { userMeInfo, waitForLogin } from "/static/javascript/typeResponse/typeLogin.js";
import { sendRequest } from "/static/javascript/websocket.js";

class Login
{
	static create()
	{
		const	loginButton		= document.getElementById('loginButton');
		const	pLoginButton	= loginButton.getElementsByTagName('p')[0];
		const	form			= document.getElementById('loginForm');
		let		nodeText		= null;
		const	registerButton  = document.getElementsByClassName('new-player')[0];

		registerButton.addEventListener('click', changeWindowLogin);
		waitForLogin().then(() => {
			if (userMeInfo.id !== -1)
			{
				nodeText = document.createTextNode(userMeInfo.username);
				loginButton.replaceChild(nodeText, pLoginButton);
				// loginButton.addEventListener('click', showMenu);
			}
			else
			{
				loginButton.addEventListener('click', showLoginDiv);
			}
		});
		form.addEventListener('submit', connect);
	}

	static dispose()
	{
		const	loginButton		= document.getElementById('loginButton');
		const	form			= document.getElementById('loginForm');
		const   registerButton  = document.getElementById('new-player');
		const   loginBackButton = document.getElementById('old-player');

		loginButton.removeEventListener('click', showLoginDiv);
		form.removeEventListener('submit', connect);
		registerButton.removeEventListener('click', changeWindowLogin);
		loginBackButton.removeEventListener('click', changeWindowLoginBack);
	}
}

function	changeWindowLogin(e)
{
	const	registerWindow	= document.getElementsByClassName('right-side-register')[0];
	const	loginWindow		= document.getElementsByClassName('right-side')[0];
	e.preventDefault();
	loginWindow.style.display = 'none';
	registerWindow.style.display = 'flex';
}

function   changeWindowLoginBack(e)
{
	const	registerWindow	= document.getElementsByClassName('right-side-register')[0];
	const	loginWindow		= document.getElementsByClassName('right-side')[0];
	e.preventDefault();
	loginWindow.style.display = 'flex';
	registerWindow.style.display = 'none';
}

function	showLoginDiv()
{
	const popout = document.getElementById('loginPopup');

	if (popout.style.display === 'flex')
		popout.style.display = 'none';
	else
		popout.style.display = 'flex';
}

function	connect(e)
{
	const	loginButton		= document.getElementById('loginButton');
	const	pLoginButton	= loginButton.getElementsByTagName('p')[0];
	const 	popout 			= document.getElementById('loginPopup');
	const 	mail			= document.getElementById('email').value;
	let		usernameNode	= null;
	
	e.preventDefault();
	sendRequest("login", {type: "byPass", mail: mail, password: e.target.password.value});
	waitForLogin().then((isConnected) => {
		if (isConnected)
		{
			usernameNode = document.createTextNode(userMeInfo.username);
			loginButton.replaceChild(usernameNode, pLoginButton);
			CN.new("Connected successfully", "Welcome " + userMeInfo.username, CN.defaultIcon.success);
			popout.style.display = 'none';
		}
	}).catch((err) => {
		console.error(err);
		CN.new("Error", "An error occured while trying to connect", CN.defaultIcon.error);
	});
}

export { Login };
/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   main.js                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: edbernar <edbernar@student.42angouleme.    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/08/07 17:40:15 by edbernar          #+#    #+#             */
/*   Updated: 2024/08/30 11:59:13 by edbernar         ###   ########.fr       */
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
		const	button42		= document.getElementsByClassName('login-42-btn')[0];

		registerButton.addEventListener('click', changeWindowLogin);
		button42.addEventListener('click', redirection);
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
		const	button42		= document.getElementsByClassName('login-42-btn')[0];

		registerButton.removeEventListener('click', redirection);
		loginButton.removeEventListener('click', showLoginDiv);
		form.removeEventListener('submit', connect);
		registerButton.removeEventListener('click', changeWindowLogin);
		loginBackButton.removeEventListener('click', changeWindowLoginBack);
	}
}

function	redirection(e)
{
	e.preventDefault();
	window.location.replace('https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-d9d6d46bd0be36dc13718981df4bfcf37e574ea364a07fcb5c39658be0f5706c&redirect_uri=https://localhost:8000/login42&response_type=code&scope=public');
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
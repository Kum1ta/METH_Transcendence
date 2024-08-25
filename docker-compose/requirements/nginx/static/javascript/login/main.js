/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   main.js                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: edbernar <edbernar@student.42angouleme.    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/08/07 17:40:15 by edbernar          #+#    #+#             */
/*   Updated: 2024/08/25 17:14:01 by edbernar         ###   ########.fr       */
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
		const	loginButton	= document.getElementById('loginButton');
		const	form			= document.getElementById('loginForm');

		loginButton.removeEventListener('click', showLoginDiv);
		form.removeEventListener('submit', connect);

	}
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
/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   typeLogin.js                                       :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: edbernar <edbernar@student.42angouleme.    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/08/02 00:39:53 by edbernar          #+#    #+#             */
/*   Updated: 2024/11/18 16:36:06 by edbernar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { createNotification as CN } from "/static/javascript/notification/main.js";
import { Login } from '/static/javascript/login/main.js'

let userMeInfo = {
	username: "",
	id: -1
};

let loginAvailable = false;
let loginResolve = [];

function waitForLogin() {
	return new Promise((resolve) => {
		if (loginAvailable)
			resolve(userMeInfo);
		else
			loginResolve.push(resolve);
	});
}

function	typeLogin(content)
{
	const	popout 			= document.getElementById('loginPopup');
	const	loginButton		= document.getElementById('loginButton');
	let		pLoginButton	= loginButton ? loginButton.getElementsByTagName('p')[0] : null;
	let		notifBadgeChat	= null;
	let		usernameNode	= null;
	let		interval		= null;
	let		i				= 0;

	if (content && typeof(content) != 'boolean' && content.status == true)
	{
		userMeInfo.username = content.username;
		userMeInfo.id = content.id;
		
		interval = setInterval(() => {
			notifBadgeChat	= document.getElementsByClassName('notification-badge')[0];
			if (notifBadgeChat && content.haveUnredMessage)
			{
				notifBadgeChat.style.display = 'flex';
				clearInterval(interval);
			}
			else if (notifBadgeChat)
				clearInterval(interval);
			else if (i == 5)
				clearInterval(interval);
			i++;
		}, 500);
		if (popout && popout.style.display === 'flex')
		{
			usernameNode = document.createTextNode(userMeInfo.username);
			loginButton.replaceChild(usernameNode, pLoginButton);
			CN.new("Connected successfully", "Welcome " + userMeInfo.username, CN.defaultIcon.success);
			popout.style.display = 'none';
			Login.changeEventLoginButton();
		}
	}
	loginAvailable = true;
	if (loginResolve != [])
	{
		loginResolve.forEach(func => func(content));
		loginResolve = [];
	}
}

export { userMeInfo, typeLogin, waitForLogin };
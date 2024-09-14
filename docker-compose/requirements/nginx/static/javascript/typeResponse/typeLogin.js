/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   typeLogin.js                                       :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: edbernar <edbernar@student.42angouleme.    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/08/02 00:39:53 by edbernar          #+#    #+#             */
/*   Updated: 2024/09/14 23:59:52 by edbernar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { createNotification as CN } from "/static/javascript/notification/main.js";

let userMeInfo = {
	username: "",
	id: -1
};

let loginAvailable = false;
let loginResolve = null;

function waitForLogin() {
	return new Promise((resolve) => {
		if (loginAvailable)
			resolve();
		else
			loginResolve = resolve;
	});
}

function	typeLogin(content)
{
	setTimeout(() => {
		const	popout 			= document.getElementById('loginPopup');
		const	loginButton		= document.getElementById('loginButton');
		let		pLoginButton	= null;
		if (loginButton)
			pLoginButton = loginButton.getElementsByTagName('p')[0];
		let		usernameNode	= null;
	
	
		if (content && typeof(content) != 'boolean' && content.status == true)
		{
			console.log("Welcome " + content.username + "\nYour id is " + content.id);
			userMeInfo.username = content.username;
			userMeInfo.id = content.id;
			if (popout && popout.style.display === 'flex')
			{
				usernameNode = document.createTextNode(userMeInfo.username);
				loginButton.replaceChild(usernameNode, pLoginButton);
				CN.new("Connected successfully", "Welcome " + userMeInfo.username, CN.defaultIcon.success);
				popout.style.display = 'none';
			}
		}
		loginAvailable = true;
		if (loginResolve)
		{
			loginResolve(content);
			loginResolve = null;
			loginAvailable = false;
		}
	}, 100);
}

export { userMeInfo, typeLogin, waitForLogin };
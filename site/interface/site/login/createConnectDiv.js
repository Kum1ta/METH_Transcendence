/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   createConnectDiv.js                                :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: edbernar <edbernar@student.42angouleme.    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/08/07 18:14:53 by edbernar          #+#    #+#             */
/*   Updated: 2024/08/07 22:33:39 by edbernar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { userMeInfo, waitForLogin } from "../typeResponse/typeLogin.js";
import { createNotification as CN } from "../notification/main.js";
import { sendRequest } from "../websocket.js";

function	createConnectDiv()
{
	const	divConnect	= document.createElement("div");
	const	inputLogin	= document.createElement("input");
	const	inputPass	= document.createElement("input");
	const	buttonLogin	= createButton(inputLogin, inputPass);
	
	addGlobalBg();
	divConnect.setAttribute("id", "connectDiv");
	inputLogin.setAttribute("type", "text");
	inputLogin.setAttribute("placeholder", "login");
	inputPass.setAttribute("type", "password");
	inputPass.setAttribute("placeholder", "password");
	buttonLogin.innerHTML = "Connect";
	divConnect.appendChild(inputLogin);
	divConnect.appendChild(inputPass);
	divConnect.appendChild(buttonLogin);
	return (divConnect);
}

function	addGlobalBg()
{
	const	globalBg	= document.createElement("div");

	globalBg.setAttribute("id", "globalBg");
	document.body.appendChild(globalBg);
}

function	createButton(inputLogin, inputPass)
{
	const	loginButton		= document.getElementById('loginButton');
	const	pLoginButton	= loginButton.getElementsByTagName('p')[0];
	const	button			= document.createElement("button");
	let		usernameNode	= null;

	button.addEventListener('click', () => {
		sendRequest("login", {type: "byPass", mail: inputLogin.value, password: inputPass.value});
		waitForLogin().then((token) => {
			usernameNode = document.createTextNode(userMeInfo.username);
			loginButton.replaceChild(usernameNode, pLoginButton);
			CN.new("Connected successfully", "Welcome " + userMeInfo.username, CN.defaultIcon.success);
			document.getElementById("loginDiv").remove();
			document.getElementById("globalBg").remove();
			document.cookie = "token={" + token + "}; path=/; Secure; SameSite=Strict; max-age=3600";
		});
	});
	return (button);
}

export { createConnectDiv };
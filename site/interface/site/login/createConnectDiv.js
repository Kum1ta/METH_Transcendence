/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   createConnectDiv.js                                :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: edbernar <edbernar@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/08/07 18:14:53 by edbernar          #+#    #+#             */
/*   Updated: 2024/08/08 17:27:14 by edbernar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { userMeInfo, waitForLogin } from "../typeResponse/typeLogin.js";
import { createNotification as CN } from "../notification/main.js";
import { sendRequest } from "../websocket.js";

function	createConnectDiv(divLogin)
{
	const	divConnect		= document.createElement("div");
	const	inputLogin		= document.createElement("input");
	const	inputPass		= document.createElement("input");
	const	buttonLogin		= createButton(inputLogin, inputPass);
	const	buttonNewAcc	= createButtonNewAcc(divConnect, divLogin);
	
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
	divConnect.appendChild(buttonNewAcc);
	return (divConnect);
}

function	addGlobalBg()
{
	const	globalBg	= document.createElement("div");

	globalBg.setAttribute("id", "globalBg");
	document.body.appendChild(globalBg);
}

async function hashPassword(password)
{
    const encoder	= new TextEncoder();
    const data		= encoder.encode(password);
    const hash		= await crypto.subtle.digest('SHA-256', data);
    const hashArray	= Array.from(new Uint8Array(hash));
    const hashHex 	= hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    
    return (hashHex);
}

function	createButton(inputLogin, inputPass)
{
	const	loginButton		= document.getElementById('loginButton');
	const	pLoginButton	= loginButton.getElementsByTagName('p')[0];
	const	button			= document.createElement("button");
	let		usernameNode	= null;
	let		hashedPass		= null;

	button.addEventListener('click', () => {
		hashPassword(inputPass.value).then((hash) => {
			hashedPass = hash;
			sendRequest("login", {type: "byPass", mail: inputLogin.value, password: hashedPass});
			waitForLogin().then((token) => {
				usernameNode = document.createTextNode(userMeInfo.username);
				loginButton.replaceChild(usernameNode, pLoginButton);
				CN.new("Connected successfully", "Welcome " + userMeInfo.username, CN.defaultIcon.success);
				document.getElementById("loginDiv").remove();
				document.getElementById("globalBg").remove();
				document.cookie = "token={" + token + "}; path=/; Secure; SameSite=Strict; max-age=3600";
			});
		}).catch((err) => {
			CN.new("Error", "An error occured while trying to connect", CN.defaultIcon.error);
		});
	});
	return (button);
}

function	createButtonNewAcc(divConnect, divLogin)
{
	const	button			= document.createElement("button");
	const	newDiv			= document.createElement("div");
	const	inputUsername	= document.createElement("input");
	const	inputMail		= document.createElement("input");
	const	inputPass		= document.createElement("input");
	const	buttonCreate	= document.createElement("button");

	button.innerHTML = "Create a new account";
	newDiv.setAttribute("id", "connectDiv");
	button.addEventListener('click', () => {
		inputUsername.setAttribute("type", "text");
		inputUsername.setAttribute("placeholder", "username");
		inputMail.setAttribute("type", "text");
		inputMail.setAttribute("placeholder", "mail");
		inputPass.setAttribute("type", "password");
		inputPass.setAttribute("placeholder", "password");
		buttonCreate.innerHTML = "Create";
		newDiv.appendChild(inputUsername);
		newDiv.appendChild(inputMail);
		newDiv.appendChild(inputPass);
		newDiv.appendChild(buttonCreate);
		button.addEventListener('click', createNewAccount);
		divConnect.remove();
		divLogin.appendChild(newDiv);
	});
	return (button);
}

function	createNewAccount()
{
	const	inputUsername	= document.getElementsByTagName("input")[0];
	const	inputMail		= document.getElementsByTagName("input")[1];
	const	inputPass		= document.getElementsByTagName("input")[2];

	console.warn("Faire la requete pour creer un compte"); 
}


export { createConnectDiv };
/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   createConnectDiv.js                                :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: edbernar <edbernar@student.42angouleme.    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/08/07 18:14:53 by edbernar          #+#    #+#             */
/*   Updated: 2024/08/13 00:21:02 by edbernar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { userMeInfo, waitForLogin } from "../typeResponse/typeLogin.js";
import { createNotification as CN } from "../notification/main.js";
import { sendRequest } from "../websocket.js";
import { showLoginDiv, showMenu } from "./main.js";

/*
	Todo (Eddy) :
		- ajouter un message de confirmation de création de compte et un message d'erreur
		- une fleche pour revenir en arriere
		- remettre sur l'ecran de login quand le compte est créé
		- ajouter l'envoi d'un mail de confirmation
		- Empecher les requetes de connexion si un champ est vide
		- Ajouter un message d'erreur si le mail est invalide
		- Connexion par 42
*/

let		url42 = "https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-d9d6d46bd0be36dc13718981df4bfcf37e574ea364a07fcb5c39658be0f5706c&redirect_uri=http%3A%2F%2F127.0.0.1%3A5500%2Fsite%2F&response_type=code";

function	createConnectDiv(divLogin)
{
	const	form			= document.createElement("form");
	const	divConnect		= document.createElement("div");
	const	inputLogin		= document.createElement("input");
	const	inputPass		= document.createElement("input");
	const	buttonLogin		= createButton(inputLogin, inputPass);
	const	buttonConnect42	= document.createElement("button");
	
	const	mailText 		= document.createElement("p");
	const	passText 		= document.createElement("p");
	const	MainText 		= document.createElement("h1");
	const	newPlayerText	= document.createElement("p");
	const	createAccText	= document.createElement("p");
	const	newAccDiv		= document.createElement("div");
	const	divCenter		= document.createElement("div");
	const	orText			= document.createElement("p");
	
	addGlobalBg();
	MainText.innerText = "Access to a new WORLD";
	MainText.setAttribute("id", "mainText");
	mailText.innerText = "Email";
	passText.innerText = "Password";
	newPlayerText.innerText = "New Player ?";
	newPlayerText.setAttribute("id", "newPlayerText")
	createAccText.innerText = "Create an account";
	createAccText.setAttribute("id", "createAccText")
	createAccText.addEventListener("mousedown", () => {
		createButtonNewAcc(divConnect, divLogin);
	});
	newAccDiv.setAttribute("id", "newAccDiv");
	divConnect.setAttribute("id", "connectDiv");
	inputLogin.setAttribute("type", "text");
	inputLogin.setAttribute("id", "inputLogin");
	inputLogin.setAttribute("placeholder", "login");
	inputLogin.setAttribute("autocomplete", "username");
	inputPass.setAttribute("type", "password");
	inputPass.setAttribute("id", "inputPassword");
	inputPass.setAttribute("autocomplete", "current-password");
	inputPass.setAttribute("placeholder", "password");
	buttonLogin.innerHTML = "Login";
	buttonLogin.setAttribute("id", "styleButton");
	orText.innerText = "▬▬▬▬▬▬▬▬▬▬ ㅤ Or ㅤ ▬▬▬▬▬▬▬▬▬▬";
	orText.setAttribute("id", "orText");
	buttonConnect42.innerHTML = "Log with 42";
	buttonConnect42.setAttribute("id", "styleButton42")
	divConnect.appendChild(MainText);
	form.appendChild(mailText);
	form.appendChild(inputLogin);
	form.appendChild(passText);
	form.appendChild(inputPass);
	form.appendChild(buttonLogin);
	newAccDiv.appendChild(newPlayerText);
	newAccDiv.appendChild(createAccText);
	form.appendChild(newAccDiv);
	form.appendChild(orText);
	form.appendChild(buttonConnect42);
	divCenter.appendChild(form);
	divCenter.setAttribute("id", "divCenter");
	divConnect.appendChild(divCenter);
	form.addEventListener('submit', (e) => {
		e.preventDefault();
		buttonLogin.click();
	});
	buttonConnect42.addEventListener('click', (e) => {
		e.preventDefault();
		window.location.replace(url42);
	});
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

	button.addEventListener('click', (e) => {
		e.preventDefault();
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
				document.getElementById('loginButton').removeEventListener('click', showLoginDiv);
				document.getElementById('loginButton').addEventListener('click', showMenu);
			});
		}).catch((err) => {
			CN.new("Error", "An error occured while trying to connect", CN.defaultIcon.error);
		});
	});
	return (button);
}

function	createButtonNewAcc(divConnect, divLogin)
{
	const	newDiv			= document.createElement("div");
	const	inputUsername	= document.createElement("input");
	const	inputMail		= document.createElement("input");
	const	inputPass		= document.createElement("input");
	const	inputPass2		= document.createElement("input");
	const	buttonCreate	= document.createElement("button");
	const	form			= document.createElement("form");

	newDiv.setAttribute("id", "connectDiv");
	inputUsername.setAttribute("type", "text");
	inputUsername.setAttribute("placeholder", "username");
	inputUsername.setAttribute("autocomplete", "username");
	inputMail.setAttribute("type", "text");
	inputMail.setAttribute("placeholder", "mail");
	inputMail.setAttribute("autocomplete", "email");
	inputPass.setAttribute("type", "password");
	inputPass.setAttribute("placeholder", "password");
	inputPass.setAttribute("autocomplete", "new-password");
	inputPass2.setAttribute("type", "password");
	inputPass2.setAttribute("placeholder", "confirm password");
	inputPass2.setAttribute("autocomplete", "new-password");
	buttonCreate.innerHTML = "Create";
	form.appendChild(inputMail);
	form.appendChild(inputUsername);
	form.appendChild(inputPass);
	form.appendChild(inputPass2);
	form.appendChild(buttonCreate);
	newDiv.appendChild(form);
	buttonCreate.addEventListener('click', createNewAccount);
	form.addEventListener('submit', (e) => {
		e.preventDefault();
		buttonCreate.click();
	});
	divConnect.remove();
	divLogin.appendChild(newDiv);
}

function	createNewAccount(e)
{
	const	inputMail		= document.getElementsByTagName("input")[0];
	const	inputUsername	= document.getElementsByTagName("input")[1];
	const	inputPass		= document.getElementsByTagName("input")[2];
	const	inputPass2		= document.getElementsByTagName("input")[3];

	e.preventDefault();
	if (inputMail.value.indexOf('@') === -1 || inputMail.value.indexOf('.') === -1)
	{
		console.log(inputMail.value);
		CN.new("Error", "Invalid mail", CN.defaultIcon.error);
	}
	else if (inputUsername.value.length < 3)
		CN.new("Error", "Username must be at least 3 characters long", CN.defaultIcon.error);
	else if (inputUsername.value.length > 20)
		CN.new("Error", "Username must be at most 20 characters long", CN.defaultIcon.error);
	else if (inputUsername.value.search(' ') !== -1)
		CN.new("Error", "Username must not contain spaces", CN.defaultIcon.error);
	else if (inputUsername.value.search(/[^a-zA-Z0-9]/) !== -1)
		CN.new("Error", "Username must contain only letters and numbers", CN.defaultIcon.error);
	else if (inputPass.value.length < 8)
		CN.new("Error", "Password must be at least 8 characters long", CN.defaultIcon.error);
	else if (inputPass.value !== inputPass2.value)
		CN.new("Error", "Passwords do not match", CN.defaultIcon.error);
	else if (inputPass.value.search(/[a-z]/) === -1 || inputPass.value.search(/[A-Z]/) === -1 || inputPass.value.search(/[0-9]/) === -1)
		CN.new("Error", "Password must contain at least one lowercase letter, one uppercase letter and one number", CN.defaultIcon.error);
	else if (inputPass.value.search(inputUsername.value) !== -1)
		CN.new("Error", "Password must not contain the username", CN.defaultIcon.error);
	else
	{
		hashPassword(inputPass.value).then((hash) => {
			sendRequest("create_account", {username: inputUsername.value, mail: inputMail.value, password: hash});
		}).catch((err) => {
			CN.new("Error", "An error occured while trying to create a new account", CN.defaultIcon.error);
		});
	}
}

export { createConnectDiv };
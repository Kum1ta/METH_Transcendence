/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   main.js                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: edbernar <edbernar@student.42angouleme.    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/08/07 17:40:15 by edbernar          #+#    #+#             */
/*   Updated: 2024/08/13 00:01:42 by edbernar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { createNotification as CN } from "../notification/main.js";
import { userMeInfo, waitForLogin } from "../typeResponse/typeLogin.js";
import { createConnectDiv } from "./createConnectDiv.js";
import { createThreeDiv } from "./createThreeDiv.js";

function	login()
{
	const	loginButton		= document.getElementById('loginButton');
	const	pLoginButton	= loginButton.getElementsByTagName('p')[0];
	let		nodeText		= null;

	waitForLogin().then((token) => {
		nodeText = document.createTextNode(userMeInfo.username);

		if (token !== undefined)
		{
			document.cookie = "token={" + token + "}; path=/; Secure; SameSite=Strict; max-age=3600";
		}
		if (userMeInfo.id !== -1)
		{
			loginButton.replaceChild(nodeText, pLoginButton);
			loginButton.addEventListener('click', showMenu);
		}
		else
			loginButton.addEventListener('click', showLoginDiv);
	});
}

function	showLoginDiv()
{
	const	divLogin	= document.createElement("div");
	const	threeDiv	= createThreeDiv();
	const	connectDiv	= createConnectDiv(divLogin);

	divLogin.setAttribute("id", "loginDiv");
	divLogin.appendChild(threeDiv);
	divLogin.appendChild(connectDiv);
	document.body.appendChild(divLogin);
}

function	showMenu()
{
	const	loginButton			= document.getElementById('loginButton');
	const	divMenu				= document.createElement("div");
	const	ul					= document.createElement("ul");
	const	li1					= document.createElement("li");
	const	li2					= document.createElement("li");
	let		already_activated	= false;

	divMenu.setAttribute("id", "menuDiv");
	li1.innerHTML = "Profile";
	li2.innerHTML = "Logout";
	li1.addEventListener('click', (e) => {
		console.log("profile");
	});
	li2.addEventListener('click', (e) => {
		document.cookie = "token=; path=/; Secure; SameSite=Strict; max-age=0";
		window.location.href = "/";
		location.reload();
	});
	ul.appendChild(li1);
	ul.appendChild(li2);
	divMenu.appendChild(ul);
	divMenu.style.position = "absolute";
	divMenu.style.width = loginButton.offsetWidth + "px";
	divMenu.style.top = loginButton.offsetTop + loginButton.offsetHeight + "px";
	divMenu.style.left = loginButton.offsetLeft + "px";
	document.body.appendChild(divMenu);
	loginButton.removeEventListener('click', showMenu);
	loginButton.addEventListener('click', () => {
		if (!already_activated)
		{
			setTimeout(() => {
				document.getElementById("menuDiv").remove();
				loginButton.addEventListener('click', showMenu);
				already_activated = true;
			}, 199);
			document.getElementById("menuDiv").style.animation = "animHideMenuDiv 0.21s";
		}
	});
}


export { login, showLoginDiv, showMenu };
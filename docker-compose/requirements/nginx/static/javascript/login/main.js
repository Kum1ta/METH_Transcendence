/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   main.js                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: edbernar <edbernar@student.42angouleme.    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/08/07 17:40:15 by edbernar          #+#    #+#             */
/*   Updated: 2024/08/24 23:42:45 by edbernar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { createNotification as CN } from "/static/javascript/notification/main.js";
import { userMeInfo, waitForLogin } from "/static/javascript/typeResponse/typeLogin.js";

function	login()
{
	const	loginButton		= document.getElementById('loginButton');
	const	pLoginButton	= loginButton.getElementsByTagName('p')[0];
	let		nodeText		= null;

	// waitForLogin().then((token) => {
	// 	nodeText = document.createTextNode(userMeInfo.username);
		// if (userMeInfo.id !== -1)
		// {
		// 	loginButton.replaceChild(nodeText, pLoginButton);
			// loginButton.addEventListener('click', showMenu);
	// 	}
	// 	else
			loginButton.addEventListener('click', showLoginDiv);
	// });
}

function	showLoginDiv()
{
	const popout = document.getElementById('loginPopup');

	if (popout.style.display === 'flex')
		popout.style.display = 'none';
	else
		popout.style.display = 'flex';
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
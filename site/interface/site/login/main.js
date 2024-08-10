/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   main.js                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: edbernar <edbernar@student.42angouleme.    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/08/07 17:40:15 by edbernar          #+#    #+#             */
/*   Updated: 2024/08/10 15:08:44 by edbernar         ###   ########.fr       */
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
			loginButton.replaceChild(nodeText, pLoginButton);
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


export { login };
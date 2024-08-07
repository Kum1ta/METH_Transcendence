/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   createConnectDiv.js                                :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: edbernar <edbernar@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/08/07 18:14:53 by edbernar          #+#    #+#             */
/*   Updated: 2024/08/07 19:09:41 by edbernar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { createNotification } from "../notification/main.js";
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
	const	button	= document.createElement("button");

	button.addEventListener('click', () => {
		sendRequest("login", {type: "byPass", mail: inputLogin.value, password: inputPass.value});
	});
	return (button);
}

export { createConnectDiv };
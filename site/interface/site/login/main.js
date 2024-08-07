/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   main.js                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: edbernar <edbernar@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/08/07 17:40:15 by edbernar          #+#    #+#             */
/*   Updated: 2024/08/07 18:38:29 by edbernar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { createNotification as CN } from "../notification/main.js";
import { createConnectDiv } from "./createConnectDiv.js";
import { createThreeDiv } from "./createThreeDiv.js";

function	login()
{
	const	loginButton	= document.getElementById('loginButton');

	loginButton.addEventListener('click', showLoginDiv);
}

function	showLoginDiv()
{
	const	divLogin	= document.createElement("div");
	const	threeDiv	= createThreeDiv();
	const	connectDiv	= createConnectDiv();

	divLogin.setAttribute("id", "loginDiv");
	divLogin.appendChild(threeDiv);
	divLogin.appendChild(connectDiv);
	document.body.appendChild(divLogin);
}

export { login };
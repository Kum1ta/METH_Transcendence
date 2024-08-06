/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   main.js                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: edbernar <edbernar@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/07/30 13:50:35 by edbernar          #+#    #+#             */
/*   Updated: 2024/08/06 15:43:35 by edbernar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { liveChat } from "./liveChat/main.js";
import { createNotification } from "./notification/main.js";

document.addEventListener('DOMContentLoaded', () => {
	liveChat();
});


function	createRamdomString()
{
	const	charset	= "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
	let		result	= "";
	let		length	= Math.floor(Math.random() * 120);

	for (let i = 0; i < length; i++)
		result += charset.charAt(Math.floor(Math.random() * charset.length));
	return (result);
}

document.addEventListener("keydown", (e) => {
	if (e.key === "+")
		createNotification.new("Server", createRamdomString(), createNotification.defaultIcon.info, () => {
			console.log("Action button");	
		}, "Send");

	if (e.key === "-")
		createNotification.new("Server", createRamdomString());
});
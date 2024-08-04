/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   main.js                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: edbernar <edbernar@student.42angouleme.    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/07/30 13:50:35 by edbernar          #+#    #+#             */
/*   Updated: 2024/08/04 23:47:45 by edbernar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { liveChat } from "./liveChat/main.js";
import { createNotification } from "./notification/main.js";

document.addEventListener('DOMContentLoaded', () => {
	liveChat();
});



document.addEventListener("keydown", (e) => {
	if (e.key === "/")
		createNotification.info("Hello");
	if (e.key === "*")
		createNotification.success("Hello");
	if (e.key === "-")
		createNotification.error("Hello");
});
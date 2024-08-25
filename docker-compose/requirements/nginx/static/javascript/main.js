/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   main.js                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: edbernar <edbernar@student.42angouleme.    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/07/30 13:50:35 by edbernar          #+#    #+#             */
/*   Updated: 2024/08/25 02:21:47 by edbernar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { liveChat } from "/static/javascript/liveChat/main.js";
import { login } from "/static/javascript/login/main.js";
import { HomePage } from "/static/javascript/homePage/main.js"

document.addEventListener('DOMContentLoaded', () => {
	liveChat();
	login();
	HomePage.create();
	setTimeout(() => {
		HomePage.dispose();
	}, 3000);
});

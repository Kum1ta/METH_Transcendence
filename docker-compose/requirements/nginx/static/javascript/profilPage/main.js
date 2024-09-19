/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   main.js                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: edbernar <edbernar@student.42angouleme.    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/09/19 23:08:31 by edbernar          #+#    #+#             */
/*   Updated: 2024/09/20 01:09:20 by edbernar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { createNotification as CN } from "/static/javascript/notification/main.js";
import { waitForUserInfo } from "/static/javascript/typeResponse/typeUserInfo.js";
import { sendRequest } from "/static/javascript/websocket.js";


class ProfilPage
{
	static create(userId)
	{
		const	profilInfos =	document.getElementsByClassName('profile-info')[0];
		const	username	=	document.getElementsByTagName('h2')[0];
		const	pfp			=	document.getElementsByClassName('profile-image')[0];
		const	banner		=	document.getElementsByClassName('background-card')[0];

		sendRequest("get_user_info", {id: userId});
		waitForUserInfo().then((userInfo) => {
			username.innerText = userInfo.username + ' (status not implemented)';
			pfp.innerHTML = `<img src='${userInfo.pfp}'>`
			banner.innerHTML = `<img src='${userInfo.banner}'>`
		});
	}

	static dispose()
	{
		
	}
	
}

export { ProfilPage };
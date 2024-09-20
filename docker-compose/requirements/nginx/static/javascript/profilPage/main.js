/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   main.js                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: edbernar <edbernar@student.42angouleme.    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/09/19 23:08:31 by edbernar          #+#    #+#             */
/*   Updated: 2024/09/20 11:15:34 by edbernar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { waitForUserInfo } from "/static/javascript/typeResponse/typeUserInfo.js";
import { userMeInfo } from "/static/javascript/typeResponse/typeLogin.js";
import { createNotification as CN } from "/static/javascript/notification/main.js";
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
			pfp.style.backgroundImage = `url("${userInfo.pfp}")`
			pfp.style.backgroundSize = "cover";
			pfp.style.backgroundRepeat = "no-repeat";
			banner.style.backgroundImage = `url("${userInfo.banner}")`
			banner.style.backgroundSize = "cover";
			banner.style.backgroundRepeat = "no-repeat";
			if (userId == userMeInfo.id)
			{
				pfp.innerHTML = `<div id='editPenPfpBg'><img class='editPenPfp' src='/static/img/profilPage/editPen.png'/></div>`
				banner.innerHTML = `<img class='editPen' src='/static/img/profilPage/editPen.png'/>`
			}	
		});
	}

	static dispose()
	{
		
	}
	
}

export { ProfilPage };
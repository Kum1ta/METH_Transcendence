/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   typeUserInfo.js                                    :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: edbernar <edbernar@student.42angouleme.    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/09/20 00:42:04 by edbernar          #+#    #+#             */
/*   Updated: 2024/09/21 21:57:45 by edbernar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

let userInfo = [];
let userInfoAvailable = false;
let userInfoResolve = null;

function waitForUserInfo() {
	return new Promise((resolve) => {
		if (userInfoAvailable)
		{
			userInfoAvailable = false;
			resolve(userInfo);
		}
		else
			userInfoResolve = resolve;
	});
}

function typeUserInfo(list)
{
	userInfo = list;
	userInfoAvailable = true;
	if (userInfoResolve)
	{
		userInfoResolve(userInfo);
		userInfoResolve = null;
		userInfoAvailable = false;
	}
}

export { typeUserInfo, waitForUserInfo };
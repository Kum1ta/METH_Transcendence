/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   typeUserInfo.js                                    :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: edbernar <edbernar@student.42angouleme.    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/09/20 00:42:04 by edbernar          #+#    #+#             */
/*   Updated: 2024/09/20 00:48:17 by edbernar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

let userInfo = [];
let userInfoAvailable = false;
let userInfoResolve = null;

function waitForUserInfo() {
	return new Promise((resolve) => {
		if (userInfoAvailable)
			resolve(userInfo);
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
	}
}

export { typeUserInfo, waitForUserInfo };
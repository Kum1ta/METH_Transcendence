/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   typePrivateListUser.js                             :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: edbernar <edbernar@student.42angouleme.    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/08/02 01:56:15 by edbernar          #+#    #+#             */
/*   Updated: 2024/08/30 16:34:29 by edbernar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

let userList = [];
let userListAvailable = false;
let userListResolve = null;

function waitForUserList() {
	return new Promise((resolve) => {
		if (userListAvailable)
			resolve();
		else
			userListResolve = resolve;
	});
}

function typePrivateListUser(list) {
	userList = list;
	userListAvailable = true;
	if (userListResolve)
	{
		userListResolve(userList);
		userListResolve = null;
	}
}

export { userList, typePrivateListUser, waitForUserList };
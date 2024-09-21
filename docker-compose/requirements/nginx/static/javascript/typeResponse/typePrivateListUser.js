/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   typePrivateListUser.js                             :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: edbernar <edbernar@student.42angouleme.    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/08/02 01:56:15 by edbernar          #+#    #+#             */
/*   Updated: 2024/09/21 16:32:42 by edbernar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

let userList = [];
let userListAvailable = false;
let userListResolve = null;

function waitForUserList() {
	return new Promise((resolve) => {
		if (userListAvailable)
		{
			userListAvailable = false;
			resolve(userList);
		}
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
		userListAvailable = false;
	}
}

export { userList, typePrivateListUser, waitForUserList };
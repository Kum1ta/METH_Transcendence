/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   typePrivateListUser.js                             :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: edbernar <edbernar@student.42angouleme.    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/08/02 01:56:15 by edbernar          #+#    #+#             */
/*   Updated: 2024/11/20 23:11:44 by edbernar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

let	userListUnread		= [];
let userList			= [];
let userListAvailable	= false;
let userListResolve		= null;

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
	userListUnread = [];
	userList.forEach(element => {
		if (element.haveUnread)
			userListUnread.push(element.id);
	});
	userListAvailable = true;
	if (userListResolve)
	{
		userListResolve(userList);
		userListResolve = null;
		userListAvailable = false;
	}
}

export { userList, userListUnread, typePrivateListUser, waitForUserList };
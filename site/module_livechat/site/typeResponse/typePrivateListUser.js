/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   typePrivateListUser.js                             :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: edbernar <edbernar@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/08/02 01:56:15 by edbernar          #+#    #+#             */
/*   Updated: 2024/08/02 11:42:46 by edbernar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

let userList = [];
let userListAvailable = false;
let userListResolve = null;

function waitForUserList() {
	return new Promise((resolve) => {
		if (userListAvailable) {
			resolve();
		} else {
			userListResolve = resolve;
		}
	});
}

function typePrivateListUser(list) {
	userList = list;
	userListAvailable = true;
	console.log(userListResolve)
	if (userListResolve) {
		userListResolve();
		userListResolve = null;
	}
}

export { userList, typePrivateListUser, waitForUserList };
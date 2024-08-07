/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   typeLogin.js                                       :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: edbernar <edbernar@student.42angouleme.    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/08/02 00:39:53 by edbernar          #+#    #+#             */
/*   Updated: 2024/08/07 22:14:49 by edbernar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

let userMeInfo = {
	username: "",
	id: -1
};

let loginAvailable = false;
let loginResolve = null;

function waitForLogin() {
	return new Promise((resolve) => {

		if (loginAvailable)
			resolve();
		else
			loginResolve = resolve;
	});
}

function	typeLogin(content)
{
	if (content != null)
	{
		console.log("Welcome " + content.username + "\nYou're id is " + content.id);
		userMeInfo.username = content.username;
		userMeInfo.id = content.id;
	}
	loginAvailable = true;
	if (loginResolve)
	{
		if (content != null)
			loginResolve(content.token);
		else
			loginResolve();
		loginResolve = null;
		loginAvailable = false;
	}
}

export { userMeInfo, typeLogin, waitForLogin };
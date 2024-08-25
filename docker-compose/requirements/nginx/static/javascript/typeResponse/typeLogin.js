/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   typeLogin.js                                       :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: edbernar <edbernar@student.42angouleme.    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/08/02 00:39:53 by edbernar          #+#    #+#             */
/*   Updated: 2024/08/25 17:09:22 by edbernar         ###   ########.fr       */
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
	if (content && typeof(content) != 'boolean' && content.status == true)
	{
		console.log("Welcome " + content.username + "\nYou're id is " + content.id);
		userMeInfo.username = content.username;
		userMeInfo.id = content.id;
		console.warn("L'ID a été ajouté manuellement dans le serv: " + userMeInfo.id);
	}
	loginAvailable = true;
	if (loginResolve)
	{
		loginResolve(content);
		loginResolve = null;
		loginAvailable = false;
	}
}

export { userMeInfo, typeLogin, waitForLogin };
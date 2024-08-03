/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   typeLogin.js                                       :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: edbernar <edbernar@student.42angouleme.    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/08/02 00:39:53 by edbernar          #+#    #+#             */
/*   Updated: 2024/08/03 23:37:33 by edbernar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

let userMeInfo = {
	username: "",
	id: 42
};

function	typeLogin(content)
{
	console.log("Welcome " + content.username + "\nYou're id is " + content.id);
	userMeInfo.username = content.username;
	userMeInfo.id = content.id;
}

export { userMeInfo, typeLogin };
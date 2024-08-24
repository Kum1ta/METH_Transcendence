/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   typeErrorUnknown42Account.js                       :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: edbernar <edbernar@student.42angouleme.    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/08/10 16:01:51 by edbernar          #+#    #+#             */
/*   Updated: 2024/08/24 23:44:12 by edbernar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { createNotification as CN } from "/static/javascript/notification/main.js";
import { typeLogin } from "/static/javascript/typeResponse/typeLogin.js";

function typeErrorUnknown42Account()
{
	window.history.replaceState({}, document.title, "/");
	CN.new("Unknown 42 account", "Your 42 account is not linked to any account.");
	typeLogin(null);
}

export { typeErrorUnknown42Account };
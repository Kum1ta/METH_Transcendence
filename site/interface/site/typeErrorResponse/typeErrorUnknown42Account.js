/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   typeErrorUnknown42Account.js                       :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: edbernar <edbernar@student.42angouleme.    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/08/10 16:01:51 by edbernar          #+#    #+#             */
/*   Updated: 2024/08/10 16:07:06 by edbernar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { createNotification as CN } from "../notification/main.js";

function typeErrorUnknown42Account()
{
	window.history.replaceState({}, document.title, "/site/");
	CN.new("Unknown 42 account", "Your 42 account is not linked to any account.");
}

export { typeErrorUnknown42Account };
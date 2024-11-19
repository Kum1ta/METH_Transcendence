/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   typeErrorInvalidToken42.js                         :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: hubourge <hubourge@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/08/10 14:29:34 by edbernar          #+#    #+#             */
/*   Updated: 2024/11/19 15:13:46 by hubourge         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */


import { createNotification as NC } from "/static/javascript/notification/main.js";

function typeErrorInvalidToken42()
{
	window.history.replaceState({}, document.title, "/site/");
	NC.new("Error 42", "Invalid token", NC.defaultIcon.error);
}

export { typeErrorInvalidToken42 };
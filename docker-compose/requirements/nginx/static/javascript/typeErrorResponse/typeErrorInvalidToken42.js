/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   typeErrorInvalidToken42.js                         :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: edbernar <edbernar@student.42angouleme.    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/08/10 14:29:34 by edbernar          #+#    #+#             */
/*   Updated: 2024/08/24 23:43:44 by edbernar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */


import { createNotification as NC } from "/static/javascript/notification/main.js";

function typeErrorInvalidToken42()
{
	// |Eddy| Changer le path pour mettre le bon path quand il y aura un vrai serveur
	window.history.replaceState({}, document.title, "/site/");
	NC.new("Error 42", "Invalid token", NC.defaultIcon.error);
}

export { typeErrorInvalidToken42 };
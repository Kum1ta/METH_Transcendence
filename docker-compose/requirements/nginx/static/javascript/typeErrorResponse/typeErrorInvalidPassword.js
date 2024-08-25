/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   typeErrorInvalidPassword.js                        :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: edbernar <edbernar@student.42angouleme.    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/08/07 21:16:09 by edbernar          #+#    #+#             */
/*   Updated: 2024/08/25 16:15:05 by edbernar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { createNotification as NC } from "/static/javascript/notification/main.js";
import { typeLogin } from "/static/javascript/typeResponse/typeLogin.js";

function typeErrorInvalidPassword()
{
	NC.new("Connection error", "Invalid mail or password", NC.defaultIcon.error);
	typeLogin(false);
	
}

export { typeErrorInvalidPassword };
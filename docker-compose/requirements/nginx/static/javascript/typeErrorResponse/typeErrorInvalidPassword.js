/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   typeErrorInvalidPassword.js                        :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: edbernar <edbernar@student.42angouleme.    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/08/07 21:16:09 by edbernar          #+#    #+#             */
/*   Updated: 2024/08/24 23:43:40 by edbernar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { createNotification as NC } from "/static/javascript/notification/main.js";

function typeErrorInvalidPassword()
{
	NC.new("Connection error", "Invalid mail or password", NC.defaultIcon.error);
}

export { typeErrorInvalidPassword };
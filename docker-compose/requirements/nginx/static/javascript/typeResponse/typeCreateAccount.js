/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   typeCreateAccount.js                               :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: edbernar <edbernar@student.42angouleme.    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/09/10 14:25:42 by edbernar          #+#    #+#             */
/*   Updated: 2024/09/12 17:04:35 by edbernar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { createNotification as CN } from "/static/javascript/notification/main.js";
import { changeWindowLoginBack } from "/static/javascript/login/main.js"

function typeCreateAccount()
{
	CN.new("Account created", "Please check your emails (including spam) to verify your account.");
	changeWindowLoginBack(null);
}

export { typeCreateAccount }

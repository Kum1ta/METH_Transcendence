/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   typeCreateAccount.js                               :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: edbernar <edbernar@student.42angouleme.    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/09/10 14:25:42 by edbernar          #+#    #+#             */
/*   Updated: 2024/09/10 14:52:33 by edbernar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { createNotification as CN } from "/static/javascript/notification/main.js";

function typeCreateAccount()
{
	CN.new("Account created", "Please check your emails (including spam) to verify your account.");
}

export { typeCreateAccount }

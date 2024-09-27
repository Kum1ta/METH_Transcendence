/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   typeChangePrivateInfo.js                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: edbernar <edbernar@student.42angouleme.    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/09/27 10:53:20 by edbernar          #+#    #+#             */
/*   Updated: 2024/09/27 10:58:05 by edbernar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { createNotification as CN } from "/static/javascript/notification/main.js";

function typeChangePrivateInfo(content)
{
	CN.new("Information", content);
}

export { typeChangePrivateInfo };
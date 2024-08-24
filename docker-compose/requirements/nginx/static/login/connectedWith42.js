/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   connectedWith42.js                                 :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: edbernar <edbernar@student.42angouleme.    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/08/09 09:15:24 by edbernar          #+#    #+#             */
/*   Updated: 2024/08/10 15:02:33 by edbernar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { typeLogin } from "../typeResponse/typeLogin.js";
import { sendRequest } from "../websocket.js";

function	connectedWith42Func()
{
	const	token42 = window.location.search.split('code=')[1];

	if (!token42)
	{
		typeLogin(null);
		return ;
	}
	sendRequest("login", {type: "by42", token: token42});
}

export { connectedWith42Func };
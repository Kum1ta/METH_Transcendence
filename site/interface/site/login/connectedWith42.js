/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   connectedWith42.js                                 :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: edbernar <edbernar@student.42angouleme.    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/08/09 09:15:24 by edbernar          #+#    #+#             */
/*   Updated: 2024/08/09 23:23:46 by edbernar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { sendRequest } from "../websocket.js";

function	connectedWith42Func()
{
	const	token42 = window.location.search.split('code=')[1];

	if (!token42)
		return ;
	sendRequest("login", {type: "by42", token: token42});
}

export { connectedWith42Func };
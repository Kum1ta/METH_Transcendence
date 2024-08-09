/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   connectedWith42.js                                 :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: edbernar <edbernar@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/08/09 09:15:24 by edbernar          #+#    #+#             */
/*   Updated: 2024/08/09 09:18:26 by edbernar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { sendRequest } from "../websocket.js";

function	connectedWith42Func()
{
	const	token42 = window.location.search.split('code=')[1];

	console.log("connectedWith42Func");
	sendRequest("login", {type: "by42", token: token42});
	console.log(token42);
}

export { connectedWith42Func };
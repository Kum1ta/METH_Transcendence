/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   typeInvitation.js                                  :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: edbernar <edbernar@student.42angouleme.    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/09/28 00:22:31 by edbernar          #+#    #+#             */
/*   Updated: 2024/09/28 16:50:17 by edbernar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { createNotification as CN } from "/static/javascript/notification/main.js";
import { pageRenderer } from '/static/javascript/main.js'

function typeInvitation(content)
{
	CN.new("New invitation", content.username + " invit you to play !", null, () => {
		pageRenderer.changePage('waitingGamePage', false, {username: content.username, id: content.invitor});
	}, 'Join', 30000);
}

export { typeInvitation }
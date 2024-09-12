/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   main.js                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: edbernar <edbernar@student.42angouleme.    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/07/30 13:50:35 by edbernar          #+#    #+#             */
/*   Updated: 2024/09/12 17:59:23 by edbernar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { launchSocket } from '/static/javascript/websocket.js';
import { Page } from '/static/javascript/Page.js';

let		pageRenderer = null;

document.addEventListener('DOMContentLoaded', () => {
	pageRenderer = new Page();
	launchSocket();
});

export { pageRenderer };
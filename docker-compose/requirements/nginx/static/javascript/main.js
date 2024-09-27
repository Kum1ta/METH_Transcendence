/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   main.js                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: edbernar <edbernar@student.42angouleme.    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/07/30 13:50:35 by edbernar          #+#    #+#             */
/*   Updated: 2024/09/27 15:22:23 by edbernar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { launchSocket } from '/static/javascript/websocket.js';
import { Page } from '/static/javascript/Page.js';

let		pageRenderer	= null;
const	isMobile		= /mobile|android|iphone|ipad/.test(navigator.userAgent.toLowerCase())

document.addEventListener('DOMContentLoaded', () => {
	pageRenderer = new Page();
	launchSocket();
});

export { pageRenderer, isMobile };
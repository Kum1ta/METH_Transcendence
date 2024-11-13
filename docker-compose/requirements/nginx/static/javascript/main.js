/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   main.js                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: edbernar <edbernar@student.42angouleme.    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/07/30 13:50:35 by edbernar          #+#    #+#             */
/*   Updated: 2024/11/13 15:11:00 by edbernar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { launchSocket } from '/static/javascript/websocket.js';
import { Page } from '/static/javascript/Page.js';
import { loadFiles } from '/static/javascript/filesLoader.js';

let		pageRenderer	= null;
const	isMobile		= /mobile|android|iphone|ipad/.test(navigator.userAgent.toLowerCase())
const	isOnChrome		= /chrome/.test(navigator.userAgent.toLowerCase())

document.addEventListener('DOMContentLoaded', () => {
	loadFiles().then(() => {
		pageRenderer = new Page();
		launchSocket();
	});
});

export { pageRenderer, isMobile, isOnChrome };
/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   main.js                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: edbernar <edbernar@student.42angouleme.    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/07/30 13:50:35 by edbernar          #+#    #+#             */
/*   Updated: 2024/08/25 19:09:02 by edbernar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import * as Socket from '/static/javascript/websocket.js';
import { Page } from '/static/javascript/Page.js';

let		pageRenderer = null;

document.addEventListener('DOMContentLoaded', () => {
	pageRenderer = new Page();
});

export { pageRenderer };
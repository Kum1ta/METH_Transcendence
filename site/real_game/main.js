/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   main.js                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: edbernar <edbernar@student.42angouleme.    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/08/18 00:53:53 by edbernar          #+#    #+#             */
/*   Updated: 2024/08/18 01:09:38 by edbernar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { Player } from './Player'

const player = new Player(null);

setInterval(() => {
    player.update();
}, 100);
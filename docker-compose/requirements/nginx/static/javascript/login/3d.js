/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   3d.js                                              :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: edbernar <edbernar@student.42angouleme.    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/11/13 11:36:46 by edbernar          #+#    #+#             */
/*   Updated: 2024/11/13 11:43:46 by edbernar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

function main3d()
{
	const	div = document.getElementById('left-side');

	div.innerHTML = '<canvas id="canvas-left-side" width="800" height="600"></canvas>';
	const canvas = div.getElementsByTagName('canvas')[0];


}

export { main3d };
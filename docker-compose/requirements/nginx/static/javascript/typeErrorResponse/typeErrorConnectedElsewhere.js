/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   typeErrorConnectedElsewhere.js                     :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: edbernar <edbernar@student.42angouleme.    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/09/22 23:33:18 by edbernar          #+#    #+#             */
/*   Updated: 2024/09/22 23:42:49 by edbernar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

function typeErrorConnectedElsewhere()
{
	setTimeout(() => {
		document.body.style.color = 'white';
		document.body.style.textAlign = 'center';
		document.body.style.paddingTop = '10%';
		document.body.innerHTML = 'You are already connected somewhere...';
	}, 500);
}

export { typeErrorConnectedElsewhere };
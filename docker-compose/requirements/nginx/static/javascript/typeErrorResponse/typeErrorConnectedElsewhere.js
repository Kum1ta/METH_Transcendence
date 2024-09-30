/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   typeErrorConnectedElsewhere.js                     :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: edbernar <edbernar@student.42angouleme.    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/09/22 23:33:18 by edbernar          #+#    #+#             */
/*   Updated: 2024/09/30 01:59:48 by edbernar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

function typeErrorConnectedElsewhere()
{
	const	button	=	document.createElement('button');

	button.type = 'button';
	button.style.width = '10%';
	button.style.color = 'black';
	button.innerText = 'Log out';
	button.addEventListener('click', () => window.location.href = '/logout');
	setTimeout(() => {
		document.body.style.color = 'white';
		document.body.style.textAlign = 'center';
		document.body.style.paddingTop = '10%';
		document.body.style.display = 'flex';
		document.body.style.flexDirection = 'column';
		document.body.style.alignItems = 'center';
		document.body.innerHTML = 'You are already connected somewhere...<br/><br/>';
		document.body.appendChild(button);
	}, 500);
}

export { typeErrorConnectedElsewhere };
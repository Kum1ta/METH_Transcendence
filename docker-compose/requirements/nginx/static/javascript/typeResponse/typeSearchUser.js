/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   typeSearchUser.js                                  :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: edbernar <edbernar@student.42angouleme.    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/09/18 08:12:24 by edbernar          #+#    #+#             */
/*   Updated: 2024/09/20 00:23:27 by edbernar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { LobbyPage } from "/static/javascript/lobbyPage/main.js";
import { pageRenderer } from '/static/javascript/main.js'

function typeSearchUser(userList)
{
	const	searchInputUser	= document.getElementById('searchInputUser');
	const	searchResult	= document.getElementById('searchResult');
	let		pos				= null;

	if (pageRenderer.actualPage !== LobbyPage)
		return ;
	document.body.addEventListener('click', removeAlluser)
	pos = searchInputUser.getBoundingClientRect();
	searchResult.style.width = pos.width + 'px';
	searchResult.style.top = pos.top + pos.height + 'px';
	searchResult.style.left = pos.left + 'px';
	searchResult.innerHTML = '';
	userList.forEach(user => {
		const div = document.createElement('div');

		div.setAttribute('class', 'searchResultLine');
		div.innerHTML = '<img src="' + user[2] + '">' + '<p>' + user[0] + '</p>';
		searchResult.appendChild(div);
		div.addEventListener('click', () => {
			pageRenderer.changePage('profilPage', false, user[1]);
		})
	});
}

function removeAlluser()
{
	const	searchInputUser	= document.getElementById('searchInputUser');
	const	searchResult	= document.getElementById('searchResult');

	document.body.removeEventListener('click', removeAlluser);
	searchResult.innerHTML = '';
	searchInputUser.value = '';
}

export { typeSearchUser };
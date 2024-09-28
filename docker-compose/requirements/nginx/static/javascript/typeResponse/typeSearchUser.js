/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   typeSearchUser.js                                  :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: edbernar <edbernar@student.42angouleme.    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/09/18 08:12:24 by edbernar          #+#    #+#             */
/*   Updated: 2024/09/28 17:49:07 by edbernar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { LobbyPage } from "/static/javascript/lobbyPage/main.js";
import { pageRenderer } from '/static/javascript/main.js'

let	enterActivated = false;

function typeSearchUser(userList)
{
	const	searchInputUser	= document.getElementById('searchInputUser');
	const	searchResult	= document.getElementById('searchResult');
	let		pos				= null;

	if (pageRenderer.actualPage !== LobbyPage)
		return ;
	document.body.removeEventListener('click', removeAlluser);
	document.body.addEventListener('click', removeAlluser);
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
			if (enterActivated)
			{
				document.body.removeEventListener('keypress', enterPressed);
				enterActivated = false;
			}
		})
	});
	if (!enterActivated)
	{
		document.body.addEventListener('keypress', enterPressed);
		enterActivated = true;
	}
}

function enterPressed(e)
{
	const	searchResult	= document.getElementById('searchResult');

	if (e.key == 'Enter' && searchResult.children && searchResult.children[0])
		searchResult.children[0].click();
}

function removeAlluser()
{
	const	searchInputUser	= document.getElementById('searchInputUser');
	const	searchResult	= document.getElementById('searchResult');

	document.body.removeEventListener('click', removeAlluser);
	if (enterActivated)
	{
		document.body.removeEventListener('keypress', enterPressed);
		enterActivated = false;
	}
	searchResult.innerHTML = '';
	searchInputUser.value = '';
}

export { typeSearchUser };
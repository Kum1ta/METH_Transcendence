/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   main.js                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: edbernar <edbernar@student.42angouleme.    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/08/22 17:08:46 by madegryc          #+#    #+#             */
/*   Updated: 2024/09/26 16:41:52 by edbernar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { userMeInfo, waitForLogin } from '/static/javascript/typeResponse/typeLogin.js';
import { barSelecter, goalSelecter } from '/static/javascript/lobbyPage/3d.js';
import { LiveChat } from "/static/javascript/liveChat/main.js";
import { sendRequest } from "/static/javascript/websocket.js";
import { pageRenderer } from '/static/javascript/main.js'

/* 
	Information :
		- 0: Multiplayer local
		- 1: Matchmaking
		- 2: Ranked
		- 3: Tournament
*/

let	listSelectCard	= null;
let	gameMode		= 0;
let barSelector		= null;
let goalSelector	= null;
let timeout			= null;

class LobbyPage
{
	static create()
	{
		const	methButton		= document.getElementById("homeButton");
		const	startButton		= document.getElementsByClassName('buttonStartGame')[0];
		const	usernameP		= document.getElementById('loginButton').getElementsByTagName('p')[0];
		const	loginButton 	= document.getElementById('loginButton');
		const	inputUser		= document.getElementById('searchInputUser');
		const	func			= [selectGameModeOne, selectGameModeTwo, selectGameModeThree, selectGameModeFour];

		if (userMeInfo.id == -1)
			waitForLogin().then(() => usernameP.innerHTML = userMeInfo.username);
		else
			usernameP.innerHTML = userMeInfo.username;
		LiveChat.create();
		inputUser.addEventListener('input', searchUser);
		loginButton.addEventListener('click', showMenu);
		window.addEventListener('resize', movePopMenuLoginButton);
		window.addEventListener('resize', ajustSearchUserList);
		movePopMenuLoginButton();
		initButtonPopMenuLogin();
		window.addEventListener('click', closePopUpWhenClickOutsite);
		listSelectCard = document.getElementsByClassName('select-card');
		document.getElementsByClassName('game-mode')[0].addEventListener('click', showGameMode);
		document.getElementById('closePopupBtn').addEventListener('click', hideGameMode);
		listSelectCard[0].addEventListener('click', selectGameModeOne);
		listSelectCard[1].addEventListener('click', selectGameModeTwo);
		listSelectCard[2].addEventListener('click', selectGameModeThree);
		listSelectCard[3].addEventListener('click', selectGameModeFour);
		func[gameMode]();
		document.getElementsByClassName('mode-card')[0].getElementsByTagName('p')[0].innerHTML = listSelectCard[gameMode].innerHTML;
		for (let i = 0; i < document.body.children.length; i++)
		{
			document.body.children[i].style.animation = 'animShowMenuDiv 0.5s';
		}
		startButton.addEventListener('click', startMode);
		methButton.addEventListener('click', goBackHome);
		document.getElementsByClassName('menuSelected')[gameMode].style.display = 'flex';
	}

	static dispose()
	{
		const	startButton = document.getElementsByClassName('buttonStartGame')[0];

		window.removeEventListener('click', closePopUpWhenClickOutsite);
		window.removeEventListener('resize', movePopMenuLoginButton);
		startButton.removeEventListener('click', startMode);
		document.getElementsByClassName('game-mode')[0].removeEventListener('click', showGameMode);
		document.getElementById('closePopupBtn').removeEventListener('click', hideGameMode);
		window.removeEventListener('resize', ajustSearchUserList);
		LiveChat.dispose();

		listSelectCard[0].removeEventListener('click', selectGameModeOne);
		listSelectCard[1].removeEventListener('click', selectGameModeTwo);
		listSelectCard[2].removeEventListener('click', selectGameModeThree);
		listSelectCard[3].removeEventListener('click', selectGameModeFour);
		listSelectCard = null;
		if (barSelector)
			barSelector.dispose();
		barSelector = null;
		if (goalSelector)
			goalSelector.dispose();
		goalSelector = null;
		listSelectCard = null;
	}
}

function searchUser(event)
{
	const	searchResult	= document.getElementById('searchResult');

	if (timeout)
		clearTimeout(timeout);
	if (event.target.value == '')
		searchResult.innerHTML = '';
	else
	{
		timeout = setTimeout(() => {
			sendRequest("search_user", {username: event.target.value});
		}, 10);
	}
}

function ajustSearchUserList()
{
	const	searchInputUser	= document.getElementById('searchInputUser');
	const	pos				= searchInputUser.getBoundingClientRect();
	const	searchResult	= document.getElementById('searchResult');

	searchResult.style.width = pos.width + 'px';
	searchResult.style.top = pos.top + pos.height + 'px';
	searchResult.style.left = pos.left + 'px';
}

function goBackHome()
{
	pageRenderer.changePage('homePage', false);
}

function startMode()
{
	if (gameMode == 0)
		startMultiLocal();
	else if (gameMode == 1)
		startMatchmaking();
	else if (gameMode == 2)
		alert("Not implemented");
	else if (gameMode == 3)
		alert("Not implemented");
}

function startMultiLocal()
{
	document.body.style.animation = "none";
	document.body.offsetHeight;
	document.body.style.animation = "startGameAnim 0.5s";
	document.body.style.opacity = 0;
	setTimeout(() => {
		pageRenderer.changePage("multiLocalGamePage");
	}, 500);
}

function startMatchmaking()
{
	document.body.style.animation = "none";
	document.body.offsetHeight;
	document.body.style.animation = "startGameAnim 0.5s";
	document.body.style.opacity = 0;
	setTimeout(() => {
		pageRenderer.changePage("waitingGamePage");
	}, 500);
}

function showGameMode()
{
	document.getElementById('loginPopup').style.display = 'flex';
}

function closePopUpWhenClickOutsite (event)
{
    if (event.target == document.getElementById('loginPopup'))
        document.getElementById('loginPopup').style.display = 'none';
};

function hideGameMode()
{
	document.getElementById('loginPopup').style.display = 'none';
}

function selectGameModeOne()
{
	document.getElementById('loginPopup').style.display = 'none';
	if (gameMode == 0)
		return ;
	document.getElementsByClassName('mode-card')[0].getElementsByTagName('p')[0].innerHTML = listSelectCard[0].innerHTML;
	const	menuList = document.getElementsByClassName('menuSelected');
	for (let i = 0; i < menuList.length; i++)
	{
		menuList[i].style.display = 'none';
	}
	document.getElementsByClassName('menuSelected')[0].style.display = 'flex';
	gameMode = 0;
}

function selectGameModeTwo()
{
	document.getElementById('loginPopup').style.display = 'none';
	if (gameMode == 1)
		return ;
	document.getElementsByClassName('mode-card')[0].getElementsByTagName('p')[0].innerHTML = listSelectCard[1].innerHTML;
	const	menuList = document.getElementsByClassName('menuSelected');
	for (let i = 0; i < menuList.length; i++)
	{
		menuList[i].style.display = 'none';
	}
	document.getElementsByClassName('menuSelected')[1].style.display = 'flex';
	if (barSelector)
		barSelector.dispose();
	if (goalSelector)
		goalSelector.dispose();
	document.getElementById('bar').innerHTML = '';
	document.getElementById('goal').innerHTML = '';
	barSelector = new barSelecter(document.getElementById('bar'));
	goalSelector = new goalSelecter(document.getElementById('goal'));
	gameMode = 1;
}

function selectGameModeThree()
{
	document.getElementById('loginPopup').style.display = 'none';
	if (gameMode == 2)
		return ;
	document.getElementsByClassName('mode-card')[0].getElementsByTagName('p')[0].innerHTML = listSelectCard[2].innerHTML;
	const	menuList = document.getElementsByClassName('menuSelected');
	for (let i = 0; i < menuList.length; i++)
	{
		menuList[i].style.display = 'none';
	}
	document.getElementsByClassName('menuSelected')[2].style.display = 'flex';
	gameMode = 2;
}

function selectGameModeFour()
{
	document.getElementById('loginPopup').style.display = 'none';
	if (gameMode == 3)
		return ;
	document.getElementsByClassName('mode-card')[0].getElementsByTagName('p')[0].innerHTML = listSelectCard[3].innerHTML;
	const	menuList = document.getElementsByClassName('menuSelected');
	for (let i = 0; i < menuList.length; i++)
	{
		menuList[i].style.display = 'none';
	}
	document.getElementsByClassName('menuSelected')[3].style.display = 'flex';
	gameMode = 3;
}

function movePopMenuLoginButton()
{
	const	loginButton			= document.getElementById('loginButton');
	const	pos					= loginButton.getBoundingClientRect();
	const	popMenuLoginButton 	= document.getElementById('popMenuLoginButton');

	popMenuLoginButton.style.left = pos.left + "px";
	popMenuLoginButton.style.top = pos.top + pos.height + "px";
}

function showMenu()
{
	const	popMenuLoginButton 	= document.getElementById('popMenuLoginButton');
	const	loginButton			= document.getElementById('loginButton');
	
	popMenuLoginButton.style.display = 'flex';
	setTimeout(() => {
		document.addEventListener('click', hideMenu);
		loginButton.removeEventListener('click', showMenu);
	}, 50);
}

function hideMenu()
{
	const	loginButton			= document.getElementById('loginButton');
	const	popMenuLoginButton 	= document.getElementById('popMenuLoginButton');
	
	popMenuLoginButton.style.display = 'none';
	document.removeEventListener('click', hideMenu);
	loginButton.addEventListener('click', showMenu);
}

function initButtonPopMenuLogin()
{
	const	buttons = document.getElementById('popMenuLoginButton').getElementsByTagName('p');

	buttons[0].addEventListener('click', () => {
		pageRenderer.changePage('profilPage', false, userMeInfo.id);
	});
	buttons[1].addEventListener('click', () => {
		pageRenderer.changePage('settingsPage', false);
	});
	buttons[2].addEventListener('click', () => {
		window.location.replace('/logout');
	});
}

export { LobbyPage };

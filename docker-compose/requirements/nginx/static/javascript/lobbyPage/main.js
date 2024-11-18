/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   main.js                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: edbernar <edbernar@student.42angouleme.    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/08/22 17:08:46 by madegryc          #+#    #+#             */
/*   Updated: 2024/11/18 15:05:34 by edbernar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { userMeInfo, waitForLogin } from '/static/javascript/typeResponse/typeLogin.js';
import { createNotification as CN } from "/static/javascript/notification/main.js";
import { barSelecter, goalSelecter } from '/static/javascript/lobbyPage/3d.js';
import { LiveChat } from "/static/javascript/liveChat/main.js";
import { sendRequest } from "/static/javascript/websocket.js";
import { pageRenderer } from '/static/javascript/main.js'
import { isMobile } from '/static/javascript/main.js';
import { lastSelected } from '/static/javascript/lobbyPage/3d.js';

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
let	layoutSelected	= {US: true, FR: false};
let	withBot			= false;

class LobbyPage
{
	static create()
	{
		const	methButton			= document.getElementById("homeButton");
		const	startButton			= document.getElementsByClassName('buttonStartGame')[0];
		const	usernameP			= document.getElementById('loginButton').getElementsByTagName('p')[0];
		const	loginButton 		= document.getElementById('loginButton');
		const	inputUser			= document.getElementById('searchInputUser');
		const	tournamentCodeInput	= document.getElementById('tournamentCode');
		const	func				= [selectGameModeOne, selectGameModeTwo, selectGameModeThree, selectGameModeFour];
		const	nbBot				= document.getElementById('nbBot');
		const	checkBoxBot			= document.getElementById('checkBoxBot');

		withBot = false;
		document.body.style.opacity = 1;
		if (userMeInfo.id == -1)
			waitForLogin().then(() => usernameP.innerHTML = userMeInfo.username);
		else
			usernameP.innerHTML = userMeInfo.username;
		if (usernameP.length > 8)
			usernameP.innerHTML = usernameP.innerHTML.substring(0, 8) + '...';
		LiveChat.create();
		inputUser.addEventListener('input', searchUser);
		loginButton.addEventListener('click', showMenu);
		window.addEventListener('resize', movePopMenuLoginButton);
		window.addEventListener('resize', ajustSearchUserList);
		movePopMenuLoginButton();
		initButtonPopMenuLogin();
		initButtonLaytout();
		window.addEventListener('click', closePopUpWhenClickOutsite);
		tournamentCodeInput.addEventListener('keypress', (event) => {
			if (event.key == 'Enter')
				startTournmament();
		});
		tournamentCodeInput.addEventListener('input', () => {
			if (tournamentCodeInput.value.length == 0)
				nbBot.style.display = 'flex';
			else
				nbBot.style.display = 'none';
		});
		listSelectCard = document.getElementsByClassName('select-card');
		listSelectCard[0].addEventListener('click', selectGameModeOne);
		listSelectCard[1].addEventListener('click', selectGameModeTwo);
		listSelectCard[2].addEventListener('click', selectGameModeThree);
		listSelectCard[3].addEventListener('click', selectGameModeFour);
		func[gameMode](null, true);
		document.getElementsByClassName('mode-card')[0].getElementsByTagName('p')[0].innerHTML = listSelectCard[gameMode].innerHTML;
		for (let i = 0; i < document.body.children.length; i++)
		{
			document.body.children[i].style.animation = 'animShowMenuDiv 0.5s';
		}
		setTimeout(() => {
			for (let i = 0; i < document.body.children.length; i++)
			{
				document.body.children[i].style.animation = null;
			}
		}, 600);
		startButton.addEventListener('click', startMode);
		methButton.addEventListener('click', goBackHome);
		document.getElementsByClassName('menuSelected')[gameMode].style.display = 'flex';
		checkBoxBot.addEventListener('click', () => withBot = !withBot);
	}

	static dispose()
	{
		const	startButton = document.getElementsByClassName('buttonStartGame')[0];

		window.removeEventListener('click', closePopUpWhenClickOutsite);
		window.removeEventListener('resize', movePopMenuLoginButton);
		startButton.removeEventListener('click', startMode);
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
			sendRequest("search_user", {username: event.target.value.toLowerCase()});
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
	if (gameMode == 0 && !isMobile)
		startMultiLocal();
	else if (gameMode == 0 && isMobile)
		CN.new("Error", "You can't play multiplayer local on mobile");
	else if (gameMode == 1)
		startMatchmaking(false);
	else if (gameMode == 2)
		startMatchmaking(true);
	else if (gameMode == 3)
		startTournmament();
}

function startMultiLocal()
{
	document.body.style.animation = "none";
	document.body.style.animation = "startGameAnim 0.5s";
	document.body.style.opacity = 0;
	setTimeout(() => {
		pageRenderer.changePage("multiLocalGamePage");
	}, 500);
}

function startMatchmaking(ranked)
{
	document.body.style.animation = "none";
	document.body.style.animation = "startGameAnim 0.5s";
	document.body.style.opacity = 0;
	setTimeout(() => {
		pageRenderer.changePage("waitingGamePage", false, ranked);
	}, 500);
}

function startTournmament()
{
	const	code	=	document.getElementById('tournamentCode').value;
	let		nbBot	=	document.getElementById('nbBot').value;

	if (code != '')
		sendRequest("tournament", {action: 0, code: code, skin: lastSelected ? lastSelected.id : 0, goal: goalSelector ? goalSelector.selected : 0});
	else
	{
		nbBot = nbBot == '' ? 0 : nbBot;
		if (parseInt(nbBot) >= 0 && parseInt(nbBot) <= 7)
			sendRequest("tournament", {action: 0, code: '', nbBot: parseInt(nbBot), skin: lastSelected ? lastSelected.id : 0, goal: goalSelector ? goalSelector.selected : 0});
		else
			CN.new("Error", "You must enter a valid number of bot");
	}
}

function closePopUpWhenClickOutsite (event)
{
    if (event.target == document.getElementById('loginPopup'))
        document.getElementById('loginPopup').style.display = 'none';
};

function selectGameModeOne(event, disableScroll = false)
{
	const	menuList = document.getElementsByClassName('menuSelected');
	const	gameModeDiv	= document.getElementsByClassName('game-mode')[0].children;

	if (!disableScroll)
	{
		setTimeout(() => {
			window.scroll({
				top: 100000,
				behavior: 'smooth'
			});
		}, 50);
	}
	for (let i = 0; i < menuList.length; i++)
	{
		menuList[i].style.display = 'none';
		gameModeDiv[i].classList.remove('mode-card');
		gameModeDiv[i].classList.remove('mode-card-ns');
	}
	document.getElementsByClassName('menuSelected')[0].style.display = 'flex';
	for (let i = 0; i < gameModeDiv.length; i++)
	{
		if (i != 0)
			gameModeDiv[i].classList.add('mode-card-ns');
	}
	gameModeDiv[0].classList.add('mode-card');
	for (let i = 0; i < menuList.length; i++)
	{
		menuList[i].style.display = 'none';
	}
	document.getElementsByClassName('menuSelected')[0].style.display = 'flex';
	gameMode = 0;
}

function selectGameModeTwo(event, disableScroll = false)
{
	const	menuList	= document.getElementsByClassName('menuSelected');
	const	gameModeDiv	= document.getElementsByClassName('game-mode')[0].children;

	if (!disableScroll)
	{
		setTimeout(() => {
			window.scroll({
				top: 100000,
				behavior: 'smooth'
			});
		}, 50);
	}
	for (let i = 0; i < menuList.length; i++)
	{
		menuList[i].style.display = 'none';
		gameModeDiv[i].classList.remove('mode-card');
		gameModeDiv[i].classList.remove('mode-card-ns');
	}
	document.getElementsByClassName('menuSelected')[1].style.display = 'flex';
	for (let i = 0; i < gameModeDiv.length; i++)
	{
		if (i != 1)
			gameModeDiv[i].classList.add('mode-card-ns');
	}
	gameModeDiv[1].classList.add('mode-card');
	if (barSelector)
		barSelector.dispose();
	if (goalSelector)
		goalSelector.dispose();
	document.getElementById('bar').innerHTML = '';
	document.getElementById('goal').innerHTML = '';
	if (barSelector)
		barSelector.dispose();
	if (goalSelector)
		goalSelector.dispose();
	barSelector = null;
	goalSelector = null;
	barSelector = new barSelecter(document.getElementById('bar'));
	goalSelector = new goalSelecter(document.getElementById('goal'));
	gameMode = 1;
}

function selectGameModeThree(event, disableScroll = false)
{
	const	menuList = document.getElementsByClassName('menuSelected');
	const	gameModeDiv	= document.getElementsByClassName('game-mode')[0].children;

	if (!disableScroll)
	{
		setTimeout(() => {
			window.scroll({
				top: 100000,
				behavior: 'smooth'
			});
		}, 50);
	}
	for (let i = 0; i < menuList.length; i++)
	{
		menuList[i].style.display = 'none';
		gameModeDiv[i].classList.remove('mode-card');
		gameModeDiv[i].classList.remove('mode-card-ns');
	}
	document.getElementsByClassName('menuSelected')[2].style.display = 'flex';
	for (let i = 0; i < gameModeDiv.length; i++)
	{
		if (i != 2)
			gameModeDiv[i].classList.add('mode-card-ns');
	}
	gameModeDiv[2].classList.add('mode-card');
	document.getElementById('bar1').innerHTML = '';
	document.getElementById('goal1').innerHTML = '';
	document.getElementsByClassName('menuSelected')[2].style.display = 'flex';
	if (barSelector)
		barSelector.dispose();
	if (goalSelector)
		goalSelector.dispose();
	barSelector = null;
	goalSelector = null;
	barSelector = new barSelecter(document.getElementById('bar1'));
	goalSelector = new goalSelecter(document.getElementById('goal1'));
	gameMode = 2;
}

function selectGameModeFour(event, disableScroll = false)
{
	const	menuList = document.getElementsByClassName('menuSelected');
	const	gameModeDiv	= document.getElementsByClassName('game-mode')[0].children;

	if (!disableScroll)
	{
		setTimeout(() => {
			window.scroll({
				top: 100000,
				behavior: 'smooth'
			});
		}, 50);
	}
	for (let i = 0; i < menuList.length; i++)
	{
		menuList[i].style.display = 'none';
		gameModeDiv[i].classList.remove('mode-card');
		gameModeDiv[i].classList.remove('mode-card-ns');
	}
	document.getElementsByClassName('menuSelected')[3].style.display = 'flex';
	for (let i = 0; i < gameModeDiv.length; i++)
	{
		if (i != 3)
			gameModeDiv[i].classList.add('mode-card-ns');
	}
	gameModeDiv[3].classList.add('mode-card');
	document.getElementById('bar2').innerHTML = '';
	document.getElementById('goal2').innerHTML = '';
	document.getElementsByClassName('menuSelected')[3].style.display = 'flex';
	if (barSelector)
		barSelector.dispose();
	if (goalSelector)
		goalSelector.dispose();
	barSelector = new barSelecter(document.getElementById('bar2'));
	goalSelector = new goalSelecter(document.getElementById('goal2'));
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

function initButtonLaytout()
{
	const	USkeys	=	document.getElementsByClassName('USButton');
	const	FRkeys	=	document.getElementsByClassName('FRButton');

	for (let i = 0; i < USkeys.length; i++)
	{
		USkeys[i].addEventListener('click', () => {
			for (let i = 0; i < USkeys.length; i++)
			{
				USkeys[i].classList.add('select-keys');
				USkeys[i].classList.remove('not-select-keys');
				FRkeys[i].classList.remove('select-keys');
				FRkeys[i].classList.add('not-select-keys');
			}
			changeDisplayedLayout(true);
			layoutSelected	= {US: true, FR: false};
		});
	}
	for (let i = 0; i < FRkeys.length; i++)
	{
		FRkeys[i].addEventListener('click', () => {
			for (let i = 0; i < USkeys.length; i++)
			{
				USkeys[i].classList.remove('select-keys');
				USkeys[i].classList.add('not-select-keys');
				FRkeys[i].classList.add('select-keys');
				FRkeys[i].classList.remove('not-select-keys');
			}
			changeDisplayedLayout(false);
			layoutSelected	= {US: false, FR: true};
		});
	}
}

function changeDisplayedLayout(isUS)
{
	const	keys	=	document.getElementsByClassName('keys');
	const	USkeys	=	['W', 'A', 'S', 'D'];
	const	FRkeys	=	['Z', 'Q', 'S', 'D'];
	
	for (let i = 0; i < keys.length; i++)
	{
		for (let j = 0; j < keys[i].children.length; j++)
		{
			if (i == 0)
			{
				if (j == 0)
					keys[i].children[j].getElementsByTagName('p')[0].innerText = isUS ? "W" : "Z";
				else if (j == 1)
					keys[i].children[j].getElementsByTagName('p')[0].innerText = "S"
			}
			else if (keys[i].children[j].getElementsByTagName('p')[0])
				keys[i].children[j].getElementsByTagName('p')[0].innerText = isUS ? USkeys[j] : FRkeys[j];
		}
	}
}

export { LobbyPage, layoutSelected, withBot };

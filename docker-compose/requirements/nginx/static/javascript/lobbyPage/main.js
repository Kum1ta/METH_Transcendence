/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   main.js                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: edbernar <edbernar@student.42angouleme.    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/08/22 17:08:46 by madegryc          #+#    #+#             */
/*   Updated: 2024/09/13 10:41:51 by edbernar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

/* 
	Information :
		- 0: Multiplayer local
		- 1: Matchmaking
		- 2: Ranked
		- 3: Tournament
*/

let	listSelectCard	= null;
let	gameMode		= 0;

class LobbyPage
{
	static create()
	{
		console.log("Lobby created");
		listSelectCard = document.getElementsByClassName('select-card');

		gameMode = 0;
		document.getElementsByClassName('game-mode')[0].addEventListener('click', showGameMode);
		document.getElementById('closePopupBtn').addEventListener('click', hideGameMode);
		window.addEventListener('click', closeClickOutsiteGameMode);
		listSelectCard[0].addEventListener('click', selectGameModeOne);
		listSelectCard[1].addEventListener('click', selectGameModeTwo);
		listSelectCard[2].addEventListener('click', selectGameModeThree);
		listSelectCard[3].addEventListener('click', selectGameModeFour);
		for (let i = 0; i < document.body.children.length; i++)
		{
			document.body.children[i].style.animation = 'animShowMenuDiv 0.5s';
		}
	}

	static dispose()
	{
		gameMode = 0;
		document.getElementsByClassName('game-mode')[0].removeEventListener('click', showGameMode);
		document.getElementById('closePopupBtn').removeEventListener('click', hideGameMode);
		window.removeEventListener('click', closeClickOutsiteGameMode);
		listSelectCard[0].removeEventListener('click', selectGameModeOne);
		listSelectCard[1].removeEventListener('click', selectGameModeTwo);
		listSelectCard[2].removeEventListener('click', selectGameModeThree);
		listSelectCard[3].removeEventListener('click', selectGameModeFour);
		listSelectCard = null;
	}
}


function showGameMode()
{
	document.getElementById('loginPopup').style.display = 'flex';
}


function hideGameMode()
{
	document.getElementById('loginPopup').style.display = 'none';
}

function closeClickOutsiteGameMode(event)
{
	if (event.target == document.getElementById('loginPopup')) {
		document.getElementById('loginPopup').style.display = 'none';
	}
}

function selectGameModeOne()
{
	document.getElementById('loginPopup').style.display = 'none';
	document.getElementsByClassName('mode-card')[0].getElementsByTagName('p')[0].innerHTML = listSelectCard[0].innerHTML;
	gameMode = 0;
}

function selectGameModeTwo()
{
	document.getElementById('loginPopup').style.display = 'none';
	document.getElementsByClassName('mode-card')[0].getElementsByTagName('p')[0].innerHTML = listSelectCard[1].innerHTML;
	gameMode = 1;
}

function selectGameModeThree()
{
	document.getElementById('loginPopup').style.display = 'none';
	document.getElementsByClassName('mode-card')[0].getElementsByTagName('p')[0].innerHTML = listSelectCard[2].innerHTML;
	gameMode = 2;
}

function selectGameModeFour()
{
	document.getElementById('loginPopup').style.display = 'none';
	document.getElementsByClassName('mode-card')[0].getElementsByTagName('p')[0].innerHTML = listSelectCard[3].innerHTML;
	gameMode = 3;
}


export { LobbyPage };
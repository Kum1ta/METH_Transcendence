/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   main.js                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: edbernar <edbernar@student.42angouleme.    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/08/07 17:40:15 by edbernar          #+#    #+#             */
/*   Updated: 2024/11/20 22:47:11 by edbernar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { userMeInfo, waitForLogin } from "/static/javascript/typeResponse/typeLogin.js";
import { createNotification as CN } from "/static/javascript/notification/main.js";
import { sendRequest } from "/static/javascript/websocket.js";
import { pageRenderer } from '/static/javascript/main.js'
import { main3d, dispose3d } from '/static/javascript/login/3d.js'

class Login
{
	static create()
	{
		const	loginButton			= document.getElementById('loginButton');
		const	pLoginButton		= loginButton.getElementsByTagName('p')[0];
		const	form				= document.getElementById('loginForm');
		const	registerButton		= document.getElementsByClassName('new-player')[0];
		const	button42			= document.getElementsByClassName('login-42-btn')[0];
		const	registerForm		= document.getElementById('registerForm');
		const   loginBackButton		= document.getElementsByClassName('old-player')[0];
		let		usernameNode		= null;
		let		nodeText			= null;

		document.body.style.overflow = 'auto';
		registerButton.addEventListener('click', changeWindowLogin);
		loginBackButton.addEventListener('click', changeWindowLoginBack);
		button42.addEventListener('click', redirection);
		if (userMeInfo.id !== -1)
		{
			usernameNode = document.createTextNode(userMeInfo.username.lenght > 8 ? userMeInfo.username.substring(0, 8) + '...' : userMeInfo.username);
			loginButton.replaceChild(usernameNode, pLoginButton);
			loginButton.addEventListener('click', showMenu);
			window.addEventListener('resize', movePopMenuLoginButton);
			movePopMenuLoginButton();
			initButtonPopMenuLogin();
		}
		else
		{
			waitForLogin().then(() => {
				if (userMeInfo.id !== -1)
				{
					nodeText = document.createTextNode(userMeInfo.username);
					loginButton.replaceChild(nodeText, pLoginButton);
					loginButton.addEventListener('click', showMenu);
					window.addEventListener('resize', movePopMenuLoginButton);
					movePopMenuLoginButton();
					initButtonPopMenuLogin();
				}
				else
				{
					loginButton.addEventListener('click', showLoginDiv);
					window.addEventListener('click', closeClickOutsiteGameMode);
				}
			});
			form.addEventListener('submit', connect);
			registerForm.addEventListener('submit', createAccount);
		}
	}

	static changeEventLoginButton()
	{
		const	loginButton			= document.getElementById('loginButton');

		loginButton.removeEventListener('click', showLoginDiv);
		loginButton.addEventListener('click', showMenu);
		window.addEventListener('resize', movePopMenuLoginButton);
		movePopMenuLoginButton();
		initButtonPopMenuLogin();
	}

	static dispose()
	{
		const	loginButton		= document.getElementById('loginButton');
		const	form			= document.getElementById('loginForm');
		const	registerButton  = document.getElementsByClassName('new-player')[0];
		const   loginBackButton = document.getElementsByClassName('old-player')[0];
		const	button42		= document.getElementsByClassName('login-42-btn')[0];
		const	registerForm	= document.getElementById('registerForm');

		document.removeEventListener('click', hideMenu);
		button42.removeEventListener('click', redirection);
		loginButton.removeEventListener('click', showLoginDiv);
		form.removeEventListener('submit', connect);
		registerButton.removeEventListener('click', changeWindowLogin);
		registerForm.removeEventListener('submit', createAccount);
		window.removeEventListener('resize', movePopMenuLoginButton);
		window.removeEventListener('click', closeClickOutsiteGameMode);
		loginButton.removeEventListener('click', showMenu);
		loginBackButton.removeEventListener('click', changeWindowLoginBack);
		dispose3d();
	}
}

function movePopMenuLoginButton()
{
	const	loginButton			= document.getElementById('loginButton');
	const	pos					= loginButton.getBoundingClientRect();
	const	popMenuLoginButton 	= document.getElementById('popMenuLoginButton');

	popMenuLoginButton.style.left = pos.left + "px";
	popMenuLoginButton.style.top = pos.top + (pos.height / 2) - 5 + "px" ;
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
	document.body.style.overflow = 'auto';
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
	})
} 

function	redirection(e)
{
	const	button42 = document.getElementsByClassName('login-42-btn')[0];

	e.preventDefault();
	window.location.replace(button42.getAttribute('href'));
}

function createAccount(e)
{
	e.preventDefault();
	const	username			= document.getElementById('username');
	const	email				= document.getElementById('email-register');
	const	password			= document.getElementById('password-register');
	const	password_confirm	= document.getElementById('password-confirm');

	if (password.value != password_confirm.value)
	{
		CN.new("Error", "Passwords do not match", CN.defaultIcon.error);
		return ;
	}
	sendRequest("create_account", {username: username.value, mail: email.value, password: password.value});
}

function	changeWindowLogin(e)
{
	const	registerWindow	= document.getElementsByClassName('right-side-register')[0];
	const	loginWindow		= document.getElementsByClassName('right-side')[0];

	e.preventDefault();
	loginWindow.style.display = 'none';
	registerWindow.style.display = 'flex';
}

function   changeWindowLoginBack(e)
{
	const	registerWindow	= document.getElementsByClassName('right-side-register')[0];
	const	loginWindow		= document.getElementsByClassName('right-side')[0];
	
	if (e)
		e.preventDefault();
	loginWindow.style.display = 'flex';
	registerWindow.style.display = 'none';
}

function	showLoginDiv()
{
	const popout = document.getElementById('loginPopup');

	if (popout.style.display === 'flex')
	{		
		document.body.style.overflow = 'auto';
		popout.style.display = 'none';
		dispose3d();
	}
	else
	{
		document.body.style.overflow = 'hidden';
		popout.style.display = 'flex';
		main3d();
	}
}

function	connect(e)
{
	const	loginButton		= document.getElementById('loginButton');
	const	pLoginButton	= loginButton.getElementsByTagName('p')[0];
	const 	popout 			= document.getElementById('loginPopup');
	const 	mail			= document.getElementById('email').value;
	let		usernameNode	= null;
	
	e.preventDefault();
	sendRequest("login", {type: "byPass", mail: mail, password: e.target.password.value});
}

function closeClickOutsiteGameMode(event)
{
	if (event.target == document.getElementById('loginPopup'))
	{
		dispose3d();
		document.getElementById('loginPopup').style.display = 'none';
		document.body.style.overflow = 'auto';	
	}
}

export { Login, changeWindowLoginBack };
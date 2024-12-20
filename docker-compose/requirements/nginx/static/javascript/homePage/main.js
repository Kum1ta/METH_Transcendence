/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   main.js                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: edbernar <edbernar@student.42angouleme.    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/08/25 00:02:19 by edbernar          #+#    #+#             */
/*   Updated: 2024/11/15 12:59:15 by edbernar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { waitForLogin } from "/static/javascript/typeResponse/typeLogin.js";
import { redirection, changePlayButtonMouseOverValue } from "/static/javascript/home3D/home3D.js";
import { LiveChat } from "/static/javascript/liveChat/main.js";
import { Home3D } from "/static/javascript/home3D/home3D.js"
import { Login } from "/static/javascript/login/main.js";
import { dispose3d } from "/static/javascript/login/3d.js";

class HomePage
{
	static create()
	{
		Home3D.create();
		Login.create();
		LiveChat.create();
		window.addEventListener('scroll', scrool);
		waitForLogin().then((infoUser) => {
			if (infoUser.id > 0)
				document.getElementById('buttonPlay').addEventListener('click', redirection);
			else
			{
				document.getElementById('buttonPlay').addEventListener('mouseover', changePlayButtonMouseOverValue);
				document.getElementById('buttonPlay').addEventListener('mouseout', changePlayButtonMouseOverValue);
			}
		})
		document.getElementById('buttonProject').addEventListener('click', () => scrollToSection(0));
		document.getElementById('buttonAuthors').addEventListener('click', () => scrollToSection(1));
		document.getElementById('cross-login').addEventListener('click', () => {
			dispose3d();
			document.getElementById('loginPopup').style.display = 'none';
			document.body.style.overflow = 'auto';
		});
	}

	static dispose()
	{
		Home3D.dispose();
		Login.dispose();
		LiveChat.dispose();
		window.removeEventListener('scroll', scrool);
		document.getElementById('buttonPlay').removeEventListener('click', redirection);
		document.body.style.overflow = 'auto';
	}
};

function scrollToSection(i)
{
	let pos;
	if (i == 0)
	{
		pos = document.getElementById('project').getBoundingClientRect().top + window.scrollY;
	}
	else if (i == 1)
	{
		pos = document.getElementById('authors').getBoundingClientRect().top + window.scrollY;
	}
	window.scroll({
		top: pos,
		behavior: 'smooth'
	});
}

function scrool()
{
	const scrollPosition = window.scrollY;
	const rotationAngle = scrollPosition * 0.1;
	const parallaxElement = document.querySelector('#firstBall');
	const parallaxElement2 = document.querySelector('#secondBall');
	const parallaxSpeed = scrollPosition * -0.17;

	parallaxElement.style.transform = `translateX(-50%) translateY(${-parallaxSpeed}px) rotate(${rotationAngle}deg)`;
	parallaxElement2.style.transform = `translateX(50%) translateY(${-parallaxSpeed}px) rotate(${rotationAngle}deg)`;
}

export { HomePage };

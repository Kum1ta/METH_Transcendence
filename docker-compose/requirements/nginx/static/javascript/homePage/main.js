/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   main.js                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: edbernar <edbernar@student.42angouleme.    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/08/25 00:02:19 by edbernar          #+#    #+#             */
/*   Updated: 2024/09/17 16:43:50 by edbernar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { LiveChat } from "/static/javascript/liveChat/main.js";
import { Home3D } from "/static/javascript/home3D/home3D.js"
import { Login } from "/static/javascript/login/main.js";

class HomePage
{
	static create()
	{
		Home3D.create();
		Login.create();
		LiveChat.create();
		window.addEventListener('scroll', scrool);
		document.getElementById('AAAAAAA').addEventListener('click', scrollToSection)
	}

	static dispose()
	{
		Home3D.dispose();
		Login.dispose();
		LiveChat.dispose();
		window.removeEventListener('scroll', scrool);
		document.getElementById('AAAAAAA').removeEventListener('click', scrollToSection)
	}
};

function scrollToSection()
{
	const pos = document.getElementById('QWERTYUIOP').getBoundingClientRect().top + window.scrollY;
	window.scroll({
		top: pos,
		behavior: 'smooth'
	});
	console.log("CACA");
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

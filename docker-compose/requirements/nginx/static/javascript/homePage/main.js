/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   main.js                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: edbernar <edbernar@student.42angouleme.    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/08/25 00:02:19 by edbernar          #+#    #+#             */
/*   Updated: 2024/08/25 15:29:51 by edbernar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { Home3D } from "/static/javascript/home3D/home3D.js"
import { Login } from "/static/javascript/login/main.js";
// import { liveChat } from "/static/javascript/liveChat/main.js";

class HomePage
{
	static create()
	{
		Home3D.create();
		Login.create();
		window.addEventListener('scroll', scrool);
	}

	static dispose()
	{
		Home3D.dispose();
		Login.dispose();
		window.addEventListener('scroll', scrool);
	}
};


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

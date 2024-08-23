/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   main.js                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: madegryc <madegryc@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/07/30 13:50:35 by edbernar          #+#    #+#             */
/*   Updated: 2024/08/23 17:47:37 by madegryc         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { liveChat } from "./liveChat/main.js";
import { login } from "./login/main.js";
import { home3D } from "./home3D/home3D.js"

window.addEventListener('scroll', () => {
	const scrollPosition = window.scrollY;
	const rotationAngle = scrollPosition * 0.1;
	const parallaxElement = document.querySelector('#firstBall');
	const parallaxElement2 = document.querySelector('#secondBall');
	const parallaxSpeed = scrollPosition * -0.17;

	parallaxElement.style.transform = `translateX(-50%) translateY(${-parallaxSpeed}px) rotate(${rotationAngle}deg)`;
	parallaxElement2.style.transform = `translateX(50%) translateY(${-parallaxSpeed}px) rotate(${rotationAngle}deg)`;
});

document.getElementById('closePopupBtn').addEventListener('click', function() {
	document.getElementById('loginPopup').style.display = 'none';
});

document.addEventListener('DOMContentLoaded', () => {
	liveChat();
	login();
	home3D();
});

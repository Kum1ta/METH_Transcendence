/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   main.js                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: edbernar <edbernar@student.42angouleme.    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/07/30 13:50:35 by edbernar          #+#    #+#             */
/*   Updated: 2024/08/22 18:01:38 by edbernar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { liveChat } from "/liveChat/main.js";
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

document.addEventListener('DOMContentLoaded', () => {
	liveChat();
	login();
	home3D();
});

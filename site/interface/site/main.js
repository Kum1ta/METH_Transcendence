/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   main.js                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: marvin <marvin@student.42.fr>              +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/07/30 13:50:35 by edbernar          #+#    #+#             */
/*   Updated: 2024/08/14 11:32:50 by marvin           ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { createNotification } from "./notification/main.js";
import { liveChat } from "./liveChat/main.js";
import { login } from "./login/main.js";

window.addEventListener('scroll', function() {
	const scrollPosition = window.scrollY;
	const rotationAngle = scrollPosition * 0.1; // Ajustez ce facteur pour contrôler l'angle de rotation
	const parallaxElement = document.querySelector('#firstBall');
	const parallaxElement2 = document.querySelector('#secondBall');
	const parallaxSpeed = scrollPosition * -0.15; // Ajustez ce facteur pour ralentir le défilement

	// Appliquer la rotation en fonction de la position de défilement
	parallaxElement.style.transform = `translateX(-50%) translateY(${-parallaxSpeed}px) rotate(${rotationAngle}deg)`;
	parallaxElement2.style.transform = `translateX(50%) translateY(${-parallaxSpeed}px) rotate(${rotationAngle}deg)`;

	// Ajuster la position de l'arrière-plan pour l'effet de parallaxe
	// parallaxElement.style.backgroundPositionY = `${parallaxSpeed}px`;
});

document.addEventListener('DOMContentLoaded', () => {
	liveChat();
	login();
});

/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   light.js                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: edbernar <edbernar@student.42angouleme.    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/07/30 13:50:46 by edbernar          #+#    #+#             */
/*   Updated: 2024/08/24 20:36:07 by edbernar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import * as THREE from '/static/three/build/three.module.js';

// ------------------- Spot Light ------------------- //
function createSpotLight(color, target, scene) {
	let spotLight = new THREE.SpotLight(color);
	spotLight.position.set(0, 1, 0);
	spotLight.angle = Math.PI / 4;
	spotLight.castShadow = true;
	spotLight.angle = 0.1;
	spotLight.penumbra = 0.05;
	spotLight.decay = 2;
	spotLight.distance = 50;
	spotLight.intensity = 10;
	spotLight.target = target;
	scene.add(spotLight);
	return spotLight;
}

function refreshSpotLight(scene, spotLight, target) {
	scene.remove(spotLight);
	spotLight.dispose();
	spotLight = createSpotLight(0xffffff, target, scene);
	scene.add(spotLight);
	return spotLight;
}

// ------------------- Light Ambient ------------------- //
function createLightAmbient(scene) {
	let lightAmbient = new THREE.AmbientLight(0x404040);
	lightAmbient.intensity = 5;
	scene.add(lightAmbient);
	return lightAmbient;
}


// ------------------- Light Point ------------------- //
function createLightPoint(scene) {
	let lightPoint = new THREE.PointLight(0xffffff, 750, 10000);
	lightPoint.position.set(0, 15, -1);
	lightPoint.castShadow = true;
	scene.add(lightPoint);
	return lightPoint;
}

function refreshLightPoint(scene, lightPoint) {
	scene.remove(lightPoint);
	lightPoint.dispose();
	lightPoint = createLightPoint(scene);
	scene.add(lightPoint);
	return lightPoint;
}



export {
	createSpotLight, refreshSpotLight,
	createLightAmbient,
	createLightPoint, refreshLightPoint
};
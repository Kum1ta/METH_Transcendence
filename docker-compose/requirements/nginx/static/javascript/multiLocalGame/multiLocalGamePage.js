/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   multiLocalGamePage.js                              :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: hubourge <hubourge@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/08/28 12:07:39 by edbernar          #+#    #+#             */
/*   Updated: 2024/11/11 15:42:23 by hubourge         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { Map, ground, gameEndStatus, score, scoreElement } from '/static/javascript/multiLocalGame/Map.js'
import { Players, player1, player2 } from '/static/javascript/multiLocalGame/Players.js'
import * as THREE from '/static/javascript/three/build/three.module.js'
import { Ball } from '/static/javascript/multiLocalGame/Ball.js'
import { pageRenderer } from '/static/javascript/main.js'

let	scene		=	null;
let	renderer	=	null;
let	camera		=	null;

/*
Controls :
	- w : monter player1
	- s : descendre player1

	- haut : monter player2
	- bas : descendre player2

	- a : restart quand score debug
*/
class multiLocalGamePage
{
	static create()
	{
		scene = new THREE.Scene();
		renderer = new THREE.WebGLRenderer({antialias: true});
		renderer.domElement.style.animation = 'fadeOutStartGames 1s';
		renderer.domElement.style.filter = 'brightness(1)';
		document.getElementById('score').style.animation = 'fadeOutStartGames 1s';

		renderer.shadowMap.enabled = true;
		renderer.shadowMap.type = THREE.PCFSoftShadowMap;
		Ball.create(scene);
		Map.create(scene);
		camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight);
		camera.rotation.x = -Math.PI / 2;
		renderer.setSize(window.innerWidth, window.innerHeight);
		scene.background = new THREE.Color(0x252525);
		document.body.appendChild(renderer.domElement);
		Players.create(scene);

		camera.position.set(0, 22, 0);

		renderer.setAnimationLoop(loop);
		document.body.style.opacity = 1;
	}

	static dispose()
	{
		Map.dispose();
		if (renderer)
			renderer.dispose();
		renderer = null;
		camera = null;
		if (scene)
		{
			scene.children.forEach(child => {
				if (child.geometry)
					child.geometry.dispose();
				if (child.material)
					child.material.dispose();
				if (child.texture)
					child.texture.dispose();
				scene.remove(child);
			});
		}
		scene = null;
	}
};
// /////////////
// const fps = 10; // change to 30 for 30 fps
// const frameDuration = 1000 / fps;
// let lastTime = 0;
// /////////////

function loop(timestamp) // retirer timestamp
{
	if (gameEndStatus)
	{
		renderer.setAnimationLoop(null);
		gameFinish()
	}
	// const deltaTime = timestamp - lastTime; //

    // if (deltaTime >= frameDuration)//
	// {
        // lastTime = timestamp;//
// 
        Ball.update();
        Map.update();
        Players.update();
        if (renderer) {
            renderer.render(scene, camera);
        }
    // }

}

function gameFinish()
{
	scoreElement.innerHTML = "Player " + (score.player1 > score.player2 ? "1" : "2") + " win !";
	scoreElement.style.fontSize = '10vh';
	scoreElement.style.opacity = 1;
	document.body.style.animation = 'none';
	setTimeout(() => {
		document.body.style.animation = 'end 1s';
		setTimeout(() => {
			pageRenderer.changePage('lobbyPage');
		}, 500);
	}, 3000);
}

export { multiLocalGamePage };

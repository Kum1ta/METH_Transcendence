/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   home3D.js                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: edbernar <edbernar@student.42angouleme.    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/08/22 17:19:17 by edbernar          #+#    #+#             */
/*   Updated: 2024/08/24 23:24:22 by edbernar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import * as THREE from '/static/javascript/three/build/three.module.js'
import { Screen, light } from '/static/javascript/home3D/Screen.js'

import { EffectComposer } from '/static/javascript/three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from '/static/javascript/three/examples/jsm/postprocessing/RenderPass.js';
import { BokehPass } from '/static/javascript/three/examples/jsm/postprocessing/BokehPass.js';


const	scene			= new THREE.Scene();
const	renderer		= new THREE.WebGLRenderer({antialias: true});
const	camera			= new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight);
const	ambiantLight	= new THREE.AmbientLight(0xffffff, 35);
const	screen			= new Screen(scene);
const	cube			= createCube();

renderer.toneMapping = THREE.LinearToneMapping;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.getElementsByClassName('homeSection')[0].appendChild(renderer.domElement);
scene.background = new THREE.Color(0x020202)
camera.position.set(6, 1, -5.5);
camera.rotation.set(Math.PI + 0.2, 0, Math.PI);
scene.add(ambiantLight);

let globalSpeed = 0.75;

const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));

const dofPass = new BokehPass(scene, camera, {
    focus: 10.0,
    aperture: 0.02,
    maxblur: 0.01,
});
composer.addPass(dofPass);

setTimeout(() => {
	let interval = setInterval(() => {
		camera.position.x -= (0.01 * globalSpeed);
		camera.lookAt(screen.tv.position);
		if (camera.position.x < 3.3)
			fadeInOut();
		if (dofPass.materialBokeh.uniforms.aperture.value > 0)
			dofPass.materialBokeh.uniforms.aperture.value -= 0.0001;
		if (camera.position.x < 3)
		{
			clearInterval(interval);
			camera.position.set(-2, 4, -6);
			interval = setInterval(() => {
				camera.lookAt(screen.tv.position);
				camera.position.x += (0.01 * globalSpeed);
				camera.position.y -= (0.005 * globalSpeed);
				if (camera.position.x > 1.7)
					fadeInOut();
				if (camera.position.x > 2)
				{
					camera.position.set(0, 1.2, 0);
					clearInterval(interval);
					interval = setInterval(() => {
						camera.lookAt(screen.tv.position);
						camera.position.y += (0.005 * globalSpeed);
						camera.position.z -= (0.01 * globalSpeed);
						if (camera.position.x < -2.3)
							fadeInOut();
						if (camera.position.z < -2)
						{
							globalSpeed -= 0.001;
							if (globalSpeed < 0)
								clearInterval(interval);
						}
					}, 10);
				}
			}, 10);
		}
	}, 10);
}, 500)

document.addEventListener('resize', () => {
	renderer.setSize(window.innerWidth, window.innerHeight);
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
});

let isInFade = false;

function fadeInOut()
{
	if (isInFade)
		return;
	let interval = null;
	isInFade = true;
	interval = setInterval(() => {
		light.point -= 0.2;
		screen.screen.material.opacity -= 0.05;
		if (screen.screen.material.opacity <= 0)
		{
			clearInterval(interval);
			setTimeout(() => {
				interval = setInterval(() => {
					light.point += 0.2;
					screen.screen.material.opacity += 0.05;
					if (screen.screen.material.opacity >= 1)
					{
						clearInterval(interval);
						interval = setInterval(() => {
							light.point += 0.2;
							if (light.point >= 1)
								clearInterval(interval);
						}, 10);
						isInFade = false;
					}
				}, 20);
			}, 500);
		}
	}, 20);
}

function createCube()
{
	const	geometry	= new THREE.BoxGeometry(5, 5, 0.1);
	const	material	= new THREE.MeshStandardMaterial({color: 0x020202});
	const	mesh		= new THREE.Mesh(geometry, material);

	mesh.position.set(8, 1, -5);
	scene.add(mesh);
}

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

document.addEventListener( 'mousemove', (event) => {
	event.preventDefault();
	mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
});


function home3D()
{
	createPlane();
	renderer.setAnimationLoop(loop)
}

function createPlane()
{
	const	geometry	= new THREE.PlaneGeometry(500, 500);
	const	material	= new THREE.MeshPhysicalMaterial({side: THREE.DoubleSide, color: 0x020202});
	const	mesh		= new THREE.Mesh(geometry, material);

	mesh.position.set(0, 0, 0);
	mesh.rotateX(-(Math.PI / 2));
	mesh.receiveShadow = true;
	scene.add(mesh);
}

const video = {
	pong: '/static/video/homePage/pong.mp4',
	login: '/static/video/homePage/notLogin.webm'
}
let	actualVideo = -1;
if (Math.random() % 100 > 0.97)
	video.pong = '/static/video/homePage/easteregg.webm'

setTimeout(() => {
	screen.changeVideo(video.pong);
	actualVideo = 0;
}, 100);

function loop()
{
	raycaster.setFromCamera( mouse, camera );
	const intersects = raycaster.intersectObjects( scene.children, false );
	
	if (!screen.canvasVideo)
	{
		composer.render();
		return ;
	}
	if (intersects.length === 0)
	{
		if (actualVideo != 0)
		{
			screen.changeVideo(video.pong);
			actualVideo = 0;
		}
	}
	else if (intersects[0].object == screen.screen)
	{
		if (actualVideo != 1)
		{
			screen.changeVideo(video.login);
			actualVideo = 1;
		}
	}
	else if (actualVideo != 0)
	{
		screen.changeVideo(video.pong);
		actualVideo = 0;
	}
	composer.render();
}


export { home3D };
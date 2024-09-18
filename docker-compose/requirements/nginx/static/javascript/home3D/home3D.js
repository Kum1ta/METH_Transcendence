/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   home3D.js                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: edbernar <edbernar@student.42angouleme.    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/08/22 17:19:17 by edbernar          #+#    #+#             */
/*   Updated: 2024/09/18 23:51:51 by edbernar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { EffectComposer } from '/static/javascript/three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from '/static/javascript/three/examples/jsm/postprocessing/RenderPass.js';
import { BokehPass } from '/static/javascript/three/examples/jsm/postprocessing/BokehPass.js';
import { GLTFLoader } from '/static/javascript/three/examples/jsm/loaders/GLTFLoader.js';
import { userMeInfo } from "/static/javascript/typeResponse/typeLogin.js";
import * as THREE from '/static/javascript/three/build/three.module.js'
import { Screen, light } from '/static/javascript/home3D/Screen.js'
import { pageRenderer } from '/static/javascript/main.js'

const	disable3D		= false;

let		scene				= null;
let		renderer			= null;
let		camera				= null;
let		screen				= null;
let		raycaster			= null;
let		interval			= null;
let		intervalFade		= null;
let		isInFade			= false;
let		composer			= null;
let		mouse				= null;
let		renderPass			= null;
let		dofPass				= null;
let		playButtonMouseOver	= false;

class Home3D
{
	static create()
	{
		if (!disable3D)
			home3D();
	}

	static dispose()
	{
		document.removeEventListener('resize', windowUpdater);
		document.removeEventListener('mousemove', mouseTracker);
		document.removeEventListener('click', redirection);

		if (!disable3D)
		{
			if (interval)
				clearInterval(interval);
			interval = null;
			if (intervalFade)
				clearInterval(intervalFade);
			intervalFade = null;
			if (screen)
				screen.dispose();
			screen = null;
			if (composer)
			{
				if (dofPass)
					composer.removePass(dofPass);
				if (renderPass)
					composer.removePass(renderPass);
				composer.dispose();
				dofPass = null;
				composer = null;
			}
			isInFade = false;
			if (renderer)
				renderer.dispose();
			renderer = null;
			if (scene)
			{
				scene.children.forEach(child => {
					scene.remove(child);
					if (child.geometry)
						child.geometry.dispose();
					if (child.material)
						child.material.dispose();
					if (child.texture)
						child.texture.dispose();
				});
			}
			scene = null;
			camera = null;
			mouse = null;
		}
	}
}

function home3D()
{
	const	loader			= new GLTFLoader();
	let		actualVideo		= -1;
	let		globalSpeed		= 0.75;
	const	ambiantLight	= new THREE.AmbientLight(0xffffff, 35);
	const	video			= {
		pong: '/static/video/homePage/pong.mp4',
		login: '/static/video/homePage/notLogin.webm'
	};
	
	scene			= new THREE.Scene();
	renderer		= new THREE.WebGLRenderer({antialias: true});
	camera			= new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight);
	screen			= new Screen(scene);
	raycaster		= new THREE.Raycaster();
	interval		= null;
	mouse			= new THREE.Vector2();
	isInFade		= false;
	
	if (Math.random() % 100 > 0.97)
		video.pong = '/static/video/homePage/easteregg.webm'
	newBgWall();
	putObject('/static/models3D/homePage/lamp.glb', -2.5, 0, 2.5, 3, 0, Math.PI + Math.PI / 8, 0);
	putObject('/static/models3D/homePage/plant.glb', 1.5, 0, 3, 0.5, 0, 0, 0);
	putObject('/static/models3D/homePage/gameboy.glb', -0.5, -0.075, 0.5, 0.1, 0, 0.4, 0);
	renderer.toneMapping = THREE.LinearToneMapping;
	renderer.shadowMap.enabled = true;
	renderer.shadowMap.type = THREE.PCFSoftShadowMap;
	renderer.setSize(window.innerWidth, window.innerHeight);
	camera.position.set(6, 1, -5.5);
	camera.rotation.set(Math.PI + 0.2, 0, Math.PI);
	scene.background = new THREE.Color(0x020202)
	scene.add(ambiantLight);
	
	createPlane();
	createCube();
	document.body.getElementsByClassName('homeSection')[0].appendChild(renderer.domElement);
	
	document.addEventListener('resize', windowUpdater);
	mouse.x = 9999; 
	mouse.y = 9999;
	document.addEventListener('mousemove', mouseTracker);

	composer		= new EffectComposer(renderer);
	renderPass		= new RenderPass(scene, camera);
	composer.addPass(renderPass);
	dofPass			= new BokehPass(scene, camera, {
								focus: 10.0,
								aperture: 0.02,
								maxblur: 0.01,
					});
	composer.addPass(dofPass);
	
	setTimeout(() => {
		interval = setInterval(() => {
			if (screen == null)
			{
				clearInterval(interval);
				return ;
			}
			camera.position.x -= (0.01 * globalSpeed);
			camera.lookAt(screen.tv.position);
			if (camera.position.x < 3.3 && interval)
				fadeInOut();
			if (dofPass.materialBokeh.uniforms.aperture.value > 0 && interval)
				dofPass.materialBokeh.uniforms.aperture.value -= 0.0001;
			if (camera.position.x < 3 && interval)
			{
				clearInterval(interval);
				camera.position.set(-2, 4, -6);
				interval = setInterval(() => {
					if (screen == null)
					{
						clearInterval(interval);
						return ;
					}
					camera.lookAt(screen.tv.position);
					camera.position.x += (0.01 * globalSpeed);
					camera.position.y -= (0.005 * globalSpeed);
					if (camera.position.x > 1.7 && interval)
						fadeInOut();
					if (camera.position.x > 2 && interval)
					{
						camera.position.set(0, 1.2, 0);
						clearInterval(interval);
						interval = setInterval(() => {
							if (screen == null)
							{
								clearInterval(interval);
								return ;
							}
							camera.lookAt(screen.tv.position);
							camera.position.y += (0.005 * globalSpeed);
							camera.position.z -= (0.01 * globalSpeed);
							if (camera.position.x < -2.3 && interval)
								fadeInOut();
							if (camera.position.z < -2 && interval)
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
	}, 500);

	let	clickDetect = false;

	function loop()
	{
		raycaster.setFromCamera( mouse, camera );
		const intersects = raycaster.intersectObjects( scene.children, false );
		
		if (!screen.canvasVideo)
		{
			composer.render();
			return ;
		}
		if (intersects.length === 0 && !playButtonMouseOver)
		{
			if (actualVideo != 0)
			{
				screen.changeVideo(video.pong);
				actualVideo = 0;
			}
		}
		else
		{
			if (clickDetect)
			{
				document.removeEventListener('click', redirection);
				clickDetect = false;
			}
			if (playButtonMouseOver || intersects[0].object == screen.screen)
			{
				if (userMeInfo.id == -1)
				{
					if (actualVideo != 1)
					{
						screen.changeVideo(video.login);
						actualVideo = 1;
					}
				}
				else
				{
					if (!clickDetect)
					{
						document.addEventListener('click', redirection);
						clickDetect = true;
					}
				}
			}
			else if (actualVideo != 0)
			{
				screen.changeVideo(video.pong);
				actualVideo = 0;
			}
		}
		composer.render();
	}

	function putObject(objUrl, x, y, z, scale, rX, rY, rZ) {
		loader.load(objUrl, (gltf) => {
			const group = new THREE.Group();
			const material =  new THREE.MeshPhysicalMaterial({color: 0x080808});
	
			gltf.scene.children.forEach(elem => {
				elem.traverse((child) => {
					if (child.isMesh) {
						child.material = material; // Appliquer le matériau aux meshes
						child.receiveShadow = true;
						child.castShadow = true;
					}
				});
				group.add(elem);
			});
	
			group.position.set(x, y, z);
			group.scale.set(scale, scale, scale);
			group.rotation.set(rX, rY, rZ);
			scene.add(group);
		});
	}

	function newBgWall()
	{
		const	geometry	= new THREE.BoxGeometry(100, 100, 0.1);
		const	material	= new THREE.MeshStandardMaterial({color: 0x020202});
		const	mesh		= new THREE.Mesh(geometry, material);
		const	geometry2	= new THREE.BoxGeometry(10, 10, 0.1);
		const	material2	= new THREE.MeshStandardMaterial({color: 0x020202});
		const	mesh2		= new THREE.Mesh(geometry2, material2);
		mesh.position.set(0, 0, 5);
		scene.add(mesh);
		mesh2.position.set(-5, 0, 0);
		mesh2.rotateY(Math.PI / 2);
		scene.add(mesh2);
	}

	function createCube()
	{
		const	geometry	= new THREE.BoxGeometry(5, 5, 0.1);
		const	material	= new THREE.MeshStandardMaterial({color: 0x020202});
		const	mesh		= new THREE.Mesh(geometry, material);

		mesh.position.set(8, 1, -5);
		scene.add(mesh);
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

	function fadeInOut() {
		if (isInFade)
			return;
		if (intervalFade)
			clearInterval(intervalFade);
		intervalFade = null;
		isInFade = true;
	
		const fadeOut = setInterval(() => {
			if (screen == null)
			{
				clearInterval(fadeOut);
				return;
			}
			light.point -= 0.2;
			screen.screen.material.opacity -= 0.05;
			if (screen.screen.material.opacity <= 0)
			{
				clearInterval(fadeOut);
				setTimeout(fadeIn, 500);
			}
		}, 20);
	
		function fadeIn()
		{
			const fadeInInterval = setInterval(() => {
				if (screen == null)
				{
					clearInterval(fadeInInterval);
					return;
				}
				light.point += 0.2;
				screen.screen.material.opacity += 0.05;
	
				if (screen.screen.material.opacity >= 1)
				{
					clearInterval(fadeInInterval);
					completeFade();
				}
			}, 20);
		}
	
		function completeFade() {
			intervalFade = setInterval(() => {
				light.point += 0.2;
				if (light.point >= 1)
				{
					clearInterval(intervalFade);
					isInFade = false;
				}
			}, 10);
		}
	}
	renderer.setAnimationLoop(loop)
}

function changePlayButtonMouseOverValue()
{
	playButtonMouseOver = !playButtonMouseOver;
}

function windowUpdater(e)
{
	renderer.setSize(window.innerWidth, window.innerHeight);
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
};

function mouseTracker (event)
{
	event.preventDefault();
	mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
};

function redirection()
{
	const	topBar		= document.getElementById('topBar');

	topBar.style.animation = 'animHideMenuDiv 0.5s';
	topBar.style.opacity = 0;
	if (interval)
	{
		clearInterval(interval);
		interval = null;
	}
	moveCamera();
	setTimeout(() => {
		setTimeout(() => {
			pageRenderer.changePage('lobbyPage');
		}, 700);
	}, 1000);
}

function moveCamera()
{
	const targetPosition = screen.tv.position;
	const initialPosition = camera.position.clone();
	const startTime = Date.now();

	function updateCameraPosition()
	{
		const elapsedTime = Date.now() - startTime;
		const t = Math.min(elapsedTime / 1000, 1);
		const position = initialPosition.clone().lerp(targetPosition, t * t);

		camera.position.copy(position);
		if (t < 1)
			requestAnimationFrame(updateCameraPosition);
	}

	updateCameraPosition();
}

export { Home3D, redirection, changePlayButtonMouseOverValue };
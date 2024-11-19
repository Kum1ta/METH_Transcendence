/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Player.js                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: hubourge <hubourge@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/08/18 00:30:31 by edbernar          #+#    #+#             */
/*   Updated: 2024/11/19 15:11:45 by hubourge         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { fetchProfile, MotionController } from '/static/javascript/three/examples/jsm/libs/motion-controllers.module.js'
import { XRControllerModelFactory } from '/static/javascript/three/examples/jsm/webxr/XRControllerModelFactory.js'
import { scene, renderer, isInVrMode, ball } from '/static/javascript/multiOnlineGame/multiOnlineGamePage.js'
import { lastSelectedGoal, availableGoals } from '/static/javascript/lobbyPage/3d.js';
import * as THREE from '/static/javascript/three/build/three.module.js'
import { layoutSelected } from '/static/javascript/lobbyPage/main.js'
import { isMobile, isOnChrome } from '/static/javascript/main.js'

let	playerExist					= false;
let	isOnPointAnim				= false;
let	pressedButton				= [];
let mapLength					= 0;
const goalAnimation				= ["triangle", "cylinder", "star", "box", "rectangle", "ring"];
const controllerModelFactory	= new XRControllerModelFactory();
let	key							= null;
let controller1					= null;
let controller2					= null;

class Player
{
	isUp				= false;
	object				= null;
	camera				= null;
	speed				= 4;
	cameraFixed			= false;
	interval			= null;
	limits				= {};
	previousTime		= Date.now();	
	deltaTime			= 1;
	mapVar				= null;
	opponent			= null;
	playerGoalAnimation = null;
	opponentGoal		= null;
	controller1			= null;
	controller2			= null;
	
	constructor (object, map, opponent, indexGoalAnimation, goalIdOppenent)
	{
		this.mapVar = map;
		this.opponent = opponent;
		if (playerExist)
			throw Error("Player is already init.");
		playerExist = true;
		isOnPointAnim = false;
		pressedButton = [];
		key			= {up: layoutSelected.US ? "w" : "z", down: "s", left: layoutSelected.US ? "a" : "q", right: "d"};
		this.opponentGoal = availableGoals[goalIdOppenent];
		this.object = object;
		this.limits = map.playerLimits;
		this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 10000);
		this.object.position.set(0, this.limits.down, map.mapLength / 2 - 0.2);
		this.playerGoalAnimation = goalAnimation[indexGoalAnimation];
		mapLength = map.mapLength;
		this.setCameraPosition(
			this.object.position.x,
			this.object.position.y + 0.7,
			this.object.position.z + 1.5
		);
		document.addEventListener('keydown', addKeyInArr);
		document.addEventListener('keyup', remKeyInArr);
		document.addEventListener('keypress', simplePressKey);
	}

	mobileMode()
	{
		showGamePad();
	}

	movePlayer(content)
	{
		this.object.position.x = content.pos;
		this.camera.position.x = content.pos;
	}

	dispose()
	{
		playerExist = false;
		isOnPointAnim = false;
		document.removeEventListener('keydown', addKeyInArr);
		document.removeEventListener('keyup', remKeyInArr);
		document.removeEventListener('keypress', simplePressKey);
		pressedButton = [];
		if (this.interval)
			clearInterval(this.interval);
		key = null;
		document.addEventListener('touchstart', addKeyTouch);
		document.addEventListener('touchend', removeKeyTouch);
	}

	reserCameraPlayer()
	{
		this.setCameraPosition(
			this.object.position.x,
			this.object.position.y + 0.7,
			this.object.position.z + 1.5
		);
	}

	resetScaleplayers()
	{
		this.object.scale.set(1, 1, 1);
		if (this.opponent)
			this.opponent.object.scale.set(1, 1, 1);
	}

	makeAnimation(isOpponent)
	{
		this.mapVar.putVideoOnCanvas(3, 'goal');
		setTimeout(() => {
			this.mapVar.putVideoOnCanvas(0, null);
			if (!isMobile && isOnChrome)
				this.mapVar.putVideoOnCanvas(2, 3);
		}, 4000);

		ball.setVisibility(false);

		if (isOpponent)
		{
			this.mapVar.reCreate("opponent");
			this.pointOpponentAnimation(this.mapVar, this.opponent.object);
		}
		else
		{
			this.mapVar.reCreate("player");
			this.pointAnimation(this.mapVar);
		}
	}

	pointAnimation(map)
	{
		const	canvasIndex = document.getElementsByTagName('canvas').length - 1;
		const	tmpCamera	= new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 10000);
		const	tmp			= this.camera;
		let		interval	= null;

		document.getElementsByTagName('canvas')[canvasIndex].style.animation = null;
		document.getElementsByTagName('canvas')[canvasIndex].style.animation = 'fadeInGames 0.199s';
		document.getElementsByTagName('canvas')[canvasIndex].style.filter = 'brightness(0)';
		
		setTimeout(() => {
			document.getElementsByTagName('canvas')[canvasIndex].style.animation = null;
			document.getElementsByTagName('canvas')[canvasIndex].style.animation = 'fadeOutGames 0.199s';
			document.getElementsByTagName('canvas')[canvasIndex].style.filter = 'brightness(1)';
		}, 300)

		setTimeout(() => {

			tmpCamera.position.set(this.limits.left, this.limits.up / 2 + 0.5, map.centerPos.z);
			isOnPointAnim = true;
			this.camera = tmpCamera;
			interval = setInterval(() => {
				tmpCamera.lookAt(this.object.position);
				tmpCamera.fov -= 0.05;
				tmpCamera.updateProjectionMatrix();
			}, 10);

			setTimeout(() => {
				map.animationGoal(this.object.position.x, this.object.position.y, this.object.position.z, this.playerGoalAnimation, lastSelectedGoal ? lastSelectedGoal : availableGoals[0]);
			}, 1000);

			setTimeout(() => {
				if (interval)
					clearInterval(interval);
				interval = null;
				if (document.getElementsByTagName('canvas') && document.getElementsByTagName('canvas')[canvasIndex])
				{
					document.getElementsByTagName('canvas')[canvasIndex].style.animation = null;
					document.getElementsByTagName('canvas')[canvasIndex].style.animation = 'fadeInGames 0.99s';
					document.getElementsByTagName('canvas')[canvasIndex].style.filter = 'brightness(0)';

					setTimeout(() => {
						ball.setVisibility(true);
						ball.setCastShadow(true);

						this.camera = tmp;
						isOnPointAnim = false;
						if (!this.cameraFixed)
						{
							this.setCameraPosition(
								this.object.position.x,
								this.object.position.y - (this.object.position.y >= this.limits.up ? 0.7 : -0.7),
								this.object.position.z + 1.5
							);
						}
						document.getElementsByTagName('canvas')[canvasIndex].style.animation = null;
						document.getElementsByTagName('canvas')[canvasIndex].style.animation = 'fadeOutGames 0.99s';
						document.getElementsByTagName('canvas')[canvasIndex].style.filter = 'brightness(1)';
					}, 400);
				}
			}, 4000);
		}, 200)
	}

	pointOpponentAnimation(map, oppponentObject)
	{
		const	canvasIndex = document.getElementsByTagName('canvas').length - 1;
		const	tmpCamera	= new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 10000);
		const	tmp			= this.camera;
		let		interval	= null;
		let		hue			= 0;

		document.getElementsByTagName('canvas')[canvasIndex].style.animation = null;
		document.getElementsByTagName('canvas')[canvasIndex].style.animation = 'fadeInGames 0.199s';
		document.getElementsByTagName('canvas')[canvasIndex].style.filter = 'brightness(0)';
		
		setTimeout(() => {
			document.getElementsByTagName('canvas')[canvasIndex].style.animation = null;
			document.getElementsByTagName('canvas')[canvasIndex].style.animation = 'fadeOut 0.199s';
			document.getElementsByTagName('canvas')[canvasIndex].style.filter = 'brightness(1)';
		}, 300)

		setTimeout(() => {
			tmpCamera.position.set(this.limits.left, this.limits.up / 2 + 0.5, map.centerPos.z);
			isOnPointAnim = true;
			this.camera = tmpCamera;
			interval = setInterval(() => {
				tmpCamera.lookAt(oppponentObject.position);
				tmpCamera.fov -= 0.05;
				tmpCamera.updateProjectionMatrix();
			}, 10);
			setTimeout(() => {
				map.animationGoal(this.opponent.object.position.x, this.opponent.object.position.y, this.opponent.object.position.z, this.opponent.playerGoalAnimation, this.opponentGoal);
			}, 1000);
			
			setTimeout(() => {
				if (interval)
					clearInterval(interval);
				interval = null;
				document.getElementsByTagName('canvas')[canvasIndex].style.animation = null;
				document.getElementsByTagName('canvas')[canvasIndex].style.animation = 'fadeInGames 0.99s';
				document.getElementsByTagName('canvas')[canvasIndex].style.filter = 'brightness(0)';
				
				setTimeout(() => {
					ball.setVisibility(true);
					ball.setCastShadow(true);

					this.camera = tmp;
					isOnPointAnim = false;
					if (!this.cameraFixed)
					{
						this.setCameraPosition(
							this.object.position.x,
							this.object.position.y - (this.object.position.y >= this.limits.up ? 0.7 : -0.7),
							this.object.position.z + 1.5
						);
					}
					document.getElementsByTagName('canvas')[canvasIndex].style.animation = null;
					document.getElementsByTagName('canvas')[canvasIndex].style.animation = 'fadeOutGames 0.99s';
					document.getElementsByTagName('canvas')[canvasIndex].style.filter = 'brightness(1)';
				}, 400);
			}, 4000);
		}, 200)
	}

	update()
	{
		const gamepads = navigator.getGamepads();
		const currentTime = Date.now();
		this.deltaTime = (currentTime - this.previousTime) / 1000;
		this.previousTime = currentTime;
		
		let i;

		i = 0;
		for (let i = 0; i< gamepads.length; i++)
		{
			if (gamepads[i])
			{
				const xAxis = gamepads[i].axes[0];
				const yAxis = gamepads[i].axes[1];
				if (!gamepads[i].buttons[0].touched)
					this.buttonACheck = false;
				else if (this.buttonACheck == false && gamepads[i].buttons[0].touched)
				{
					this.buttonACheck = true;
					this.buttonAAction = true;
				}
				this.joysticksMove(xAxis, yAxis);
				this.buttonAAction = false;
			}
		}
		while (i < pressedButton.length)
		{
			if (pressedButton[i] == key.up && this.object.position.y < this.limits.up)
			{
				this.isUp = true;
				if (this.interval)
					clearInterval(this.interval);
				this.interval = setInterval(() => {
					this.object.position.y += this.speed / 40;
					if (!this.cameraFixed && !isOnPointAnim)
						this.camera.position.y += (this.speed / 80);
					if (this.object.position.y >= this.limits.up)
					{
						clearInterval(this.interval);
						this.object.position.y = this.limits.up;
						this.camera.position.y = 2.34;
						this.interval = null;
					}
				}, 5);
			}
			if (pressedButton[i] == key.down && this.object.position.y > this.limits.down)
			{
				this.isUp = false;
				if (this.interval)
					clearInterval(this.interval);
				this.interval = setInterval(() => {
					this.object.position.y -= this.speed / 40;
					if (!this.cameraFixed && !isOnPointAnim)
						this.camera.position.y -= (this.speed / 80);
					if (this.object.position.y <= this.limits.down)
					{
						clearInterval(this.interval);
						this.interval = null;
						this.object.position.y = this.limits.down;
						this.camera.position.y = 1;
					}
				}, 5);
			}
			if (pressedButton[i] == key.right && this.object.position.x < this.limits.right)
			{
				this.object.position.x += this.speed * this.deltaTime;
				if (!this.cameraFixed && !isOnPointAnim)
					this.camera.position.x += this.speed * this.deltaTime;
				if (this.object.position.x > this.limits.right)
				{
					this.object.position.x = this.limits.right;
					this.camera.position.x = this.limits.right;
				}
			}
			if (pressedButton[i] == key.left && this.object.position.x > this.limits.left)
			{
				this.object.position.x -= this.speed * this.deltaTime;
				if (!this.cameraFixed && !isOnPointAnim)
					this.camera.position.x -= this.speed * this.deltaTime;
				if (this.object.position.x < this.limits.left)
				{
					this.object.position.x = this.limits.left;
					this.camera.position.x = this.limits.left;
				}
			}
			i++;
		}
		if (isInVrMode)
		{
			if (controller1.userData.inputSource && controller1.userData.inputSource.gamepad)
			{
				const gamepad = controller1.userData.inputSource.gamepad;
				const [a, b, xAxis, yAxis] = gamepad.axes;

				this.joysticksMove(xAxis, yAxis);
			}
		
		}
	}

	buttonACheck = false;
	buttonAAction = false;

	joysticksMove(xAxis, yAxis)
	{
		if (yAxis > 0.75 || this.buttonAAction)
			addKeyInArr({key: key.down})
		else
			remKeyInArr({key: key.down});
		if (yAxis < -0.75 || this.buttonAAction)
			addKeyInArr({key: key.up})
		else
			remKeyInArr({key: key.up});
		if (xAxis > 0.5)
			addKeyInArr({key: key.right})
		else
			remKeyInArr({key: key.right});
		if (xAxis < -0.5)
			addKeyInArr({key: key.left})
		else
			remKeyInArr({key: key.left});
	}

	setCameraPosition(x, y, z)
	{
		this.camera.position.set(x, y, z);
	}

	scalePlayer(isOpponent)
	{
		let object;
		if (isOpponent)
			object = this.opponent.object;
		else
			object = this.object;

		const value = 0.004;

		for (let i = 0; i < 10; i++)
		{
			setTimeout(() => {
				object.scale.z += value;
				object.scale.x += value * 2;
			}, i * 10);
		}

		for (let i = 10; i < 20; i++)
		{
			setTimeout(() => {
				object.scale.z -= value;
				object.scale.x -= value * 2;
			}, i * 10);
		}
		object.scale.set(1, 1, 1);
	}

	configureVrController()
	{
		controller1 = renderer.xr.getController(0);
		controller2 = renderer.xr.getController(1);

		scene.add(controller1);
		scene.add(controller2);
		
		for (let i = 0; i < scene.children.length; i++)
		{
			if (scene.children[i].name === 'vrHeadset')
			{
				const controllerGrip1 = renderer.xr.getControllerGrip(0);
				controllerGrip1.add(controllerModelFactory.createControllerModel(controllerGrip1));
				scene.children[i].add(controllerGrip1);
		
				const controllerGrip2 = renderer.xr.getControllerGrip(1);
				controllerGrip2.add(controllerModelFactory.createControllerModel(controllerGrip2));
				scene.children[i].add(controllerGrip2);
			}
		}

		controller1.addEventListener('connected', (event) => {
			controller1.userData.inputSource = event.data;
		});
		
		controller2.addEventListener('connected', (event) => {
			controller2.userData.inputSource = event.data;
		});
	}
};

function addKeyInArr(e)
{
	const	key	= e.key.toLowerCase();
	let		i;

	i = 0;
	while (i < pressedButton.length && key != pressedButton[i])
		i++;
	if (i == pressedButton.length)
		pressedButton.push(e.key.toLowerCase());
}

function remKeyInArr(e)
{
	const	key	= e.key.toLowerCase();
	let		i;

	i = 0;
	while (i < pressedButton.length && key != pressedButton[i])
		i++;
	if (i != pressedButton.length)
		pressedButton.splice(i, 1);
}

function simplePressKey(e)
{
	if (e.key == 'm' && !isOnPointAnim)
	{
		this.cameraFixed = !this.cameraFixed;
		if (!this.cameraFixed)
		{
			this.setCameraPosition(
				this.object.position.x,
				this.object.position.y - (this.object.position.y >= this.limits.up ? 0.7 : -0.7),
				this.object.position.z + 1.5
			);
			this.camera.rotation.set(0, 0, 0);
		}
		else
			this.setCameraPosition(0, 1.5, this.object.position.z + 3);
	}				
}

function goFullscreen()
{
	const	elem	= document.documentElement;

	if (elem.requestFullscreen)
		elem.requestFullscreen();
	else if (elem.mozRequestFullScreen)
		elem.mozRequestFullScreen();
	else if (elem.webkitRequestFullscreen)
		elem.webkitRequestFullscreen();
	else if (elem.msRequestFullscreen)
		elem.msRequestFullscreen();
}

function showGamePad()
{
	const	gamePad		=	document.getElementsByClassName('gamePad')[0];
	const	canvas		=	document.getElementById('canvasMultiGameOnline');

	canvas.addEventListener('touchstart', function(e) {
		e.preventDefault();
	});
	canvas.addEventListener('mousedown', function(e) {
		e.preventDefault();
	});
	document.getElementById('fullscreen').addEventListener('click', () => {
		goFullscreen();
	});
	gamePad.style.display = 'flex';
	document.addEventListener('touchstart', addKeyTouch);
	document.addEventListener('touchend', removeKeyTouch);
}

function addKeyTouch(event)
{
	const	keyId		=	event.target.getAttribute("id");
	const	keyAction	=	[key.left, key.right, key.up, key.down];
	const	keyList		=	['padLeft', 'padRight', 'padTop', 'padBottom'];

	for (let i = 0; i < keyList.length; i++)
	{
		if (keyList[i] == keyId)
			addKeyInArr({key: keyAction[i]})
	}
}

function removeKeyTouch(event)
{
	const	keyId			=	event.target.getAttribute("id");
	const	keyAction	=	[key.left, key.right, key.up, key.down];
	const	keyList		=	['padLeft', 'padRight', 'padTop', 'padBottom'];

	for (let i = 0; i < keyList.length; i++)
	{
		if (keyList[i] == keyId)
			remKeyInArr({key: keyAction[i]})
	}
}

export { Player, playerExist, goalAnimation};

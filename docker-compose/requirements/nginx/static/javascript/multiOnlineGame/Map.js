/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Map.js                                             :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: edbernar <edbernar@student.42angouleme.    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/08/20 14:52:55 by hubourge          #+#    #+#             */
<<<<<<< HEAD
/*   Updated: 2024/10/01 19:42:54 by edbernar         ###   ########.fr       */
=======
/*   Updated: 2024/10/01 20:27:32 by hubourge         ###   ########.fr       */
>>>>>>> 3e8bc6071273411d12af866d58550eddebba89ec
/*                                                                            */
/* ************************************************************************** */

import { GLTFLoader } from '/static/javascript/three/examples/jsm/loaders/GLTFLoader.js';
import { files } from '/static/javascript/filesLoader.js';
import * as THREE from '/static/javascript/three/build/three.module.js'
import { Video } from '/static/javascript/multiOnlineGame/Video.js';
import { player, ball} from '/static/javascript/multiOnlineGame/multiOnlineGamePage.js';
// import { Ball } from '/static/javascript/multiOnlineGame/Ball.js'

let loader						= null;
let	scene						= null;
let videoList					= [];
let interval2					= null;
let videoCanvas					= null;
let videoCanvasTexture			= null;
let materialCanvas				= null;
let textureLoaderPlane			= null;
let texturePlane				= null;
let ctx							= null;
let canvasTextScore				= null;
let contextTextScore			= null;
let textureTextScore			= null;
let animationSpeed				= 0.02;
let animateGoalObjectUpdate		= null;
let animateGoalObjectUp			= false;

let path = [];

const colorList = [
    0xFFB3BA, 0xFFDFBA, 0xFFFFBA, 0xBAFFC9, 0xBAE1FF, // Pastel pink, peach, yellow, green, blue
    0xFFD1DC, 0xFF9AA2, 0xFFB7B2, 0xFFDAC1, 0xE2F0CB, // More pastel pinks, greens
    0xB5EAD7, 0xC7CEEA, 0xE0BBE4, 0xFFDFD3, 0xF3FFE3, // Soft purple, beige, mint
    0xFFB3B3, 0xFFC1E3, 0xFDDDE6, 0xD4C0E2, 0xFFC2D1, // Soft reds, pinks, purples
    0xA9E5BB, 0xFFF2CC, 0xFFC3A0, 0xFFB7CE, 0xFFFFCB, // Pastel greens, peaches, yellows
    0x9EADBA, 0xE4BAD4, 0xFFCECE, 0xD4E157, 0xC1E7E3, // Gentle blues, violets, greens
    0xFFEDCC, 0xC6D6E7, 0xFDDDEC, 0xC4DFDF, 0xD3FBD8, // Very soft pastels, blues, peaches
    0xFCF7DE, 0xDBFFD6, 0xD4E2D4, 0xFFD6E0, 0xFFEDDF, // Soft beige, mint, light rose
    0xF5F0E1, 0xB1E1FF, 0xFAD4C0, 0xFFC9DE, 0xBFD7EA, // Soft tan, peach, blue, light pink
    0xFFFAE3, 0xE7D3D3, 0xFDE3A7, 0xCDE0C9, 0xF4D9E3  // Soft light peach, pale pink, green, lavender
]; // Merci chatGPT

let spacingImages = [
	100 * 2.33 * 10 - (100 * 2.33),   // 2 images
	100 * 2.33 * 5 - (100 * 2.33),    // 4 images
	100 * 2.33 * 2.5 - (100 * 2.33),  // 8 images
	100 * 2.33 * 1.25 - (100 * 2.33), // 16 images
];

class Map
{
	score	= {player: 0, opponent: 0};
	arrObject = [];
	mapLength = 0;
	banner = null;
	centerPos = {
		x: -1,
		y: -1,
		z:-1
	};
	playerLimits = {
		up : 3,
		down: 0.3,
		left: -3,
		right: 3,
	};

	dispose()
	{
		videoList = null;
		if (videoCanvas)
			videoCanvas.remove();
		if (videoCanvasTexture)
			videoCanvasTexture.dispose();
		if (materialCanvas)
			materialCanvas.dispose();
		videoCanvas = null;
		textureLoaderPlane = null;
		loader = null;
		if (texturePlane)
			texturePlane.dispose();
		this.arrObject.forEach(elem => {
			if (elem.mesh instanceof THREE.Group)
			{
				elem.mesh.children.forEach(child => {
					if (child.geometry)
						child.geometry.dispose();
					if (child.material)
						child.material.dispose();
					if (child.texture)
						child.texture.dispose();
				});
			}
			else
			{
				if (elem.mesh.geometry)
					elem.mesh.geometry.dispose();
				if (elem.mesh.material)
					elem.mesh.material.dispose();
				if (elem.mesh.texture)
					elem.mesh.texture.dispose();
			}
			scene.remove(elem.mesh);
		});
		this.arrObject = null;
		if (interval2)
			clearInterval(interval2);
		scene = null;
	}

	constructor(sceneToSet, length, obstacles)
	{
		loader	= new GLTFLoader();
		scene	= sceneToSet;

		this.centerPos.x = 0;
		this.centerPos.y = 0.15;
		this.centerPos.z = -length / 2 + length / 2;
		this.mapLength = length;
		scene.add(this.#createPlanes(7.5, length, -(Math.PI / 2), "planeBottom", true, files.planeTexture));
		scene.add(this.#createPlanes(7.5, length, (Math.PI / 2), "planeTop", false, files.planeTexture));
		scene.add(this.#createWall(-3.5, 0.4, -length/2, "wallLeft"));
		scene.add(this.#createWall(3.5, 0.4, -length/2, "wallRight"));
		{ // A retirer
			/* Style de couleur why not
			0xFFCCCC
			0xFF9999
			0xFF6666
			0xFF3333
			0xCC0000

			0xCCFFCC
			0x99FF99
			0x66FF66
			0x33FF33
			0x009900

			0xCCCCFF
			0x9999FF
			0x6666FF
			0x3333FF
			0x0000CC
			*/
		}
		this.putScoreboard(0xCCCCFF);
		path = [
			{name: 'goal', 			onChoice: true, src: files.goalVideoPub},
			{name: 'easteregg',		onChoice: true, src: files.easterEggVideoPub},
			{name: 'outstanding', 	onChoice: true, src: files.outstandingVideoPub},
			{name: 'ping', 			onChoice: false, src: files.pingVideoPub},
			{name: 'catch', 		onChoice: false, src: files.catchVideoPub},
			{name: 'fortnite', 		onChoice: false, src: files.fortniteVideoPub},
		];
	};

	#createPlanes(x, y, rot, name, isBottom, visual)
	{
		let	geometryPlane		= null;
		let	materialPlane		= null;
		let	meshPlane			= null;

		for (let i = 0; i < this.arrObject.length; i++)
		{
			if (this.arrObject[i].name == name)
				throw Error("Name already exist.");
		}
		geometryPlane = new THREE.PlaneGeometry(x, y);
		if (typeof(visual) == 'string')
		{
			textureLoaderPlane = new THREE.TextureLoader();
			texturePlane = textureLoaderPlane.load(visual);
			materialPlane = new THREE.MeshPhysicalMaterial({ map: texturePlane });
		}
		else if (typeof(visual) == 'number')
			materialPlane = new THREE.MeshPhysicalMaterial({ color: visual });
		else
			materialPlane = new THREE.MeshPhysicalMaterial();
		meshPlane = new THREE.Mesh(geometryPlane, materialPlane);
		meshPlane.rotateX(rot);
		if (isBottom)
			meshPlane.position.set(0, 0.15, 0);
		else
			meshPlane.position.set(0, 3.15, 0);
		this.arrObject.push({mesh: meshPlane, name: name, type: "plane"});
		meshPlane.receiveShadow = true;
		return (meshPlane);
	};

	changePlane(texture)
	{
		for (let i = 0; i < this.arrObject.length; i++)
		{
			if (this.arrObject[i].name == "planeBottom" || this.arrObject[i].name == "planeTop")
			{
				if (this.arrObject[i].mesh.material)
					this.arrObject[i].mesh.material.dispose();
				if (typeof(texture) == 'string')
				{
					let textureLoader = new THREE.TextureLoader();
					texture = textureLoader.load(texture);
					this.arrObject[i].mesh.material.map = texture;
				}
				else if (typeof(texture) == 'number')
					this.arrObject[i].mesh.material.color.set(texture);
			}
		}
	};

	#createWall(x, y, z, name)
	{
		let geometryWall		= null;
		let materialWall		= null;
		let meshWall			= null;

		for (let i = 0; i < this.arrObject.length; i++)
		{
			if (this.arrObject[i].name == name)
				throw Error("Name already exist.");
		}

		geometryWall	= new THREE.BoxGeometry(0.05, 0.5, 0.75);
		materialWall	= new THREE.MeshPhysicalMaterial();
		meshWall		= new THREE.Mesh(geometryWall, materialWall);
		meshWall.position.set(x, y, z);
		materialWall.transparent = true;
		materialWall.opacity = 0.5;
		this.arrObject.push({mesh: meshWall, name: name, type: "wall"});
		return (meshWall);
	};

	#createGravityChanger(x, y, z, name, typeName, onTop)
	{
		let geometry1			= null;
		let material1			= null;
		let ring1				= null;
		let geometry2			= null;
		let material2			= null;
		let ring2				= null;
		let geometry3			= null;
		let material3			= null;
		let ring3				= null;
		let geometry4			= null;
		let material4			= null;
		let circle1				= null;
		let geometry5			= null;
		let material5			= null;
		let circle2 			= null;
		let geometry6			= null;
		let material6			= null;
		let collider			= null;
		let groupJumper			= null;

		for (let i = 0; i < this.arrObject.length; i++)
		{
			if (this.arrObject[i].name == name)
				throw Error("Name already exist.");
		}

		geometry1	= new THREE.TorusGeometry(1, 0.1, 12, 24);
		material1	= new THREE.MeshPhysicalMaterial({color: 0x00ff00});
		ring1		= new THREE.Mesh(geometry1, material1);
		ring1.rotateX(-Math.PI / 2);
		ring1.position.set(0, 0, 0);
		ring1.scale.set(0.2, 0.2, 0.2);
		material1.transparent = true;
		material1.opacity = 0.75;

		geometry2	= new THREE.TorusGeometry(1, 0.1, 12, 24);
		material2	= new THREE.MeshPhysicalMaterial({color: 0x00ff00});
		ring2		= new THREE.Mesh(geometry2, material2);
		ring2.rotateX(-Math.PI / 2);
		ring2.position.set(0, 0 + 0.1, 0);
		ring2.scale.set(0.18, 0.18, 0.18);
		material2.transparent = true;
		material2.opacity = 0.65;

		geometry3	= new THREE.TorusGeometry(1, 0.1, 12, 24);
		material3	= new THREE.MeshPhysicalMaterial({color: 0x00ff00});
		ring3		= new THREE.Mesh(geometry3, material3);
		ring3.rotateX(-Math.PI / 2);
		ring3.position.set(0, 0 + 0.2, 0);
		ring3.scale.set(0.16, 0.16, 0.16);
		material3.transparent = true;
		material3.opacity = 0.35;

		geometry4	= new THREE.CircleGeometry(0.2, 24);
		material4	= new THREE.MeshPhysicalMaterial({color: 0xaaffaa});
		circle1		= new THREE.Mesh(geometry4, material4);
		circle1.rotateX(-Math.PI / 2);
		circle1.position.set(0, 0 - 0.048, 0);

		geometry5	= new THREE.CircleGeometry(0.24, 24);
		material5	= new THREE.MeshPhysicalMaterial({color: 0x00ff00});
		circle2		= new THREE.Mesh(geometry5, material5);
		circle2.rotateX(-Math.PI / 2);
		circle2.position.set(0, 0 - 0.049, 0);

		geometry6	= new THREE.CylinderGeometry(0.15, 0.15, 0.35);
		material6	= new THREE.MeshPhysicalMaterial({color: 0x00ff00});
		collider	= new THREE.Mesh(geometry6, material6);
		collider.position.set(0, 0 + 0.1, 0);
		material6.transparent = true;
		material6.opacity = 0.1;

		groupJumper = new THREE.Group();
		groupJumper.add(ring1);
		groupJumper.add(ring2);
		groupJumper.add(ring3);
		groupJumper.add(circle1);
		groupJumper.add(circle2);
		groupJumper.add(collider);

		// Set groupJumper position groud / top
		for (let i = 0; i < groupJumper.children.length && onTop; i++)
			groupJumper.children[i].position.set(x, y - 0.1, z);
		for (let i = 0; i < groupJumper.children.length && !onTop; i++)
			groupJumper.children[i].position.set(x, y, z);

		let distanceY = [-0.04, -0.14, -0.24, 0.048, 0.049, -0.125];
		let rotate = [0, 0, 0, 1, 1, 0];

		// Set distance between each object
		for (let i = 0; i < groupJumper.children.length; i++)
		{
			if (onTop)
			{
				if (rotate[i])
					groupJumper.children[i].rotateX(Math.PI);
				groupJumper.children[i].position.set(groupJumper.children[i].position.x, groupJumper.children[i].position.y + distanceY[i], groupJumper.children[i].position.z);
			}
			else
				groupJumper.children[i].position.set(groupJumper.children[i].position.x, groupJumper.children[i].position.y - distanceY[i], groupJumper.children[i].position.z);
		}

		this.arrObject.push({mesh: groupJumper, name: name, type: typeName});
		scene.add(groupJumper);
	};

	#createWallObstacle(x, y, size, onTop)
	{
		let geometryWallObs		= null;
		let materialWallObs 	= null;
		let meshWallObs			= null;

		geometryWallObs	= new THREE.BoxGeometry(size, 0.5, 0.1);
		materialWallObs = new THREE.MeshPhysicalMaterial({color: 0xaaaafe});
		meshWallObs		= new THREE.Mesh(geometryWallObs, materialWallObs);
		if (onTop)
			meshWallObs.position.set(x, this.playerLimits.up - 0.1, y);
		else
			meshWallObs.position.set(x, 0.4, y);
		return (meshWallObs);
	};

	putScoreboard(color)
	{
		this.#putPlayerProfile("", "", color);
		
		let materialScoreboard	= null;
		let geometryScoreboard1	= null;
		let meshScoreboard1		= null;
		let geometryScoreboard2	= null;
		let meshScoreboard2		= null;

		let materialText		= null;
		let geometryText1		= null;
		let meshText1			= null;
		let geometryText2		= null;
		let meshText2			= null;

		let height = 1.8;
		let width = 5;
		let depth = 0.2;

		materialScoreboard	= new THREE.MeshPhysicalMaterial({color: color});
		geometryScoreboard1	= new THREE.BoxGeometry(width, height, depth);
		meshScoreboard1		= new THREE.Mesh(geometryScoreboard1, materialScoreboard);
		geometryScoreboard2	= new THREE.BoxGeometry(width, height, depth);
		meshScoreboard2		= new THREE.Mesh(geometryScoreboard2, materialScoreboard);

		canvasTextScore = document.createElement('canvas');
		contextTextScore = canvasTextScore.getContext('2d');
		canvasTextScore.width = 512 * 2;
		canvasTextScore.height = 256 * 2;
    	drawScore(this.score);
		textureTextScore = new THREE.CanvasTexture(canvasTextScore);
		
		materialText		= new THREE.MeshBasicMaterial({ map: textureTextScore });
		geometryText1		= new THREE.PlaneGeometry(width - 0.15, height - 0.15);
		meshText1			= new THREE.Mesh(geometryText1, materialText);
		geometryText2		= new THREE.PlaneGeometry(width - 0.15, height - 0.15);
		meshText2			= new THREE.Mesh(geometryText2, materialText);

		meshScoreboard1.rotation.y = Math.PI;
		meshText1.rotation.y = Math.PI;
		meshScoreboard1.position.set(0, 1.60, 8.5);
		meshScoreboard2.position.set(0, 1.60, -8.5);
		meshText1.position.set(0, 1.60, 8.5 - depth / 2 - 0.01);
		meshText2.position.set(0, 1.60, - 8.5 + depth / 2 + 0.01);

		scene.add(meshScoreboard1);
		scene.add(meshScoreboard2);
		scene.add(meshText1);
		scene.add(meshText2);
		this.arrObject.push({mesh: meshScoreboard1, name: "", type: "scoreboard"});
		this.arrObject.push({mesh: meshScoreboard2, name: "", type: "scoreboard"});
		this.arrObject.push({mesh: meshText1, name: "", type: "scoreboard"});
		this.arrObject.push({mesh: meshText2, name: "", type: "scoreboard"});
	};

	#putPlayerProfile(nameLeft, nameRight, color)
	{
		let materialBoardLeftFront;
		let geometryBoardLeftFront;
		let meshBoardLeftFront;

		let materialBoardRightFront;
		let geometryBoardRightFront;
		let meshBoardRightFront;
		
		let materialBoardLeftBack;
		let geometryBoardLeftBack;
		let meshBoardLeftBack;

		let materialBoardRightBack;
		let geometryBoardRightBack;
		let meshBoardRightBack;

		let height = 1.8;
		let width = 1.5;
		let depth = 0.2;
		let spacing = 2.5;

		materialBoardLeftFront	= new THREE.MeshPhysicalMaterial({color: color});
		geometryBoardLeftFront	= new THREE.BoxGeometry(width, height, depth);
		meshBoardLeftFront		= new THREE.Mesh(geometryBoardLeftFront, materialBoardLeftFront);

		materialBoardRightFront	= new THREE.MeshPhysicalMaterial({color: color});
		geometryBoardRightFront	= new THREE.BoxGeometry(width, height, depth);
		meshBoardRightFront		= new THREE.Mesh(geometryBoardRightFront, materialBoardRightFront);

		materialBoardLeftBack	= new THREE.MeshPhysicalMaterial({color: color});
		geometryBoardLeftBack	= new THREE.BoxGeometry(width, height, depth);
		meshBoardLeftBack		= new THREE.Mesh(geometryBoardLeftBack, materialBoardLeftBack);

		materialBoardRightBack	= new THREE.MeshPhysicalMaterial({color: color});
		geometryBoardRightBack	= new THREE.BoxGeometry(width, height, depth);
		meshBoardRightBack	= new THREE.Mesh(geometryBoardRightBack, materialBoardRightBack);

		meshBoardLeftFront.position.set(-spacing - width / 2 - 0.3, 1.6, -8.5);
		meshBoardRightFront.position.set(spacing + width / 2 + 0.3, 1.6, -8.5);

		meshBoardLeftBack.rotation.y = Math.PI;
		meshBoardLeftBack.position.set(-spacing - width / 2 - 0.3, 1.6, 8.5);
		meshBoardRightBack.rotation.y = Math.PI;
		meshBoardRightBack.position.set(spacing + width / 2 + 0.3, 1.6, 8.5);

		scene.add(meshBoardLeftFront);
		scene.add(meshBoardRightFront);
		scene.add(meshBoardLeftBack);
		scene.add(meshBoardRightBack);
		this.arrObject.push({mesh: meshBoardLeftFront, name: "", type: "profileBoard"});
		this.arrObject.push({mesh: meshBoardRightFront, name: "", type: "profileBoard"});
		this.arrObject.push({mesh: meshBoardLeftBack, name: "", type: "profileBoard"});
		this.arrObject.push({mesh: meshBoardRightBack, name: "", type: "profileBoard"});

		let canvasProfileNameLeft		= null;
		let contextProfileNameLeft		= null;
		let textureProfileNameLeft		= null;

		let canvasProfileNameRight		= null;
		let contextProfileNameRight	= null;
		let textureProfileNameRight	= null;

		canvasProfileNameLeft = document.createElement('canvas');
		contextProfileNameLeft = canvasProfileNameLeft.getContext('2d');
		canvasProfileNameLeft.width = 960;
		canvasProfileNameLeft.height = 540 / 2;
    	drawName(nameLeft, canvasProfileNameLeft, contextProfileNameLeft);
		textureProfileNameLeft = new THREE.CanvasTexture(canvasProfileNameLeft);

		canvasProfileNameRight = document.createElement('canvas');
		contextProfileNameRight = canvasProfileNameRight.getContext('2d');
		canvasProfileNameRight.width = 960;
		canvasProfileNameRight.height = 540 / 2;
    	drawName(nameRight, canvasProfileNameRight, contextProfileNameRight);
		textureProfileNameRight = new THREE.CanvasTexture(canvasProfileNameRight);

		let materialProfileLeft		= null;
		let materialProfileRight		= null;
		
		let geometryProfileLeftFront	= null;
		let meshProfileLeftFront		= null;
		let geometryProfileRightFront	= null;
		let meshProfileRightFront		= null;

		let geometryProfileLeftBack	= null;
		let meshProfileLeftBack		= null;
		let geometryProfileRightBack	= null;
		let meshProfileRightBack		= null;
		
		materialProfileLeft		= new THREE.MeshBasicMaterial({ map: textureProfileNameLeft });
		materialProfileRight		= new THREE.MeshBasicMaterial({ map: textureProfileNameRight });

		geometryProfileLeftFront	= new THREE.PlaneGeometry(width - 0.15, height - 0.15);
		meshProfileLeftFront		= new THREE.Mesh(geometryProfileLeftFront, materialProfileLeft);

		geometryProfileRightFront	= new THREE.PlaneGeometry(width - 0.15, height - 0.15);
		meshProfileRightFront		= new THREE.Mesh(geometryProfileRightFront, materialProfileRight);

		geometryProfileLeftBack	= new THREE.PlaneGeometry(width - 0.15, height - 0.15);
		meshProfileLeftBack		= new THREE.Mesh(geometryProfileLeftBack, materialProfileLeft);

		geometryProfileRightBack	= new THREE.PlaneGeometry(width - 0.15, height - 0.15);
		meshProfileRightBack		= new THREE.Mesh(geometryProfileRightBack, materialProfileRight);

		meshProfileLeftFront.position.set(-spacing - width / 2 - 0.325, 1.6, - 8.5 + depth / 2 + 0.01);
		meshProfileRightFront.position.set(spacing + width / 2 + 0.325, 1.6, - 8.5 + depth / 2 + 0.01);

		meshProfileLeftBack.rotation.y = Math.PI;
		meshProfileLeftBack.position.set(-spacing - width / 2 - 0.325, 1.6, 8.5 - depth / 2 - 0.01);
		meshProfileRightBack.rotation.y = Math.PI;
		meshProfileRightBack.position.set(spacing + width / 2 + 0.325, 1.6, 8.5 - depth / 2 - 0.01);

		scene.add(meshProfileLeftFront);
		scene.add(meshProfileRightFront);
		scene.add(meshProfileLeftBack);
		scene.add(meshProfileRightBack);
		this.arrObject.push({mesh: meshProfileLeftFront, name: "", type: "profileBoard"});
		this.arrObject.push({mesh: meshProfileRightFront, name: "", type: "profileBoard"});
		this.arrObject.push({mesh: meshProfileLeftBack, name: "", type: "profileBoard"});
		this.arrObject.push({mesh: meshProfileRightBack, name: "", type: "profileBoard"});
	};

	putVideoOnCanvas(nbImage, vNameNb)
	{
		this.#clearVideoCanvas();
		if (nbImage <= 0)
			return ;

		let startIndex = 0;
		let nbVideos = 1;
		path.sort(() => Math.random() - 0.5);

		// Create the canvas for the video
		videoCanvas = document.createElement('canvas');
		ctx = videoCanvas.getContext('2d');
		videoCanvas.width = 50 * 2.33 * 20;
		videoCanvas.height = 50;

		// Get the number of videos to display
		if (vNameNb && typeof(vNameNb) == 'number')
			nbVideos = vNameNb;
		if (vNameNb && typeof(vNameNb) == 'string')
			startIndex = getIndex(vNameNb);

		function getIndex(vNameNb)
		{
			for (let i = 0; i < path.length; i++)
			{
				if (path[i].name == vNameNb)
					return (i);
			}
			return (0);
		}

		// Fill the videoList with the videos
		for (let i = startIndex; i < (nbVideos + startIndex); i++)
		{
			if (path[i].onChoice == true && !(vNameNb && typeof(vNameNb) == 'string'))
			{
				startIndex++;
				continue ;
			}
			let videoTmp = null;
			videoTmp = new Video(path[i].src).video;
			videoTmp.addEventListener('loadeddata', () => {
				videoTmp.play();
				drawVideoOnCanvas();
			});
			videoList.push({video: videoTmp, imageWidth: 50 * 2.33, imageHeight: 50});
		}

		// Draw the video on the canvas
		function drawVideoOnCanvas()
		{
			if (videoCanvas)
			{
				ctx.clearRect(0, 0, videoCanvas.width, videoCanvas.height);
				if (nbVideos == 0)
					return ;
				let nbDraw = 0;
				let vIndex = 0;
				let y = 0;
				for (let x = 0; x < videoCanvas.width; x += (videoList[vIndex].imageWidth + spacingImages[nbImage]))
				{
					ctx.drawImage(videoList[vIndex].video, x, y, videoList[vIndex].imageWidth, videoList[vIndex].imageHeight);
					nbDraw++;
					if (nbVideos > 1)
						vIndex++;
					if (vIndex >= nbVideos)
						vIndex = 0;
					if (!(videoList && videoList[vIndex]))
						break ;
				}
				if (videoCanvasTexture)
					videoCanvasTexture.needsUpdate = true;
				requestAnimationFrame(drawVideoOnCanvas);
			}
		}

		// Create the material and the banner
		videoCanvasTexture = new THREE.CanvasTexture(videoCanvas);
		videoCanvasTexture.wrapS = THREE.RepeatWrapping;
		videoCanvasTexture.wrapT = THREE.RepeatWrapping;
		videoCanvasTexture.repeat.set(-1, 1);
		materialCanvas	= new THREE.MeshBasicMaterial({ map: videoCanvasTexture, side: THREE.BackSide , transparent: true});

		// Load the banner
		loader.load(files.bannerModel, (gltf) => {
			this.banner = gltf.scene.children[0];
			gltf = null;
			this.banner.material = materialCanvas;
			this.banner.position.y += 1.7;
			this.banner.rotation.x = (Math.PI);
			this.banner.rotation.y += -0.15;
			scene.add(this.banner);
			interval2 = setInterval(() => {
				this.banner.rotation.y += 0.001;
			}, 10);
		}, undefined, function ( error ) {
			console.error( error );
		} );
	};

	#clearVideoCanvas()
	{
		if (videoCanvas)
		{
			videoCanvas.remove();
			videoCanvas = null;
		}
		if (videoList)
		{
			videoList.forEach(elem => {
				elem.video.pause();
				elem.video.src = '';
				elem.video.removeAttribute('src');
				elem.video.load();
			})
		}
		videoList = [];
		if (videoCanvasTexture)
		{
			videoCanvasTexture.dispose();
			videoCanvasTexture = null;
		}
		if (materialCanvas)
		{
			materialCanvas.dispose();
			materialCanvas		= null;
		}
		if (interval2)
		{
			clearInterval(interval2);
			interval2 = null;
		}
		scene.remove(this.banner);
	};

	animationGoal(cordX, cordY, cordZ, nameObject)
	{
		this.#clearAnimationGoal();

		let objectList = [];

		if (nameObject == "triangle")
		{
			for (let i = 0; i < 6; i++)
				objectList.push(createTriangle(colorList[Math.floor(Math.random() * 100 % colorList.length)]));
		}
		else if (nameObject == "cylinder")
		{
			for (let i = 0; i < 6; i++)
				objectList.push(createCylinder(colorList[Math.floor(Math.random() * 100 % colorList.length)]));
		}
		else if (nameObject == "star")
		{
			for (let i = 0; i < 6; i++)
				objectList.push(createStar(colorList[Math.floor(Math.random() * 100 % colorList.length)]));
		}
		else if (nameObject == "box")
		{
			for (let i = 0; i < 6; i++)
				objectList.push(createBox(colorList[Math.floor(Math.random() * 100 % colorList.length)]));
		}
		else if (nameObject == "rectangle")
		{
			for (let i = 0; i < 6; i++)
				objectList.push(createRectangle(colorList[Math.floor(Math.random() * 100 % colorList.length)]));
		}
		else if (nameObject == "ring")
		{
			for (let i = 0; i < 6; i++)
				objectList.push(createRing(colorList[Math.floor(Math.random() * 100 % colorList.length)]));
		}

		for (let i = 0; i < objectList.length; i++)
		{
			objectList[i].position.set(cordX, cordY, cordZ);
			objectList[i].scale.set(0.2, 0.2, 0.2);
			
			if (Math.random() < 0.5)
				objectList[i].rotateX(Math.PI / 2);
			if (Math.random() < 0.5)
				objectList[i].rotateY(Math.PI / 2);
			if (Math.random() < 0.5)
				objectList[i].rotateZ(Math.PI / 2);
			
			scene.add(objectList[i]);
			this.arrObject.push({mesh: objectList[i], name: "object" + i, type: "goalObject"});
		}
		
		animateGoalObjectUpdate = true;
		if (cordY > 1.5)
			animateGoalObjectUp = true;
		else
			animateGoalObjectUp = false;
	};

	#clearAnimationGoal()
	{
		for (let i = 0; i < this.arrObject.length; i++)
		{
			if (this.arrObject[i].type == "goalObject")
			{
				if (this.arrObject[i].mesh.geometry)
					this.arrObject[i].mesh.geometry.dispose();
				if (this.arrObject[i].mesh.material)
					this.arrObject[i].mesh.material.dispose();
				scene.remove(this.arrObject[i].mesh);
				this.arrObject[i].mesh.geometry = null;
				this.arrObject[i].mesh.material = null;
				this.arrObject[i].mesh = null;
				this.arrObject.splice(i, 1);
				i--;
			}
		}
	}

	#animationGravityChanger(group, onTop)
	{
		let geometryGC			= new THREE.TorusGeometry(1.5, 0.05, 12, 24);
		let materialGC			= new THREE.MeshPhysicalMaterial({color: 0x00ff00});
		let ringGC				= new THREE.Mesh(geometryGC, materialGC);
		let landmarkGC			= group.children[0];
		let	speed				= 0.1;
		let interval			= null;

		ringGC.rotateX(-Math.PI / 2);
		ringGC.position.set(landmarkGC.position.x, landmarkGC.position.y, landmarkGC.position.z);
		ringGC.scale.set(0.2, 0.2, 0.2);
		materialGC.transparent = true;
		scene.add(ringGC);

		interval = setInterval(() => {
			if (onTop)
				ringGC.position.y -= speed;
			else
				ringGC.position.y += speed;
			materialGC.opacity -= 0.02;
			speed *= 0.90;
			if (materialGC.opacity == 0)
				clearInterval(interval);
		}, 10);
	};

	placeObject(listObject)
	{
		let	nbJumper = 0; 
		
		listObject = listObject.content;
		for (let i = 0; i < listObject.length; i++ )
		{
			if (listObject[i].type == 1)
			{
				this.#createGravityChanger(listObject[i].pos.x, listObject[i].pos.y, listObject[i].pos.z, listObject[i].name, listObject[i].isUp ? "jumperTop" : "jumperBottom", listObject[i].isUp);
				nbJumper++;
			}
			else if (listObject[i].type == 2)
				scene.add(this.#createWallObstacle(listObject[i].pos.x, listObject[i].pos.y, listObject[i].pos.z, listObject[i].isUp));
		}
	}

	activeJumper(name)
	{
		ball.changeGravity();
		for (let i = 0; this.arrObject && i < this.arrObject.length; i++)
		{
			if (this.arrObject[i].name == name)
			{
				if (this.arrObject[i].name == "jumperTop")
					this.#animationGravityChanger(this.arrObject[i].mesh, true);
				else
					this.#animationGravityChanger(this.arrObject[i].mesh, false);
			}
		}
	}

	#generateObstacle()
	{
		const wallPos = [
			{ x: 1, y: 0, z: 1, onTop: false},
			{ x: 1, y: 0, z: 1, onTop: true},
			{ x: -1, y: 0, z: 1, onTop: false},
			{ x: -1, y: 0, z: 1, onTop: true}
		];
		for (let i = 0; i < wallPos.length; i++)
		{
			if (Math.random() < 0.5)
				scene.add(this.#createWallObstacle(wallPos[i].x, wallPos[i].y, wallPos[i].z, wallPos[i].onTop));
		}

		const type = "gravityChanger";
		const typeNameBottom = "jumperBottom";
		const typeNameTop = "jumperTop";
		const jumperPos = [
			{ x: -1.5, y: 0.2, z: this.mapLength / 4, type: type, typeName: typeNameBottom, onTop: false},
			{ x: -1.5, y: 3.2, z: this.mapLength / 4, type: type, typeName: typeNameTop, onTop: true},
			{ x: 1.5, y: 0.2, z: this.mapLength / 4, type: type, typeName: typeNameBottom, onTop: false},
			{ x: 1.5, y: 3.2, z: this.mapLength / 4, type: type, typeName: typeNameTop, onTop: true},
			{ x: -1.5, y: 0.2, z: -this.mapLength / 4, type: type, typeName: typeNameBottom, onTop: false},
			{ x: -1.5, y: 3.2, z: -this.mapLength / 4, type: type, typeName: typeNameTop, onTop: true},
			{ x: 1.5, y: 0.2, z: -this.mapLength / 4, type: type, typeName: typeNameBottom, onTop: false},
			{ x: 1.5, y: 3.2, z: -this.mapLength / 4, type: type, typeName: typeNameTop, onTop: true}
		];
		for (let i = 0; i < jumperPos.length; i++)
		{
			if (Math.random() < 0.5)
			{
				this.#createGravityChanger(jumperPos[i].x, jumperPos[i].y, jumperPos[i].z, jumperPos[i].type + i, jumperPos[i].typeName, jumperPos[i].onTop);
				if (i % 2 == 0)
					i++;
			}
		}
	};

	update(ball)
	{
		for (let i = 0; this.arrObject && i < this.arrObject.length; i++)
		{
			if (this.arrObject[i].name == "wallLeft")
			{
				// Move the wall with the ball position
				if (ball.object.position.z < this.mapLength / 2 - 0.35 && ball.object.position.z > -this.mapLength / 2 + 0.35)
					this.arrObject[i].mesh.position.z = ball.object.position.z;
				if (ball.object.position.y >= 0.3 + 0.1 && ball.object.position.y <= 3 - 0.1)
					this.arrObject[i].mesh.position.y = ball.object.position.y;

				// Change the opacity of the wall
				let	diff = ball.object.position.x - this.arrObject[i].mesh.position.x - 0.1;
				if (diff > 2)
					this.arrObject[i].mesh.material.opacity = 0;
				else
					this.arrObject[i].mesh.material.opacity = 1 - (diff / 2);
			}
			else if (this.arrObject[i].name == "wallRight")
			{
				// Move the wall with the ball position
				if (ball.object.position.z < this.mapLength / 2 - 0.35 && ball.object.position.z > -this.mapLength / 2 + 0.35)
					this.arrObject[i].mesh.position.z = ball.object.position.z;
				if (ball.object.position.y >= 0.3 + 0.1 && ball.object.position.y <= 3 - 0.1)
					this.arrObject[i].mesh.position.y = ball.object.position.y;

				// Change the opacity of the wall
				let	diff = this.arrObject[i].mesh.position.x - ball.object.position.x - 0.1;
				if (diff > 2)
					this.arrObject[i].mesh.material.opacity = 0;
				else
					this.arrObject[i].mesh.material.opacity = 1 - (diff / 2);
			}
			if (this.arrObject[i].type == 'jumperBottom')
			{
				// Gravity changer animation
				for (let j = 0; j < 3; j++)
				{
					this.arrObject[i].mesh.children[j].rotation.x = Math.sin(Date.now() * 0.001 + (j - 2) * 5) * 0.1 + Math.PI / 2;
					this.arrObject[i].mesh.children[j].rotation.y = Math.sin(Date.now() * 0.001 + (j - 2) * 5) * 0.1 + Math.cos(Date.now() * 0.001) * 0.1;;
				}
			}
			else if (this.arrObject[i].type == 'jumperTop')
			{
				// Gravity changer animation
				for (let j = 0; j < 3; j++)
				{
					this.arrObject[i].mesh.children[j].rotation.x = Math.sin(Date.now() * 0.001 + (j - 2) * 5) * 0.1 + Math.PI / 2;
					this.arrObject[i].mesh.children[j].rotation.y = Math.sin(Date.now() * 0.001 + (j - 2) * 5) * 0.1 + Math.cos(Date.now() * 0.001) * 0.1;;
				}
			}
			if (animateGoalObjectUpdate && this.arrObject[i].type == "goalObject")
				this.#updateGoalAnimation(this.arrObject[i], animationSpeed += 0.003);
		}
	};

	#updateGoalAnimation(object, speed)
	{
		object.mesh.rotation.x += 0.03;
		object.mesh.rotation.y += 0.03;
		object.mesh.rotation.z += 0.03;

		object.mesh.scale.x -= 0.001 * speed;
		object.mesh.scale.y -= 0.001 * speed;
		object.mesh.scale.z -= 0.001 * speed;

		if (object.name == "object0")
		{
			object.mesh.position.x += 0.05 * speed;
			if (animateGoalObjectUp)
				object.mesh.position.y -= 0.05 * speed;
			else
				object.mesh.position.y += 0.05 * speed;
			object.mesh.position.z += 0.02 * speed;
		}
		else if (object.name == "object1")
		{
			object.mesh.position.x -= 0.03 * speed;
			if (animateGoalObjectUp)
				object.mesh.position.y -= 0.04 * speed;
			else
				object.mesh.position.y += 0.04 * speed;
			object.mesh.position.z -= 0.05 * speed;
		}
		else if (object.name == "object2")
		{
			object.mesh.position.x += 0.04 * speed;
			if (animateGoalObjectUp)
				object.mesh.position.y -= 0.03 * speed;
			else
				object.mesh.position.y += 0.03 * speed;
			object.mesh.position.z += 0.06 * speed;
		}
		else if (object.name == "object3")
		{
			object.mesh.position.x -= 0.06 * speed;
			if (animateGoalObjectUp)
				object.mesh.position.y -= 0.02 * speed;
			else
				object.mesh.position.y += 0.02 * speed;
			object.mesh.position.z += 0.05 * speed;
		}
		else if (object.name == "object4")
		{
			object.mesh.position.x += 0.03 * speed;
			if (animateGoalObjectUp)
				object.mesh.position.y -= 0.04 * speed;
			else
				object.mesh.position.y += 0.04 * speed;
			object.mesh.position.z += 0.03 * speed;
		}
		else if (object.name == "object5")
		{
			object.mesh.position.x -= 0.05 * speed;
			if (animateGoalObjectUp)
				object.mesh.position.y -= 0.03 * speed;
			else
				object.mesh.position.y += 0.03 * speed;
			object.mesh.position.z -= 0.04 * speed;
		}
	};

	updateScore(name, score)
	{
		setTimeout(() => {
			if (name == "player")
				score.player++;
			else if (name == "opponent")
				score.opponent++;
			drawScore(score);
			textureTextScore.needsUpdate = true;
		}, 200);
	}

	resetPosWalls()
	{
		for (let i = 0; i < this.arrObject.length; i++)
		{
			if (this.arrObject[i].name == "wallLeft")
			{
				this.arrObject[i].mesh.position.set(-3.5, 0.4, -length/2);
				this.arrObject[i].mesh.material.opacity = 0.5;
			}
			else if (this.arrObject[i].name == "wallRight")
			{
				this.arrObject[i].mesh.position.set(3.5, 0.4, -length/2);
				this.arrObject[i].mesh.material.opacity = 0.5;
			}
		}
	}

	reCreate(name)
	{
		this.#clearAnimationGoal();
		animateGoalObjectUpdate = false;
		animationSpeed = 0.02;

		this.updateScore(name, this.score);
		ball.resetPosBall();
		this.resetPosWalls();
		player.resetScaleplayers();
		player.reserCameraPlayer();
	};
};

function drawScore(score)
{
	contextTextScore.clearRect(0, 0, canvasTextScore.width, canvasTextScore.height);
	contextTextScore.fillStyle = "white";
	contextTextScore.font = "bold 350px Arial";
	contextTextScore.textAlign = "center";
	contextTextScore.fillText(score.player + " - " + score.opponent, canvasTextScore.width / 2, canvasTextScore.height - canvasTextScore.height / 4);
};

function drawName(name, canvas, context)
{
	context.clearRect(0, 0, canvas.width, canvas.height);
	context.fillStyle = "white";
	context.font = "bold 175px Poppins";
	context.textAlign = "center";
	context.fillText(name, canvas.width / 2, canvas.height - canvas.height / 4);
}

function createTriangle(colorO) {
	const shape = new THREE.Shape();
	shape.moveTo(0, 1);
	shape.lineTo(-1, -1);
	shape.lineTo(1, -1);
	shape.lineTo(0, 1);
	const extrudeSettings = {
		depth: 0.5,
		bevelEnabled: false
	};

	const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
	const material = new THREE.MeshBasicMaterial({ color: colorO });
	return new THREE.Mesh(geometry, material);
}

function createCylinder(colorO) {
	const geometry = new THREE.CylinderGeometry(0.5, 0.5, 1, 32);
	const material = new THREE.MeshBasicMaterial({ color: colorO });
	return new THREE.Mesh(geometry, material);
}

function createStar(colorO) {
	const shape = new THREE.Shape();
	const outerRadius = 0.5;
	const innerRadius = 0.2;
	const spikes = 5;

	for (let i = 0; i < spikes * 2; i++) {
		const radius = i % 2 === 0 ? outerRadius : innerRadius;
		const angle = (i / (spikes * 2)) * Math.PI * 2;
		shape.lineTo(Math.cos(angle) * radius, Math.sin(angle) * radius);
	}
	shape.closePath();

	const extrudeSettings = {
		depth: 0.5,
		bevelEnabled: false
	};

	const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
	const material = new THREE.MeshBasicMaterial({ color: colorO });
	return new THREE.Mesh(geometry, material);
}

function createBox(colorO) {
	const geometry = new THREE.BoxGeometry(1, 1, 1);
	const material = new THREE.MeshBasicMaterial({ color: colorO });
	return new THREE.Mesh(geometry, material);
}

function createRectangle(colorO) {
	const geometry = new THREE.BoxGeometry(1, 2, 0.5);
	const material = new THREE.MeshBasicMaterial({ color: colorO });
	return new THREE.Mesh(geometry, material);
}

function createRing(colorO) {
	const geometry = new THREE.TorusGeometry(0.5, 0.2, 16, 100);
	const material = new THREE.MeshBasicMaterial({ color: colorO });
	return new THREE.Mesh(geometry, material);
}

export { Map, createStar, createBox, createRectangle, createRing, colorList };
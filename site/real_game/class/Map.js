/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Map.js                                             :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: hubourge <hubourge@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/08/20 14:52:55 by hubourge          #+#    #+#             */
/*   Updated: 2024/08/26 20:21:15 by hubourge         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// import * as THREE from '/static/javascript/three/build/three.module.js';
import * as THREE from '/node_modules/three/build/three.module.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { Video } from './Video.js';

const loader = new GLTFLoader();

let	scene				= null;
// Plane
let	geometryPlane		= null;
let	materialPlane		= null;
let	meshPlane			= null;
let textureLoaderPlane	= null;
let texturePlane		= null;
// Border wall
let geometryWall		= null;
let materialWall		= null;
let meshWall			= null;
// Gravity changer
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
// Wall obstacle
let geometryWallObs		= null;
let materialWallObs 	= null;
let meshWallObs			= null;
// Banner
let videoCanvas			= null;
let video1				= null;
let video2				= null;
let video3				= null;
let video4				= null;
let video5				= null;
let videoCanvasTexture	= null;
let materialCanvas		= null;
// Gravity changer animation
let geometryGC			= null;
let materialGC			= null;
let ringGC				= null;
let landmarkGC			= null;
let interval			= null;


class Map
{
	arrObject = [];
	ballObject = null;
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
	ballIsOnJumper = {
		can: true
	};

	static create()
	{
		
	}

	static dispose()
	{
		// Plane
		// Border wall
		// Gravity changer
		// Wall obstacle
		// Banner
		// Gravity changer animation
	}	
	constructor(sceneToSet, length, obstacles)
	{
		scene = sceneToSet;
		this.centerPos.x = 0;
		this.centerPos.y = 0.15;
		this.centerPos.z = -length / 2 + length / 2;
		this.mapLength = length;
		scene.add(this.#createPlanes(7.5, length, -(Math.PI / 2), "planeBottom", true, '/textures/pastel.jpg'));
		scene.add(this.#createPlanes(7.5, length, (Math.PI / 2), "planeTop", false, '/textures/pastel.jpg'));
		scene.add(this.#createWall(-3.5, 0.4, -length/2, "wallLeft"));
		scene.add(this.#createWall(3.5, 0.4, -length/2, "wallRight"));
		this.#createBanner();
		if (obstacles)
			this.#generateObstacle();

		/***** JUST FOR TEST *****/
		document.addEventListener('keypress', (e) => {
			if (e.key == 'q')
			{
				for (let i = 0; i < this.arrObject.length; i++)
				{
					if (this.arrObject[i].type == 'jumperTop')
						this.#animationGravityChanger(this.arrObject[i].mesh, true)
					if (this.arrObject[i].type == 'jumperBottom')
						this.#animationGravityChanger(this.arrObject[i].mesh, false)
				}
			}
		})
		/*************************/
	};

	#createPlanes(x, y, rot, name, isBottom, visual)
	{
		for (let i = 0; i < this.arrObject.length; i++)
		{
			if (this.arrObject[i].name == name)
				throw Error("Name already exist.");
		}

		geometryPlane	= new THREE.PlaneGeometry(x, y);

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

	#createWall(x, y, z, name)
	{
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
		geometryWallObs	= new THREE.BoxGeometry(size, 0.5, 0.1);
		materialWallObs = new THREE.MeshPhysicalMaterial({color: 0xaaaafe});
		meshWallObs		= new THREE.Mesh(geometryWallObs, materialWallObs);

		if (onTop)
			meshWallObs.position.set(x, this.playerLimits.up - 0.1, y);
		else
			meshWallObs.position.set(x, 0.4, y);
		return (meshWallObs);
	}

	/* Todo (Hugo) :
		- Faire une zone Player banner (importer un model blender)
		- Faire une zone pour les pub (s'inspirer de theFinals) (ok)
		
		- Effet gros pixel (ok)
		- Effet de lumière en 2d
		- Preparer une animation pour le but
	*/
	#createBanner()
	{
		// Create canvas
		videoCanvas = document.createElement('canvas');
		const ctx = videoCanvas.getContext('2d');
		videoCanvas.width = 100 * 2.33 * 20;
		videoCanvas.height = 100;
		
		let path = [
			'../textures/video/goal2.webm',
			'../textures/video/pingpong.mp4',
			'../textures/video/catch.mp4',
			'../textures/video/easteregg.webm',
			'../textures/video/fortnite.mp4',
		]
		path.sort(() => Math.random() - 0.5);

		let vSettings = [];

		let spacingImages = [
			100 * 2.33 * 10 - (100 * 2.33),   // 2 images 
			100 * 2.33 * 5 - (100 * 2.33),    // 4 images
			100 * 2.33 * 2.5 - (100 * 2.33),  // 8 images
			100 * 2.33 * 1.25 - (100 * 2.33), // 16 images
		];
		
		const nbVideos = 5; // 1, 2, 3, 4, 5
		const nbImages = 3; // 0 = 2 img, 1 = 4 img, 2 = 8 img, 3 = 16 img
		const startIndex = ((Math.random() * (path.length - nbVideos)).toFixed(0)) % path.length;
		
		for (let i = startIndex; i < nbVideos + startIndex; i++)
		{
			let videoTmp = new Video(path[i]).video;
			videoTmp.addEventListener('loadeddata', () => {
				videoTmp.play();
				drawVideoOnCanvas();
			});
			vSettings.push({video: videoTmp, imageWidth: 100 * 2.33, imageHeight: 100});
		}

		function drawVideoOnCanvas() {
			ctx.clearRect(0, 0, videoCanvas.width, videoCanvas.height);
	
			if (nbVideos == 0)
				return ;
			let nbDraw = 0;
			let vIndex = 0;
			let y = 0;
			for (let x = 0; x < videoCanvas.width; x += (vSettings[vIndex].imageWidth + spacingImages[nbImages]))
			{
				ctx.drawImage(vSettings[vIndex].video, x, y, vSettings[vIndex].imageWidth, vSettings[vIndex].imageHeight);
				nbDraw++;
				if (nbVideos > 1)
					vIndex++;
				if (vIndex >= nbVideos)
					vIndex = 0;
			}
			
			videoCanvasTexture.needsUpdate = true;
			requestAnimationFrame(drawVideoOnCanvas);
		}

		// Create texture
		videoCanvasTexture = new THREE.CanvasTexture(videoCanvas);
		videoCanvasTexture.wrapS = THREE.RepeatWrapping;
		videoCanvasTexture.wrapT = THREE.RepeatWrapping;
		videoCanvasTexture.repeat.set(-1, 1);

		materialCanvas = new THREE.MeshBasicMaterial({ map: videoCanvasTexture, side: THREE.BackSide , transparent: true});

		// videoCanvas.innerHTML = 'Test';																	 // ca sert ca eddy ? Repond stp ?
		loader.load( '../blender/exported/banner.glb', (gltf) => {
			this.banner = gltf.scene.children[0];
			this.banner.material = materialCanvas;
			this.banner.position.y += 1.7;
			this.banner.rotation.x = (Math.PI);
			this.banner.rotation.y += -0.15;
			scene.add(gltf.scene);
			setInterval(() => {
				this.banner.rotation.y += 0.001;
			}, 10);
		}, undefined, function ( error ) {
			console.error( error );
		} );

        function animate() {
            requestAnimationFrame(animate);
        }
        animate();
	}
	
	#animationGravityChanger(group, onTop)
	{
		geometryGC		= new THREE.TorusGeometry(1.5, 0.05, 12, 24);
		materialGC		= new THREE.MeshPhysicalMaterial({color: 0x00ff00});
		ringGC			= new THREE.Mesh(geometryGC, materialGC);
		landmarkGC		= group.children[0];
		let	speed		= 0.1;

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
		for (let i = 0; i < this.arrObject.length; i++)
		{
			if (this.arrObject[i].name == "wallLeft")
			{
				// Move the wall with the ball position
				if (ball.object.position.z < this.mapLength / 2 - 0.35 && ball.object.position.z > -this.mapLength / 2 + 0.35)
					this.arrObject[i].mesh.position.z = ball.object.position.z;
				if (ball.object.position.y > 0.4 + 0.1 && ball.object.position.y < 3.2)
					this.arrObject[i].mesh.position.y = ball.object.position.y - 0.1;
				
				// Change the opacity of the wall
				let	diff = ball.object.position.x - this.arrObject[i].mesh.position.x - 0.1;
				if (diff > 2)
					this.arrObject[i].mesh.material.opacity = 0;
				else
					this.arrObject[i].mesh.material.opacity = 1 - (diff / 2);
			}
			if (this.arrObject[i].name == "wallRight")
			{
				// Move the wall with the ball position
				if (ball.object.position.z < this.mapLength / 2 - 0.35 && ball.object.position.z > -this.mapLength / 2 + 0.35)
					this.arrObject[i].mesh.position.z = ball.object.position.z;
				if (ball.object.position.y > 0.4 + 0.1 && ball.object.position.y < 3.2)
					this.arrObject[i].mesh.position.y = ball.object.position.y - 0.1;

				// Change the opacity of the wall
				let	diff = this.arrObject[i].mesh.position.x - ball.object.position.x - 0.1;
				if (diff > 2)
					this.arrObject[i].mesh.material.opacity = 0;
				else
					this.arrObject[i].mesh.material.opacity = 1 - (diff / 2);
			}
			if (this.arrObject[i].type == 'jumperBottom')
			{
				const cylinder	= this.arrObject[i].mesh.children[5];
				const distance	= ball.object.position.distanceTo(cylinder.position);
				const speed		= 0.1;

				// Detect if the ball is on the jumper
				if (distance < 0.25 && this.ballIsOnJumper.can)
				{
					this.ballIsOnJumper.can = false;
					ball.changeGravity(this.ballIsOnJumper);
					this.#animationGravityChanger(this.arrObject[i].mesh, false);
				}

				// Gravity changer animation
				for (let j = 0; j < 3; j++)
				{
					this.arrObject[i].mesh.children[j].rotation.x = Math.sin(Date.now() * 0.001 + (j - 2) * 5) * 0.1 + Math.PI / 2;
					this.arrObject[i].mesh.children[j].rotation.y = Math.sin(Date.now() * 0.001 + (j - 2) * 5) * 0.1 + Math.cos(Date.now() * 0.001) * 0.1;;
				}
			}
			if (this.arrObject[i].type == 'jumperTop')
			{
				const cylinder	= this.arrObject[i].mesh.children[5];
				const distance	= ball.object.position.distanceTo(cylinder.position);
				const speed		= 0.1;
				
				// Detect if the ball is on the jumper
				if (distance < 0.4 && this.ballIsOnJumper.can)
				{
					this.ballIsOnJumper.can = false;
					ball.changeGravity(this.ballIsOnJumper);
					this.#animationGravityChanger(this.arrObject[i].mesh, true);
				}

				// Gravity changer animation
				for (let j = 0; j < 3; j++)
				{
					this.arrObject[i].mesh.children[j].rotation.x = Math.sin(Date.now() * 0.001 + (j - 2) * 5) * 0.1 + Math.PI / 2;
					this.arrObject[i].mesh.children[j].rotation.y = Math.sin(Date.now() * 0.001 + (j - 2) * 5) * 0.1 + Math.cos(Date.now() * 0.001) * 0.1;;
				}
			}
		}
	};
};

export { Map };
/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   3d.js                                              :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: edbernar <edbernar@student.42angouleme.    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/09/13 13:59:46 by edbernar          #+#    #+#             */
/*   Updated: 2024/10/03 21:15:40 by edbernar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { createStar, createBox, createRectangle, createRing, colorList } from '/static/javascript/multiOnlineGame/Map.js'
import * as THREE from '/static/javascript/three/build/three.module.js'
import { files } from '/static/javascript/filesLoader.js';

let 	actualBarSelecor	= null;
let 	actualGoalSelecter	= null;
let		lastSelected		= null;
let		lastSelectedGoal	= null;
const	availableSkins	=	[
	{id: 0, color: 0xff53aa, texture: null},
	{id: 1, color: 0xaa24ea, texture: null},
	{id: 2, color: 0x2c9c49, texture: null},
	{id: 3, color: 0x101099, texture: null},
	{id: 4, color: null, texture: null},
	{id: 5, color: null, texture: null},
	{id: 6, color: null, texture: null},
	{id: 7, color: null, texture: null},
];
const	availableGoals	=	[
	createStar,
	createBox,
	createRectangle,
	createRing
]

class barSelecter
{
	scene			= null;
	renderer		= null;
	camera			= null;
	spotLight		= new THREE.SpotLight(0xffffff, 5);
	selected		= lastSelected ? lastSelected : availableSkins[0];
	bar				= this.createBarPlayer(this.selected.color ? this.selected.color : this.selected.texture);
	boundChangeSkin = this.changeSkin.bind(this);


	constructor(div)
	{
		const	pos		= div.getBoundingClientRect();
		this.scene		= new THREE.Scene();
		this.renderer	= new THREE.WebGLRenderer({antialias: true});
		this.camera		= new THREE.PerspectiveCamera(60, (pos.width - 10) / (pos.height - 10));
	
		if (!lastSelected)
			lastSelected = availableSkins[0];
		this.scene.background = new THREE.Color(0x020202);
		this.renderer.setSize(pos.width - 10, pos.height - 10);
		this.scene.add(this.spotLight);
		this.camera.position.set(0.7, 0.5, 0.7);
		this.spotLight.position.set(0.7, 0.5, 0.7);
		div.appendChild(this.renderer.domElement);
		actualBarSelecor = this;
		this.scene.add(this.bar);
		actualBarSelecor.camera.lookAt(actualBarSelecor.bar.position);
		this.spotLight.target = this.bar;
		this.spotLight.lookAt(this.bar.position);
		this.renderer.setAnimationLoop(this.#loop);
		availableSkins[4].texture = files.skinOneTexture;
		availableSkins[5].texture = files.skinTwoTexture;
		availableSkins[6].texture = files.skinThreeTexture;
		availableSkins[7].texture = files.skinFourTexture;
		div.addEventListener('click', () => {
			const	popup	=	document.getElementById('popup-skin-selector');
			const	skins	=	document.getElementsByClassName('color-box-skin');
		
			popup.style.display = 'flex';
			for (let i = 0; i < skins.length; i++)
			{
				skins[i].setAttribute('skinId', availableSkins[i].id);
				if (availableSkins[i].color != null)
					skins[i].style.backgroundColor = `#${availableSkins[i].color.toString(16)}`;
				else
					skins[i].style.backgroundImage = `url("${availableSkins[i].texture}")`
				skins[i].removeEventListener('click', this.boundChangeSkin);
				skins[i].addEventListener('click', this.boundChangeSkin);
			}
			popup.removeEventListener('click', this.hideSkinSelector);
			popup.addEventListener('click', this.hideSkinSelector);
		});
	}

	hideSkinSelector(event)
	{
		const	popup	=	document.getElementById('popup-skin-selector');

		if (event.target.getAttribute('id') == 'popup-skin-selector')
			popup.style.display = 'none';
	}

	changeSkin (event)
	{
		const	popup	=	document.getElementById('popup-skin-selector');
	
		const id = event.target.getAttribute('skinId');
		popup.style.display = 'none';
		this.bar.material.dispose();
		lastSelected = availableSkins[id];
		if (availableSkins[id].color != null)
			this.bar.material = new THREE.MeshPhysicalMaterial({color: availableSkins[id].color});
		else
			this.bar.material = new THREE.MeshPhysicalMaterial({map: new THREE.TextureLoader().load(availableSkins[id].texture)});
		this.selected = availableSkins[id];
	}

	createBarPlayer(color)
	{
		const	geometry	= new THREE.BoxGeometry(1, 0.1, 0.1);
		let		material	= null;

		if (typeof(color) == 'number')
			material = new THREE.MeshPhysicalMaterial({color: color});
		else
			material = new THREE.MeshPhysicalMaterial({map: new THREE.TextureLoader().load(color)});
		const	mesh		= new THREE.Mesh(geometry, material);

		mesh.castShadow = true;
		return (mesh);
	}

	#loop()
	{
		actualBarSelecor.renderer.render(actualBarSelecor.scene, actualBarSelecor.camera);
		actualBarSelecor.bar.rotation.y += 0.005;
	}

	dispose()
	{
		if (this.renderer)
		{
			this.renderer.dispose();
			this.renderer.forceContextLoss();
		}
		this.renderer = null;
		if (this.scene)
		{
			this.scene.children.forEach(child => {
				if (child.geometry)
					child.geometry.dispose();
				if (child.material)
					child.material.dispose();
				if (child.texture)
					child.texture.dispose();
				this.scene.remove(child);
			});
		}
		this.scene = null;
		actualBarSelecor = null;
	}
}

class goalSelecter
{
	scene					= null;
	renderer				= null;
	camera					= null;
	selected				= lastSelectedGoal ? lastSelectedGoal : availableGoals[0];
	ambiantLight			= new THREE.AmbientLight(0xffffff, 35);
	goal					= this.selected(colorList[Math.floor(Math.random() * 100 % colorList.length)], true);
	rendererList			= [];
	sceneList				= [];
	cameraList				= [];
	div						= null;
	boundChangeGoal			= this.changeGoal.bind(this);
	boundhideGoalSelector	= this.hideGoalSelector.bind(this);
	boundshowGoals			= this.showGoals.bind(this);

	constructor(div)
	{
		const	pos		= div.getBoundingClientRect();
		this.scene		= new THREE.Scene();
		this.renderer	= new THREE.WebGLRenderer({antialias: true});
		this.camera		= new THREE.PerspectiveCamera(60, (pos.width - 10) / (pos.height - 10));
	
		this.div = div;
		lastSelectedGoal = this.selected;
		this.scene.background = new THREE.Color(0x020202);
		this.renderer.setSize(pos.width - 10, pos.height - 10);
		this.scene.add(this.ambiantLight);
		this.camera.position.set(1.5, 0.5, 1.5);
		div.appendChild(this.renderer.domElement);
		actualGoalSelecter = this;
		this.scene.add(this.goal);
		this.camera.lookAt(actualGoalSelecter.goal.position);
		this.renderer.setAnimationLoop(this.#loop.bind(this));
		div.removeEventListener('click', this.boundshowGoals);
		div.addEventListener('click', this.boundshowGoals);
	}

	showGoals()
	{
		const	popup	=	document.getElementById('popup-goal-selector');
		const	goal	=	document.getElementsByClassName('color-box-goal');
	
		popup.style.display = 'flex';
		for (let i = 0; i < goal.length; i++)
		{
			const	canvas = goal[i].getElementsByTagName('canvas');

			for (let j = 0; j < canvas.length; j++)
				canvas[j].remove();
			goal[i].setAttribute('goalId', i);
			goal[i].appendChild(this.showObject(availableGoals[i], goal[i].getBoundingClientRect()));
			goal[i].removeEventListener('click', this.boundChangeGoal);
			goal[i].addEventListener('click', this.boundChangeGoal);
		}
		popup.removeEventListener('click', this.boundhideGoalSelector);
		popup.addEventListener('click', this.boundhideGoalSelector);
	};

	showObject(func, pos)
	{
		const	scene		= new THREE.Scene();
		const	renderer	= new THREE.WebGLRenderer({antialias: true});
		const	camera		= new THREE.PerspectiveCamera(60, (pos.width - 5) / (pos.height - 5));
		const	mesh		= func(colorList[Math.floor(Math.random() * 100 % colorList.length)]);
		const	spotLight	= new THREE.SpotLight(0xffffff, 5000);
		
		renderer.setSize(pos.width - 5, pos.height - 5);
		scene.add(mesh);
		camera.position.set(1.5, 1.5, 1.5);
		spotLight.position.set(1.5, 1.5, 1.5);
		spotLight.target = mesh;
		camera.lookAt(mesh.position);
		scene.add(spotLight);
		scene.background = new THREE.Color(0x1a1a1a);
		this.sceneList.push(scene);
		this.rendererList.push(renderer);
		this.cameraList.push(camera);
		return (renderer.domElement)
	}

	changeGoal(event)
	{
		const	popup	=	document.getElementById('popup-goal-selector');
	
		const id = event.target.parentElement.getAttribute('goalId');
		popup.style.display = 'none';
		lastSelectedGoal = availableGoals[id];
		this.selected = availableGoals[id];
		if (this.scene && this.scene.children && this.scene.children.length > 1)
		{
			this.scene.children[1].geometry.dispose();
			this.scene.children[1].material.dispose();
			this.scene.remove(this.scene.children[1]);
		}
		this.goal = this.selected(colorList[Math.floor(Math.random() * 100 % colorList.length)], true);
		this.scene.add(this.goal);
		this.camera.lookAt(this.goal.position);
		this.disposeGoalSelector();
	}

	hideGoalSelector(event)
	{
		const	popup	=	document.getElementById('popup-goal-selector');

		if (event.target.getAttribute('id') == 'popup-goal-selector')
		{
			this.disposeGoalSelector();
			popup.style.display = 'none';
		}
	}
	
	disposeGoalSelector()
	{
		const	colorBoxGoal	=	document.getElementsByClassName('color-box-goal');


		for (let i = colorBoxGoal.length - 1; i >= 0; i--)
		{
			const	canvas = colorBoxGoal[i].getElementsByTagName('canvas');

			for (let j = 0; j < canvas.length; j++)
				canvas[j].remove();
			if (this.rendererList && this.rendererList[i])
			{
				this.rendererList[i].dispose();
				this.rendererList[i].forceContextLoss();
				this.sceneList[i].children.forEach(child => {
					if (child.geometry)
						child.geometry.dispose();
					if (child.material)
						child.material.dispose();
					if (child.texture)
						child.texture.dispose();
					this.scene.remove(child);
				});
				this.rendererList.splice(i, 1);
				this.sceneList.splice(i, 1);
				this.cameraList.splice(i, 1);
			}
		}
	}

	#loop()
	{
		actualGoalSelecter.goal.rotation.y += 0.01;
		actualGoalSelecter.goal.rotation.x += 0.01;
		actualGoalSelecter.renderer.render(actualGoalSelecter.scene, actualGoalSelecter.camera);
		for (let i = 0; this.rendererList && i < this.rendererList.length; i++)
		{
			this.sceneList[i].children[0].rotation.y -= 0.01;
			this.sceneList[i].children[0].rotation.x += 0.01;
			this.rendererList[i].render(this.sceneList[i], this.cameraList[i]);
		}
	}

	dispose()
	{
		this.disposeGoalSelector();
		if (this.renderer)
		{
			this.renderer.dispose();
			this.renderer.forceContextLoss();
		}
		if (this.rendererList)
		{
			for (let i = 0; i < this.rendererList.length; i++)
			{
				this.rendererList[i].dispose();
				this.rendererList[i].forceContextLoss();
			}
		}
		this.renderer = null;
		if (this.scene)
		{
			this.scene.children.forEach(child => {
				if (child.geometry)
					child.geometry.dispose();
				if (child.material)
					child.material.dispose();
				if (child.texture)
					child.texture.dispose();
				this.scene.remove(child);
			});
		}
		this.scene = null;
		actualGoalSelecter = null;
		this.div.removeEventListener('click', this.boundshowGoals);
	}
}

export { barSelecter, goalSelecter, lastSelected, availableSkins, lastSelectedGoal, availableGoals };
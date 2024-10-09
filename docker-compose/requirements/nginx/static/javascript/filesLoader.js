/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   filesLoader.js                                     :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: madegryc <madegryc@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/09/29 22:36:43 by edbernar          #+#    #+#             */
/*   Updated: 2024/10/09 18:06:05 by madegryc         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

const	url_files = {
	lampModel: '/static/models3D/homePage/lamp.glb',
	plantModel: '/static/models3D/homePage/plant.glb',
	gameboyModel: '/static/models3D/homePage/gameboy.glb',
	tvModel: '/static/models3D/homePage/tv.glb',
	bannerModel: '/static/models3D/multiOnlineGame/banner.glb',
	infinitPlane: '/static/models3D/homePage/infinitPlane.glb',

	pongVideo: '/static/video/homePage/pong.mp4',
	notLoginVideo: '/static/video/homePage/notLogin.webm',
	easterEggVideo: '/static/video/homePage/easteregg.webm',

	goalVideoPub: '/static/video/multiOnlineGamePage/goal2.webm',
	easterEggVideoPub: '/static/video/multiOnlineGamePage/easteregg.webm',
	outstandingVideoPub: '/static/video/multiOnlineGamePage/outstanding.webm',
	pingVideoPub: '/static/video/multiOnlineGamePage/pingpong.mp4',
	catchVideoPub: '/static/video/multiOnlineGamePage/catch.mp4',
	fortniteVideoPub: '/static/video/multiOnlineGamePage/fortnite.mp4',

	wallTexture: '/static/img/multiOnlineGamePage/wallTexture.jpg',
	planeTexture: '/static/img/multiOnlineGamePage/pastel.jpg',
	skinOneTexture: {
		left: '/static/img/skin/1/left.jpg',
		right: '/static/img/skin/1/right.jpg',
		top: '/static/img/skin/1/top.jpg',
		bottom: '/static/img/skin/1/bottom.jpg',
		front: '/static/img/skin/1/front.jpg',
		back: '/static/img/skin/1/back.jpg',
		show: '/static/img/skin/1/back.jpg',
	},
	skinTwoTexture: {
		left: '/static/img/skin/2/left.jpg',
		right: '/static/img/skin/2/right.jpg',
		top: '/static/img/skin/2/top.jpg',
		bottom: '/static/img/skin/2/bottom.jpg',
		front: '/static/img/skin/2/front.jpg',
		back: '/static/img/skin/2/back.jpg',
		show: '/static/img/skin/2/back.jpg',
	},
	skinThreeTexture: {
		left: '/static/img/skin/3/left.jpg',
		right: '/static/img/skin/3/right.jpg',
		top: '/static/img/skin/3/top.jpg',
		bottom: '/static/img/skin/3/bottom.jpg',
		front: '/static/img/skin/3/front.jpg',
		back: '/static/img/skin/3/back.jpg',
		show: '/static/img/skin/3/back.jpg',
	},
	skinFourTexture: {
		left: '/static/img/skin/4/left.jpg',
		right: '/static/img/skin/4/right.jpg',
		top: '/static/img/skin/4/top.jpg',
		bottom: '/static/img/skin/4/bottom.jpg',
		front: '/static/img/skin/4/front.jpg',
		back: '/static/img/skin/4/back.jpg',
		show: '/static/img/skin/4/back.jpg',
	},
}

let	files = {
}

function sleep(ms)
{
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function loadFiles()
{
	const	percentText	=	document.getElementById('percentLoad');
	const	loadBar		=	document.getElementsByClassName('loading-bar')[0];

	window.addEventListener('beforeunload', () => {
		Object.values(files).forEach((file) => {
			URL.revokeObjectURL(file);
		});
	});
	Object.entries(url_files).forEach(([key, value]) => {
		if (typeof value === 'object')
		{
			files[key] = {};
			Object.entries(value).forEach(([k, v]) => {
				fetch(v)
				.then(response => response.blob())
				.then(blob => {
					files[key][k] = URL.createObjectURL(blob);
				});
			});
			return;
		}
		fetch(value)
		.then(response => response.blob())
		.then(blob => {
			files[key] = URL.createObjectURL(blob);
		});
	});
	while (Object.values(files).length < Object.values(url_files).length)
	{
		const	value = Math.round(Object.values(files).length * 100 / Object.values(url_files).length) + '%'
		percentText.innerText = value;
		loadBar.style.width = value;
		await sleep(50);
	}
}

export { files, loadFiles };
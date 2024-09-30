/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   filesLoader.js                                     :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: edbernar <edbernar@student.42angouleme.    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/09/29 22:36:43 by edbernar          #+#    #+#             */
/*   Updated: 2024/09/30 23:08:59 by edbernar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

const	url_files = {
	lampModel: '/static/models3D/homePage/lamp.glb',
	plantModel: '/static/models3D/homePage/plant.glb',
	gameboyModel: '/static/models3D/homePage/gameboy.glb',
	tvModel: '/static/models3D/homePage/tv.glb',
	bannerModel: '/static/models3D/multiOnlineGame/banner.glb',

	pongVideo: '/static/video/homePage/pong.mp4',
	notLoginVideo: '/static/video/homePage/notLogin.webm',
	easterEggVideo: '/static/video/homePage/easteregg.webm',

	goalVideoPub: '/static/video/multiOnlineGamePage/goal2.webm',
	easterEggVideoPub: '/static/video/multiOnlineGamePage/easteregg.webm',
	outstandingVideoPub: '/static/video/multiOnlineGamePage/outstanding.webm',
	pingVideoPub: '/static/video/multiOnlineGamePage/pingpong.mp4',
	catchVideoPub: '/static/video/multiOnlineGamePage/catch.mp4',
	fortniteVideoPub: '/static/video/multiOnlineGamePage/fortnite.mp4',

	planeTexture: '/static/img/multiOnlineGamePage/pastel.jpg',
	skinOneTexture: '/static/img/skin/1.jpg',
	skinTwoTexture: '/static/img/skin/2.jpg',
	skinThreeTexture: '/static/img/skin/3.jpg',
	skinFourTexture: '/static/img/skin/4.jpg',
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
/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Video.js                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: hubourge <hubourge@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/08/26 18:57:00 by hubourge          #+#    #+#             */
/*   Updated: 2024/08/26 19:20:32 by hubourge         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// import * as THREE from '/static/javascript/three/build/three.module.js';
import * as THREE from '/node_modules/three/build/three.module.js';

class Video
{
	video = null;

	constructor(path)
	{
		this.video = document.createElement('video');
		this.video.src = path;
		this.video.muted = true;
		this.video.autoplay = true;
		this.video.loop = true;
	}	
}

export { Video };
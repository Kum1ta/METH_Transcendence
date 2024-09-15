/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Video.js                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: edbernar <edbernar@student.42angouleme.    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/08/26 18:57:00 by hubourge          #+#    #+#             */
/*   Updated: 2024/09/15 15:01:30 by edbernar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

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
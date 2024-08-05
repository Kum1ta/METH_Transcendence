/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   main.js                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: edbernar <edbernar@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/08/04 23:32:52 by edbernar          #+#    #+#             */
/*   Updated: 2024/08/05 18:29:04 by edbernar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

/*
	Todo (Eddy) : 
		- Image but not necessary
		- icon 
		- Title
		- Message
		- Action button
		- Timerbar
		- Close button
		- pause when hover
*/

function	createHeader(title)
{
	const	divHeader	= document.createElement("div");
	const	icon		= document.createElement("img");
	const	h1Title		= document.createElement("h1");
	const	cross		= document.createElement("p");

	divHeader.classList.add("header");
	icon.style.width = "20px";
	icon.style.height = "20px";
	icon.style.position = 'absolute';
	icon.style.left = '10px';
	icon.style.top = '15px';
	h1Title.innerHTML = title;
	h1Title.style.textAlign = "center";
	h1Title.style.width = "100%";
	h1Title.style.marginTop = "5px";
	cross.innerHTML = "X";
	cross.style.position = 'absolute';
	cross.style.right = '10px';
	cross.style.top = '20px';
	cross.style.cursor = 'pointer';
	cross.style.margin = '0';
	divHeader.appendChild(icon);
	divHeader.appendChild(h1Title);
	divHeader.appendChild(cross);
	return (divHeader);
}

function	createContent(message)
{
	const	divContent	= document.createElement("div");
	const	pMessage	= document.createElement("p");
	const	limit		= 100;

	divContent.classList.add("content");
	pMessage.style.textAlign = "center";
	if (message.length > limit)
		message = message.substring(0, limit) + "...";
	pMessage.innerHTML = message;
	divContent.appendChild(pMessage);
	return (divContent);
}

function	newNotification(title, message, img, action, timer)
{
	const	divNotification	= document.getElementById("divNotification");
	const	newNotification	= document.createElement("div");
	const	header			= createHeader(title);
	const	content			= createContent(message, img);

	newNotification.classList.add("notification");
	newNotification.style.width = "100%";
	newNotification.appendChild(header);
	divNotification.appendChild(newNotification);
	newNotification.appendChild(content);
	setTimeout(() => {
		setTimeout(() => {
			divNotification.removeChild(newNotification);
		}, 199);
		newNotification.style.animation = "slideOut 0.21s";
	}, timer);
}

class notification
{
	timer = 5000;

	constructor() {}

	new(title, message, img=null, action=null)
	{
		console.log("New notification: " + message);
		newNotification(title, message, img, action, this.timer);
	}
}

const	createNotification = new notification();

export { createNotification };
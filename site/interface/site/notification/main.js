/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   main.js                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: edbernar <edbernar@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/08/04 23:32:52 by edbernar          #+#    #+#             */
/*   Updated: 2024/08/06 16:25:21 by edbernar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

/*
	Todo (Eddy) : 
		- Close button
		- pause when hover
*/

function	createHeader(title, img)
{
	const	divHeader	= document.createElement("div");
	const	icon		= document.createElement("img");
	const	h1Title		= document.createElement("h1");
	const	cross		= document.createElement("p");

	divHeader.classList.add("header");
	if (img)
	{
		icon.style.width = "20px";
		icon.style.height = "20px";
		icon.style.position = 'absolute';
		icon.src = img;
	}
	h1Title.innerHTML = title;
	h1Title.style.textAlign = "center";
	h1Title.style.width = "100%";
	h1Title.style.marginTop = "5px";
	cross.innerHTML = "X";
	cross.style.position = 'absolute';
	cross.style.cursor = 'pointer';
	cross.style.margin = '0';
	cross.style.right = '10px';
	cross.style.marginTop = '5px';
	cross.style.fontSize = '20px';
	cross.style.fontWeight = 'bold';
	if (img)
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

function	createLoadBar(timer)
{
	const	divLoadBar		= document.createElement("div");
	const	progress		= document.createElement("div");
	let		interval		= null;
	const	intervalTimer	= timer / 100;
	let		i				= 1;

	progress.classList.add("progress");
	divLoadBar.classList.add("loadBar");
	divLoadBar.appendChild(progress);
	progress.style.height = '5px';
	progress.style.width = '0px';
	progress.style.backgroundColor = 'black';
	interval = setInterval(() => {
		progress.style.width = (intervalTimer * i) * 100 / timer + "%";
		i++;
	}, intervalTimer);
	setTimeout(() => {
		clearInterval(interval);
	}, timer);
	return (divLoadBar);
}

function	createFooter(action, actionText)
{
	const	newButton	= document.createElement("div");

	if (action == null)
		return (null);
	newButton.style.cursor = "pointer";
	if (actionText.length > 20)
		actionText = actionText.substring(0, 20) + "...";
	newButton.innerHTML = actionText;
	newButton.setAttribute("onclick", action);
	newButton.classList.add("footer");
	if (typeof(action) !== "function")
		throw new Error("Action must be a function");
	newButton.addEventListener("click", action);
	return (newButton);
}

function	newNotification(title, message, img, action, timer, actionText)
{
	const	divNotification	= document.getElementById("divNotification");
	const	newNotification	= document.createElement("div");
	const	header			= createHeader(title, img);
	const	content			= createContent(message);
	const	footer			= createFooter(action, actionText);
	const	loadBar			= createLoadBar(timer);

	newNotification.classList.add("notification");
	newNotification.style.width = "100%";
	newNotification.appendChild(header);
	divNotification.appendChild(newNotification);
	newNotification.appendChild(content);
	if (footer)
		newNotification.appendChild(footer);
	newNotification.appendChild(loadBar);
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
	defaultIcon = {
		"warning": "/site/notification/ico/warning.png",
		"error": "/site/notification/ico/error.png",
		"success": "/site/notification/ico/success.png",
		"info": "/site/notification/ico/info.png"
	};

	constructor() {}

	new(title, message, img=null, action=null, actionText="Confirm")
	{
		console.log("New notification: " + message);
		newNotification(title, message, img, action, this.timer, actionText);
	}
}

const	createNotification = new notification();

export { createNotification };
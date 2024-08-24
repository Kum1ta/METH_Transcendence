/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   main.js                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: edbernar <edbernar@student.42angouleme.    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/08/04 23:32:52 by edbernar          #+#    #+#             */
/*   Updated: 2024/08/24 23:41:57 by edbernar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

function	createHeader(title, img)
{
	const	divHeader		= document.createElement("div");
	const	icon			= document.createElement("img");
	const	h1Title			= document.createElement("h1");
	const	cross			= document.createElement("p");
	const	titleTextNode	= document.createTextNode(title);

	divHeader.classList.add("header");
	if (img)
	{
		icon.style.width = "20px";
		icon.style.height = "20px";
		icon.style.position = 'absolute';
		icon.src = img;
	}
	h1Title.appendChild(titleTextNode);
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
	cross.addEventListener("click", () => {
		divHeader.parentNode.style.animation = "slideOut 0.21s";
		setTimeout(() => {
			divHeader.parentNode.remove();
		}, 199);
	});
	if (img)
		divHeader.appendChild(icon);
	divHeader.appendChild(h1Title);
	divHeader.appendChild(cross);
	return (divHeader);
}

function	createContent(message)
{
	const	divContent		= document.createElement("div");
	const	pMessage		= document.createElement("p");
	const	pMessageNode	= document.createTextNode(message);
	const	limit			= 100;

	divContent.classList.add("content");
	pMessage.style.textAlign = "center";
	if (message.length > limit)
		message = message.substring(0, limit) + "...";
	pMessage.appendChild(pMessageNode);
	divContent.appendChild(pMessage);
	return (divContent);
}

function	createLoadBar(newNotification, timer)
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
	newNotification.addEventListener("mouseover", () => {
		clearInterval(interval);
		progress.style.width = "100%";
	});
	interval = setInterval(() => {
		progress.style.width = (intervalTimer * i) * 100 / timer + "%";
		i++;
	}, intervalTimer);
	setTimeout(() => {
		clearInterval(interval);
	}, timer);
	newNotification.appendChild(divLoadBar);
	return (interval);
}

function	createFooter(action, actionText)
{
	const	newButton	= document.createElement("div");
	const	textNode	= document.createTextNode(actionText);

	if (action == null)
		return (null);
	newButton.style.cursor = "pointer";
	if (actionText.length > 20)
		actionText = actionText.substring(0, 20) + "...";
	newButton.appendChild(textNode);
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
	let		intervalLoadBar	= null;
	let		timeoutInTimout	= null;

	console.log("New notification: " + message);
	newNotification.classList.add("notification");
	newNotification.style.width = "100%";
	newNotification.appendChild(header);
	divNotification.appendChild(newNotification);
	newNotification.appendChild(content);
	if (footer)
		newNotification.appendChild(footer);
	intervalLoadBar = createLoadBar(newNotification, timer);
	const timeout = setTimeout(() => {
		timeoutInTimout = setTimeout(() => {
			divNotification.removeChild(newNotification);
		}, 199);
		newNotification.style.animation = "slideOut 0.21s";
	}, timer);
	newNotification.addEventListener("mouseover", () => {
		clearTimeout(timeout);
		clearTimeout(timeoutInTimout);
		clearInterval(intervalLoadBar);
	});
}

class notification
{
	timer = 5000;
	defaultIcon = {
		"warning": "/static/img/notification/ico/warning.png",
		"error": "/static/img/notification/ico/error.png",
		"success": "/static/img/notification/ico/success.png",
		"info": "/static/img/notification/ico/info.png"
	};

	constructor() {}

	new(title, message, img=null, action=null, actionText="Confirm")
	{
		newNotification(title, message, img, action, this.timer, actionText);
	}
}

const	createNotification = new notification();

export { createNotification };
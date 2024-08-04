/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   main.js                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: edbernar <edbernar@student.42angouleme.    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/08/04 23:32:52 by edbernar          #+#    #+#             */
/*   Updated: 2024/08/05 00:24:52 by edbernar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

/*
	Todo (Eddy) : 
		- Image but not necessary
		- Title
		- Message
		- Action button
		- Timerbar
		- Close button
		- pause when hover
*/

function	newNotification(type, timer)
{
	const	divNotification = document.getElementById("divNotification");
	const	newNotification = document.createElement("div");

	newNotification.classList.add("notification");

	newNotification.innerHTML = "This is a " + type + " notification";
	newNotification.style.width = "100%";
	divNotification.appendChild(newNotification);
	setInterval(() => {
		newNotification.style.opacity = 1;
	}, 100);
	setTimeout(() => {
		setTimeout(() => {
			divNotification.removeChild(newNotification);
		}, 99);
		newNotification.style.animation = "slideOut 0.11s";
	}, timer);
}

class notification
{
	timer = 2000;

	constructor() {}

	info(message, action=null)
	{
		console.log("New info notification: " + message);
		newNotification("info", this.timer);
	}

	success(message, action=null)
	{
		console.log("New success notification: " + message);
		newNotification("success", this.timer);
	}

	warning(message, action=null)
	{
		console.log("New warning notification: " + message);
		newNotification("warning", this.timer);
	}

	error(message, action=null)
	{
		console.log("New error notification: " + message);
		newNotification("error", this.timer);
	}
}

const	createNotification = new notification();

export { createNotification };
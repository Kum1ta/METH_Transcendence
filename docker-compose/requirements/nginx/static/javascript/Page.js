/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Page.js                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: edbernar <edbernar@student.42angouleme.    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/08/25 00:00:21 by edbernar          #+#    #+#             */
/*   Updated: 2024/09/14 00:57:30 by edbernar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { multiLocalGamePage } from "/static/javascript/multiLocalGame/multiLocalGamePage.js"
import { LobbyPage } from "/static/javascript/lobbyPage/main.js";
import { HomePage } from "/static/javascript/homePage/main.js";

class Page
{
	actualPage = null;
	availablePages = [
		{url:'/', servUrl: '/homePage', class: HomePage, name: 'homePage', title: 'PTME - Home'},
		{url:'/lobby', servUrl: '/lobbyPage', class: LobbyPage, name: 'lobbyPage', title: 'PTME - Lobby'},
		{url:'/game', servUrl: '/multiLocalGamePage', class: multiLocalGamePage, name: 'multiLocalGamePage', title: 'PTME - Game'},
	]

	constructor()
	{
		const thisClass = this;
		window.onpopstate = function(event) {
			for (let i = 0; i < thisClass.availablePages.length; i++)
			{
				if (window.location.pathname == thisClass.availablePages[i].url)
				{
					thisClass.changePage(thisClass.availablePages[i].name, true);
					return ;
				}
			}
		};
		for (let i = 0; i < this.availablePages.length; i++)
		{
			if (window.location.pathname == this.availablePages[i].url)
			{
				this.changePage(this.availablePages[i].name);
				return ;
			}
		}
		this.#showUnknownPage();
	}
	
	changePage(name, isBack = false)
	{
		if (this.actualPage != null)
			this.actualPage.dispose();
		for (let i = 0; i < this.availablePages.length; i++)
		{
			if (name === this.availablePages[i].name)
			{
				fetch(this.availablePages[i].servUrl, {
					method: "POST",
				})
				.then(response => {
					if (response.status != 200)
						throw Error("Page '" + name + "' can't be loaded")
					return (response);
				})
				.then(data => {
					data.text().then(text => {
						document.body.innerHTML = text;
						this.actualPage = this.availablePages[i].class;
						document.title = this.availablePages[i].title;
						if (!isBack)
							history.pushState({}, this.availablePages[i].title, this.availablePages[i].url);
						this.actualPage.create();
						console.log("Page created.");
					})
				})
				.catch(error => {
					window.location.href = '/';
					throw Error(error);
				});

				return ;
			}
		}
		throw Error("Page '" + name + "' not exist");
	}

	#showUnknownPage()
	{
		if (this.actualPage != null)
			this.actualPage.dispose();
		fetch('/404')
		.then(response => {
			if (response.status != 200)
				throw Error("Page '" + name + "' can't be loaded")
			return (response);
		})
		.then(data => {
			data.text().then(text => {
				document.body.innerHTML = text;
				this.actualPage = null;
				document.title = 'PTME - Page not found';
				history.pushState({}, this.availablePages[i].title, this.availablePages[i].url);
			})
		})
		.catch(error => {
			window.location.href = '/';
			throw Error(error);
		});

	}
};

export { Page }
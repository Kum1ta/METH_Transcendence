/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Page.js                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: edbernar <edbernar@student.42angouleme.    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/08/25 00:00:21 by edbernar          #+#    #+#             */
/*   Updated: 2024/09/28 19:48:30 by edbernar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { MultiOnlineGamePage } from "/static/javascript/multiOnlineGame/multiOnlineGamePage.js"
import { multiLocalGamePage } from "/static/javascript/multiLocalGame/multiLocalGamePage.js"
import { settingsPage } from "/static/javascript/settingsPage/settingsPage.js"
import { WaitingGamePage } from "/static/javascript/waitingGame/main.js"
import { ProfilPage } from "/static/javascript/profilPage/main.js";
import { LobbyPage } from "/static/javascript/lobbyPage/main.js";
import { sendRequest } from "/static/javascript/websocket.js";
import { HomePage } from "/static/javascript/homePage/main.js";

class Page
{
	actualPage = null;
	wasRefresh = false;
	availablePages = [
		{suffix: false, url:'/', servUrl: '/homePage', class: HomePage, name: 'homePage', title: 'METH - Home'},
		{suffix: false, url:'/lobby', servUrl: '/lobbyPage', class: LobbyPage, name: 'lobbyPage', title: 'METH - Lobby'},
		{suffix: false, url:'/game', servUrl: '/multiOnlineGamePage', class: MultiOnlineGamePage, name: 'multiOnlineGamePage', title: 'METH - Game'},
		{suffix: false, url:'/game', servUrl: '/multiLocalGamePage', class: multiLocalGamePage, name: 'multiLocalGamePage', title: 'METH - Game'},
		{suffix: false, url:'/wait_game', servUrl: '/waitingGamePage', class: WaitingGamePage, name: 'waitingGamePage', title: 'METH - Wait for a game'},
		{suffix: true, url:'/profil', servUrl: '/profilPage', class: ProfilPage, name: 'profilPage', title: 'METH - Profil'},
		{suffix: false, url:'/settings', servUrl: '/settingsPage', class: settingsPage, name: 'settingsPage', title: 'METH - Settings'},
	]

	constructor()
	{
		const thisClass = this;
		window.onpopstate = function(event) {
			for (let i = 0; i < thisClass.availablePages.length; i++)
			{
				if (window.location.pathname == thisClass.availablePages[i].url || (thisClass.availablePages[i].suffix && window.location.pathname.startsWith(thisClass.availablePages[i].url)))
				{
					let arg = window.location.pathname.slice(thisClass.availablePages[i].url.length + 1);
					if (arg == "" || !thisClass.availablePages[i].suffix)
						arg = null;
					if (thisClass.actualPage == MultiOnlineGamePage)
						sendRequest("game", {action: 2});
					thisClass.changePage(thisClass.availablePages[i].name, true, arg, !thisClass.availablePages[i].suffix);
					return ;
				}
			}
		};
		this.wasRefresh = (performance.getEntriesByType("navigation").length > 0 && performance.getEntriesByType("navigation")[0].type === "reload")
		for (let i = 0; i < this.availablePages.length; i++)
		{
			if (window.location.pathname == this.availablePages[i].url || (thisClass.availablePages[i].suffix && window.location.pathname.startsWith(thisClass.availablePages[i].url)))
			{
				let arg = window.location.pathname.slice(thisClass.availablePages[i].url.length + 1);
				if (arg == "" || !thisClass.availablePages[i].suffix)
					arg = null;
				this.changePage(this.availablePages[i].name, false, arg, !thisClass.availablePages[i].suffix);
				return ;
			}
		}
		this.#showUnknownPage();
	}
	
	changePage(name, isBack = false, arg = null, needToChangePath = true)
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
						if (!isBack && !this.wasRefresh)
						{
							if (needToChangePath)
								history.pushState({}, this.availablePages[i].title, this.availablePages[i].url);
							else
								history.pushState({}, this.availablePages[i].title, window.location.pathname);
						}
						this.wasRefresh = false;
						if (arg)
							this.actualPage.create(arg);
						else
							this.actualPage.create();
					})
				})
				.catch(error => {
					window.location.href = '/';
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
				document.title = 'METH - Page not found';
				history.pushState({}, document.title, window.location.pathname);
			})
		})
		.catch(error => {
			window.location.href = '/';
			throw Error(error);
		});

	}
};

export { Page }
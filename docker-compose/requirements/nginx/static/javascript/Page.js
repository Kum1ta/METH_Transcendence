/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Page.js                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: edbernar <edbernar@student.42angouleme.    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/08/25 00:00:21 by edbernar          #+#    #+#             */
/*   Updated: 2024/08/25 15:22:15 by edbernar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { HomePage } from "/static/javascript/homePage/main.js";

class Page
{
	actualPage = null;
	availablePages = [
		{url:'/', servUrl: '/homePage', class: HomePage, name: 'homePage', title: 'PTME - Home'},
	]

	constructor()
	{
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
	
	changePage(name)
	{
		if (this.actualPage != null)
			this.actualPage.dispose();
		for (let i = 0; i < this.availablePages.length; i++)
		{
			if (name === this.availablePages[i].name)
			{
				fetch(this.availablePages[i].servUrl)
				.then(response => {
					if (response.status != 200)
						throw Error("Page '" + name + "' can't be loaded")
					return (response);
				})
				.then(data => {
					data.text().then(text => {
						document.body.innerHTML = text;
						this.availablePages[i].class.create();
						document.title = this.availablePages[i].title;
						this.actualPage = this.availablePages[i].name;
						history.pushState({}, this.availablePages[i].title, this.availablePages[i].url);
					});
				})
				.catch(error => {
					throw Error(error);
				});

				return ;
			}
		}
		throw Error("Page '" + page + "' not exist");
	}

	#showUnknownPage()
	{
		document.body.innerHTML = "404 - Page not found";
	}
};

export { Page }
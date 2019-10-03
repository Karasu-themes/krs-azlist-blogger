class azList {

	constructor(userOption){

		// variables base
		let _BODY = document.body,
			_AZ = [...'abcdefghijklmnopqrstuvwxyz'],
			self = this,
			_CONFIG = {
			blogId: "blog_id",
			apiKey: "api_key",
			selector: '.krs-azlist'}

		let option = this.mergeObject(_CONFIG, userOption);

		let fetchURL=`https://www.googleapis.com/blogger/v3/blogs/${option.blogId}/posts?key=${option.apiKey}&maxResults=500`;

		fetch(fetchURL)
		.then(response=>{
			if (response.ok) {
				return response.json();
			}
		})
		.then(result=>{
			let obj = self.orderbyAZ(result.items, _AZ),
				content = document.querySelector(option.selector);

			content.innerHTML="";
			content.appendChild(self.renderNav(_AZ));
			for (var i = 0; i < obj.length; i++) {
				if (obj[i].items.length>0) {
					// console.log(obj[i])
					content.appendChild(self.render(obj[i], option))
				}
			}

		})
	}

	// Genera la estructura del listado
	render(data, option){
		let self = this;

		function _headline(text, letter){
			let container = document.createElement('div'),
				count = document.createElement('span');

			container.classList.add('krs-azlist__headline'),
			container.id = letter.toLowerCase(),
			count.classList.add('krs-azlist__count');

			container.innerText = text + letter,
			count.innerText = data.items.length + ' entradas';
			container.appendChild(count);

			return container;

		}

		function _items(data){
			let body = document.createElement('div'),
				thumbnail = '',
				items = document.createElement('ul');

			body.classList.add('krs-azlist__body'),
			items.classList.add('krs-azlist__items');

			for (var i = 0; i < data.length; i++) {
				items.innerHTML+= `<li><a href="${data[i].url}" title="${data[i].title}" target="_blank">${i+1} - ${data[i].title}</a></li>`
			}

			// console.log(self.test())

			body.appendChild(items);

			return body
		}

		let row = document.createElement('div');
		row.classList.add('krs-azlist__row');

		row.appendChild(_headline("letra ",data.letter.toUpperCase()));
		row.appendChild(_items(data.items))

		return row
	}

	/*
		Navegación
	*/
	renderNav(az){
		let container = document.createElement('div');
			container.classList.add('krs-azlist__nav');
		for (var i = 0; i < az.length; i++) {
			let anchor = document.createElement('a');
			anchor.href="#"+az[i];
			anchor.innerText=az[i];
			container.appendChild(anchor);
		}
		return container;
	}

	// Ordena las entradas en base a su letra y devuelve un array de objetos.
	orderbyAZ(obj, az){

		let alphabet = az,
			temp=[];

		for (var i = 0; i < alphabet.length; i++) {
			let letter = alphabet[i];

			let getLetter = obj.filter(element=>{
					let letterTitle = element.title.substr(0,1).toLowerCase();
					if (letterTitle == letter) {
						return element;
					}
				})

			temp[i] = {
				letter: letter,
				items: getLetter
			}
		}

		let asterisk = obj.filter(element=>{
			let letter = element.title.substr(0,1).toLowerCase();
			if (!/[a-z]/g.test(letter)) {
				return element;
			}
		})

		temp.unshift({
			letter: "#",
			items: asterisk
		})



		return temp;
	}

	// Mezcla las opciones por defecto con las del usuario
	mergeObject(source, properties){
		var property;
		for (property in properties) {
			if (properties.hasOwnProperty(property)) {
				source[property] = properties[property];
			}
		}
		return source;
	}

}
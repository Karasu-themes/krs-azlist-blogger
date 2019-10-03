"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var azList = function () {
	function azList(userOption) {
		_classCallCheck(this, azList);

		// variables base
		var _BODY = document.body,
		    _AZ = [].concat(_toConsumableArray('abcdefghijklmnopqrstuvwxyz')),
		    self = this,
		    _CONFIG = {
			blogId: "blog_id",
			apiKey: "api_key",
			selector: '.krs-azlist' };

		var option = this.mergeObject(_CONFIG, userOption);

		var fetchURL = "https://www.googleapis.com/blogger/v3/blogs/" + option.blogId + "/posts?key=" + option.apiKey + "&maxResults=500";

		fetch(fetchURL).then(function (response) {
			if (response.ok) {
				return response.json();
			}
		}).then(function (result) {
			var obj = self.orderbyAZ(result.items, _AZ),
			    content = document.querySelector(option.selector);

			content.innerHTML = "";
			content.appendChild(self.renderNav(_AZ));
			for (var i = 0; i < obj.length; i++) {
				if (obj[i].items.length > 0) {
					// console.log(obj[i])
					content.appendChild(self.render(obj[i], option));
				}
			}
		});
	}

	// Genera la estructura del listado


	_createClass(azList, [{
		key: "render",
		value: function render(data, option) {
			var self = this;

			function _headline(text, letter) {
				var container = document.createElement('div'),
				    count = document.createElement('span');

				container.classList.add('krs-azlist__headline'), container.id = letter.toLowerCase(), count.classList.add('krs-azlist__count');

				container.innerText = text + letter, count.innerText = data.items.length + ' entradas';
				container.appendChild(count);

				return container;
			}

			function _items(data) {
				var body = document.createElement('div'),
				    thumbnail = '',
				    items = document.createElement('ul');

				body.classList.add('krs-azlist__body'), items.classList.add('krs-azlist__items');

				for (var i = 0; i < data.length; i++) {
					items.innerHTML += "<li><a href=\"" + data[i].url + "\" title=\"" + data[i].title + "\" target=\"_blank\">" + (i + 1) + " - " + data[i].title + "</a></li>";
				}

				// console.log(self.test())

				body.appendChild(items);

				return body;
			}

			var row = document.createElement('div');
			row.classList.add('krs-azlist__row');

			row.appendChild(_headline("letra ", data.letter.toUpperCase()));
			row.appendChild(_items(data.items));

			return row;
		}

		/*
  	Navegación
  */

	}, {
		key: "renderNav",
		value: function renderNav(az) {
			var container = document.createElement('div');
			container.classList.add('krs-azlist__nav');
			for (var i = 0; i < az.length; i++) {
				var anchor = document.createElement('a');
				anchor.href = "#" + az[i];
				anchor.innerText = az[i];
				container.appendChild(anchor);
			}
			return container;
		}

		// Ordena las entradas en base a su letra y devuelve un array de objetos.

	}, {
		key: "orderbyAZ",
		value: function orderbyAZ(obj, az) {

			var alphabet = az,
			    temp = [];

			var _loop = function _loop() {
				var letter = alphabet[i];

				var getLetter = obj.filter(function (element) {
					var letterTitle = element.title.substr(0, 1).toLowerCase();
					if (letterTitle == letter) {
						return element;
					}
				});

				temp[i] = {
					letter: letter,
					items: getLetter
				};
			};

			for (var i = 0; i < alphabet.length; i++) {
				_loop();
			}

			var asterisk = obj.filter(function (element) {
				var letter = element.title.substr(0, 1).toLowerCase();
				if (!/[a-z]/g.test(letter)) {
					return element;
				}
			});

			temp.unshift({
				letter: "#",
				items: asterisk
			});

			return temp;
		}

		// Mezcla las opciones por defecto con las del usuario

	}, {
		key: "mergeObject",
		value: function mergeObject(source, properties) {
			var property;
			for (property in properties) {
				if (properties.hasOwnProperty(property)) {
					source[property] = properties[property];
				}
			}
			return source;
		}
	}]);

	return azList;
}();
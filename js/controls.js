import MgbaSettingsDialog from './settings.js';
import MgbaGame from './game.js';
import * as FileLoader from './fileloader.js';


const buttonNameToId = new Map();
buttonNameToId.set('a', 0);
buttonNameToId.set('b', 1);
buttonNameToId.set('select', 2);
buttonNameToId.set('start', 3);
buttonNameToId.set('right', 4);
buttonNameToId.set('left', 5);
buttonNameToId.set('up', 6);
buttonNameToId.set('down', 7);
buttonNameToId.set('r', 8);
buttonNameToId.set('l', 9);
const buttonIdToName = new Map();
for (const [key, value] of buttonNameToId) {
	buttonIdToName.set(value, key);
}

export default class MgbaControls extends HTMLElement {
	connectedCallback() {
		this.addButtons();
	}

	addButtons() {
		const buttonContainer = document.getElementById('gamepad');
		this.appendChild(buttonContainer);

		this.addShoulderRow(buttonContainer);

		gamepad.classList.add("active");
		const A = this.querySelector('.A');
		const B = this.querySelector('.B');
		const L = this.querySelector('.L');
		const R = this.querySelector('.R');
		const Up = this.querySelector('.Up');
		const Down = this.querySelector('.Down');
		const Left = this.querySelector('.Left');
		const Right = this.querySelector('.Right');
		const upLeft = this.querySelector('.up-left');
		const upRight = this.querySelector('.up-right');
		const downLeft = this.querySelector('.down-left');
		const downRight = this.querySelector('.down-right');
		const start = this.querySelector('.start');
		const select = this.querySelector('.select');

		[
			[A, 'A'],
			[B, 'B'],
			[L, 'L'],
			[R, 'R'],
			[Up, 'Up'],
			[Down, 'Down'],
			[Left, 'Left'],
			[Right, 'Right'],
			[upLeft, 'up-left'],
			[upRight, 'up-right'],
			[downLeft, 'down-left'],
			[downRight, 'down-right'],
			[start, 'start'],
			[select, 'select']
		].forEach(([element, buttonName]) => {
			let currentButton = null;

			['mousedown', 'touchstart'].forEach(startEventName => {
				element.addEventListener(startEventName, () => {
					currentButton = element;
					if (buttonName === 'up-right' || buttonName === 'up-left' || buttonName === 'down-right' || buttonName === 'down-left') {
						const directions = buttonName.split('-');
						directions.forEach(direction => {
							this.buttonPress(direction.charAt(0).toUpperCase() + direction.slice(1));
						});
					} else {
						this.buttonPress(buttonName);
					}
					element.classList.add('touched');
				});
			});

			['mouseup', 'touchend', 'touchcancel'].forEach(endEventName => {
				element.addEventListener(endEventName, () => {
					if (currentButton) {
						if (buttonName === 'up-right' || buttonName === 'up-left' || buttonName === 'down-right' || buttonName === 'down-left') {
							const directions = buttonName.split('-');
							directions.forEach(direction => {
								this.buttonUnpress(direction.charAt(0).toUpperCase() + direction.slice(1));
							});
						} else {
							this.buttonUnpress(buttonName);
						}
						currentButton.classList.remove('touched');
						currentButton = null;
					}
				});
			});

			element.addEventListener('touchmove', event => {
				const touch = event.touches[0];
				const newButton = document.elementFromPoint(touch.clientX, touch.clientY);

				if (newButton !== currentButton && event.touches.length === 1) {
					if (currentButton) {
						const touchendEvent = new Event('touchend');
						currentButton.dispatchEvent(touchendEvent);
					}

					if (newButton) {
						const touchstartEvent = new Event('touchstart');
						newButton.dispatchEvent(touchstartEvent);
					}

					currentButton = newButton;
				}
			});
			document.addEventListener('touchend', event => {
				if (event.touches.length === 0) {
					if (currentButton) {
						const touchendEvent = new Event('touchend');
						currentButton.dispatchEvent(touchendEvent);
						currentButton = null;
					}
				}
			});
			// Joystick
			let currentDirection = '';
			dynamic.on('move', (evt, data) => {
				var angle = data.angle.degree;
				var dpadDirection = '';

				if (angle >= 337.5 || angle < 22.5) {
					dpadDirection = 'right';
				} else if (angle >= 22.5 && angle < 67.5) {
					dpadDirection = 'up-right';
				} else if (angle >= 67.5 && angle < 112.5) {
					dpadDirection = 'up';
				} else if (angle >= 112.5 && angle < 157.5) {
					dpadDirection = 'up-left';
				} else if (angle >= 157.5 && angle < 202.5) {
					dpadDirection = 'left';
				} else if (angle >= 202.5 && angle < 247.5) {
					dpadDirection = 'down-left';
				} else if (angle >= 247.5 && angle < 292.5) {
					dpadDirection = 'down';
				} else if (angle >= 292.5 && angle < 337.5) {
					dpadDirection = 'down-right';
				}

				if (dpadDirection !== currentDirection) {
					if (currentDirection === 'up') {
						this.buttonUnpress('Up');
					} else if (currentDirection === 'down') {
						this.buttonUnpress('Down');
					} else if (currentDirection === 'left') {
						this.buttonUnpress('Left');
					} else if (currentDirection === 'right') {
						this.buttonUnpress('Right');
					} else if (currentDirection === 'up-left') {
						this.buttonUnpress('Up');
						this.buttonUnpress('Left');
					} else if (currentDirection === 'up-right') {
						this.buttonUnpress('Up');
						this.buttonUnpress('Right');
					} else if (currentDirection === 'down-left') {
						this.buttonUnpress('Down');
						this.buttonUnpress('Left');
					} else if (currentDirection === 'down-right') {
						this.buttonUnpress('Down');
						this.buttonUnpress('Right');
					}

					if (dpadDirection === 'up') {
						this.buttonPress('Up');
					} else if (dpadDirection === 'down') {
						this.buttonPress('Down');
					} else if (dpadDirection === 'left') {
						this.buttonPress('Left');
					} else if (dpadDirection === 'right') {
						this.buttonPress('Right');
					} else if (dpadDirection === 'up-left') {
						this.buttonPress('Up');
						this.buttonPress('Left');
					} else if (dpadDirection === 'up-right') {
						this.buttonPress('Up');
						this.buttonPress('Right');
					} else if (dpadDirection === 'down-left') {
						this.buttonPress('Down');
						this.buttonPress('Left');
					} else if (dpadDirection === 'down-right') {
						this.buttonPress('Down');
						this.buttonPress('Right');
					}
					currentDirection = dpadDirection;
				}

				console.log('DPAD Direction: ' + dpadDirection);
			});

			dynamic.on('end', () => {
				if (currentDirection === 'up') {
					this.buttonUnpress('Up');
				} else if (currentDirection === 'down') {
					this.buttonUnpress('Down');
				} else if (currentDirection === 'left') {
					this.buttonUnpress('Left');
				} else if (currentDirection === 'right') {
					this.buttonUnpress('Right');
				} else if (currentDirection === 'up-left') {
					this.buttonUnpress('Up');
					this.buttonUnpress('Left');
				} else if (currentDirection === 'up-right') {
					this.buttonUnpress('Up');
					this.buttonUnpress('Right');
				} else if (currentDirection === 'down-left') {
					this.buttonUnpress('Down');
					this.buttonUnpress('Left');
				} else if (currentDirection === 'down-right') {
					this.buttonUnpress('Down');
					this.buttonUnpress('Right');
				}

				currentDirection = '';
			});
			// Joystick

		});

	}

	buttonPress(name) {
		window.Module._buttonPress(buttonNameToId.get(name.toLowerCase()));
	}

	buttonUnpress(name) {
		window.Module._buttonUnpress(buttonNameToId.get(name.toLowerCase()));
	}

	addShoulderRow() {

		const L = document.getElementById('l-pad');
		L.classList.add('L');

		const R = document.getElementById('r-pad');
		R.classList.add('R');

		const a = document.getElementById('A-pad');
		a.classList.add('A');

		const b = document.getElementById('B-pad');
		b.classList.add('B');

		const select = document.getElementById('select-pad');
		select.classList.add('select');

		const start = document.getElementById('start-pad');
		start.classList.add('start');

		const Up = document.getElementById('Up');
		Up.classList.add('Up');

		const Down = document.getElementById('Down');
		Down.classList.add('Down');

		const Left = document.getElementById('Left');
		Left.classList.add('Left');

		const Right = document.getElementById('Right');
		Right.classList.add('Right');

		const upleft = document.getElementById('up-left');
		upleft.classList.add('up-left');

		const upRight = document.getElementById('up-right');
		upRight.classList.add('up-right');

		const downRight = document.getElementById('down-right');
		downRight.classList.add('down-right');

		const downleft = document.getElementById('down-left');
		downleft.classList.add('down-left');

		var messageTimeout;
		const dropdown = document.getElementById('slot-state');
		const saveStateButton = document.getElementById('save-state');
		const messageDiv = document.querySelector('.message');
		let clickCount = 0;
		let clickTimer = null;

		saveStateButton.addEventListener('click', () => {
		clickCount++;
		if (clickCount === 1) {
			clickTimer = setTimeout(() => {
			clickCount = 0;
			}, 300);
		} else if (clickCount === 2) {
			const selectedValue = dropdown.value; 
			saveStateButton.disabled = true;
			window.Module._saveState(selectedValue);
			FileLoader.writefs().then(() => {
			saveStateButton.disabled = false;
			if (messageTimeout) {
                clearTimeout(messageTimeout);
            }
			messageDiv.classList.add('act');
			messageDiv.textContent = '.ss' + selectedValue + ' state saved.';
			messageTimeout = setTimeout(function () {
                messageDiv.classList.remove('act');
            }, 2000);
			});
			clickCount = 0;
			clearTimeout(clickTimer);
		}
		});
		const loadStateButton = document.getElementById('load-state');
		loadStateButton.addEventListener('click', () => {
			clickCount++;

			if (clickCount === 1) {
				clickTimer = setTimeout(() => {
					clickCount = 0;
				}, 300);
			} else if (clickCount === 2) {
				const selectedValue = dropdown.value;
				window.Module._loadState(selectedValue);
				if (messageTimeout) {
					clearTimeout(messageTimeout);
				}
				messageDiv.classList.add('act');
				messageDiv.textContent = '.ss' + selectedValue + ' loaded.';
				messageTimeout = setTimeout(function () {
					messageDiv.classList.remove('act');
				}, 2000);
				clickCount = 0;
				clearTimeout(clickTimer);
			}
		});

		const speedToggleButton = document.getElementById('turbo');
		let turboState = 1; 
		
		speedToggleButton.addEventListener('click', () => {
			const timing = window.Module._getMainLoopTiming();
			console.log('timing: ' + timing);
		
			const turboElement = document.getElementById('turbo');
			turboElement.classList.remove('turbo-medium', 'turbo-fast');
			if (turboState === 1) {
				turboElement.classList.add('turbo-medium');
				turboState = 2; 
			} else if (turboState === 2) {
				turboElement.classList.add('turbo-fast');
				turboState = 3; 
			} else if (turboState === 3) {
				turboElement.classList.remove('turbo-fast');
				turboState = 1; 
			} else {
				console.log('unrecognized turbo state: ' + turboState);
			}
			if (turboState === 1) {
				window.Module._setMainLoopTiming(0, MgbaGame.mainLoopTiming);
			} else if (turboState === 2) {
				window.Module._setMainLoopTiming(0, MgbaGame.mediumLoopTiming);
			} else if (turboState === 3) {
				window.Module._setMainLoopTiming(0, MgbaGame.fastLoopTiming);
			}
		});

		function reloadPage() {
			location.reload();
		}
		const myButton = document.getElementById('restart-game');
		myButton.addEventListener('click', reloadPage);

		document.getElementById('gamepad').ontouchstart = (e) => {
			e.preventDefault();
		};
		const volumeInput = document.getElementById('range-in');
		const savedVolume = localStorage.getItem('volume');
		volumeInput.type = 'range';
		volumeInput.min = 0;
		volumeInput.max = 0x100;
		if (savedVolume !== null) {
			volumeInput.value = savedVolume;
		} else {
			volumeInput.value = window.Module._getVolume();
		}
		volumeInput.oninput = () => {
			localStorage.setItem('volume', volumeInput.value);
			window.Module._setVolume(volumeInput.value);
		};
		const setButton = document.getElementById('set-volume-range');
		let volumeLevel = 0;
		
		setButton.onclick = () => {
			if (volumeLevel === 0) {
				volumeLevel = 128;
			} else if (volumeLevel === 128) {
				volumeLevel = 256;
			} else {
				volumeLevel = 0;
			}
		
			window.Module._setVolume(volumeLevel);
			volumeInput.value = volumeLevel;
			localStorage.setItem('volume', volumeLevel);
		};

		const saveButton = document.getElementById('save-game');
		saveButton.onclick = async () => {
			saveButton.disabled = true;
			const confirmed = window.confirm('Do you want to save the game?');
			if (confirmed) {
				saveButton.disabled = false;
				await FileLoader.writefs();
			} else {
				saveButton.disabled = false;
			}
		};
		
		const button = document.getElementById('menu-pad');
		const div = document.getElementById('menu-list-pad');

		button.addEventListener('click', function() {
			button.classList.toggle('active');
			div.classList.toggle('active');
		});

		const shader = document.getElementById('shader');
		const imgshader = document.getElementById('img-shader');
		const savedValue = localStorage.getItem('selectedShader');
		if (savedValue) {
			shader.value = savedValue;
			applyShaderClass(savedValue);
		}
		shader.addEventListener('change', function() {
			const selectedValue = shader.value;
			localStorage.setItem('selectedShader', selectedValue);
			applyShaderClass(selectedValue);
		});
		function applyShaderClass(selectedValue) {
			imgshader.classList.remove('sd-1', 'sd-2', 'sd-3', 'sd-4','sd-5' );
			if (selectedValue === 'option1') {
				imgshader.classList.add('sd-1');
			} else if (selectedValue === 'option2') {
				imgshader.classList.add('sd-2');
			} else if (selectedValue === 'option3') {
				imgshader.classList.add('sd-3');
			} else if (selectedValue === 'option4') {
				imgshader.classList.add('sd-4');
			} else if (selectedValue === 'option5') {
				imgshader.classList.add('sd-5');
			}
		}
		
		//document.addEventListener("visibilitychange", function() {
		//	if (document.hidden) {
		//		alert("Kabu stopped suddenly because of switching apps.");
		//		setTimeout(function() {
		//			alert("Audio activation is interrupted.");
		//		}, 200);
		//	}
		//});

		let opacity = parseFloat(localStorage.getItem('opacity')) || 0.1;

		imgshader.style.opacity = opacity;

		const increaseButton = document.getElementById('plus-shader');
		const decreaseButton = document.getElementById('minus-shader');

		increaseButton.addEventListener('click', function() {
			if (opacity < 1) {
				opacity += 0.05;
				localStorage.setItem('opacity', opacity);
			}
			imgshader.style.opacity = opacity;
			if (messageTimeout) {
				clearTimeout(messageTimeout);
			}
			messageDiv.textContent = 'Opacity ' + opacity.toFixed(2);
			messageDiv.classList.add('act');
			messageTimeout = setTimeout(function () {
                messageDiv.classList.remove('act');
            }, 2000);
		});

		decreaseButton.addEventListener('click', function() {
			if (opacity > 0.1) {
				opacity -= 0.05;
				localStorage.setItem('opacity', opacity);
			}
			imgshader.style.opacity = opacity;
			if (messageTimeout) {
				clearTimeout(messageTimeout);
			}
			messageDiv.textContent = 'Opacity ' + opacity.toFixed(2);
			messageDiv.classList.add('act');
			messageTimeout = setTimeout(function () {
                messageDiv.classList.remove('act');
            }, 2000);
		});

	}
}
customElements.define('mgba-controls', MgbaControls);
/**
 * Novashore.ImageEditor an image editor for use with Backbone-forms.
 *
 * Copyright (c) Novashore 2014
 *
 * License and more information at:
 * http://github.com/novashore/Novashore.ImageEditor
 */

$(function() {
				
	
	Novashore={};
	Novashore.ImageEditor = Backbone.Form.editors.Base.extend
	({

	    
		tagName: 'IMG',
		events: {
			'change': function() {
				// The 'change' event should be triggered whenever something happens
				// that affects the result of `this.getValue()`.
				this.trigger('change', this);
			},
			'focus': function() {
				// The 'focus' event should be triggered whenever an input within
				// this editor becomes the `document.activeElement`.
				this.trigger('focus', this);
				// This call automatically sets `this.hasFocus` to `true`.
			},
			'blur': function() {
				// The 'blur' event should be triggered whenever an input within
				// this editor stops being the `document.activeElement`.
				this.trigger('blur', this);
				// This call automatically sets `this.hasFocus` to `false`.
			},
			'click': 'edit',
		},

		initialize: function(options) {
			// Call parent constructor
			Backbone.Form.editors.Base.prototype.initialize.call(this, options);
			_.bindAll(this, 'changeSize', 'renderImage', 'edit');

			// Custom setup code.
			if(!this.value) this.value = 'images/image.png'
	 
			//console.log(this);
			this.currentImage;
			this.imgh;
			this.imgw;
			this.sizetimer;
						   
											   
		},
		changeSize: function(size) {
			console.log(this);
			console.log(size);
		   var nimgw = Math.round((this.imgw * size)/100);
		   var nimgh = Math.round((this.imgh * size)/100);
		   this.modal.$el.find( "#cnvwidth").val(nimgw);
		   this.modal.$el.find( "#cnvheight").val(nimgh);
		   this.modal.canvas['height'] = nimgh;
		   this.modal.canvas['width'] = nimgw;
		   this.renderImage();
											   
		},

		renderImage: function () {
			var data = this.currentImage;
			var img = document.createElement('img');
			var can = this.modal.canvas;
			img.onload = function () {
				var ctx = can.getContext('2d');
				ctx.drawImage(this, 0, 0, can.width, can.height);
			};
			img.src = data;
	 
	 
	 
		},
		render: function() {
			this.setValue(this.value);
			this.$el.append('<input type="hidden" name="' + this.key + '" class="imgedtval ' + this.className + '"   value="' + this.value + '"/>')
			return this;
	 
		},
		edit: function() {
			this.modal = new Backbone.BootstrapModal
			({
				content: 'Your file : <input type="file" id="fileinput" /><br/><br/><table><tbody><tr><td>size</td><td><input type="range" min="0" max="100" value="100" id="slider" />%</td><tr><td>Width</td><td><input id="cnvwidth" style="margin-left: 20px; width: 100px;" type="text" value="200" />px</td></tr><tr><td>Height</td><td><input id="cnvheight" style="margin-left: 20px; width: 100px;" type="text" value="200" />px</td></tr></tbody></table><canvas width="200px" height="200px" style="border: 1px solid black;" id="canvas"></canvas>',
				id: 'imgeditor',
				title: 'Image',
				animate: true,
				focusElement: true,
			 });



			this.currentImage = this.getValue();
			var self = this;
				this.modal.on('shown', function (){

				this.modal.canvas = this.modal.$el.find('#canvas').get(0);
				this.modal.$el.on('change', "#slider", function (event) {

					self.changeSize(event.target.value)

				});


				this.modal.$el.on('change', "#fileinput", function (event) {

					if (self.modal.$el.find("#fileinput").get(0).files && self.modal.$el.find("#fileinput").get(0).files[0]) {

						var FR = new FileReader();
						FR.onload = function (e) {

							self.currentImage = e.target.result;
							if (self.currentImage) {
							   var image = document.createElement('img');

							   image.onload = function () {
									// access image size here
									self.modal.$el.find("#cnvwidth").val(this.width);
									self.modal.$el.find("#cnvheight").val(this.height);
									self.modal.canvas['height'] = this.height;
									self.modal.canvas['width'] = this.width;
									self.imgh = this.height;
									self.imgw = this.width;
									self.renderImage();

							    };
							   image.src = self.currentImage;
							   
							   
							   
							}

						};
						FR.readAsDataURL(self.modal.$el.find("#fileinput").get(0).files[0]);

					}


				});


				this.modal.$el.on('keyup', "#cnvwidth", function (event) {
					console.log(event);


					var value = this.value,
					    dimension = 'width';
					if (!/(width|height)/.test(dimension)) {
					    return;
					}
					if (/^\d+$/.test(value)) {
					    self.modal.canvas[dimension] = this.value;
					    self.renderImage();
					}

				});
				this.modal.$el.on('keyup', "#cnvheight", function (event) {
					var value = this.value,  dimension = 'height';
					if (!/(width|height)/.test(dimension)) {
					    return;
					}
					if (/^\d+$/.test(value)) {
					    self.modal.canvas[dimension] = this.value;
					    self.renderImage();
					}

				});

				this.modal.$el.find( "#cnvwidth").val(this.el.height);
				this.modal.$el.find( "#cnvheight").val(this.el.width);
				this.modal.canvas['height'] = this.el.height;
				this.modal.canvas['width'] = this.el.width;
				this.imgw = this.el.width;
				this.imgh = this.el.height;
				this.renderImage();



			}, this);

			this.modal.open(function () {
				self.setValue( self.modal.canvas.toDataURL());
				self.trigger('change', self);

			});

	    },

	    getValue: function() {
		   return this.$el.find('.imgedtval').val();
	    },

	    setValue: function(value) {
			this.$el.find('.imgedtval').val(value);
			this.$el.attr('src', value);
	    },

	    focus: function() {
		   if (this.hasFocus) return;

		   // This method call should result in an input within this edior
		   // becoming the `document.activeElement`.
		   // This, in turn, should result in this editor's `focus` event
		   // being triggered, setting `this.hasFocus` to `true`.
		   // See above for more detail.
		   this.$el.focus();
	    },

	    blur: function() {
		   if (!this.hasFocus) return;

		   this.$el.blur();
	    }
	});
	

	
});
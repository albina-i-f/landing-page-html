$(document).ready(function() {

	var navigation = $('#nav-sticker'), // navigation menu
			toTop = $('.to-top'); // button "to the top"

	// Sticky navigation menu
	navigation.sticky({
		topSpacing: 0,
		zIndex: 100
	});

	// Navigation menu container height
	var navHeight = navigation.parent().height();

	// Toggle navigation menu for small devices
	$('.nav-toggle').click(function(e) {
		e.preventDefault();
	
		$(this)
			.toggleClass('open')
			.next()
			.slideToggle();

		// Proper rendering of dropdown navigation menu,
		// 62px - navigation menu height in close state
		adjustNavContainer(navigation, '62px');
	});

	// Page navigation
	$('nav li:not(:first) > a').click(function(e) {
		e.preventDefault();

		var id  = $(this).attr('href'),
				top = $(id).offset().top;
		$.scrollTo(top-navHeight+1, 800);
	});

	// Popup form
	$('.open-popup')
		.click(function() {
			$('#popup-form h5').html($(this).text());
		})
		.magnificPopup({
		type: 'inline',
		midClick: true,
		removalDelay: 300,
		mainClass: 'mfp-fade'
	});

	$(window).scroll(function() {

		changeActiveSection(navHeight);

		if ($(this).scrollTop() > 300) {
			toTop.fadeIn();
		} else {
			toTop.fadeOut();
		}
	});

	toTop.click(function(e) {
		e.preventDefault();

		$.scrollTo(0, 800);
	});
});

$(window).load(function() { 
	$(".loader-inner").fadeOut(); 
	$(".loader").delay(400).fadeOut("slow"); 

	// Animation
	animate($('header .lead'), 'fadeInUp');
	animate($('header .achievement'), 'fadeIn');
	animate($('.credo .large-text'), 'fadeIn');
	animate($('.credo .lead'), 'fadeInUp');
	animate($('.development .item-wrap'), 'fadeIn');
	animate($('.trade-in .h1'), 'fadeIn');
	animate($('.trade-in .item'), 'fadeInUp');
	animate($('.trade-in .btn-container'), 'fadeIn');
	animate($('.contact-us-wrap'), 'fadeIn');
});

function adjustNavContainer(nav, navHeight) {
	if (nav.css('position') !== 'fixed') {
		nav
			.parent()
			.css('height', 'auto');
	} else {
		nav
			.parent()
			.css('height', navHeight); // navigation menu height in close state
	} 
}

function animate(target, effect) {
	target
		.css('opacity', '0')
		.addClass('animated')
		.waypoint(function(down) {
			target.addClass(effect)
			.css('opacity', '1');
		}, {
			offset: '90%'
		});
}

function changeActiveSection(navHeight) {
	var sections = $('section');
	sections.push($('header'));

	sections.each(function() {
		var top = $(this).offset().top - navHeight,
				bottom = top + $(this).height(),
				scroll = $(window).scrollTop(),
				id = $(this).attr('id');

		if (scroll > top && scroll < bottom) {
			$('nav li.active').removeClass('active');

			if (id !== undefined) {
				$('nav a[href="#'+id+'"]')
				.parent()
				.addClass('active');
			} else {
				$('nav li:first').addClass('active');
			}
		}
	});
}
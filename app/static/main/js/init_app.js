/** *************Init JS*********************

    TABLE OF CONTENTS
	---------------------------
	1.Ready function
	2.Load function
	3.Full height function
	4.APP function
	5.Chat App function
	6.Resize function
 ** ***************************************/
"use strict";
var ActiveApi = DATA.config.Apikey;
$('.js-click-modal').click(function(){
  $('.container').addClass('modal-open');
});

$('.js-close-modal').click(function(){
  $('.container').removeClass('modal-open');
});
function ConfirmPrintOrDelete(location, name_file) {
	//let timerInterval
Swal.fire({
  title: 'Файл ' + name_file,
  html:
    // 'I will close in <strong></strong> seconds.<br/><br/>' +
    // '<button id="increase" class="btn btn-warning">' +
    //   'I need 5 more seconds!' +
    // '</button><br/>' +
    '<button id="delete" class="btn btn-danger btn-lg" style="margin: 10px;">' +
      'Удалить файл' +
    '</button>' + //<br/>' +
    '<button id="sent_file" class="btn btn-success btn-lg" style="margin: 10px;">' +
      'Отправить на печать' +
    '</button>' + //<br/>' +
    '<button id="close" class="btn btn-primary btn-lg" style="margin: 10px;">' +
      'Закрыть' +
    '</button>',
  //timer: 10000,
  onBeforeOpen: () => {
    var content = Swal.getContent();
    var $ = content.querySelector.bind(content);

    var delete_file = $('#delete');
    var sent_file = $('#sent_file');
    var close = $('#close');
    //const increase = $('#increase')

    Swal.showLoading();

    delete_file.addEventListener('click', () => {
    	DeleteFile(location, name_file);
      swal("Успешно", "Файл " + name_file + "успешно удалён" , "success");
    });

    sent_file.addEventListener('click', () => {
    	Swal.close()
    	$('#maintab').click();
    	StartPrint(location, name_file);

      //swal("Отменено", "А ты послушный :)", "error");

    });

    close.addEventListener('click', () => {
      Swal.close()

    });

    // increase.addEventListener('click', () => {
    //   Swal.increaseTimer(5000)
    // })

    // timerInterval = setInterval(() => {
    //   Swal.getContent().querySelector('strong')
    //     .textContent = (Swal.getTimerLeft() / 1000)
    //       .toFixed(0)
    // }, 100)
  },
  // onClose: () => {
  //   clearInterval(timerInterval)
  // }
});
	// Swal.fire({
	// 	text: "text",
	// 	content: "content",
	// 	title: "Test",
	// 	buttons: {
  //   		cancel: {
  //   			text: "Cancel",
  //   			value: null,
  //  		 		visible: false,
  //   			className: "",
  //   			closeModal: true,
	// 		},
	// 		catch: {
  //   			text: "Throw Pokéball!",
	// 			value: "catch",
	// 		},
	// 		confirm: {
  //   text: "OK",
  //   value: true,
  //   visible: true,
  //   className: "",
  //   closeModal: true
  // }
	// 		//defeat: true,
	// 	}
	// }, function () {
  //
  //   });
    // swal("A wild Pikachu appeared! What do you want to do?", {
    	// buttons: {
    	// 	cancel: "Run away!",
	// 		catch: {
    	// 		text: "Throw Pokéball!",
	// 			value: "catch",
	// 		},
	// 		defeat: true,
	// 	},
	// })
		// .then((value) => {
		// 	switch (value) {
		// 		case "defeat":
		// 			swal("Pikachu fainted! You gained 500 XP!");
		// 			break;
		// 		case "catch":
		// 			swal("Gotcha!", "Pikachu was caught!", "success");
		// 			break;
		// 		default:
		// 			swal("Got away safely!");
		// 	}
		// });
    // swal({
    //     title: "Вы уверены ?",
    //     text: "Файл " + name_file + " будет скопирован на внутреннюю память",
    //     type: "warning",
    //     showCancelButton: true,
    //     confirmButtonColor: "#f8b32d",
    //     confirmButtonText: "Да, я сделаю это",
    //     cancelButtonText: "Нет, не хооочу",
    //     closeOnConfirm: true,
    //     closeOnCancel: true
    // }, function (isConfirm) {
    //     if (isConfirm) {
    //     	CommandFile(location, name_file, "copy");
    //         StartPrint(location, name_file);
    //         $('#maintab').click();
    //     } else {
    //         swal("Отменено", "А ты послушный :)", "error");
    //     }
    // });
}

function CommandFile(filepath, name, command) {
	//alert('Копируется файл' + filepath);
	$.ajax(
        {
            "async": true,
            "url": "http://localhost:5001/manage_file",
            "method": "POST",
			"data": JSON.stringify({"path": filepath,
			"command": command, "name": name})
    }).done(function (response){
    	Swal.fire(
            'Скопировано!',
            'Ваш файл успешно скопирован.',
            'success'
        );
    	//alert('Файл скопирован');
    })
		.error(function (response) {
			Swal.fire(
            'Не скопировано!',
            'Произошла проблема',
            'error'
        );
			//alert('Файл не скопирован');
        });
}
function ConfirmCopy(location, name_file) {
    Swal.fire({
        title: "Вы уверены ?",
        text: "Файл " + name_file + " будет скопирован на внутреннюю память",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#f8b32d",
        confirmButtonText: "Да, я сделаю это",
        cancelButtonText: "Нет, не хооочу",
        closeOnConfirm: true,
        closeOnCancel: true
    }).then((result) => {
  if (result.value)
	{
		CommandFile(location, name_file, "copy");

    }})
  // }
  //   , function (isConfirm) {
  //       if (isConfirm) {
  //       	//alert('confirm')
  //       	CommandFile(location, name_file, "copy");
  //           //StartPrint(location, name_file);
  //           $('#maintab').click();
  //       } else {
  //           swal("Отменено", "А ты послушный :)", "error");
  //       }
  //   });
}
 /** ***************************************/

var InitApp = function () {
	$('.preloader-it > .la-anim-1').addClass('la-animate');
	$('#pie_chart_1').data('easyPieChart').update(0);
	$('#degres_1').text('/' + DATA.Definition.Target + '°');
	$('#pie_chart_3').data('easyPieChart').update(0);
	$('#pie_chart_34').data('easyPieChart').update(0);
	$('#pie_chart_feed_rate').data('easyPieChart').update(0);
	$('#degres_3').text('/' + DATA.Definition.Target + '°');
	$('#progress').html('');
	$('#pie_chart_feed_rate').data('easyPieChart').update(50);
	$('#t_board').text(String(Temp.Default.Bed));
  	$('#t_tool').text(String(Temp.Default.Tool));
     $('#nozzle').text(Apps._settings.Definition.MainTool);
     if (DATA.chambery) {
         $('#pie_chart_chambery').data('easyPieChart').update(0);
         // $('#degres_chambery').text('/' + DATA.Definition.Target + '°');

         // pie_chart_chambery
     }


// =======================================
// select temp tool0

     $("#range_temp_tool0").ionRangeSlider({
        onChange: function (data) {
        	Apps.temp_tool0 = data.from;
        }
    });
     var range_temp_tool0 = $("#range_temp_tool0").data("ionRangeSlider");
     range_temp_tool0.update({
         min: 0,
         max: 300,
		 from: Apps.temp_tool0,
         step: 10,
         skin: "big"
     });


// =======================================
// select temperature chamber
     $("#range_temp_chamber").ionRangeSlider({
        onChange: function (data) {
        	Apps.temp_chamber = data.from;
        	// var pie_chart_feed_rate = $('#pie_chart_feed_rate');
        	// pie_chart_feed_rate.data('easyPieChart').update(data.from_percent);
         //    pie_chart_feed_rate.find('.percents').text(data.from);
        	// console.log('Change', data.from, data.from_percent);
        }
    });
     var range_temp_chamber = $("#range_temp_chamber").data("ionRangeSlider");
     range_temp_chamber.update({
         min: 0,
         max: 300,
		 from: Apps.temp_chamber,
         step: 10,
         skin: "big"
     });
 // };



// =======================================
// select temp board

     $("#range_temp_board").ionRangeSlider({
        onChange: function (data) {
        	Apps.temp_board = data.from;
        }
    });
     var range_temp_board = $("#range_temp_board").data("ionRangeSlider");
     range_temp_board.update({
         min: 0,
         max: 130,
		 from: Apps.temp_board,
         step: 10,
         skin: "big"
     });



// =======================================
// select range feed rate
     $("#range_feed_rate").ionRangeSlider({
        onChange: function (data) {
        	Apps.feed_rate = data.from;
        	var pie_chart_feed_rate = $('#pie_chart_feed_rate');
        	pie_chart_feed_rate.data('easyPieChart').update(data.from_percent);
            pie_chart_feed_rate.find('.percents').text(data.from);
        	console.log('Change', data.from, data.from_percent);
        }
    });
     var range_feed_rate = $("#range_feed_rate").data("ionRangeSlider");
     range_feed_rate.update({
         min: 50,
         max: 300,
		 from: Apps.feed_rate,
         step: 10,
         skin: "big"
     });

     // $("#range_feed_rate").ionRangeSlider({
     //
     // });
 };
$(window).load(function() {
  $('a.toolbtn').click(function() {
      $('a.toolbtn.active').removeClass("active");
      $(this).toggleClass("active");
      Apps.Printer.Tool.changeTool($(this).text());
      //console.log($(this).text());
  });
});
//Managment fan buttons
$(window).load(function () {
    $('a.fanbtn').click(function () {
        $('a.fanbtn.active').removeClass("active");
        $(this).toggleClass("active");
        var percents = $(this).text().substr(0, $(this).text().length - 1);
        Apps.PlayCommand($(this).attr('data'));
        $('#pie_chart_34').find('.percents').text(percents);
        $('#pie_chart_34').data('easyPieChart').update(+percents);

        //console.log($(this).attr('data'));
    });
});
/*****Ready function start*****/
$(document).ready(function(){
	App();
	InitApp();
	ConnectOctoprint();
	Apps.init();
});
/*****Ready function end*****/

/*****Load function start*****/
$(window).on("load", function() {
    $(".preloader-it").delay(500).fadeOut("slow");
	/*Progress Bar Animation*/
	var progressAnim = $('.progress-anim');
	if( progressAnim.length > 0 ){
		for(var i = 0; i < progressAnim.length; i++){
			var $this = $(progressAnim[i]);
			$this.waypoint(function() {
			var progressBar = $(".progress-anim .progress-bar");
			for(var i = 0; i < progressBar.length; i++){
				$this = $(progressBar[i]);
				$this.css("width", $this.attr("aria-valuenow") + "%");
			}
			}, {
			  triggerOnce: true,
			  offset: 'bottom-in-view'
			});
		}
	}
    $('ul.menu-main').on('click', 'li:not(.active)', function() {
		$(this)
			.addClass('active').siblings().removeClass('active')
			.closest('div.tabs').find('div.tabs__content').removeClass('active').eq($(this).index()).addClass('active');
	});

	var tabIndex = window.location.hash.replace('#tab','')-1;
	if (tabIndex != -1) $('ul.menu-main li').eq(tabIndex).click();

	$('a[href*=#tab]').click(function() {
		var tabIndex = $(this).attr('href').replace(/(.*)#tab/, '')-1;
		$('ul.menu-main li').eq(tabIndex).click();
	});

    // another style
    // document.styleSheets[0].insertRule('a:active { color: #333 !important; }', 0);
    // document.styleSheets[0].insertRule('a:visited { color: white !important; }', 0);
});
/*****Load function* end*****/

/***** Full height function start *****/
var setHeightWidth = function () {
	var height = $(window).height();
	var width = $(window).width();
	$('.full-height').css('height', (height));
	$('.page-wrapper').css('min-height', (+height-6));

	/*Right Sidebar Scroll Start*/
	if(width<=1007){
		$('#chat_list_scroll').css('height', (height - 270));
		$('.fixed-sidebar-right .chat-content').css('height', (height - 279));
		$('.fixed-sidebar-right .set-height-wrap').css('height', (height - 219));

	}
	else {
		$('#chat_list_scroll').css('height', (height - 204));
		$('.fixed-sidebar-right .chat-content').css('height', (height - 213));
		$('.fixed-sidebar-right .set-height-wrap').css('height', (height - 153));
	}
	/*Right Sidebar Scroll End*/

	/*Vertical Tab Height Cal Start*/
	var verticalTab = $(".vertical-tab");
	if( verticalTab.length > 0 ){
		for(var i = 0; i < verticalTab.length; i++){
			var $this =$(verticalTab[i]);
			$this.find('ul.nav').css(
			  'min-height', ''
			);
			$this.find('.tab-content').css(
			  'min-height', ''
			);
			height = $this.find('ul.ver-nav-tab').height();
			$this.find('ul.nav').css(
			  'min-height', height + 40
			);
			$this.find('.tab-content').css(
			  'min-height', height + 40
			);
		}
	}
	/*Vertical Tab Height Cal End*/
};
/***** Full height function end *****/

/***** main app function start *****/
var $wrapper = $(".wrapper");
function App(){

	/*Counter Animation*/
	var counterAnim = $('.counter-anim');
	if( counterAnim.length > 0 ){
		counterAnim.counterUp({ delay: 10,
        time: 1000});
	}

	/*Tooltip*/
	if( $('[data-toggle="tooltip"]').length > 0 )
		$('[data-toggle="tooltip"]').tooltip();

	/*Popover*/
	if( $('[data-toggle="popover"]').length > 0 )
		$('[data-toggle="popover"]').popover()


	/*Sidebar Collapse Animation*/
	var sidebarNavCollapse = $('.fixed-sidebar-left .side-nav  li .collapse');
	var sidebarNavAnchor = '.fixed-sidebar-left .side-nav  li a';
	$(document).on("click",sidebarNavAnchor,function (e) {
		if ($(this).attr('aria-expanded') === "false")
				$(this).blur();
		$(sidebarNavCollapse).not($(this).parent().parent()).collapse('hide');
	});

	/*Panel Remove*/
	$(document).on('click', '.close-panel', function (e) {
		var effect = $(this).data('effect');
			$(this).closest('.panel')[effect]();
		return false;
	});

	/*Accordion js*/
		$(document).on('show.bs.collapse', '.panel-collapse', function (e) {
		$(this).siblings('.panel-heading').addClass('activestate');
	});

	$(document).on('hide.bs.collapse', '.panel-collapse', function (e) {
		$(this).siblings('.panel-heading').removeClass('activestate');
	});

	/*Sidebar Navigation*/
	$(document).on('click', '#toggle_nav_btn,#open_right_sidebar,#setting_panel_btn', function (e) {
		$(".dropdown.open > .dropdown-toggle").dropdown("toggle");
		return false;
	});
	$(document).on('click', '#toggle_nav_btn', function (e) {
		$wrapper.removeClass('open-right-sidebar open-setting-panel').toggleClass('slide-nav-toggle');
		return false;
	});

	$(document).on('click', '#open_right_sidebar', function (e) {
		$wrapper.toggleClass('open-right-sidebar').removeClass('open-setting-panel');
		return false;

	});

	$(document).on('click','.product-carousel .owl-nav',function(e){
		return false;
	});

	$(document).on('click', 'body', function (e) {
		if($(e.target).closest('.fixed-sidebar-right,.setting-panel').length > 0) {
			return;
		}
		$('body > .wrapper').removeClass('open-right-sidebar open-setting-panel');
		return;
	});

	$(document).on('show.bs.dropdown', '.nav.navbar-right.top-nav .dropdown', function (e) {
		$wrapper.removeClass('open-right-sidebar open-setting-panel');
		return;
	});

	$(document).on('click', '#setting_panel_btn', function (e) {
		$wrapper.toggleClass('open-setting-panel').removeClass('open-right-sidebar');
		return false;
	});
	$(document).on('click', '#toggle_mobile_nav', function (e) {
		$wrapper.toggleClass('mobile-nav-open').removeClass('open-right-sidebar');
		return;
	});


	$(document).on("mouseenter mouseleave",".wrapper > .fixed-sidebar-left", function(e) {
		if (e.type == "mouseenter") {
			$wrapper.addClass("sidebar-hover");
		}
		else {
			$wrapper.removeClass("sidebar-hover");
		}
		return false;
	});

	$(document).on("mouseenter mouseleave",".wrapper > .setting-panel", function(e) {
		if (e.type == "mouseenter") {
			$wrapper.addClass("no-transition");
		}
		else {
			$wrapper.removeClass("no-transition");
		}
		return false;
	});

	/*Todo*/
	var random = Math.random();
	$(document).on("keypress","#add_todo",function (e) {
		if ((e.which == 13)&&(!$(this).val().length == 0))  {
				$('<li class="todo-item"><div class="checkbox checkbox-success"><input type="checkbox" id="checkbox'+random+'"/><label for="checkbox'+random+'">' + $('.new-todo input').val() + '</label></div></li><li><hr class="light-grey-hr"/></li>').insertAfter(".todo-list li:last-child");
				$('.new-todo input').val('');
		} else if(e.which == 13) {
			alert('Please type somthing!');
		}
		return;
	});
	/*Horizontal Nav*/
	$(document).on("show.bs.collapse",".top-fixed-nav .fixed-sidebar-left .side-nav > li > ul",function (e) {
		e.preventDefault();
	});

	/*Slimscroll*/
	$('.nicescroll-bar').slimscroll({height:'100%',color: '#878787', disableFadeOut : true,borderRadius:0,size:'4px',alwaysVisible:false});
	$('.message-nicescroll-bar').slimscroll({height:'229px',size: '4px',color: '#878787',disableFadeOut : true,borderRadius:0});
	$('.message-box-nicescroll-bar').slimscroll({height:'350px',size: '4px',color: '#878787',disableFadeOut : true,borderRadius:0});
	$('.product-nicescroll-bar').slimscroll({height:'346px',size: '4px',color: '#878787',disableFadeOut : true,borderRadius:0});
	$('.app-nicescroll-bar').slimscroll({height:'162px',size: '4px',color: '#878787',disableFadeOut : true,borderRadius:0});
	$('.todo-box-nicescroll-bar').slimscroll({height:'310px',size: '4px',color: '#878787',disableFadeOut : true,borderRadius:0});
	$('.users-nicescroll-bar').slimscroll({height:'370px',size: '4px',color: '#878787',disableFadeOut : true,borderRadius:0});
	$('.users-chat-nicescroll-bar').slimscroll({height:'257px',size: '4px',color: '#878787',disableFadeOut : true,borderRadius:0});
	$('.chatapp-nicescroll-bar').slimscroll({height:'543px',size: '4px',color: '#878787',disableFadeOut : true,borderRadius:0});
	$('.chatapp-chat-nicescroll-bar').slimscroll({height:'483px',size: '4px',color: '#878787',disableFadeOut : true,borderRadius:0});

	/*Product carousel*/
	if( $('.product-carousel').length > 0 )
	var $owl = $('.product-carousel').owlCarousel({
		loop:true,
		margin:15,
		nav:true,
		navText: ["<i class='zmdi zmdi-chevron-left'></i>","<i class='zmdi zmdi-chevron-right'></i>"],
		dots:false,
		autoplay:true,
		responsive:{
			0:{
				items:1
			},
			400:{
				items:2
			},
			767:{
				items:3
				},
			1399:{
				items:4
			}
		}
	});

	/*Refresh Init Js*/
	var refreshMe = '.refresh';
	$(document).on("click",refreshMe,function (e) {
		var panelToRefresh = $(this).closest('.panel').find('.refresh-container');
		var dataToRefresh = $(this).closest('.panel').find('.panel-wrapper');
		var loadingAnim = panelToRefresh.find('.la-anim-1');
		panelToRefresh.show();
		setTimeout(function(){
			loadingAnim.addClass('la-animate');
		},100);
		function started(){} //function before timeout
		setTimeout(function(){
			function completed(){} //function after timeout
			panelToRefresh.fadeOut(800);
			setTimeout(function(){
				loadingAnim.removeClass('la-animate');
			},800);
		},1500);
		  return false;
	});

	/*Fullscreen Init Js*/
	$(document).on("click",".full-screen",function (e) {
		$(this).parents('.panel').toggleClass('fullscreen');
		$(window).trigger('resize');
		return false;
	});

	/*Nav Tab Responsive Js*/
	$(document).on('show.bs.tab', '.nav-tabs-responsive [data-toggle="tab"]', function(e) {
		var $target = $(e.target);
		var $tabs = $target.closest('.nav-tabs-responsive');
		var $current = $target.closest('li');
		var $parent = $current.closest('li.dropdown');
			$current = $parent.length > 0 ? $parent : $current;
		var $next = $current.next();
		var $prev = $current.prev();
		$tabs.find('>li').removeClass('next prev');
		$prev.addClass('prev');
		$next.addClass('next');
		return;
	});
};
/***** jetson function end *****/

/***** Chat App function Start *****/
var chatAppTarget = $('.chat-for-widgets-1.chat-cmplt-wrap');
var chatApp = function() {
	$(document).on("click",".chat-for-widgets-1.chat-cmplt-wrap .chat-data",function (e) {
		var width = $(window).width();
		if(width<=1007) {
			chatAppTarget.addClass('chat-box-slide');
		}
		return false;
	});
	$(document).on("click","#goto_back_widget_1",function (e) {
		var width = $(window).width();
		if(width<=1007) {
			chatAppTarget.removeClass('chat-box-slide');
		}
		return false;
	});
};
/***** Chat App function End *****/

var boxLayout = function() {
	if((!$wrapper.hasClass("rtl-layout"))&&($wrapper.hasClass("box-layout")))
		$(".box-layout .fixed-sidebar-right").css({right: $wrapper.offset().left + 300});
		else if($wrapper.hasClass("box-layout rtl-layout"))
			$(".box-layout .fixed-sidebar-right").css({left: $wrapper.offset().left});
}
boxLayout();

/***** Resize function start *****/
$(window).on("resize", function () {
	setHeightWidth();
	boxLayout();
	chatApp();
}).resize();
/***** Resize function end *****/


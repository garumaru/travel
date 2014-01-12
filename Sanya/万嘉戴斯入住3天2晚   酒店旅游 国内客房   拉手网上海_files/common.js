function Tools(){}
Tools.RemainTime = function(){
	//获取总体剩余时间
	this.second = 0;
	//用数组记录下时间
	this.remainTime = [];
	//递减数量
	this.remainNum  = 1;
	this.timeout = null;
	//直接开始运行
	//this.start();
}
Tools.RemainTime.prototype = {
	start:function(){
		this.init();
	},
	init:function(){
		this.run();
	},
	run:function(){
		this.setRemainTime(this.second);//初始化时间数组
		this.setText();
		var oo = this;
		this.second = this.second - 1;
		this.timeout = setTimeout(function(){oo.run();},1000);
	},
	setRemainTime:function(second){
				if(second==0) location.reload();
		var day = parseInt(second/86400);
		var hour = parseInt((second-day*86400)/3600);
		var minute = parseInt((second-day*86400-hour*3600)/60);
		var second = parseInt(second-day*86400-hour*3600-minute*60);
		this.remainTime = [day,hour,minute,second];
	},
	setText:function(){
		document.getElementById('day').innerHTML=this.remainTime[0];
		document.getElementById('hour').innerHTML=this.remainTime[1];
		document.getElementById('minute').innerHTML=this.remainTime[2];
		document.getElementById('second').innerHTML=this.remainTime[3];
	}
}

var Timer = function(second_left,id){
	this.second = second_left;
	this.id = id;
}
Timer.prototype = new Tools.RemainTime();
Timer.prototype.setText = function(){
	$('#'+this.id).html(this.remainTime[0]+'天'+this.remainTime[1]+'小时'+this.remainTime[2]+'分钟'+this.remainTime[3]+'秒');
}




function initialize(){		
	
	var myOptions = {
			zoom:14,
			center:latlng,
			mapTypeId:google.maps.MapTypeId.ROADMAP,
			mapTypeControl:false
		}
	map = new google.maps.Map($('#map_canvas')[0],myOptions);

	if(arguments[0]){
		 var locations = arguments[0];
		 for (var i = 0; i < locations.length; i++) {
				var beach = locations[i];
				var myLatLng = new google.maps.LatLng(beach[1], beach[2]);
				new google.maps.Marker({
					position: myLatLng,
					map: map
				});
		  }
	}else{
		if(lat && lng){
			var latlng = new google.maps.LatLng(lat, lng);
		}else{
			var latlng = new google.maps.LatLng(39.90870752436677, 116.39750182628632);
		}
		marker = new google.maps.Marker({
			 position: latlng, 
			 map: map
		});
	}
}

Array.prototype.index = function(val){
	var index = -1;
    for (var i = 0; i < this.length; i++)
    {
        if (this[i] == val)
        {
            index = i;
            break;
        }
    }
    return index;
}


Array.prototype.removeByIndex = function(dx){

	if(isNaN(dx)||dx>this.length){return false;}
    for(var i=0,n=0;i<this.length;i++)
    {
        if(this[i]!=this[dx])
        {
            this[n++]=this[i]
        }
    }
    this.length-=1;
}

Array.prototype.max = function () {
    var max = this[0];
    var len = this.length;
    for (var i = 1; i < len; i++) {
        if (this[i] > max) {
            max = this[i];
        }
    }
    return max;
}

Array.prototype.min = function () {
    var min = this[0];
    var len = this.length;
    for (var i = 1; i < len; i++) {
        if (this[i] < min) {
            min = this[i];
        }
    }
    return min;
}

/*
Array.max = function (array) {
    return Math.max.apply(Math, array);
};
Array.min = function (array) {
    return Math.min.apply(Math, array);
}; 
*/

/*
Array.prototype.max = function () {
    return Math.max.apply({}, this)
}
 
Array.prototype.min = function () {
    return Math.min.apply({}, this)
}
*/


Array.prototype.in_array = function (val) {
    var i = 0
	for(;i<this.length;i++){
	    if ( this[ i ] == val )
		return i;
	}
    return -1;
}


function apend_options(obj,num)
{
	var e = $('#'+obj)[0];
	e.options.length = 0 ;
	e.options.add(new Option('-请选择-',0))
	num = num?num:1;
	for(var i=1;i<=num;i++){
		e.options.add(new Option(i+'间',i))
	}
}


function creat_options(num)
{
	var s = '';
	for(var i=1;i<=num;i++){
		s += '<li title="'+ i +'">&nbsp;&nbsp;<strong>'+ i +'</strong>&nbsp;&nbsp;间</li>';
	}
	$('#options_li').html(s);
}



function update_option()
{
	$('#dp-popup').hide();
	$('#roomsList').show();
}

function create_calendar(goods_attr){

	$('#product').html(goods_attr[3]);
	$('#price').html(goods_attr[4]);
	$('#value').html(goods_attr[5]);
	creat_options(goods_attr[2]);
	$.getJSON('/hotel/ajax.php?act=update_status&goods_id='+goods_attr[6],function(data){
		calendar = new LsCalendar($('#dp-calendar'),{
			startDate	:  goods_attr[0],
			endDate		:  goods_attr[1],
			roomsData	:  data?data:null,
			callback	:  function(){
				if(calendar.checkedDate.length == 0){
					$('#dates_div').html('<table class="detail_table_2" width="92%" style="margin:0px auto" cellpadding="0" cellspacing="0"><tr><td colspan="3" id="detail_td" ><span style="font-size:12px;">请选择入住时间</span></td></tr><tr><td class="available">预订中</td><td class="checked">已选定</td><td class="unavailable">不可选</td></tr></table>');
					$('#total_fee').html(0+'');
					$('#checkedDate').val('');
				}else{
					$('#dates_div').html('<table width="92%" border="0" cellpadding="0" cellspacing="0" class="hbsd"><tr><td style="font-size:12px;color:#999;border-bottom:#ccc 1px solid;text-align:center;width:70px;">预订天数</td><td style="font-size:12px;color:#999;border-bottom:#ccc 1px solid;text-align:center">已选日期</td></tr><tr><td style="font-size:18px;font-weight:bold;text-align:center;vertical-align:top;padding-top:5px;width:70px;">'+calendar.nights+'夜</td><td><span>'+calendar.checkedDate.sort().join('</span><span>')+'</span></td></tr></table>');
					$('#total_fee').html(Number((calendar.nights)*(goods_attr[4])*($('#roomNum').val())).toFixed(2)+'');
					$('#checkedDate').val(calendar.checkedDate.sort().join(','));
				}
			}
		});
		calendar.create();
	});
}

function create_calendar_2(goods_attr){
	
	var maxCheckedDate = arguments[1]?arguments[1]:0;

	$.getJSON('/hotel/ajax.php?act=update_status&goods_id='+goods_attr[6],function(data){
		calendar = new LsCalendar($('#dp-calendar'),{
			startDate	:  goods_attr[0],
			endDate		:  goods_attr[1],
			roomsData	:  data?data:null,
			display_all	:  true,
			maxCheckedDate : maxCheckedDate,
			callback	:  function(){
				if(calendar.checkedDate.length == 0){

					$('.db_date').show();
					$('.db_price').hide();
					$('#checkedDate_td').html('');
					$('#checkedDate').val('');
					$('input[name=days]').focus();
					
					$('#total_fee').html(0+'');
					$('#saving').html(0+'');

				}else{

					$('.db_date').hide();
					$('.db_price').show();
					$('#checkedDate_td').html('<span style="font-size:11px;height:18px;text-align:center;display:block">'+calendar.checkedDate.sort().join('</span><span style="font-size:11px;height:18px;text-align:center;display:block">')+'</span>');
					$('#checkedDate').val(calendar.checkedDate.sort().join(','));
					$('input[name=days]').val('');
					
					$('#total_fee').html(Number((calendar.nights)*(goods_attr[4])*($('#roomNum').val())).toFixed(2)+'');
					$('#saving').html(Number((calendar.nights)*(goods_attr[5]-goods_attr[4])*($('#roomNum').val())).toFixed(2)+'');

				}
			}
		});
		calendar.create();
		$('input[name=days]').focus();
	});
}

function create_calendar_3(goods_attr){
	
	var maxCheckedDate = arguments[1]?arguments[1]:0;

	$.getJSON('/hotel/ajax.php?act=update_status&goods_id='+goods_attr[6],function(data){
		calendar = new LsCalendar($('#dp-calendar'),{
			startDate	:  goods_attr[0],
			endDate		:  goods_attr[1],
			roomsData	:  data?data:null,
			display_all	:  true,
			maxCheckedDate : maxCheckedDate,
			callback	:  function(){
				$('#checkedDate_td').html('<span style="font-size:11px;height:18px;text-align:center;display:block">'+calendar.checkedDate.sort().join('</span><span style="font-size:11px;height:18px;text-align:center;display:block">')+'</span>');
				$('#checkedDate').val(calendar.checkedDate.sort().join(','));
				$('#days').html((goods_attr[7]-calendar.checkedDate.length) + '');
			}
		});
		calendar.create();
	});

}

$(function(){
	
	$('#select_div').hover(function(){
		$('#options_li').show();
	},function(){
		$('#options_li').hide();
	})

	$('#options_li').find('li').live('click', function(){
		var num = $(this).attr('title');
		$('#select_div').find('span').html('&nbsp;&nbsp;<strong>'+num+'</strong>间');
		$('#roomNum').val(num);
		var night = $('#checkedDate').val()?$('#checkedDate').val().split(',').length:0;
		var price = Number($('#price').html());
		$('#total_fee').html((night*price*num).toFixed(2)+'');
		$('#options_li').hide();
	})
})


function IsNumeric(sText){
   var ValidChars = "0123456789";
   var IsNumber=true;
   var Char;
   for (i = 0; i < sText.length && IsNumber == true; i++){
	  Char = sText.charAt(i);
	  if (ValidChars.indexOf(Char) == -1){
		 IsNumber = false;
	  }
   }
   return IsNumber;
}


function count_fee()
{
	var days = null;
	var checkedDate = $('#checkedDate').val();

	if(checkedDate){
		days = checkedDate.split(',').length;
		$('#total_fee').html(Number(days*(goods_attr[4])*($('#roomNum').val())).toFixed(2)+'');
		$('#saving').html(Number(days*(goods_attr[5]-goods_attr[4])*($('#roomNum').val())).toFixed(2)+'');
		return;
	}

	var input_days = $('#days').val();
	if(input_days && !IsNumeric(input_days)){
		alert('请输入有效的入住天数!');
		return;
	}
	
	days = input_days;
	var maxDays = calendar.maxDays?calendar.maxDays:50;
	if(days > maxDays){
		alert('入住天数太大了，请输入有效的入住天数!');
		return;
	}

	$('#total_fee').html(Number(days*(goods_attr[4])*($('#roomNum').val())).toFixed(2)+'');
	$('#saving').html(Number(days*(goods_attr[5]-goods_attr[4])*($('#roomNum').val())).toFixed(2)+'');
}

function post_check()
{
	if(uid == 0){
		alert('请注册或登录拉手网');
		return false;f
	}

	var checkedDate = $.trim($('#checkedDate').val());
	var roomNum = $('#roomNum').val();
	var goods_id = $('#checked_goods_id').val();


	if(!goods_id){
		alert('请选择房型');
		return false;
	}else if(checkedDate == ''){
		alert('请选择入住日期');
		return false;
	}else if(roomNum == 0){
		alert('请选择房间数');
		return false;
	}

	return true;
}

function post_check_2()
{

	var checkedDate = $.trim($('#checkedDate').val());
	var days = $.trim($('#days').val());
	
	if(checkedDate == '' && days == ''){
		alert('请选择入住日期或填写入住天数!')
		return false;
	}

	var buy_mobile =  $.trim($('#buy_mobile').val());
	var guest = $.trim($('input[name=guest]').val());
	var guest_mobile = $.trim($('#guest_mobile').val());
	
	
	var partten = /^1[3458]\d{9}$/;
	
	if( buy_mobile=='' || !partten.test(buy_mobile)){
		alert('请输入正确的购买人手机号!')
		$('#buy_mobile').focus();
		return false;
	}
	
	if(guest == ''){
		alert('请填写入住人姓名!');
		$('input[name=guest]').focus();
		return false;
	}
	
	if(guest_mobile == '' || !partten.test(guest_mobile)){
		alert('请填写入住人手机!');
		$('#buy_mobile').focus();
		return false;
	}

	return true;
}


function post_check_3()
{
	var checkedDate = $.trim($('#checkedDate').val());
	if(checkedDate == '' ){
		alert('请选择入住日期!')
		return false;
	}

	if(checkedDate.split(',').length != goods_attr[7]){
		alert('你的可选天数为'+goods_attr[7]+'天，请选择完整!')
		return false;
	}

	return true;
}

function send_mail(obj){
	var email = $('#trip_email').val();
	if($.trim(email) == ''){
		return
	}
	var testEmail = /^[A-Za-z0-9](([_\.\+\-]?[a-zA-Z0-9]+)*)@([A-Za-z0-9]+)(([\.\-]?[a-zA-Z0-9]+)*)\.([A-Za-z]{2,})$/;		
	if(!testEmail.test(email)){
		$('#trip_email_hint').html("请输入正确的邮件地址")
		return;
	}
	$(obj).attr('disabled',true);
	jQuery.post('/hotel/ajax.php?act=trip_email',{email:email},function(data){
		$(obj).attr('disabled',false);
		$('#trip_email_hint').html(data);
		$('#trip_email').val('');
		setTimeout(function(){$('#trip_email_hint').html('');},2000);
	})
}
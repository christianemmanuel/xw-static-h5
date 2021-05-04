// 返回按钮添加回退
$(document).ready(function() {	
	$(".mui-action-back").attr("href","javascript:void(0);").click(function(){
		if (/(iPhone|iPad|iPod)/i.test(navigator.userAgent)) {             
	        	window.location.href = window.document.referrer;
		} else { window.history.go("-1"); }
	});
	isLowerBrowser();
});

// 时间格式化
Date.prototype.format = function(format) {
	var o = {
		"M+" : this.getMonth() + 1, // month
		"d+" : this.getDate(), // day
		"h+" : this.getHours(), // hour
		"m+" : this.getMinutes(), // minute
		"s+" : this.getSeconds(), // second
		"q+" : Math.floor((this.getMonth() + 3) / 3), // quarter
		"S" : this.getMilliseconds()
	// millisecond
	}
	if (/(y+)/.test(format)) {
		format = format.replace(RegExp.$1, (this.getFullYear() + "")
				.substr(4 - RegExp.$1.length));
	}
	for ( var k in o) {
		if (new RegExp("(" + k + ")").test(format)) {
			format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k]
					: ("00" + o[k]).substr(("" + o[k]).length));
		}
	}
	return format;
}
function isVivo(){
	var ua = navigator.userAgent.toLowerCase();
	return ua.indexOf('vivo')!=-1||ua.indexOf('oppo')!=-1||ua.indexOf('360')!=-1;
}
function _getStorageData(key){
	var s_data = null;
	s_data = isVivo() ? $.cookie(key) : sessionStorage.getItem(key);
	return s_data==undefined||s_data==null ? null : s_data;
	// if(isVivo()){ return $.cookie(key); } return sessionStorage.getItem(key);
}
function _setStorageData(key,value){
	if(isVivo()){
		var _date=new Date();
		_date.setHours(_date.getHours()+4);
		$.cookie(key, value, { expires: _date, path: '/'});return;
	}
	sessionStorage.setItem(key,value);
}
function _removeStorageData(key){
	if(isVivo()){
		$.cookie(key, null, { path: '/'});return;
	}
	sessionStorage.removeItem(key);
}
function wap_site_host(){
	var testStatus = _getStorageData("rstTestStatus") | 0;
	return getRandomDomain('rst', testStatus);
}
//{'loginName':loginName,'memberName':memberName,'token':tokenValue,'vipName':d.data.vip.vipName,'vipLevel':d.data.vip.vipLevel,
//		'domain':d.data.domain,'cashierDomain':d.data.cashierDomain,'userDomain':''}
//domain 服务器地址,cashierDomain 存款地址
var domain_urls = ['https://wrss1072ex.5ct5mm555.com/','https://wrss1092.5ct5mm555.com/'];

var all_domains = [{"rst" : ['https://wrss1072ex.5ct5mm555.com/', 'https://wrss1092.5ct5mm555.com/'], "cr" : ['https://wcrr.5ct5mm555.com/']}, {"rst" : ['https://smart.jskpaper.com'], "cr" : ['https://lnks.jskpaper.com']}];
function wap_get_user(){
	var loginUser = _getStorageData("$user");
	if(loginUser=='null'||loginUser==null||loginUser==undefined){
		//正式
		var defaultDomain = _getStorageData('_df_domain');
		if(defaultDomain==undefined || defaultDomain=='' || defaultDomain==null){
			defaultDomain = domain_urls[Math.floor(Math.random()*domain_urls.length)];
			_setStorageData('_df_domain', defaultDomain);
		}
        //defaultDomain="http://t196.xdy20.com:8080/";
        return {'loginName':'','memberName':'','token':'','vipName':'','vipLevel':'','domain':wap_site_host(),'cashierDomain':'','userDomain':''};
	}
	var userJson = JSON.parse(loginUser);
	userJson.domain = wap_site_host();
	userJson.cashierDomain = getRandomDomain('cr');
	return userJson;
}
function checkRst() {
	var testUrl = getRandomDomain('rst', 0);
	$.ajax({
       	url: testUrl + "/member/wrong",
		type:"GET",
		data:{},
		success:function(d) {
			_setStorageData('rstTestStatus', 0);
 		 },
 		 error:function(e){
 			_setStorageData('rstTestStatus', 1);
 		 }
	});
}
function getRandomDomain(type, i) {
	var index = i | (_getStorageData("rstTestStatus") | 0);
	return all_domains[index][type][Math.floor(Math.random()*all_domains[index][type].length)];
}
function wap_set_user(user){
	_setStorageData('$user', JSON.stringify(user));
}
function wap_logout(){
	_removeStorageData('$user');
}
function wap_is_user_notexist(){
	var userData = _getStorageData("$user");
	var isNotExist = userData==null||userData=='null'||userData==undefined;
	return isNotExist;
}
function wap_need_login(){
	wap_go_login('请登录后再操作');
}
function wap_go_login(msg){
	msg= (msg==null||msg==undefined) ? '': msg;
	_setStorageData('_notice_msg', msg);
	window.location.href="/wap/login.html";
}
function wap_check_ajaxerror(jqXHR){
	if(jqXHR!=null&&jqXHR!=undefined&&jqXHR.status==401&&jqXHR.responseJSON!=undefined&&jqXHR.responseJSON!=null){
		wap_if_session_out(jqXHR.responseJSON.code);
	}
}
function wap_if_session_out(code){
	if(code==12001||code==12002||code==12003||code==12004){
		wap_session_out();
	}
}
function wap_session_out(){
	wap_logout();
	wap_go_login('登录超时，请重新登录');
}
function fun_filterTxt(txt){
	if(txt==''||txt==null||txt==undefined){return '';}
	txt = txt+'';
	return txt.replace(/</g,'&lt;').replace(/>/g,'&gt;');
}
function fun_timeFormat(_timeStamp){
	if(_timeStamp==null||_timeStamp==undefined){return '';}
	// 比如需要这样的格式 yyyy-MM-dd hh:mm:ss
	var date = new Date(_timeStamp);
	Y = date.getFullYear() + '-';
	M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
	D = date.getDate() + ' ';
	h = date.getHours() + ':';
	m = date.getMinutes() + ':';
	s = date.getSeconds(); 
	return Y+M+D+h+m+s;
}
function isLowerBrowser(){
	var ua =navigator.userAgent.toLowerCase();
	return ua.indexOf('android 4.0')!=-1;
}
function fun_toast(msg){
	if(isLowerBrowser()){
		layer.msg(msg, {offset:'b',time: 2000});
	}else{
		mui.toast(msg);
	}
}
function fun_checkLoginStatus(functionSuccess){
    $.ajax({
        dataType: "jsonp",
        url:wap_site_host() + "/member/checkLoginStatus",
        type:"GET",
        data:{'token':wap_get_user().token},
        dataType: 'json',
        success:function(d){
            if (d.code == 0) {
                if(obj_isFunction(functionSuccess)){functionSuccess();}
			} else {
                wap_if_session_out(d.code);
            }
        },
        error:function(jqXHR, textStatus, errorThrown){ wap_check_ajaxerror(jqXHR); }
    });
}
function fun_alertMsg(msg,title, function01){
	if(obj_isFunction(title)){function01 = title;title = '系统提示';}
	if(isLowerBrowser()){
		layer.alert(msg,{'title':title}, function(index){
			function01();
			layer.close(index);
		});    
	}else{
		mui.alert(msg, title, function01);
	}
}
function fun_confirmMsg(msg, functionYes, functionCancel, yesBtn, noBtn){
    yesBtn = typeof yesBtn !== 'undefined' ? yesBtn : '是';
    noBtn = typeof noBtn !== 'undefined' ? noBtn : '否';
	if(isLowerBrowser()){
		layer.confirm(msg, {title:'系统提示'},[yesBtn,noBtn],
            function(index){
					functionYes();
					layer.close(index);
				},function(index){
					functionCancel();
					layer.close(index);
				}
		);
	}else{
		mui.confirm(msg, '系统提示', [yesBtn,noBtn], function(e) {
			if (e.index == 1) {
				functionCancel();
			} else {
				functionYes();
			}
		});
	}
	
}

function event_site_host(){
    return "https://wett.5ct5mm555.com";
    //return "http://t182.xdy20.com:8080";
    //return "http://127.0.0.1:8889";
}

function obj_isFunction(fn) {
   return Object.prototype.toString.call(fn)=== '[object Function]';
}

function loadAgentCode() {
	if(document.domain == 'm.dyvip52.com') {
		$('.download-ljxzbtn').attr('href', 'https://dyvip52gg.com/');
	}
    var tpageUrl = window.location.href;
    if(tpageUrl.length<6)
        return;
    var acode=tpageUrl.substr(tpageUrl.length - 6);
    if(checkCode(acode)) {
        $.ajax({
            url: wap_site_host() + "/member/getAgentByCode",
            data:{"agentCode" : acode},
            type: "POST",
            dataType: 'json',
            success: function (d) {
                if (d.code == 0) {
                    _setStorageData('$agentInfoCode', d.data);
                } else {
                    _removeStorageData('$agentInfoCode');
                }
            }
        });
    }
}

function checkCode(code) {
    var digits=new Array('f', 'x', 'a', 'b', 'c', 'd', 'e', 'g', 'h', 'i');
    var number = "";
    for (var i = 0; i < code.length; i++) {
        for (var j = 0; j < digits.length; j++) {
            if (code.charAt(i) == digits[j])
                number += j;
        }
    }
    if(number.length==6)
        return true
    else
        return false;
}

function fun_getLevelBouns(gameType,type,token) {
    $.ajax({
        url:event_site_host()+"/ptweb/getLevelBonus",
        type:"POST",
        crossDomain: true,
        data : {'type' : type, 'gameType':gameType,'token' : token},
        dataType: 'json',
        success:function(data){
            fun_alertMsg(data.msg, function() {
                window.location.reload();
			});
        },
        error:function(jqXHR, textStatus){
            wap_check_ajaxerror(jqXHR);
            fun_alertMsg('提交等级俸禄异常！', function() {});
        },
    });
}
function fun_getLevelUpgradeBouns(gameType,token) {
    $.ajax({
        url:event_site_host()+"/ptweb/getLevelUpgradeBonus",
        type:"POST",
        crossDomain: true,
        data : {'gameType':gameType,'token' : token},
        dataType: 'json',
        success:function(data){
            fun_alertMsg(data.msg, function() {
                window.location.reload();
            });
        },
        error:function(jqXHR, textStatus){
            wap_check_ajaxerror(jqXHR);
            fun_alertMsg('提交升级奖金异常！', function() {});
        },
    });
}

function getQueryParam(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
	var r = window.location.search.substr(1).match(reg);
	if (r != null) return unescape(r[2]); return null;
}

function getQueryString(name) {
	var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
	var r = window.location.search.substr(1).match(reg);
	if(r!=null)return  unescape(r[2]); return null;
}

function fun_openUrl(url){
    if (wap_is_user_notexist()) {
        wap_need_login();
    } else {
        window.location.href=url;
    }
}
function loadHTMLPage(url,callback, beforeCalback){
    $.ajax({
        url: url,
        type: "GET",
        dataType: 'json',
        success: function (d) {
            var url;
            if(beforeCalback != null){
                var returnUrl = beforeCalback(d);
                url = (returnUrl == undefined) ? url : returnUrl;
            }else{
                url = d.data.url;
            }
            addScriptTag(url, callback);
        }
    });
}
function addScriptTag(src, callback) {
    var position = src.lastIndexOf("/") + 1;
    var fileName = src.substring(position);
    var script = document.createElement("script");
    script.setAttribute("type", "text/javascript");
    script.setAttribute("src", src);
    script.setAttribute("id", fileName);
    script.setAttribute("callback", callback);
    script.onerror = function (ev) {
        eval(callback + "('')");
    }
    document.body.appendChild(script);
}

function getDownLoadUrl(url) {
    var host = window.location.href;
    var agentCodeCache = _getStorageData("$agentInfoCode");
    var agentCode = agentCodeCache == null ? "" : agentCodeCache;
    var arrUrl = host.split("//");
    var currUrl = arrUrl[1].split("/");
    var realUrl = currUrl[0];
    if (realUrl == 'm.dyvip52.com') {
        url="dyvip52gg.com";
        agentCode = '105435';
    }
    return "https://"+url+"?url=" + realUrl + "&agentCode=" + agentCode;
}
//2012-5-5
TQKF.AS = {
	isOK: false,
	cookies_handle_ok: false,
	checkTimes: 0,
	Creat: function() {
		TQ_DEBUG("TQKF.AS.Creat()", 3);
		document.write('<object id="tq_as" name="tq_as" classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" width="1" height="1">');
		document.write('<param name="movie" value="' + TQKF.swf_url + 'shareObject.swf" />');
		document.write('<param name="allowScriptAccess" value="always" />');
		if (TQUtils.FF) {
			document.write('<object id="tq_as2" name="tq_as2" type="application/x-shockwave-flash" data="' + TQKF.swf_url + 'shareObject.swf" width="1" height="1">');
			document.write('<param name="allowScriptAccess" value="always" />');
			document.write('</object>')
		}
		document.write('</object>')
	},
	Register: function() {
		TQ_DEBUG("TQKF.AS.Register()", 3);
		TQKF.AS.CheckFlash()
	},
	GetFlash: function(movieName) {
		if (TQUtils.FF) {
			var temp = movieName + "2";
			return window.document[temp]
		} else {
			return document.getElementById(movieName)
		}
	},
	CheckFlash: function() {
		TQ_DEBUG("check if flash is ready for " + TQKF.AS.checkTimes + " times", 3);
		TQKF.AS.checkTimes++;
		if (TQKF.AS.checkTimes > 20) {
			TQKF.AS.isOK = true;
			TQ_DEBUG("flash is not avalueble ,force tq_asOk to true", 1)
		}
		if (! (TQKF.AS.isOK)) {
			try {
				TQKF.AS.GetFlash("tq_as").read();
				TQKF.AS.isOK = true
			} catch(e) {
				TQKF.AS.isOK = false;
				setTimeout(TQKF.AS.CheckFlash, 10)
			}
			if (TQKF.AS.isOK) setTimeout(TQKF.AS.CheckFlash, 10)
		} else {
			TQ_DEBUG("flash is avalueble now", 3);
			TQKF.AS.CookiesHandle()
		}
	},
	ReadCookie: function() {
		var data = null;
		try {
			TQ_DEBUG("read cookie by as", 3);
			data = this.GetFlash("tq_as").read();
			TQ_DEBUG("data=" + data, 2);
			if (data != null && data != "") {
				try {
					eval("TQKF.cookieObject_all = " + data)
				} catch(e1) {
					TQ_DEBUG("do eval TQKF.cookieObject_all error", 1)
				}
				try {
					TQKF.clientInfo = eval("TQKF.cookieObject_all.u" + tq_adminid)
				} catch(e2) {
					TQ_DEBUG("do eval TQKF.cookieObject_all.u" + tq_adminid + " error", 1);
					TQKF.clientInfo = new Object();
					TQKF.clientInfo.adminUin = tq_adminid
				}
				if (TQKF.clientInfo == null || TQKF.clientInfo == "undefined") {
					TQ_DEBUG("cookie is not null ,but it is write by other kefu,my TQKF.clientInfo=" + TQKF.clientInfo, 1);
					TQKF.clientInfo = new Object();
					TQKF.clientInfo.adminUin = tq_adminid
				}
			}
		} catch(e4) {
			data = null;
			TQ_DEBUG("read cookie by as error", 1)
		}
		if (data == null || data == "") {
			TQ_DEBUG("read cookie by as error or read null ,try read cookie by js", 1);
			try {
				var clientInfo = TQUtils.GetCookie("tracqinfo");
				if (clientInfo != null && clientInfo != "") {
					TQ_DEBUG("GetCookie=" + (TQUtils.GetCookie("tracqinfo")), 3);
					clientInfo = clientInfo.replace(/\*/gi, ":").replace(/\#/gi, ',').replace(/\$/gi, ":").replace(/\^/gi, '%');
					eval("TQKF.clientInfo=" + clientInfo);
					TQ_DEBUG("TQKF.clientInfo.comTimes=" + TQKF.clientInfo.comTimes, 3);
					TQ_DEBUG("read cookie by is ok,TQKF.clientInfo=" + TQUtils.toJSONString(TQKF.clientInfo), 3)
				}
			} catch(e5) {
				TQ_DEBUG("read cookie by js error ", 1)
			}
		}
	},
	WriteCookie: function(clientInfo) {
		try {
			eval("TQKF.cookieObject_all.u" + clientInfo.adminUin + "=" + TQUtils.toJSONString(clientInfo));
			TQ_DEBUG("write cookie by as:" + TQUtils.toJSONString(TQKF.cookieObject_all), 2);
			var tq_writeOk = this.GetFlash("tq_as").write(TQUtils.toJSONString(TQKF.cookieObject_all));
			if (tq_writeOk != 1) {
				TQ_DEBUG("write cookie by as error,try write by js", 1)
			}
		} catch(e5) {
			TQ_DEBUG("write cookie by as error,try write by js", 1)
		}
		try {
			TQ_DEBUG("write cookie by js", 3);
			var temp = TQUtils.toJSONString(clientInfo).replace(/:/gi, "$").replace(/,/gi, '#').replace(/%/gi, '^');
			TQ_DEBUG("tempp=" + temp, 3)
		} catch(e7) {
			TQ_DEBUG("write cookie by js error", 1)
		}
	},
	UpdateLastTalkUin: function(uin) {
		TQKF.clientInfo.LastTalkUin = uin;
		TQKF.clientInfo.LastTalkTime = escape(TQUtils.GetTime_invite());
		TQKF.AS.WriteCookie(TQKF.clientInfo)
	},
	UpdateClientNickName: function(clientNickName) {
		TQKF.clientInfo.clientNickName = clientNickName;
		TQKF.AS.WriteCookie(TQKF.clientInfo)
	},
	CookiesHandle: function() {
		TQ_DEBUG("TQKF.AS.CookiesHandle", 3);
		this.ReadCookie();
		TQ_DEBUG("after read cookie,TQKF.clientInfo=" + TQUtils.toJSONString(TQKF.clientInfo), 3);
		if (TQKF.clientInfo != null && TQKF.clientInfo != "" && typeof(TQKF.clientInfo.rand) != "undefined" && TQKF.clientInfo.rand != "") {
			try {
				TQKF.clientInfo.comTimes = parseInt(TQKF.clientInfo.comTimes) + 1
			} catch(e2) {
				TQ_DEBUG("error 2", 2)
			}
		} else {
			TQ_DEBUG("cookie is null", 2);
			TQKF.clientInfo.adminUin = tq_adminid;
			TQKF.clientInfo.rand = Math.floor(Math.random() * 1000000) + "" + Math.floor(Math.random() * 1000000) + "" + Math.floor(Math.random() * 100000);
			TQKF.clientInfo.comTimes = 1;
			TQKF.clientInfo.TalkTimes = 0;
			TQKF.clientInfo.LastVisitTime = escape(TQUtils.GetTime_invite());
			TQKF.clientInfo.LastTalkTime = "";
			TQKF.clientInfo.LastTalkUin = "";
			TQKF.clientInfo.clientNickName = "";
			TQKF.clientInfo.isInBlackList = 0;
			TQKF.clientInfo.badClickTimes = 0;
			TQKF.clientInfo.LastBadClickTime = new Date().getTime()
		}
		if (tq_is_anti_bad_click == "1" || tq_is_anti_bad_click == 1) {
			TQ_DEBUG("tq_is_anti_bad_click=1", 3);
			try {
				TQKF.antiBadClick.HandleBadClick()
			} catch(e) {
				setTimeout(function() {
					try {
						TQKF.antiBadClick.HandleBadClick()
					} catch(e) {}
				},
				2000)
			}
		} else TQ_DEBUG("tq_is_anti_bad_click!=1", 3);
		var temp_clientInfo = TQKF.clientInfo;
		TQ_DEBUG("TQKF.AS.CookiesHandle finish,TQKF.clientInfo=" + TQUtils.toJSONString(TQKF.clientInfo), 2);
		temp_clientInfo.LastVisitTime = escape(TQUtils.GetTime_invite());
		this.WriteCookie(temp_clientInfo);
		this.cookies_handle_ok = true
	}
};
TQKF.AS.Creat();
setTimeout(TQKF.AS.Register, 500);
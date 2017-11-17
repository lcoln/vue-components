"use strict"
// import vue from ''
define(['vue'],function(vue){

	var ensure = function (target, item) {
	    //只有当前数组不存在此元素时只添加它
	    if (target.indexOf(item) === -1) {
	        return target.push(item)
	    }
	}

	var ruleRegExp = /(:id)|(\{id\})|(\{id:([A-z\d\,\[\]\{\}\-\+\*\?\!:\^\$]*)\})/g;
	var isMouseUp = true
	var defaultOptions = {
		prefix: /^(#!|#)[\/]?/,		//hash前缀正则
		historyOpen: true,		//是否开启hash历史
		allowReload: true		//连续点击同一个链接是否重新加载
	}
	function Router(){
		this.table = {get: []}
		this.started = false		//是否配置过路由
		this.init = {}
		this.hash = ''
		this.history = null
		this.errorFn = null
	}

	Router.prototype = {
		error: function(callback){
			this.errorFn = callback
		},
		config: function(opts){
			if(this.started)
				return console.error('Router config has been set')

			this.started = true
			//默认连续点击同一个链接重新加载
			if(!opts.allowReload)
				opts.allowReload = true
			this.init = {
				extends: {},opts,defaultOptions
			}
		},
		//生成正则匹配规则
		_getRegExp: function(rule, opts){
			var re = rule.replace(ruleRegExp, function(m, p1, p2, p3, p4){
				var w = '(\\w';
				if(p1 || p2){
					return w + '+)';
				}else{
					if(!/^\{[\d\,]+\}$/.test(p4)){
						w = '(';
					}
					return w + p4 + ')';
				}
			})
			re = re.replace(/(([^\\])([\/]+))/g, '$2\\/').replace(/(([^\\])([\.]+))/g, '$2\\.').replace(/(([^\\])([\-]+))/g, '$2\\-').replace(/(\(.*)(\\[\-]+)(.*\))/g, '$1-$3');
			re = '^' + re + '$';
			opts.regexp = new RegExp(re)
			return opts;
		},
		_add: function(method, rule, callback){
			if(!this.started)
				this.config({})

			var table = this.table[method.toLowerCase()]
			if(rule.charAt(0) !== "/"){
				console.error('char "/" must be in front of router rule')
				return
			}
			rule = rule.replace(/^[\/]|[\/]|\s+/g,'')
			var opts = {}
			opts.rule = rule
			opts.callback = callback
			ensure(table,this._getRegExp(rule,opts))
		},
		_route: function(method, hash){
			var hash = hash.trim();
			var table = this.table[method];
			var init = this.init;
			if(!init.defaultOptions.allowReload && hash === this.history)
				return;

			if(init.defaultOptions.historyOpen){
				this.history = hash;
				if(vue.ls)
					vue.ls('lastHash', hash);
			}

			for(var i = 0, obj; obj = table[i++];){
				var args = hash.match(obj.regexp);
				if(args){
					args.shift();
					obj.callback.apply(obj, args)
					return
				}
			}
			this.errorFn && this.errorFn(hash);
		},
		get: function(rule,callback){
			this._add('get',rule,callback)
		}
	}



	if('onhashchange' in window){
		window.addEventListener('hashchange', function(event){
			if(!isMouseUp)
				return
			var prefix = vue.router.init.defaultOptions.prefix
			var hash = location.hash.replace(prefix, "").trim()
			vue.router._route('get', hash)
		})
	}

	window.addEventListener('load',function(){
		if(!vue.router.started)
			return
		var prefix = vue.router.init.defaultOptions.prefix
		var hash = location.hash
		hash = hash.replace(prefix, "").trim()
		vue.router._route('get', hash)
	})

	document.addEventListener('mouseup',function(){
		if(!isMouseUp){
			vue.router._route('get', vue.router.hash)
			isMouseUp = true
		}
	})

	document.addEventListener('mousedown',function(event){
		var defaultPrevent = "defaultPrevent" in event ? event["defaultPrevent"] : event.returnValue === false

		//当阻止了默认事件，或者按住ctrl,meta或者鼠标中键时return
		if(defaultPrevent || event.ctrlKey || event.metaKey || event.whith === 2)
			return

		var target = event.target
		while(target.nodeName !== "A"){
			target = target.parentNode
			if(!target || target.tagName === "BODY")
				return
		}

		if(targetIsThisWindow(target.target)){
			//如果未启动路由则返回
			if(!vue.router.started)
				return
			var href = target.getAttribute("href") || target.getAttribute("xlink:href")
			var	prefix = vue.router.init.defaultOptions.prefix

			if(href === null || !prefix.test(href))
				return

			vue.router.hash = href.replace(prefix, "").trim()
			event.preventDefault()
			location.hash = href
			isMouseUp = false
		}
	})

	//判断A标签target是否指向自身
	function targetIsThisWindow(targetWindow){
		if(!targetWindow || targetWindow === window.name || targetWindow === '_self' || (targetWindow === 'top' && window == window.top)){
			return true
		}
		return false
	}
	return vue.router = new Router;
})
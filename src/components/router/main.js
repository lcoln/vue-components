/**
 *
 * @authors linteng (875482941@qq.com)
 * @date    2017-12-28 17:24:03
 */

define(['vue'], function(vue){

    if(typeof Object.assign !== 'function'){
        Object.assign = function(target, para){
            'use strict'

            if(target == null)
                throw new TypeError('shit')

            var to = Object(target),
                i = 0

            for(;i < arguments.length;){
                var source = arguments[i++]

                if(source !== null){
                    for(var k in source){
                        if(Object.prototype.hasOwnProperty.call(source, k))
                            to[k] = source[k]
                    }
                }
            }

            return to
        }
    }

    if(!vue.ensure){
        vue.ensure = function(target, para){
            if(target.indexOf(para) === -1){
                return target.push(para)
            }
        }
    }

    if(!vue.listen){
        vue.bind = function(el, ev, fn, capture){
            if(window.addEventListener){
                el.addEventListener(ev, fn, capture)
            }else if(window.attachEvent){
                el.attachEvent('on' + ev, fn, capture)
            }else{
                el['on' + ev] = fn
            }
        }
    }

    function Router(){
        this.table = {get: []};
        this.errorFn = null;
        this.history = null;
        this.hash = '';
        this.started = false;
        this.init = {};
    }

    var defaultOptions = {
        prefix: /^(#!|#)[\/]?/, //hash前缀正则
        historyOpen: true, //是否开启hash历史
        allowReload: true //连续点击同一个链接是否重新加载
    };
    var isMouseUp = true;

    var ruleRegExp = /(:id)|(\{id\})|(\{id:([A-z\d\,\[\]\{\}\-\+\*\?\!:\^\$]*)\})/g;

    Router.prototype = {
        error: function(callback){
            this.errorFn = callback;
        },
        config: function(opts){
            if(this.started)
                return console.error('Router config has been set');

            this.started = true;
            if(!opts.allowReload)
                opts.historyOpen = true;
            this.init = Object.assign({}, defaultOptions, opts);
            console.log(111);
        },
        _getRegExp: function(rule, opts){
            var re = rule.replace(ruleRegExp, function(m, p1, p2, p3, p4){
                var w = '([\\w.-]';
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
                this.config({});

            var table = this.table[method.toLowerCase()];
            if (rule.charAt(0) !== "/") {
                console.error('char "/" must be in front of router rule');
                return;
            }
            rule = rule.replace(/^[\/]+|[\/]+$|\s+/g, '');
            var opts = {};
            opts.rule = rule;
            opts.callback = callback;
            vue.ensure(table, this._getRegExp(rule, opts));
        },
        _route: function(method, hash){
            var hash = hash.trim();
            var table = this.table[method];
            var init = this.init;

            if(!init.allowReload && hash === this.history)
                return;

            if(init.historyOpen){
                this.history = hash;
                if(vue.ls)
                    vue.ls('lastHash', hash);
            }

            for(var i = 0, obj; obj = table[i++];){
                var args = hash.match(obj.regexp);
                if(args){
                    args.shift();
                    return obj.callback.apply(obj, args)
                }
            }
            this.errorFn && this.errorFn(hash);
        },
        on: function(rule, callback){
            var _this = this
            if(Array.isArray(rule)){
                rule.forEach(function(it){
                    _this._add('get', it, callback);
                })
            }else{
                this._add('get', rule, callback);
            }
        }
    }

    vue.bind(window, 'load', function(){
        if(!vue.router.started)
            return;
        var prefix = vue.router.init.prefix;
        var hash = location.hash;
        hash = hash.replace(prefix, "").trim();
        vue.router._route('get', hash);
    });


    if('onhashchange' in window){
        window.addEventListener('hashchange', function(event){
            if(!isMouseUp)
                return;
            var prefix = vue.router.init.prefix;
            var hash = location.hash.replace(prefix, "").trim();
            vue.router._route('get', hash)
        })
    }

    //劫持页面上所有点击事件，如果事件源来自链接或其内部，
    //并且它不会跳出本页，并且以"#/"或"#!/"开头，那么触发updateLocation方法
    vue.bind(document, "mousedown", function(event){
        var defaultPrevented = "defaultPrevented" in event ? event['defaultPrevented'] : event.returnValue === false
        if (defaultPrevented || event.ctrlKey || event.metaKey || event.which === 2)
            return
        var target = event.target
        while (target.nodeName !== "A") {
            target = target.parentNode
            if (!target || target.tagName === "BODY") {
                return
            }
        }

        if (targetIsThisWindow(target.target)){
            if(!vue.router.started)
                return;
            var href = target.getAttribute("href") || target.getAttribute("xlink:href"),
                prefix = vue.router.init.prefix;

            if (href === null || !prefix.test(href))
                return

            vue.router.hash = href.replace(prefix, "").trim();
            event.preventDefault();
            location.hash = href;
            isMouseUp = false;
        }
    })

    vue.bind(document, "mouseup", function(){
        if(!isMouseUp){
            vue.router._route('get', vue.router.hash);
            isMouseUp = true;
        }

    })


    //判定A标签的target属性是否指向自身
    //thanks https://github.com/quirkey/sammy/blob/master/lib/sammy.js#L219
    function targetIsThisWindow(targetWindow) {
        if (!targetWindow || targetWindow === window.name || targetWindow === '_self' || (targetWindow === 'top' && window == window.top)) {
            return true
        }
        return false
    }

    return vue.router = new Router;
})
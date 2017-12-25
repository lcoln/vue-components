/**
 * [懒加载]
 * @authors Lincoln (875482941@qq.com)
 * @date    2017-06-07 15:31:25
 */

(function(_context){

    var clientHeight
    var bodyHeight
    var scrollTop

    var listen = (function(){
        if(window.addEventListener){
            return function(dom, event, func, capture){
                dom.addEventListener(event, function(e){
                    func.apply(dom, e)
                }, capture)
            }
        }else if(window.det){
            return function(dom, event, func, capture){
                dom.attachEvent("on" + event, function(e){
                    func.apply(dom, e)
                })
            }
        }
    })()

    var remove = (function(){
        if(window.removeEventListener){
            return function(dom, event, func){
                dom.removeEventListener(event, func, false)
            }
        }else if(window.detachEvent){
            return function(dom, event, func){
                dom.detachEvent("on" + event, func)
            }
        }
    })()

    var getUserAgent = function(){
        var useragent = ['Chrome', 'Firefox', 'MSIE']
        for(let i in useragent){
            if(navigator.userAgent.indexOf(useragent[i]) > -1)
                return useragent[i]
        }

        return false
    }

    var scroll = function(dom, callback, time, deadLine){
        listen(dom, "scroll", throttle(scrollCallBack, dom, callback, time, deadLine), false)
    }

    scroll.removeEvent = function(dom){
        remove(dom, "scroll", throttle)
    }

    function throttle(func, dom, callback, time, deadLine){
        var timeout = null,
            args = [].slice.call(arguments, 1),
            context = this,
            now = new　Date()

        return function() {

            clearTimeout(timeout);
            var curTime = new Date()
            // 如果达到了规定的触发时间间隔，触发 handler
            timeout = setTimeout(function(){
                func.apply(context, args);
            }, time)
        }
    }

    function scrollCallBack(dom, callback){
        clientHeight = dom.clientHeight || dom.offsetHeight || window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
        if(getUserAgent() === 'Firefox')
            bodyHeight = dom.scrollHeight || domdocument.documentElement.scrollHeight
        else
            bodyHeight = dom.scrollHeight || document.body.scrollHeight

        scrollTop = dom.scrollTop || document.body.scrollTop || document.documentElement.scrollTop

        if(scrollTop + clientHeight >= bodyHeight){
            callback && callback()
        }
    }

    if(typeof require === 'function' && typeof module === 'object' && typeof exports === 'object')
        module.exports = scroll
    else
        _context.scroll = scroll

})(this)
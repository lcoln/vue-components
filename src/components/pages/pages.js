/**
 *
 * @authors Lincoln (875482941@qq.com)
 * @date    2017-01-13 11:12:27
 * @version $Id$
 */

'use strict'

define(['avalon', 'text!./pages.htm', 'css!./pages'],function(av, tpl){
    av.component('ui:pages', {
        $replace: true,
        $template: tpl,
        skin: 'blue',
        pages: [],
        total: 0,
        curr: 1,
        currIndex: 1,
        max: 5,
        showJumpBtn: false,
        $callback: av.noop,
        $jump: av.noop,
        $onSuccess: av.noop,
        msg: '',
        $init: function(vm, ele){
            vm.$jump = function(curr){
                if(curr >> 0 === vm.curr >> 0)
                    return

                if(!(curr >> 0 > 0))
                    vm.msg = '页码不符合格式'
                else if(curr > vm.total)
                    vm.msg = '页数不能超过' + vm.total + '页'

                if(vm.msg){
                    return setTimeout(function(){
                        vm.msg = ''
                    },1000)
                }
                vm.pages = calculate(vm, curr)
                vm.curr = curr
                vm.$callback && vm.$callback(curr)
            }
            vm.$watch('total',function(val, old){
                vm.pages = calculate(vm, 1)
            })
        },
        $ready: function(vm){
            vm.$onSuccess(vm)
        }

    })

    function calculate(vm,curr){
        var dis = Math.floor(vm.max / 2)
        var start
        if(vm.total - curr < dis && vm.total >= vm.max)
            start = vm.total - (vm.max - 1)
        else if(curr - dis > 0 && vm.total >= vm.max)
            start = curr - dis
        else
            start = 1

        var end = start + (vm.max - 1) < vm.total ? start + (vm.max - 1) : vm.total
        var pages = []
        for(var i = 0,s = start,e = end;i<vm.max;i++,s++){
            if(s <= e)
                pages[i] = s
        }
        return pages
    }

    return av
})
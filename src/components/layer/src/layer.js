'use strict'

import Vue from 'vue'
import LayerComponent from './layer.vue'
//合并对象函数，这个方法是会改变，第一个参数的值的
function merge(target) {
    for (let i = 1, j = arguments.length; i < j; i++) {
        let source = arguments[i] || {};
        for (let prop in source) {
            if (source.hasOwnProperty(prop)) {
                let value = source[prop];
                if (value !== undefined) {
                    target[prop] = value;
                }
            }
        }
    }
    return target;
};
let instance;
//extend 是构造一个组件的语法器.传入参数，返回一个组件
let LayerConstructor = Vue.extend(LayerComponent);

let initInstance = ()=>{
    //实例化ConfirmConstructor组件
    instance = new LayerConstructor({
        el: document.createElement('div')
    });
    //添加到boby
    document.body.appendChild(instance.$el);
}

let Layer = (options={})=>{
    //初始化
    if(!document.getElementById('UiLayer'))
        initInstance();
    // 将单个 confirm instance 的配置合并到默认值（instance.$data，就是main.vue里面的data）中
    merge(instance.$data, options);
    return instance
}

export default Layer;
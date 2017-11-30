'use strict'

import vue from 'vue'
let layerConstructor = vue.extend(require('./layer.vue'))

var UiLayer = function(){
    var instance = new layerConstructor()
    instance = instance.$mount()
    document.body.appendChild(instance.$el)
    return instance.vm
}

export default UiLayer
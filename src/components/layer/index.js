/**
 *
 * @authors Lincoln (875482941@qq.com)
 * @date    2017-02-11 18:02:58
 * @version $Id$
 */

import layer from './src/layer.js'

const install = function(Vue) {
    //注册全局组件
    Vue.component(layer.name, layer)
    //添加全局API
    Vue.prototype.$layer = new layer()
}
export default install
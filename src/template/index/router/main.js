/**
 *
 * @authors linteng (875482941@qq.com)
 * @date    2017-12-29 16:04:58
 */

import vue from 'vue'

import page1 from './page1'
import page2 from './page2'
import page3 from './page3'
import page3_1 from './page3_1'
import page3_2 from './page3_2'
import vueRouter from 'vue-router'
import App from './App.vue'

vue.use(vueRouter)

const routes = [
    {
        path: '/page1',
        name: 'page1',
        component: page1
    },
    {
        path: '/page2',
        name: 'page2',
        component: page2
    },
    {
        path: '/page3',
        name: 'page3',
        component: page3
    },
    {
        path: '/page3/1',
        name: 'page3_1',
        component: page3_1
    },
    {
        path: '/page3/2',
        name: 'page3_2',
        component: page3_2
    },
]


var router = new vueRouter({
    base: __dirname,
    routes
})

new vue({
    el: '#router',
    router: router,
    render: h => h(App)
})

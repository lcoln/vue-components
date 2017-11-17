<template>
    <div class="components-index">
        <aside>
            <section class="logo">
                <!-- <img src="" /> -->
                <span>Components</span>
            </section>
            <nav>
                <a class="item" :class="{'act': currView === 'fullScroll'}" href="#!/fullScroll">全屏滚动组件</a>
                <a class="item" :class="{'act': currView === 'waterfall'}" href="#!/waterfall">瀑布流组件</a>
                <a class="item" :class="{'act': currView === 'pointer'}" href="#!/pointer">鼠标滑动3d动画组件</a>
                <a class="item" :class="{'act': currView === 'sliders'}" href="#!/sliders">幻灯片</a>
                <a class="item" :class="{'act': currView === 'pages'}" href="#!/pages">分页组件</a>
                <a class="item" :class="{'act': currView === 'datepicker'}" href="#!/datepicker">日历组件</a>
                <a class="item" :class="{'act': currView === 'layer'}" href="#!/layer">弹窗组件</a>
                <a class="item" :class="{'act': currView === 'lazy_loading'}" href="#!/lazy_loading">懒加载</a>
            </nav>
        </aside>
        <content>
            <component :is="currView"></component>
        </content>
    </div>
</template>

<script>
    import store from 'store'
    import vue from 'vue'
    import home from './template/index/home.vue'
    import fullScroll from './template/index/fullscreen_scroll.vue'
    import waterfall from './template/index/waterfall.vue'
    import pointer from './template/index/pointer.vue'
    import sliders from './template/index/sliders.vue'
    import pages from './template/index/pages.vue'
    import datepicker from './template/index/datepicker.vue'
    import layer from './template/index/layer.vue'
    import lazy_loading from './template/index/lazy_loading.vue'

    export default {
        name: 'app',
        data () {
            return {
                currView: ''
            }
        },
        methods: {

        },
        mounted: async function(){
            let callback = (m => {
                this.currView = m;
            }).bind(this)

            vue.router.get('/', () => callback('home'))
            vue.router.get('/:id', m => callback(m))
        },
        components: {
            home,
            fullScroll,
            waterfall,
            pointer,
            sliders,
            pages,
            datepicker,
            layer,
            lazy_loading
        },
    }
</script>

<style lang="scss" type="text/css" scoped>

    @import 'static/sass/mixin.scss';
    .components-index{width: 100%;height: 100%;
        aside{float: left;width: 200px;height:100%;background: #1F2E54;
            nav{margin-top: -10px;}
            .logo{height: 100px;line-height: 100px;text-align: center;
                span{font-size: 30px;color: #fff;}
            }
            .item{display: block;width: 100%;height: 40px;margin: 10px 0;padding-left: 20px;line-height: 40px;font-size: 14px;color: #fff;transition: .4s;
                &.act{background: #182445;color: #6090cd;}
            }
            .item:hover{background: #182445;color: #6090cd;
            }
        }
        content{display: block;margin-left: 200px;height: 100%;}
    }


</style>

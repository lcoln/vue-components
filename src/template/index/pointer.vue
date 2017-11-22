<template>
    <div style="height: 100%;">
        <div class="exam" v-show="showType == 1">
            <div id="pointer">
                <img src="/static/images/bg.jpg">
            </div>
            <div id="pointer2">
                <img src="/static/images/vue.jpg">
            </div>
        </div>
        <pre class="code" v-if="showType == 2" v-text="code">
            <code class="html">

            </code>
        </pre>
    </div>
</template>

<script>
    import store from 'store'
    import vue from 'vue'
    // import PointerHover from '@/components/pointer-hover-slider/main-es6.js'

    export default {
        name: 'app',
        data () {
            return {
                code: `
<div class="exam" v-show="showType == 1">
    <div id="pointer">
        <img src="/static/images/bg.jpg">
    </div>
    <div id="pointer2">
        <img src="/static/images/vue.jpg">
    </div>
</div>

<script>
    var pointer = new PointerHover()
    console.log(pointer);
    pointer.init('pointer')
    var pointer2 = new PointerHover()
    pointer2.init('pointer2')
<\/script>

<style>
    #pointer{display: inline-block;width: 300px;height: 400px;
        img{width: 100%;height: 100%;object-fit: cover;}
    }
    #pointer2{display: inline-block;width: 400px;height: 400px;margin: 0 10px;
        img{width: 100%;height: 100%;object-fit: cover;}
    }
</style>
                `
            }
        },
        methods: {

        },
        mounted: async function(){
            require('@/components/pointer-hover-slider/main-es5.js')
            var pointer = new PointerHover()
            pointer.init('pointer')
            var pointer2 = new PointerHover()
            pointer2.init('pointer2')
        },
        computed: {
            showType () {
                return store.state.showType
            }
        },
        components: {

        }
    }
</script>

<style rel="stylesheet" lang="scss" type="text/css" scoped>
    #pointer{display: inline-block;width: 300px;height: 400px;
        img{width: 100%;height: 100%;object-fit: cover;}
    }
    #pointer2{display: inline-block;width: 400px;height: 400px;margin: 0 10px;
        img{width: 100%;height: 100%;object-fit: cover;}
    }
</style>
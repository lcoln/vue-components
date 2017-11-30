<template>
    <div>
        <div class="exam" v-show="showType == 1">
            <div id="fullPage">
                <div class="page"></div>
                <div class="page"></div>
                <div class="page"></div>
                <div class="page"></div>
                <div class="page"></div>
            </div>
            <div id="fullPage2">
                <div class="page"></div>
                <div class="page"></div>
                <div class="page"></div>
                <div class="page"></div>
                <div class="page"></div>
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
    import UiFullScreenScroll from '@/components/fullscreen-scroll/main-es6.js'
    export default {
        data () {
            return {
                code: `
<div id="fullPage">
    <div class="page"></div>
    <div class="page"></div>
    <div class="page"></div>
    <div class="page"></div>
    <div class="page"></div>
</div>
<div id="fullPage2">
    <div class="page"></div>
    <div class="page"></div>
    <div class="page"></div>
    <div class="page"></div>
    <div class="page"></div>
</div>

es5: <script src="https://components.cncoders.me/components/fullscreen-scroll/main-es5.js"><\/script>
es6: https://components.cncoders.me/components/fullscreen-scroll/main-es6.js //import UiPages from 'path/to/fullscreen-scroll/main-es6.js'

<script>
    var fullpage = new UiFullScreenScroll()
    fullpage.init('fullPage', 'page', '.4')
    var fullpage2 = new UiFullScreenScroll()
    fullpage2.init('fullPage2', 'page', '.4')
<\/script>

<style>

    #fullPage{width: 100%;height: 500px;box-shadow: 0 0 5px #333;background: #ddd;}
    #fullPage .page{width: 100%;height: 100%;background: #bbb;}
    #fullPage .page:nth-of-type(1){background: #182327}
    #fullPage .page:nth-of-type(2){background: #132C33}
    #fullPage .page:nth-of-type(3){background: #F9F9F9}
    #fullPage .page:nth-of-type(4){background: #015E7F}
    #fullPage .page:nth-of-type(5){background: #2D363F}

    #fullPage2{width: 100%;height: 620px;margin: 10px 0;box-shadow: 0 0 5px #333;background: #ddd;}
    #fullPage2 .page{width: 100%;height: 100%;background: #bbb;}
    #fullPage2 .page:nth-of-type(1){background: #182327}
    #fullPage2 .page:nth-of-type(2){background: #132C33}
    #fullPage2 .page:nth-of-type(3){background: #F9F9F9}
    #fullPage2 .page:nth-of-type(4){background: #015E7F}
    #fullPage2 .page:nth-of-type(5){background: #2D363F}
</style>`
            }
        },
        methods: {

        },
        mounted: function(){
            // require('@/components/fullscreen-scroll/main-es5.js')
            var fullpage1 = new UiFullScreenScroll()
            fullpage1.init('fullPage', 'page', '.4')
            var fullpage2 = new UiFullScreenScroll()
            fullpage2.init('fullPage2', 'page', '.4')
            // console.log(fullpage2);
        },
        computed: {
            showType () {
                return store.state.showType
            }
        },
    }
</script>

<style rel="stylesheet" lang="scss" type="text/css" scoped>

    #fullPage{width: 100%;height: 500px;box-shadow: 0 0 5px #333;background: #ddd;}
    #fullPage .page{width: 100%;height: 100%;background: #bbb;}
    #fullPage .page:nth-of-type(1){background: #182327}
    #fullPage .page:nth-of-type(2){background: #132C33}
    #fullPage .page:nth-of-type(3){background: #F9F9F9}
    #fullPage .page:nth-of-type(4){background: #015E7F}
    #fullPage .page:nth-of-type(5){background: #2D363F}

    #fullPage2{width: 100%;height: 620px;margin: 10px 0;box-shadow: 0 0 5px #333;background: #ddd;}
    #fullPage2 .page{width: 100%;height: 100%;background: #bbb;}
    #fullPage2 .page:nth-of-type(1){background: #182327}
    #fullPage2 .page:nth-of-type(2){background: #132C33}
    #fullPage2 .page:nth-of-type(3){background: #F9F9F9}
    #fullPage2 .page:nth-of-type(4){background: #015E7F}
    #fullPage2 .page:nth-of-type(5){background: #2D363F}
</style>
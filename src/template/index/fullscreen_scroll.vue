<template>
    <div class="content">
        <section class="tab-group">
            <a class="tab" href="javascript:;" :class="{'act': showType == 1}" @click="showType = 1">预览</a>
            <a class="tab" href="javascript:;" :class="{'act': showType == 2}" @click="showType = 2">代码</a>
        </section>
        <section class="container">
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
        </section>
    </div>
</template>

<script>

    import vue from 'vue'
    import fullpage from '@/components/fullscreen-scroll/main-es6.js'
    export default {
        data () {
            return {
                bgColor: ['#182327', '#202834', '#2b3958', '#1B1521', '#2D363F'],
                curIndex: 0,
                curArr: [0],
                showType: 1,
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
<script>
    var fullpage = new fullpage()
    fullpage.init('fullPage', 'page', '.4')
    var fullpage2 = new fullpage()
    fullpage2.init('fullPage2', 'page', '.4')
<\/script>`
            }
        },
        methods: {
            go(page){
                this.curIndex = page
            },
            changeCurIndex(v){
                this.curIndex = v
                if(!this.curArr.includes(v))
                    this.curArr.push(v)

            }
        },
        mounted: function(){
            require('@/components/fullscreen-scroll/main-es5.js')
            var fullpage1 = new Scroll()
            fullpage1.init('fullPage', 'page', '.4')
            var fullpage2 = new Scroll()
            fullpage2.init('fullPage2', 'page', '.4')
            console.log(fullpage2);
        },
        /*components: {
            fullpage
        }*/
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

    pre{tab-size: 4;}
    .content{width: 100%;height: 100%;
        .tab-group{float: left;width: 100%;border-bottom: 1px solid #ddd;
            .tab{display: inline-block;width: 100px;height: 40px;margin-bottom: -1px;line-height: 40px;text-align: center;transition: .4s;color: #333;
                &.act{border-bottom: 2px solid #182445;}
            }
        }
        .container{width: 100%;overflow: auto;
            .code{height: 100%;margin: 30px;padding: 10px;box-shadow: 0 0 5px #ddd;background: #F7F7F7;overflow: auto;}
            .exam{margin: 30px;}
        }
    }
</style>
<template>
    <div class="content">
        <section class="tab-group">
            <a class="tab" href="javascript:;" :class="{'act': showType == 1}" @click="showType = 1">预览</a>
            <a class="tab" href="javascript:;" :class="{'act': showType == 2}" @click="showType = 2">代码</a>
        </section>
        <section class="container">
            <div class="exam" v-if="showType == 1">
                <fullpage :amount="5" :bg-color="bgColor" :cur-page="curIndex" @on-curIndex-change="changeCurIndex">
                    <div slot="page1" class="page">111111</div>
                    <div slot="page2" class="page">222222</div>
                    <div slot="page3" class="page">333333</div>
                    <div slot="page4" class="page">444444</div>
                    <div slot="page5" class="page">555555</div>
                    <!-- <template slot="ui-fullpage-tab">
                        <div class="website-index-tab-group">
                            <span v-for="(page, index) in tabText" :class="{'tab-act': curIndex == index}" class="website-index-tab" @click="go(index >> 0)">
                                {{page}}
                                <i class="tab-line" :class="{'tab-line-act': curIndex == index}"></i>
                            </span>
                        </div>
                    </template> -->
                </fullpage>
            </div>
            <pre class="code" v-if="showType == 2">2222</pre>
        </section>
    </div>
</template>

<script>

    import vue from 'vue'
    import fullpage from '@/components/fullscreen-scroll/main.vue'
    export default {
        data () {
            return {
                bgColor: ['#182327', '#202834', '#2b3958', '#1B1521', '#2D363F'],
                curIndex: 0,
                curArr: [0],
                showType: 1
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
            vue.log(fullpage)
        },
        components: {
            fullpage
        }
    }
</script>

<style rel="stylesheet" lang="scss" type="text/css" scoped>
    .content{width: 100%;height: 100%;
        .tab-group{float: left;width: 100%;border-bottom: 1px solid #ddd;
            .tab{display: inline-block;width: 100px;height: 40px;margin-bottom: -1px;line-height: 40px;text-align: center;transition: .4s;color: #333;
                &.act{border-bottom: 2px solid #182445;}
            }
        }
        .container{width: 100%;padding-top: 40px;
            .code{height: 100%;margin: 30px;padding: 10px;box-shadow: 0 0 5px #ddd;background: #F7F7F7;}
            .exam{height: 500px;margin: 30px;box-shadow: 0 0 5px #333;}
        }
    }
</style>
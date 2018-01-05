<template>
    <div class="ui-fn-noselect ui-pages" :class="pageOpts.skin" v-if="pageOpts.total > 0">
        <span class="first" @click="jump(1)">首页</span>
        <span v-if="curr - Math.floor(pageOpts.max / 2) > 1 && pageOpts.total > pageOpts.max">...</span>
        <span @click="jump(curr - 1)">«</span>
        <span v-for="item in pages" :class="{active: item == curr}" @click="jump(item)">{{item}}</span>
        <span v-if="pageOpts.total - curr > Math.floor(pageOpts.max /2) && pageOpts.total > pageOpts.max">...</span>
        <span @click="jump(curr + 1)">»</span>
        <span class="last" @click="jump(pageOpts.total)">未页</span>
        <input v-if="pageOpts.showJumpBtn" type="text" class="txt" v-model="pageNum" />
        <span v-if="pageOpts.showJumpBtn" class="jump" href="javascript:;" @click="jump(pageNum)" >跳转</span>
        <span class="msg" v-if="msg">{{msg}}</span>
    </div>
</template>

<script>
    import vue from 'vue'
    let skin = ['blue', 'green', 'pine', 'darkGreen', 'yellow']
    let PAGE_OPTS = {}


    export default {
        name: 'PAGES',
        props: {
            pageOpts: {
                type: Object,
                default: {
                    total: 0,
                    max: 6,
                    showJumpBtn: false,
                    skin: skin[0],
                    callback (curr) {

                    }
                }
            }
        },
        data () {
            return {
                msg: '',
                curr: 1,
                pages: [],
                pageNum: ''
            }
        },
        created () {
            this.pageOpts.skin = this.pageOpts.skin ? this.pageOpts.skin : skin[0]
            PAGE_OPTS = this.pageOpts
        },
        methods: {
            calculate(curr){

                var dis = Math.floor(PAGE_OPTS.max / 2)
                var start
                if(PAGE_OPTS.total - curr < dis && PAGE_OPTS.total >= PAGE_OPTS.max)
                    start = PAGE_OPTS.total - (PAGE_OPTS.max - 1)
                else if(curr - dis > 0 && PAGE_OPTS.total >= PAGE_OPTS.max)
                    start = curr - dis
                else
                    start = 1

                var end = start + (PAGE_OPTS.max - 1) < PAGE_OPTS.total ? start + (PAGE_OPTS.max - 1) : PAGE_OPTS.total
                var pages = []
                for(var i = 0;i < PAGE_OPTS.max;){
                    if(start <= end)
                        pages[i++] = start++
                }
                dis = start = end = null
                this.pages = pages
            },
            jump(curr){
                if(curr < 1 || curr > PAGE_OPTS.total || !(curr >> 0 > 0) || curr > PAGE_OPTS.total)
                    return

                this.curr = curr
                this.calculate(curr)
                PAGE_OPTS.callback && PAGE_OPTS.callback(curr)
            }
        },
        mounted: async function(){
            require('./pages.css')
            this.calculate(1)
        },
        watch: {
            msg: function(v){
                var _self = this
                setTimeout(function(){
                    _self.msg = ''
                }, 1000)
            }
        },
        components: {

        }
    }
</script>

<style rel="stylesheet" lang="scss" type="text/css" scoped>

</style>
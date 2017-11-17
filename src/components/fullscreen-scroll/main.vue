<template>
    <div class="ui-fullpage" @wheel="wheelEvent">
        <div class="ui-fullpage-container" :style="{transform: `translateY(${-100 * curIndex}%)`}">
            <section class="ui-fullpage-box" v-for="(page, index) in pages" :key="index" :style="{background: bgColor[index] ? bgColor[index] : bgBase}">
                <slot :name="`page${index + 1}`"></slot>
            </section>
        </div>

        <slot name="ui-fullpage-tab" class="ui-fullpage-tab" v-on:go="jump"></slot>

    </div>
</template>

<script>
    import store from 'store'
    var now = Date.now()
    export default {
        props: {
            amount: {
                type: Number,
                require: true
            },
            bgColor: {
                type: Array
            },
            bgBase: {
                default: '#fff'
            },
            curPage: {
                type: Number
            }
        },
        data() {
            return {
                pages: new Array(this.amount),
                curIndex: 0
            }
        },
        methods: {
            wheelEvent(e) {
                if(!store.state.approved)
                    return
                let curIndex = this.curIndex
                let dom = document.querySelector(`.index${curIndex + 1}`)
                if(dom){
                    if(dom.scrollHeight - dom.clientHeight > 3){
                        if(dom.scrollTop < dom.scrollHeight - dom.clientHeight && e.deltaY > 0){
                            return
                        }

                        if(dom.scrollTop > 0 && e.deltaY < 0){
                            return
                        }
                    }
                }
                if(Date.now() - now < 1000)
                    return

                now = Date.now()

                if (e.deltaY > 0) {
                    if(curIndex < this.pages.length - 1)
                        curIndex += 1
                }
                if (e.deltaY < 0) {
                    if(curIndex > 0)
                        curIndex -= 1
                }
                this.curIndex = curIndex
            },
            jump(page) {
                this.curIndex = page
            }
        },
        watch: {
            curPage: function(v){
                this.curIndex = v
            },
            curIndex: function(v){
                this.$emit("on-curIndex-change", v)
            }
        }
    }
</script>

<style lang="scss" type="text/css" scoped>
    .ui-fullpage{width: 100%;height: 100%;overflow: hidden;
        .ui-fullpage-container{width: 100%;height: 100%;transition: .6s ease;
            .ui-fullpage-box{width: 100%;height: 100%;}
        }
    }

    .ui-fullpage-tab-enter-active {
        animation: hide-show 5s ease-in-out 4s;
    }

    @keyframes hide-show{
        0%{opacity: 0;-webkit-filter: blur(26px);}
        100%{opacity: 1;-webkit-filter: blur(0px);}
    }

</style>
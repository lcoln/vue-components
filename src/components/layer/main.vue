<template>
    <div class="ui-waterfall" :style="waterfallStyle">
        <div class="ui-waterfall-container ui-fn-cl" ref="ui-waterfall-container">
            <section class="ui-waterfall-box ui-fn-fl" v-for="(page, index) in pages" ref="ui-waterfall-box" :style="pagestyle[index]">
                <slot :name="`waterfallPage${index + 1}`"></slot>
            </section>
        </div>

    </div>
</template>

<script>

    import vue from 'vue'
    import * as common from "common";


    function setStyle(vm){

        return new Promise((resolve, reject) => {
            let container = vm.$refs['ui-waterfall-container']
            let containerw = container.offsetWidth
            let box = vm.$refs['ui-waterfall-box']
            let boxMarginLeft = box[0].style.marginLeft.replace('px', '') >> 0
            let boxMarginRight = box[0].style.marginRight.replace('px', '') >> 0
            let boxMarginTop = box[0].style.marginTop.replace('px', '') >> 0
            let boxMarginBottom = box[0].style.marginBottom.replace('px', '') >> 0

            let boxw = box[0].offsetWidth + boxMarginLeft + boxMarginRight
            let maxColumLen = Math.floor(containerw / boxw)
            for(let i = 0;i < box.length;i++){
                let margin = boxMarginTop + boxMarginBottom

                let top = 0
                let left = boxw * (i % maxColumLen) + 'px'

                if(i + 1 > maxColumLen){
                    if(i - maxColumLen < maxColumLen){
                        top = box[i - maxColumLen].offsetHeight + margin + 'px'
                    }else{
                        let curBox = box[i - maxColumLen]
                        top = (curBox.style.transform.split(',')[1].replace('px)', '') >> 0) + curBox.offsetHeight + margin + 'px'
                    }
                }

                box[i].style.cssText += `transform: translate(${left},${top})`
            }
            resolve()
        });
    }

    export default {
        props: {
            amount: {
                type: Number,
                require: true
            },
            waterfallStyle: {
                type: Object,
                default(){
                    return {
                        width: '100%'
                    }
                }
            },
            pageStyle: {
                type: Object,
                default(){
                    return {
                        position: 'absolute',
                        width: '200px',
                        border: '1px solid #ddd'
                    }
                }
            },
            height: {
                type: Array,
                default(){
                    return [300, 400]
                },
                validator: function (val) {
                    return val[1] > val[0]
                }
            }
        },
        data() {
            return {
                pages: new Array(this.amount),
                curIndex: 0,
                pagestyle: []
            }
        },
        beforeMount: function(){

            for(let i = 0;i < this.amount;i++){
                let tmp = JSON.parse(JSON.stringify(this.pageStyle))
                tmp.height = Math.random() * (this.height[1] - this.height[0]) + this.height[0] + 'px'
                tmp.position = 'absolute'
                tmp.transition = '.4s'
                this.pagestyle[i] = tmp
            }
        },
        mounted: function(){
            let _this = this
            vue.nextTick(async function(){

                await setStyle(_this)

                common.listenEvent(window, 'resize', function(){
                    setStyle(_this)
                })
            })


        },
        computed:{

        },
        methods: {

        },
        watch: {

        }
    }
</script>

<style lang="scss" type="text/css" scoped>

    .ui-waterfall{width: 100%;height: 100%;
        .ui-waterfall-container{position: relative;width: 100%;height: 100%;
            .ui-waterfall-box{}
        }
    }

</style>
<template>
    <div class="ui-circle-percent">
        <section class="ui-circle-percent-box">
            <div class="ui-circle-percent-half left" :style="{transform: percent <= 0.5 ? 'rotate(-135deg)' : `rotate(${45 + (180 * percent * 2)}deg)`, 'border-left-color': color, 'border-bottom-color': color}"></div>
        </section><section class="ui-circle-percent-box">
            <div class="ui-circle-percent-half right" :style="{transform: percent >= 0.5 ? 'rotate(45deg)' : `rotate(${-135 + (180 * percent * 2)}deg)`, 'border-right-color': color, 'border-top-color': color}"></div>
        </section><section class="ui-circle-percent-text">
            <div class="text-box":style="{background: bgColor}">
                <span class="text">{{`${(percent * 100).toFixed(0)}%`}}</span>
            </div>
        </section>

    </div>
</template>

<script>

    import vue from 'vue'
    import * as common from "common";

    export default {
        props: {
            color: {
                type: String,
                default: '#000'
            },
            bgColor: {
                type: String,
                default: '#fff'
            },
            percent: {
                type: Number,
                default: 1
            }
        },
        data() {
            return {

            }
        },
        beforeMount: function(){

        },
        mounted: function(){


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

    .ui-circle-percent{position: relative;width: 100%;height: 100%;border-radius: 50%;
        .ui-circle-percent-box{display: inline-block;width: 50%;height: 100%;overflow: hidden;letter-spacing: 0;
            .ui-circle-percent-half{position: relative;left: 0;border: 10px solid #F44336;width: 200%;height: 100%;border-radius: 50%;transition: .4s;
                &.left{border-right: 10px solid transparent;border-top: 10px solid transparent;}
                &.right{left: -100%;border-left: 10px solid transparent;border-bottom: 10px solid transparent;}
            }
        }
        .ui-circle-percent-text{position: absolute;left: 0;top: 0;width: 100%;height: 100%;padding: 10px;
            .text-box{position: relative;width: 100%;height: 100%;border-radius: 50%;background: #fff;
                .text{position: absolute;left: 0;top: 0;bottom: 0;right: 0;margin: auto;color: #333;height: 30px;line-height: 30px;text-align: center;font-size: 18px;font-weight: bold;}
            }
        }
    }

</style>
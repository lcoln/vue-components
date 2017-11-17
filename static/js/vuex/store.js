/**
 * []
 * @authors Lincoln (875482941@qq.com)
 * @date    2017-04-07 21:39:45
 *
 */

"use strict"

import vuex from 'vuex'
import vue from 'vue'

vue.use(vuex)
var file
var $file

const store = new vuex.Store({
    state: {
        approved: true
    },
    mutations: {
        isEmptyObj: (state, arg) => {
            for(let i in arg.para){
                return false
            }
            return true
        },
        checkFields: function(state, arg){
            for(let i of arg.fields){
                if(!arg.para[i] && arg.para[i] !== 0)
                    return i
            }
            return true
        }
    },
    getters: {

    },
    actions: {
        post (state, {path, para}) {
            return new Promise((resolve, reject) => {
                vue.request.post(path)
                    .send(para || {})
                    .end((err, res) => {
                        if(['502','500'].indexOf(res.status) > -1)
                            return layer.alert(err + '')

                        var json = JSON.parse(res.text)

                        if(json.code != 200 && json.code != 201)
                            return layer.alert(json.msg)

                        resolve(json)
                    })
            })
        },
        sleep (state, time) {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve()
                }, time)
            })
        },
        chooseFile (state, {id}) {
            $file = document.getElementById(id)
            var ev = document.createEvent('MouseEvent')
            ev.initEvent('click', false, false)
            $file.dispatchEvent(ev)
        },
        //获取选择的图片的base64
        getFile (state, {file}) {
            return new Promise((resolve, reject) => {

                file = file
                if(file){
                    if(!/jpg|jpeg|png/.test(file.type) || file.size > 1024 * 2000){
                        $file.value = null
                        return layer.alert('请上传小于2mb的jpg或png格式的图片')
                    }

                    var fs = new FileReader()
                    fs.readAsDataURL(file)
                    fs.onload = function(){
                        $file.value = null
                        resolve(this.result)
                    }
                }
            });
        },
        //上传图片
        uploadFile(state){
            return new Promise((resolve, reject) => {
                vue.request.post('/common/uploadFile')
                    .field('file', file)
                    .end((err, res) => {
                        let json
                        if(res.status == 500)
                            return layer.alert(err + '')
                        else
                            json = JSON.parse(res.text)

                        if(json.code != 201)
                            return layer.alert(json.msg)
                        file = null
                        $file.value = null
                        resolve(json.data)
                    })
            });
        },
    }
})

export default store
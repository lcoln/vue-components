# 幻灯片组件文档

## 配置说明

```json
    {
        
        skin: 'green',      //皮肤: green, blue, pine, yellow
        showJumpBtn: true,   //是否显示跳转按钮
        max: 5,         //最大显示的页数
        $onSuccess: function(vm){
            vm.curr = 1         //当前页码
            vm.total = Math.ceil(arr.length / 10)       //当前总页数
        },          //在组件初始化完成后的回调中返回组件对象
        $callback: function(pid){
            
        }           //点击页码或翻页按钮时，返回页码
    }

```


## 用法

```html
<div ms-controller="index">
    <ul>
        <li ms-repeat="arr">{{el}}</li>
    </ul>
    <ui:pages identifier="indexPages" config="pagesOpts"></ui:pages>
</div>

<!--  
其中config属性是指定分页组件的配置，会自动从上一层controller里找;
identifier属性可以设定组件的$id值，方便各模块之间进行通讯
-->
<!--  引入分页组件  -->
<script type="text/javascript" src="avalon.min.js"></script>
<script type="text/javascript">
    require(['avalon', '../pages/pages'],function(av){
        var arr = []

        var Index = av.define({
            $id: 'index',
            arr: [],
            pagesOpts: {
                skin: 'green',
                showGo: true,
                max: 5,
                $onSuccess: function(vm){
                    av.log(vm)
                    vm.curr = 1
                    vm.total = Math.ceil(arr.length / 10)
                },
                $callback: function(pid){
                    
                }
            }
        })

        av.scan()
    })


</script>
```

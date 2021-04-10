<template>
    <div class="test-main-container">
        <div class="test-title">{{msg}}</div>
        <ne-panel class="test-panel" :init="init"></ne-panel>
    </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  data () {
    return {
      msg: 'node-editor节点编辑器测试',
      init: {
        nodeList: [
          {nId:'1', name: 'ne-text', x: -350, y: -150, value: '节点1'},
          {nId:'2', name: 'ne-text', x: -400, y: 0, value: '节点2'},
          {nId:'3', name: 'ne-text', x: -200, y: 100, value: '节点3'},
          {nId:'4', name: 'ne-add', x: -150, y: -100, value: [0, 1]},
          {nId:'5', name: 'ne-add', x: 50, y: 0, value: [0, 1, 2]},
          {nId:'6', name: 'ne-output', x: 0, y: -200, value: 'StringA'},
          {nId:'7', name: 'ne-output', x: 200, y: -150, value: 'StringB'},
          {nId:'8', name: 'ne-output', x: 250, y: -50, value: 'StringC'}
        ],
        connection: [
          {range: {p0: '1#o0', p1: '6#i0'}},
          {range: {p0: '1#o0', p1: '4#i0'}},
          {range: {p0: '2#o0', p1: '4#i1'}},
          {range: {p0: '2#o0', p1: '5#i0'}},
          {range: {p0: '3#o0', p1: '5#i1'}},
          {range: {p0: '4#o0', p1: '5#i2'}},
          {range: {p0: '4#o0', p1: '7#i0'}},
          {range: {p0: '5#o0', p1: '8#i0'}}
        ]
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>

    .test-main-container {
        width: 100vw;
        height: 100vh;
        display: flex;
        flex-direction: column;

        .test-title {
            width: 100%;
            height: 50px;
            min-height: 50px;
            font-size: 30px;
            line-height: 50px;
            font-weight: bold;
            text-align: center;
        }

        .test-panel {
            margin: 0 auto;
            width: 96%;
            height: 90%;
            border: 2px solid #2c3e50;
        }
    }

</style>

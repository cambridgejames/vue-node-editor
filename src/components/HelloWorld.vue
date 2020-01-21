<template>
  <div class="test-main-container">
    <div class="test-title">{{msg}}</div>
    <ne-panel class="test-panel" :node-list="nodeList"></ne-panel>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  data () {
    return {
      msg: 'node-editor节点编辑器测试',
      nodeList: [
        {name: 'ne-text', x: 0, y: 0, selected: false, value: '节点1'},
        {name: 'ne-text', x: 200, y: 0, selected: false}
      ]
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

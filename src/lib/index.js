import nePanel from './ne-panel.vue'
let nodeEditor = {}
nodeEditor.install = function (Vue, options) {
  Vue.component(nePanel.name, nePanel) // testPanel.name 组件的name属性
}
export default nodeEditor

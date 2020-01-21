import nePanel from './ne-panel.vue'
import neText from './nodes/input/ne-text.vue'

let nodeEditor = {}
nodeEditor.install = function (Vue, options) {
  Vue.component(nePanel.name, nePanel)
  Vue.component(neText.name, neText)
}

export default nodeEditor

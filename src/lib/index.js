import nePanel from './ne-panel'
import neText from './nodes/input/ne-text'
import  neAdd from './nodes/math/ne-add'
import  neOutput from './nodes/Output/ne-output'

let nodeEditor = {}
nodeEditor.install = function (Vue, options) {
  Vue.component(nePanel.name, nePanel)
  Vue.component(neText.name, neText)
  Vue.component(neAdd.name, neAdd)
  Vue.component(neOutput.name, neOutput)
}

export default nodeEditor

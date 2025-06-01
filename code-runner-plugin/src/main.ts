import { createApp, ref } from 'vue'

const App = {
  setup() {
    const code = ref('console.log("Hello World")')
    const lang = ref('javascript')
    const output = ref('')
    const runtimes = window.services.getRuntimes()

    const run = () => {
      try {
        output.value = window.services.runCode(code.value, lang.value)
      } catch (e) {
        output.value = String(e)
      }
    }

    return { code, lang, output, run, runtimes }
  },
  template: `
    <div>
      <select v-model="lang">
        <option value="javascript">JavaScript</option>
        <option value="typescript">TypeScript</option>
        <option value="c">C</option>
        <option value="rust">Rust</option>
        <option value="dart">Dart</option>
        <option value="html">HTML</option>
      </select>
      <textarea v-model="code" rows="10" cols="50" />
      <button @click="run">运行</button>
      <pre>{{output}}</pre>
    </div>
  `
}

createApp(App).mount('#app')

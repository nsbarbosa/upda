<script lang="ts">
export default defineComponent({
  setup() {
    const routerView = resolveComponent('router-view')

    return () => h('div', { class: 'layout-blank' }, h(routerView))
  },
})
</script>

<style>
.layout-blank {
  height: 100vh;
  align-content: center;
}
</style>

<script>
export default {
  props: {
    renderFunc: {
      type: Function,
      required: true,
    },
  },
  render() {
    return this.renderFunc(this.$attrs);
  },
};
</script>

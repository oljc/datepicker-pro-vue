<template>
  <div :class="`${prefixCls}-shortcuts`">
    <Button v-if="showNowBtn" size="mini" @click="() => onNowClick()"
      >此刻</Button
    >
    <Button
      v-for="(item, index) in shortcuts"
      :key="index"
      size="mini"
      @click="() => onItemClick(item)"
      @mouseenter.native="() => onItemMouseEnter(item)"
      @mouseleave.native="() => onItemMouseLeave(item)"
    >
      <RenderFunction v-if="isFunction(item.label)" :render-func="item.label" />
      <template v-else>
        {{ item.label }}
      </template>
    </Button>
  </div>
</template>

<script>
import Button from '../common/button.vue';
import RenderFunction from '../common/render-function.vue';

export default {
  name: 'PanelShortcuts',
  components: {
    Button,
    RenderFunction,
  },
  props: {
    prefixCls: {
      type: String,
      required: true,
    },
    shortcuts: {
      type: Array,
      default: () => [],
    },
    showNowBtn: {
      type: Boolean,
    },
  },
  methods: {
    isFunction(obj) {
      return typeof obj === 'function';
    },
    onItemClick(item) {
      this.$emit('itemClick', item);
    },
    onItemMouseEnter(item) {
      this.$emit('itemMouseEnter', item);
    },
    onItemMouseLeave(item) {
      this.$emit('itemMouseLeave', item);
    },
    onNowClick() {
      this.$emit('nowClick');
    },
  },
};
</script>

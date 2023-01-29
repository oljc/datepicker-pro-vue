<template>
  <button
    :class="[
      cls,
      { [`${prefixCls}-only-icon`]: $slots.icon && !$slots.default },
    ]"
    :type="htmlType"
    @click="handleClick"
  >
    <span v-if="loading || $slots.icon" :class="`${prefixCls}-icon`">
      <icon-loading v-if="loading" :spin="true" />
      <slot v-else name="icon" />
    </span>
    <slot />
  </button>
</template>

<script>
import { getPrefixCls } from '../utils/config';

export default {
  name: 'Button',
  props: {
    type: {
      type: String,
      default: 'secondary',
    },
    shape: {
      type: String,
      default: 'square',
    },
    status: {
      type: String,
      default: 'normal',
    },
    size: {
      type: String,
    },
    long: {
      type: Boolean,
      default: false,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
    },
    htmlType: {
      type: String,
      default: 'button',
    },
  },
  data() {
    return {
      prefixCls: getPrefixCls('btn'),
    };
  },
  computed: {
    cls() {
      return [
        this.prefixCls,
        `${this.prefixCls}-${this.type}`,
        `${this.prefixCls}-shape-${this.shape}`,
        `${this.prefixCls}-size-${this.size}`,
        `${this.prefixCls}-status-${this.status}`,
        {
          [`${this.prefixCls}-long`]: this.long,
          [`${this.prefixCls}-loading`]: this.loading,
          [`${this.prefixCls}-disabled`]: this.disabled,
        },
      ];
    },
  },
  methods: {
    handleClick(ev) {
      if (this.disabled || this.loading) {
        ev.preventDefault();
        return;
      }
      this.$emit('click', ev);
    },
  },
};
</script>

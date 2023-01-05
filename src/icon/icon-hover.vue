<template>
  <span
    :class="[
      prefixCls,
      {
        [`${prefix}-icon-hover`]: prefix,
        [`${prefixCls}-size-${size}`]: size !== 'medium',
        [`${prefixCls}-disabled`]: disabled,
      },
    ]"
  >
    <slot />
  </span>
</template>

<script>
import { getPrefixCls } from '../utils/config';

export default {
  name: 'IconHover',
  props: {
    prefix: {
      type: String,
    },
    size: {
      type: String,
      default: 'medium',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      prefixCls: getPrefixCls('icon-hover'),
    };
  },
};
</script>

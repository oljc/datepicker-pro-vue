<template>
  <div ref="refWrapper" :class="`${prefixCls}-column`">
    <ul>
      <li
        v-for="item in list"
        :key="item.value"
        :ref="item.value"
        :class="[
          `${prefixCls}-cell`,
          {
            [`${prefixCls}-cell-disabled`]: item.disabled,
            [`${prefixCls}-cell-selected`]: item.selected,
          },
        ]"
        @click="onItemClick(item)"
      >
        <div :class="`${prefixCls}-cell-inner`">{{ item.label }}</div>
      </li>
    </ul>
  </div>
</template>

<script>
import { isUndefined } from '../../utils/is';
import { scrollTo } from '../../utils/index';

export default {
  name: 'TimePickerColumn',
  props: {
    prefixCls: {
      type: String,
      required: true,
    },
    list: {
      type: Array,
      required: true,
    },
    value: {
      type: [Number, String],
    },
    visible: {
      type: Boolean,
    },
  },
  methods: {
    scrollToTop(easing = false) {
      if (!this.$refs.refWrapper || isUndefined(this.value) || !this.visible) {
        return;
      }
      const refSelected = this.$refs[this.value] && this.$refs[this.value][0];
      if (refSelected) {
        scrollTo(
          this.$refs.refWrapper,
          refSelected.offsetTop,
          easing ? 100 : 0
        );
      }
    },
    onItemClick(item) {
      if (!item.disabled) {
        this.$emit('select', item.value);
      }
    },
  },
  watch: {
    value() {
      this.scrollToTop(true);
    },
    visible() {
      this.$nextTick(() => {
        this.scrollToTop();
      });
    },
  },
  mounted() {
    this.scrollToTop();
  },
};
</script>

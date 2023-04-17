<template>
  <div :class="classNames">
    <div :class="getInputWrapClassName(0)">
      <input
        ref="refInput0"
        :disabled="disabled0"
        :placeholder="placeholder[0]"
        :value="displayValue0"
        v-bind="readonly ? { readonly: true } : {}"
        @input="onChange"
        @keydown.enter="onPressEnter"
        @keydown.tab="onPressTab"
        @click="changeFocusedInput(0)"
      />
    </div>
    <span :class="`${prefixCls}-separator`">
      <slot name="separator"> - </slot>
    </span>
    <div :class="getInputWrapClassName(1)">
      <input
        ref="refInput1"
        :disabled="disabled1"
        :placeholder="placeholder[1]"
        :value="displayValue1"
        v-bind="readonly ? { readonly: true } : {}"
        @input="onChange"
        @keydown.enter="onPressEnter"
        @keydown.tab="onPressTab"
        @click="changeFocusedInput(1)"
      />
    </div>
    <div :class="`${prefixCls}-suffix`">
      <IconHover
        v-if="allowClear && !disabled && value.length === 2"
        :prefix="prefixCls"
        :class="`${prefixCls}-clear-icon`"
        @click.native="onClear"
      >
        <IconCommon use="close" />
      </IconHover>
      <span :class="`${prefixCls}-suffix-icon`">
        <slot name="suffix-icon" />
      </span>
    </div>
  </div>
</template>

<script>
import IconCommon from '../icon/icon-common.vue';
import IconHover from '../icon/icon-hover.vue';

import {
  isArray,
  isFunction,
  isDayjs,
  isNumber,
  isUndefined,
} from '../utils/is';
import { getPrefixCls } from '../utils/config';
import { log } from 'console';

export default {
  name: 'DateInputRange',
  components: {
    IconHover,
    IconCommon,
  },
  props: {
    size: {
      type: String,
      default: 'medium',
    },
    focused: {
      type: Boolean,
    },
    focusedIndex: {
      type: Number,
    },
    error: {
      type: Boolean,
    },
    disabled: {
      type: [Boolean, Array],
      default: false,
    },
    readonly: {
      type: Boolean,
    },
    allowClear: {
      type: Boolean,
    },
    placeholder: {
      type: Array,
      default: () => [],
    },
    inputValue: {
      type: Array,
    },
    value: {
      type: Array,
      default: () => [],
    },
    format: {
      type: [String, Function],
      required: true,
    },
  },
  computed: {
    disabled0() {
      return this.getDisabled(0);
    },
    disabled1() {
      return this.getDisabled(1);
    },
    classNames() {
      return [
        this.prefixCls,
        `${this.prefixCls}-range`,
        `${this.prefixCls}-size-${this.size}`,
        {
          [`${this.prefixCls}-focused`]: this.focused,
          [`${this.prefixCls}-disabled`]: this.disabled0 && this.disabled1,
          [`${this.prefixCls}-error`]: this.error,
        },
      ];
    },
    displayValue0() {
      return this.getDisplayValue(0);
    },
    displayValue1() {
      return this.getDisplayValue(1);
    },
  },
  data() {
    return {
      prefixCls: getPrefixCls('picker'),
    };
  },
  methods: {
    getDisabled(index) {
      return isArray(this.disabled) ? this.disabled[index] : this.disabled;
    },
    getInputWrapClassName(index) {
      return [
        `${this.prefixCls}-input`,
        {
          [`${this.prefixCls}-input-active`]: index === this.focusedIndex,
        },
      ];
    },
    getDisplayValue(index) {
      if (this.inputValue) {
        return this.inputValue[index];
      }
      const targetValue = this.value && this.value[index];
      if (targetValue && isDayjs(targetValue)) {
        return isFunction(this.format)
          ? this.format(targetValue)
          : targetValue.format(this.format);
      }
      return undefined;
    },
    changeFocusedInput(index) {
      this.$emit('focused-index-change', index);
      this.$emit('update:focusedIndex', index);
    },
    onChange(e) {
      e.stopPropagation();
      this.$emit('change', e);
    },
    onPressEnter() {
      this.$emit('press-enter');
    },
    onPressTab(e) {
      e.preventDefault();
    },
    onClear(e) {
      this.$emit('clear', e);
    },
    focus(index) {
      const targetIndex = isNumber(index) ? index : this.focusedIndex;
      const targetElement =
        targetIndex === 0 ? this.$refs.refInput0 : this.$refs.refInput1;
      !isUndefined(targetIndex) &&
        !this.getDisabled(targetIndex) &&
        targetElement.focus();
    },
    blur() {
      const targetElement =
        this.focusedIndex === 0 ? this.$refs.refInput0 : this.$refs.refInput1;
      targetElement && targetElement.blur && targetElement.blur();
    },
  },
};
</script>

<style></style>

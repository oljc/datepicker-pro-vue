<template>
  <div :class="classNames">
    <div :class="`${prefixCls}-input`">
      <input
        ref="refInput"
        :disabled="disabled"
        :placeholder="placeholder"
        :class="`${prefixCls}-start-time`"
        v-bind:value="displayValue"
        v-bind="readonly ? { readonly: true } : {}"
        @keydown.enter="onPressEnter"
        @input="onChange"
      />
    </div>
    <div :class="`${prefixCls}-suffix`">
      <IconHover
        v-if="allowClear && !disabled && displayValue"
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
import { getPrefixCls } from '../utils/config';
import { isDayjs, isFunction } from '../utils/is';

export default {
  name: 'DateInput',
  components: {
    IconHover,
    IconCommon,
  },
  props: {
    size: {
      type: String,
      validator: (value) => {
        return ['mini', 'small', 'medium', 'large'].includes(value);
      },
    },
    focused: {
      type: Boolean,
    },
    disabled: {
      type: Boolean,
    },
    readonly: {
      type: Boolean,
    },
    error: {
      type: Boolean,
    },
    allowClear: {
      type: Boolean,
    },
    placeholder: {
      type: String,
    },
    inputValue: {
      type: String,
    },
    value: {
      type: Object,
    },
    format: {
      type: [String, Function],
      required: true,
    },
  },
  data() {
    return {
      prefixCls: getPrefixCls('picker'),
    };
  },
  computed: {
    classNames() {
      return [
        this.prefixCls,
        `${this.prefixCls}-size-${this.size}`,
        {
          [`${this.prefixCls}-focused`]: this.focused,
          [`${this.prefixCls}-disabled`]: this.disabled,
          [`${this.prefixCls}-error`]: this.error,
        },
      ];
    },
    displayValue() {
      if (this.inputValue) return this.inputValue;
      if (this.value && isDayjs(this.value)) {
        return isFunction(this.format)
          ? this.format(this.value)
          : this.value.format(this.format);
      }
      return undefined;
    },
  },
  methods: {
    onPressEnter() {
      this.$emit('pressEnter');
    },
    onChange(e) {
      this.$emit('change', e);
    },
    onClear(e) {
      this.$emit('clear', e);
    },
    focus() {
      this.$refs.refInput &&
        this.$refs.refInput.focus &&
        this.$refs.refInput.focus();
    },
    blur() {
      this.$refs.refInput &&
        this.$refs.refInput.blur &&
        this.$refs.refInput.blur();
    },
  },
};
</script>

<style></style>

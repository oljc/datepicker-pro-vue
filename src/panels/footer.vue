<template>
  <div :class="`${prefixCls}-footer`">
    <div v-if="$slots.extra" :class="`${prefixCls}-footer-extra-wrapper`">
      <slot name="extra" />
    </div>
    <div v-if="showTodayBtn" :class="`${prefixCls}-footer-now-wrapper`">
      <a :class="`${prefixCls}-link`" @click="onTodayClick">今天</a>
    </div>
    <div
      v-if="$slots.btn || showConfirmBtn"
      :class="`${prefixCls}-footer-btn-wrapper`"
    >
      <slot name="btn" />
      <Button
        v-if="showConfirmBtn"
        :class="`${prefixCls}-btn-confirm`"
        type="primary"
        size="mini"
        :disabled="confirmBtnDisabled"
        @click="onConfirmBtnClick"
      >
        确定
      </Button>
    </div>
  </div>
</template>

<script>
import Button from '../common/button.vue';

export default {
  name: 'PanelFooter',
  components: {
    Button,
  },
  props: {
    prefixCls: {
      type: String,
      required: true,
    },
    showTodayBtn: {
      type: Boolean,
    },
    showConfirmBtn: {
      type: Boolean,
    },
    confirmBtnDisabled: {
      type: Boolean,
    },
  },
  methods: {
    onTodayClick() {
      this.$emit('todayBtnClick');
    },
    onConfirmBtnClick() {
      this.$emit('confirmBtnClick');
    },
  },
};
</script>

<style></style>

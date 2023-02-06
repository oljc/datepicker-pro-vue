<template>
  <component :is="popupTag" class="datepicke-pro-vue">
    <slot></slot>
    <div
      ref="content"
      :class="[`${prefixCls}-popup`, `${prefixCls}-position-${position}`]"
      @after-leave="doDestroy"
    >
      <transition
        :name="animationName"
        :enter-active-class="enterActiveClass"
        :leave-active-class="leaveActiveClass"
      >
        <div
          :class="`${prefixCls}-popup-wrapper`"
          v-show="!disabled && showPopper"
        >
          <div :class="[`${prefixCls}-content`]">
            <slot name="content"></slot>
          </div>
          <div
            ref="arrowRef"
            v-if="showArrow"
            :class="[`${prefixCls}-arrow`]"
          />
        </div>
      </transition>
    </div>
  </component>
</template>

<script>
import { createPopper } from '@popperjs/core';

import { getPrefixCls } from '../utils/config';

function on(element, event, handler, capture = false) {
  if (element && event && handler) {
    document.addEventListener
      ? element.addEventListener(event, handler, capture)
      : element.attachEvent(`on${event}`, handler);
  }
}

function off(element, event, handler) {
  if (element && event) {
    document.removeEventListener
      ? element.removeEventListener(event, handler, false)
      : element.detachEvent(`on${event}`, handler);
  }
}

export default {
  props: {
    // 弹出框是否可见
    popupVisible: {
      type: Boolean,
      default: undefined,
    },
    popupTag: {
      type: String,
      default: 'div',
    },
    // 触发方式
    trigger: {
      type: String,
      default: 'hover',
      validator: (value) =>
        ['toggle', 'click', 'hover', 'focus'].indexOf(value) > -1,
    },
    // 弹窗位置
    position: {
      type: String,
      default: 'bottom',
    },
    // 弹出框是否显示箭头
    showArrow: {
      type: Boolean,
      default: false,
    },
    // 偏移
    offset: {
      type: [String, Number],
      default: 0,
    },
    // mouseenter事件延时触发的时间（毫秒）
    mouseEnterDelay: {
      type: Number,
      default: 100,
    },
    // mouseleave事件延时触发的时间（毫秒）
    mouseLeaveDelay: {
      type: Number,
      default: 100,
    },
    // 禁用
    disabled: {
      type: Boolean,
      default: false,
    },
    // 持续展示
    forceShow: {
      type: Boolean,
      default: false,
    },
    // 是否挂载在body下
    renderToBody: {
      type: Boolean,
      default: true,
    },
    // 是否卸载节点
    unmountOnClose: {
      type: Boolean,
      default: false,
    },
    // 动画
    animationName: {
      type: String,
      default: 'fade-in',
    },
    enterActiveClass: String,
    leaveActiveClass: String,
    // 弹出挂载容器
    popupContainer: {
      type: [String, Object],
    },
    stopPropagation: {
      type: Boolean,
      default: false,
    },
    preventDefault: {
      type: Boolean,
      default: false,
    },
    // GPU渲染-低端机可能无法开启
    gpuAcceleration: {
      type: Boolean,
      default: true,
    },
  },

  data() {
    return {
      prefixCls: getPrefixCls('trigger') || 'ljc-trigger',
      referenceElm: null,
      popperJS: null,
      showPopper: false,
    };
  },

  watch: {
    showPopper(value) {
      if (value) {
        this.$emit('show', this);
        this.updatePopper();
      } else {
        this.unmountOnClose && this.doDestroy();
        this.$emit('hide', this);
      }
      this.$emit('update:popupVisible', value);
      this.$emit('popupVisibleChange', value);
    },
    // 独立外部-统一由内部处理
    popupVisible(val) {
      this.showPopper = val;
    },

    forceShow: {
      handler(value) {
        this[value ? 'doShow' : 'doClose']();
      },
      immediate: true,
    },

    disabled(value) {
      this.showPopper = !value;
    },
  },

  mounted() {
    this.referenceElm = this.$slots.default[0].elm;
    this.popper =
      this.popupContainer || this.$refs.content || this.$slots.content[0].elm;
    switch (this.trigger) {
      case 'toggle':
        on(this.referenceElm, 'click', this.doToggle);
        on(document, 'click', this.handleDocumentClick, true);
        on(document, 'touchstart', this.handleDocumentClick);
        break;
      case 'click':
        on(this.referenceElm, 'click', this.doShow);
        on(document, 'click', this.handleDocumentClick, true);
        on(document, 'touchstart', this.handleDocumentClick);
        break;
      case 'hover':
        on(this.referenceElm, 'mouseover', this.onMouseOver);
        on(this.popper, 'mouseover', this.onMouseOver);
        on(this.referenceElm, 'mouseout', this.onMouseOut);
        on(this.popper, 'mouseout', this.onMouseOut);
        break;
      case 'focus':
        on(this.referenceElm, 'focus', this.onMouseOver);
        on(this.popper, 'focus', this.onMouseOver);
        on(this.referenceElm, 'blur', this.onMouseOut);
        on(this.popper, 'blur', this.onMouseOut);
        break;
      default:
        break;
    }
  },

  methods: {
    doToggle(event) {
      this.stopPropagation && event.stopPropagation();
      this.preventDefault && event.preventDefault();
      if (!this.disabled && !this.forceShow) {
        this.showPopper = !this.showPopper;
      }
    },

    doShow() {
      if (!this.disabled) {
        this.showPopper = true;
      }
    },

    doClose() {
      if (!this.disabled) {
        this.showPopper = false;
      }
    },

    doDestroy() {
      if (this.showPopper) {
        return;
      }

      if (this.popperJS) {
        this.popperJS.destroy();
        this.popperJS = null;
      }
    },

    createPopper() {
      if (this.renderToBody) {
        document.body.appendChild(this.popper);
      }

      if (this.popperJS && this.popperJS.destroy) {
        this.popperJS.destroy();
      }
      this.popperJS = createPopper(this.referenceElm, this.popper, {
        placement: this.position,
        modifiers: [
          {
            name: 'offset',
            options: {
              offset: [0, this.offset],
            },
          },
        ],
        computeStyle: {
          gpuAcceleration: this.gpuAcceleration,
        },
      });
    },

    destroyPopper() {
      off(this.referenceElm, 'click', this.doToggle);
      off(this.referenceElm, 'mouseup', this.doClose);
      off(this.referenceElm, 'mousedown', this.doShow);
      off(this.referenceElm, 'focus', this.doShow);
      off(this.referenceElm, 'blur', this.doClose);
      off(this.referenceElm, 'mouseout', this.onMouseOut);
      off(this.referenceElm, 'mouseover', this.onMouseOver);
      off(document, 'click', this.handleDocumentClick);
      this.showPopper = false;
      this.doDestroy();
    },

    updatePopper() {
      this.popperJS ? this.popperJS.update() : this.createPopper();
    },

    onMouseOver() {
      if (this.disabled) return;
      clearTimeout(this._timer);
      this._timer = setTimeout(() => {
        this.showPopper = true;
      }, this.mouseEnterDelay);
    },

    onMouseOut() {
      if (this.disabled) return;
      clearTimeout(this._timer);
      this._timer = setTimeout(() => {
        this.showPopper = false;
      }, this.mouseLeaveDelay);
    },

    handleDocumentClick(e) {
      if (
        this.disabled ||
        !this.$el ||
        !this.referenceElm ||
        this.elementContains(this.$el, e.target) ||
        this.elementContains(this.referenceElm, e.target) ||
        !this.popper ||
        this.elementContains(this.popper, e.target)
      ) {
        return;
      }

      if (this.forceShow) {
        return;
      }
      this.showPopper = false;
    },

    elementContains(elm, otherElm) {
      if (typeof elm.contains === 'function') {
        return elm.contains(otherElm);
      }

      return false;
    },
  },

  destroyed() {
    this.destroyPopper();
  },
};
</script>

import DatePickerPro from './picker';
import './style';

const components = [DatePickerPro];

// eslint-disable-next-line func-names
const install = function (Vue) {
  if (install.installed) return;
  components.map((component) => Vue.component(component.name, component));
};

// 判断是否是直接引入文件
if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue);
}

export default {
  install,
  DatePickerPro,
};

export { install, DatePickerPro };

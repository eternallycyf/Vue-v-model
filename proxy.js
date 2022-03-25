
class MVVM {
  constructor(el, data) {
    this.el = document.querySelector(el)
    this.data = data;
    this.domPool = {};
    this.init();
  }

  init() {
    this.initData()
    this.initDom()
  }

  initDom() {
    this.bindDom(this.el)
    this.bindInput(this.el)
  }

  initData() {
    const _this = this;
    this.data = new Proxy(this.data, {
      get(target, key) {
        return Reflect.get(target, key)
      },
      set(target, key, value) {
        _this.domPool[key].innerHTML = value
        return Reflect.set(target, key, value)
      }
    })
  }

  bindDom(el) {
    const childNodes = el.childNodes

    childNodes.forEach(item => {
      if (item.nodeType === 3) {
        const _value = item.nodeValue;
        if (_value.trim().length) {
          let _isValid = /\{\{(.+?)\}\}/.test(_value)
          if (_isValid) {
            const _key = _value.match(/\{\{(.+?)\}\}/)[1].trim()
            this.domPool[_key] = item.parentNode;
            item.parentNode.innerText = this.data[_key] || undefined
          }
        }
      }

      item.childNodes && this.bindDom(item)
    })
  }

  bindInput(el) {
    const _allInputs = el.querySelectorAll('input');

    _allInputs.forEach(input => {
      const _vModel = input.getAttribute('v-model')
      if (_vModel) {
        input.addEventListener('keyup', this.handleInput.bind(this, _vModel, input), false)
      }
    })
  }


  handleInput(key, input) {
    const _value = input.value;
    this.data[key] = _value;

  }

  setData(key, value) {
    this.data[key] = value;
  }

}

const app = new MVVM('#app', {
  name: "myname",
  age: "12",
  email: "9999@99",
  tel: "111212"
})

document.querySelector("#btn")?.addEventListener('click', function () {
  app.setData('name', 'newName')
})

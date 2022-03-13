import convert from 'color-convert'

class Color {
  startColor = {
    h: 120,
    s: 100,
    l: 100
  }
  endColor = {
    h: 240,
    s: 100,
    l: 100
  }
  options = {
    steps: 5,
    isReverse: false,
    colorFunc: {
      h: _ => null,
      s: _ => 1,
      l: x => x*x
    }
  }
  colorLine = []

  constructor({ startColor = {}, endColor = {}, options = {} }) {
    this.startColor = { ...this.startColor, ...startColor }
    this.endColor = { ...this.endColor, ...endColor, }
    this.options = { ...this.options, ...options }
  }

  reload({ startColor = {}, endColor = {}, options = {} }) {
    this.startColor = { ...this.startColor, ...startColor }
    this.endColor = { ...this.endColor, ...endColor, }
    this.options = { ...this.options, ...options }
  }

  initLines() {
    const { startColor, endColor, options } = this
    const { h = _ => _, s = _ => _, l = _ => _ } = options.colorFunc
    const { steps } = options
    // 先计算出hsl各个数值的差值
    const hOffset = endColor.h - startColor.h, // 50
      sOffset = endColor.s - startColor.s, // 30
      lOffset = endColor.l - startColor.l // 30
    // 先根据曲线方程算出步长 *(范围100的)
    const rangeControl = (value, min = 0, max = 100) => {
      return ( value < min 
          ? min 
          : (value > max ? max : value)
        )
        ?? 100
    }
    const colorLine = new Array(steps + 1).fill()
      .map((_, index) => ({
        value: index/steps,
        // h: color.h
      }))
      .map(({ value }) => ({
        color: {
          hValue: rangeControl(h(value)),
          sValue: rangeControl(s(value)),
          lValue: rangeControl(l(value))
        }
      }))
      .map(({ color }) => ({
        // last result
        color: {
          h: startColor.h + hOffset * color.hValue,
          s: startColor.s + sOffset * color.sValue,
          l: startColor.l + lOffset * color.lValue,
          hex: '#' + convert.hsl.hex(
            startColor.h + hOffset * color.hValue, 
            startColor.s + sOffset * color.sValue,
            startColor.l + lOffset * color.lValue
          )
        }
      }))
    this.colorLine = colorLine
    return colorLine
  }

  initCssText(type, nameVal='pink') {
    const cssTextWrap = (name, value) => {
      switch(type) {
        case 'css':
          return `var(--${name}): ${value};\n`
        case 'less':
          return `@${name}: ${value};\n`
        case 'scss':
          return `$${name}: ${value};\n`
        default:
          return `var(--${name}): ${value};\n`
      }
    }
    const colors = this.initLines()
    console.log(colors)
    const levels = (colors.length - 1) / 2
    let text = ``
    colors.forEach(({ color }, index) => {
      if(index<levels) {
        text += cssTextWrap(`${nameVal}-light-${levels-index}`, color.hex)
      }else if(index > levels) {
        text += cssTextWrap(`${nameVal}-dark-${index-levels}`, color.hex)
      } else if(index === levels) {
        text += cssTextWrap(nameVal, color.hex)
      }
    })
    return text
  }
}

export default Color
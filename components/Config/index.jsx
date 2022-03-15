import React, { useState, useEffect, useRef } from 'react'
import { HuePicker } from 'react-color'
import { Slider, Input, Tooltip, Select } from 'antd'
const { Option } = Select
import { CHART_TYPES } from '@/config/index'
import Color from '@/core/index'
import style from './index.module.scss'
import BezierEasing from 'bezier-easing'
const Bezier = {
  'ease-in': BezierEasing(0.5, 0, 1, 1),
  'ease-out':  BezierEasing(0, 0, 0.5, 1),
  'ease-in-out': BezierEasing(0.5, 0, 0.5, 1)
}

export default function ConfigComponent({ 
  colorChange,
  typeChange 
}) {
  const [startColor, setStartColor] = useState({
    h: 120, // h变化的时候需要判断是否逆向
    s: 80,
    l: 70
  })
  const [endColor, setEndColor] = useState({
    h: 240,
    s: 100,
    l: 90
  })
  const [colorFuncs, setColorFuncs] = useState({
    h: 'return x',
    s: 'return Math.log(x + 1)',
    l: 'return x * x',
  })
  const [config, setConfig] = useState({
    steps: 10, // 生产颜色的数量
    colorFunc: {}, // 颜色变化的曲线
    isReverse: false, // 色环是否逆向变化
  })
  const [hExpression, sExpression, lExpression] = [useRef(null), useRef(null), useRef(null)]

  const setExpression = (funcName, target) => {
    if(funcName==='custom') {
      return
    }
    setConfig({
      ...config,
      colorFunc: {
        ...config.colorFunc,
        [target]: Bezier[funcName]
      }
    })
  }
  const tips = {
    HUE_EXPRESSION: `定制hue的曲线: 输入的值(x)从0 - 1, 输出的值(return)也为从0 - 1`
  }

  const [myColor] = useState(new Color({}))
  // 用于重载线条函数
  useEffect(() => {
    const saveFunctionWrap = (Expression) => {
      return Function('x', `try {
        ${Expression}
      } catch(e) {
        console.log('Custom Function Error' + e)
      }`)
    }
    try {
      const funcs = {
        h: saveFunctionWrap(colorFuncs.h),
        s: saveFunctionWrap(colorFuncs.s),
        l: saveFunctionWrap(colorFuncs.l),
      }
      setConfig({
        ...config,
        colorFunc: funcs
      })
    } catch(e) {
      console.log('ERROR' + e)
    }
  }, [colorFuncs])

  // 监听所有变动
  useEffect(() => {
    myColor.reload({startColor, endColor, options: config})
    const colors = myColor.initLines()
    console.log(myColor.initCssText('css', 'color'))
    colorChange(colors)
  }, [startColor, endColor, config])

  return (
    <div className={style["side-bar-wrap"]}>
      <div className={style["section-title"]}>
        {'Hue'} 
        <div 
          className={[style["title-button"]]}
          onClick={() => typeChange(CHART_TYPES.HUE)}
        >Show Chart</div>
      </div>
      <div className={style["selector-item"]}>
        <div className={style["label"]}>
          {'Start Color Hue'}
        </div>
        <div className={style["picker"]}>
          <HuePicker 
            color={{ h: startColor.h }}
            onChange={(color) => setStartColor({...startColor, h: color.hsl.h})} 
            width={'100%'}
          />  
        </div>
      </div>
      <div className={style["selector-item"]}>
        <div className={style["label"]}>
          {'End Color Hue'}
        </div>
        <div className={style["picker"]}>
          <HuePicker 
            color={{ h: endColor.h }}
            onChange={(color) => setEndColor({...endColor, h: color.hsl.h})} 
            width={'100%'}
          />  
        </div>
      </div>
      <div className={style["selector-item"]}>
        <div className={style["label"]}>
          <Tooltip title={tips.HUE_EXPRESSION}>
            {'Hue Expression'}
          </Tooltip>
          <div className={style["selector"]}>
            <Select defaultValue="ease-in" style={{ width: 140 }} onChange={(e)=>setExpression(e, 'h')} size="small">
              <Option value="ease-in">Ease In</Option>
              <Option value="ease-out">Ease Out</Option>
              <Option value="ease-in-out">Ease In Out</Option>
              <Option value="custom">Custom</Option>
            </Select>
          </div>
        </div>
        <div className={style["picker"]}>
          <Input.TextArea
            ref={hExpression}
            value={colorFuncs.h}
            onChange={(e) => setColorFuncs({...colorFuncs, h: e.target.value})} 
          />  
        </div>
      </div>
      <div className={style["section-title"]}>
        {'Saturation'}
        <div 
          className={[style["title-button"]]}
          onClick={() => typeChange(CHART_TYPES.SATURATION)}
        >Show Chart</div>
      </div>
      <div className={style["selector-item"]}>
        <div className={style["label"]}>
          {'Color Saturation Start'}
        </div>
        <div className={style["picker"]}>
          <Slider 
            value={startColor.s} 
            onChange={(value) => setStartColor({...startColor, s: value})} 
          />
        </div>
      </div>
      <div className={style["selector-item"]}>
        <div className={style["label"]}>
          {'Color Saturation End'}
        </div>
        <div className={style["picker"]}>
          <Slider 
            value={endColor.s} 
            onChange={(value) => setEndColor({...endColor, s: value})} 
          />
        </div>
      </div>
      <div className={style["selector-item"]}>
        <div className={style["label"]}>
          {'Saturation Expression'}
          
          <div className={style["selector"]}>
            <Select defaultValue="ease-in" style={{ width: 140 }} onChange={(e)=>setExpression(e, 'l')} size="small">
              <Option value="ease-in">Ease In</Option>
              <Option value="ease-out">Ease Out</Option>
              <Option value="ease-in-out">Ease In Out</Option>
              <Option value="custom">Custom</Option>
            </Select>
          </div>
        </div>
        <div className={style["picker"]}>
          <Input.TextArea  
            ref={sExpression}
            value={colorFuncs.s}
            onChange={(e) => setColorFuncs({...colorFuncs, s: e.target.value})} 
          />  
        </div>
      </div>
      <div className={style["section-title"]}>
        {'Lightness'}
        <div 
          className={[style["title-button"]]}
          onClick={() => typeChange(CHART_TYPES.LIGHTNESS)}
        >Show Chart</div>
      </div>
      <div className={style["selector-item"]}>
        <div className={style["label"]}>
          {'Color Lightness Start'}
        </div>
        <div className={style["picker"]}>
          <Slider 
            value={startColor.l} 
            onChange={(value) => setStartColor({...startColor, l: value})} 
          />
        </div>
      </div>
      <div className={style["selector-item"]}>
        <div className={style["label"]}>
          {'Color Lightness End'}
        </div>
        <div className={style["picker"]}>
          <Slider 
            value={endColor.l} 
            onChange={(value) => setEndColor({...endColor, l: value})} 
          />
        </div>
      </div>
      <div className={style["selector-item"]}>
        <div className={style["label"]}>
          {'Lightness Expression'}
          <div className={style["selector"]}>
            <Select defaultValue="ease-in" style={{ width: 140 }} onChange={(e)=>setExpression(e, 's')} size="small">
              <Option value="ease-in">Ease In</Option>
              <Option value="ease-out">Ease Out</Option>
              <Option value="ease-in-out">Ease In Out</Option>
              <Option value="custom">Custom</Option>
            </Select>
          </div>
        </div>
        <div className={style["picker"]}>
          <Input.TextArea  
            ref={lExpression}
            value={colorFuncs.l}
            onChange={(e) => setColorFuncs({...colorFuncs, l: e.target.value})} 
          />  
        </div>
      </div>
    </div>
  )
}

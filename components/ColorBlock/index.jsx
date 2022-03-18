import React from 'react'
import style from './index.module.scss'
import copy from '@/utils/copy'
import Color from '@/core/index'
export default function ColorBlock({ colors }) {
  console.log(colors)
  return (
    <div style={{
      margin: '10px 35px',
      maxWidth: '100%',
      overflowX: 'scroll',
      display: 'flex',
      flexWrap: 'nowrap'
    }}>
      <div style={{
        display: 'flex',
        flexWrap: 'nowrap'
      }}>
      {
        colors.map(({ color }, index) => {
          const fontColor = Color.contrastRatioCalc(color.hex, '#000') < 4.5
          ? 'white' 
          : 'black'
          return (
            <div
              onClick={() => copy(color.hex)}
              className={style["color-block-item"]} 
              key={index} 
              style={{
                background: color.hex,
                color: fontColor
              }}
            >
              {color.hex}
            </div>
          )
        })
      }
      </div>
    </div>
  )
}

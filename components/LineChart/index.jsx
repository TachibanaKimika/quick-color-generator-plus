import React, { useState, useEffect, useCallback } from 'react'
import shortid from 'shortid'
import { Chart } from '@antv/g2';
import dynamic from 'next/dynamic';

function LineChart({ type, data }) {
  const [uuid] = useState(shortid.generate())
  const [chartInstance, setChartInstance] = useState(null)
  console.log(type, data)
  const formatData = (nodes) => nodes.map((node, index) => ({...node.color, index}))

  // first render
  useEffect(() => {
    const chart = new Chart({
      container: uuid,
      autoFit: true,
      height: 700,
      padding: [30, 60, 95, 80]
    });
    chart.data(formatData(data));
    chart.scale({
      index: {
        nice: true,
      },
      h: {
        min: 0,
        max: 360,
      },
      s: {
        min: 0,
        max: 100,
      },
      l: {
        min: 0,
        max: 100,
      }
    });
    chart.interaction('active-region');
    chart.point()
      .position('index*h')
      .color('hex', hex => hex)
      .shape('circle')
      .size(20)
      .tooltip({
        fields: ['hex', 'h', 's', 'l'],
        callback: (hex, h, s, l) => {
          return {
            name: hex,
            value: `h: ${h}, s: ${s}, l: ${l}`
          }
        }
      })
    chart.render();
    setChartInstance(chart)
  }, [uuid])

  // reload data
  useEffect(() => {
    if(!chartInstance) {
      return
    }
    chartInstance.changeData(formatData(data))
  }, [data])

  // reload tyoe
  useEffect(() => {
    if(!chartInstance) {
      return
    }
    const chart = chartInstance
    chart.clear();    
    chart.data(formatData(data));
    chart.interaction('active-region');
    chart.point()
      .position('index*' + type)
      .color('hex', hex => hex)
      .shape('circle')
      .size(20)
      .tooltip({
        fields: ['hex', 'h', 's', 'l'],
        callback: (hex, h, s, l) => {
          return {
            name: hex,
            value: `h: ${h}, s: ${s}, l: ${l}`
          }
        }
      })
    chart.render()
  }, [type])
  return (
    <div>
      <div id={uuid}></div>
    </div>
  )
}
export default dynamic(() => Promise.resolve(LineChart), {
  ssr: false,
});
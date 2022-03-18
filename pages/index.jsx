import React, { useState } from 'react'
import Head from 'next/head'
import Config from '@/components/Config'
import { CHART_TYPES } from '@/config/index'
import LineChart from '@/components/LineChart'
import ColorBlock from '@/components/ColorBlock'
export default function Home() {
  const [colors, setColors] = useState([])
  const [chartConfig, setChartConfig] = useState(null)
  const [chartType, setChartType] = useState(CHART_TYPES.HUE)
  return (
    <>
      <Head>
        <title>Color-generator-plus</title>
        <link rel="icon" href="../public/favicon.ico" />
      </Head>
      <div style={{
        display: 'flex',
        minWidth: '1300px',
      }}>
        <div className="side-bar" style={{
          width: '350px',
          borderRight: '1px solid #777'
        }}>
          <Config 
            colorChange={(data) => setColors(data)}
            typeChange={(type) => setChartType(type)} />
        </div>
        <div className="main-view" style={{
          width: 'calc(100% - 350px)',
          padding: '30px',
          boxSizing: 'border-box'
        }}>
          <div className="chart-view" style={{
            width: '100%',
          }}>
            <ColorBlock colors={colors} />
            <LineChart 
            type={chartType}
            data={colors} />
          </div>
        </div>
      </div>
    </>
  )
}

"use client"

import React, { useState, useRef } from 'react'

import { LuckyWheel } from '@lucky-canvas/react'

export function LuckyWheelPage() {
    const [blocks] = useState([
        { padding: '10px', background: '#869cfa', imgs: [{src: "https://bugstack.cn/images/system/blog-03.png"}]}
    ])
    const [prizes] = useState([
        { background: '#e9e8fe', fonts: [{ text: '0' }] },
        { background: '#b8c5f2', fonts: [{ text: '1' }] },
        { background: '#e9e8fe', fonts: [{ text: '2' }] },
        { background: '#b8c5f2', fonts: [{ text: '3' }] },
        { background: '#e9e8fe', fonts: [{ text: '4' }] },
        { background: '#b8c5f2', fonts: [{ text: '5' }] },
    ])
    const [buttons] = useState([
        { radius: '40%', background: '#617df2' },
        { radius: '35%', background: '#afc8ff' },
        {
            radius: '30%', background: '#869cfa',
            pointer: true,
            fonts: [{ text: '开始', top: '-10px' }]
        }
    ])
    const myLucky = useRef()

    return <div>
        <LuckyWheel
            ref={myLucky}
            width="300px"
            height="300px"
            blocks={blocks}
            prizes={prizes}
            buttons={buttons}
            onStart={() => { // 点击抽奖按钮会触发star回调
                myLucky.current.play()
                setTimeout(() => {
                    const index = Math.random() * 6 >> 0
                    myLucky.current.stop(index)
                }, 2500)
            }}
            onEnd={prize => { // 抽奖结束会触发end回调
                alert('恭喜你抽到 ' + prize.fonts[0].text + ' 号奖品')
            }}
        />
    </div>

}
"use client"

import React, {useState, useRef, useEffect, useContext} from 'react'
// @ts-ignore
import {LuckyGrid} from '@lucky-canvas/react'
import {draw, queryRaffleAwardList} from "@/apis";
import {RaffleAwardVO} from "@/types/RaffleAwardVO";

/**
 * 大转盘文档：https://100px.net/docs/grid.html
 * @constructor
 */
// @ts-ignore
export function LuckyGridPage({handleRefresh}) {
    const [prizes, setPrizes] = useState([{}])
    const myLucky = useRef()

    const queryRaffleAwardListHandle = async () => {
        const queryParams = new URLSearchParams(window.location.search);
        const userId = String(queryParams.get('userId'));
        const activityId = Number(queryParams.get('activityId'));
        const result = await queryRaffleAwardList(userId, activityId);
        const {code, info, data}: { code: string; info: string; data: RaffleAwardVO[] } = await result.json();

        if (code != "0000") {
            window.alert("获取抽奖奖品列表失败 code:" + code + " info:" + info)
            return;
        }

        // 创建一个新的奖品数组
        const prizes = [
            {
                x: 0,
                y: 0,
                fonts: [{text: data[0].awardTitle, top: '80%', fontSize: '12px', fontWeight: '800'}],
                imgs: [{src: "/raffle-award-00.png", width: "100px", height: "100px", activeSrc: "/raffle-award.png"}]
            },
            {
                x: 1,
                y: 0,
                fonts: [{text: data[1].awardTitle, top: '80%', fontSize: '12px', fontWeight: '800'}],
                imgs: [{src: "/raffle-award-01.png", width: "100px", height: "100px", activeSrc: "/raffle-award.png"}]
            },
            {
                x: 2,
                y: 0,
                fonts: [{text: data[2].awardTitle, top: '80%', fontSize: '12px', fontWeight: '800'}],
                imgs: [{src: "/raffle-award-02.png", width: "100px", height: "100px", activeSrc: "/raffle-award.png"}]
            },
            {
                x: 2,
                y: 1,
                fonts: [{text: data[3].awardTitle, top: '80%', fontSize: '12px', fontWeight: '800'}],
                imgs: [{src: "/raffle-award-12.png", width: "100px", height: "100px", activeSrc: "/raffle-award.png"}]
            },
            {
                x: 2,
                y: 2,
                fonts: [{
                    text: data[4].isAwardUnlock ? data[4].awardTitle : '再抽奖' + data[4].waitUnLockCount + '次解锁',
                    top: '80%',
                    fontSize: '12px',
                    fontWeight: '800'
                }],
                imgs: [{
                    src: data[4].isAwardUnlock ? "/raffle-award-22.png" : "/raffle-award-22-lock.png",
                    width: "100px",
                    height: "100px",
                    activeSrc: "/raffle-award.png"
                }]
            },
            {
                x: 1,
                y: 2,
                fonts: [{
                    text: data[5].isAwardUnlock ? data[5].awardTitle : '再抽奖' + data[5].waitUnLockCount + '次解锁',
                    top: '80%',
                    fontSize: '12px',
                    fontWeight: '800'
                }],
                imgs: [{
                    src: data[5].isAwardUnlock ? "/raffle-award-21.png" : "/raffle-award-21-lock.png",
                    width: "100px",
                    height: "100px",
                    activeSrc: "/raffle-award.png"
                }]
            },
            {
                x: 0,
                y: 2,
                fonts: [{
                    text: data[6].isAwardUnlock ? data[6].awardTitle : '再抽奖' + data[6].waitUnLockCount + '次解锁',
                    top: '80%',
                    fontSize: '12px',
                    fontWeight: '800'
                }],
                imgs: [{
                    src: data[6].isAwardUnlock ? "/raffle-award-20.png" : "/raffle-award-20-lock.png",
                    width: "100px",
                    height: "100px",
                    activeSrc: "/raffle-award.png"
                }]
            },
            {
                x: 0,
                y: 1,
                fonts: [{text: data[7].awardTitle, top: '80%', fontSize: '12px', fontWeight: '800'}],
                imgs: [{src: "/raffle-award-10.png", width: "100px", height: "100px", activeSrc: "/raffle-award.png"}]
            },
        ]

        // 设置奖品数据
        setPrizes(prizes)

    }

    const randomRaffleHandle = async () => {
        const queryParams = new URLSearchParams(window.location.search);
        const userId = String(queryParams.get('userId'));
        const activityId = Number(queryParams.get('activityId'));

        let result = await draw(userId, activityId);
        const {code, info, data} = await result.json();
        if (code != "0000") {
            window.alert("随机抽奖失败 code:" + code + " info:" + info)
            return;
        }

        handleRefresh()

        // 为了方便测试，mock 的接口直接返回 awardIndex 也就是奖品列表中第几个奖品。
        return data.awardIndex - 1;
    }

    const [buttons] = useState([
        {
            x: 1,
            y: 1,
            background: "#7f95d1",
            shadow: '3',
            imgs: [{src: "/raffle-button.png", width: "100px", height: "100px"}]
        }
    ])

    const [defaultStyle] = useState([{background: "#b8c5f2"}])

    useEffect(() => {
        queryRaffleAwardListHandle().then(r => {
        });
    }, [])

    return <>
        <LuckyGrid
            ref={myLucky}
            width="300px"
            height="300px"
            rows="3"
            cols="3"
            prizes={prizes}
            defaultStyle={defaultStyle}
            buttons={buttons}
            onStart={() => { // 点击抽奖按钮会触发star回调
                // @ts-ignore
                myLucky.current.play()
                setTimeout(() => {
                    // 抽奖接口
                    randomRaffleHandle().then(prizeIndex => {
                            // @ts-ignore
                            myLucky.current.stop(prizeIndex);
                        }
                    );
                }, 2500)
            }}
            onEnd={
                // @ts-ignore
                prize => {
                    // 加载数据
                    queryRaffleAwardListHandle().then(r => {
                    });
                    // 展示奖品
                    alert('恭喜抽中奖品💐【' + prize.fonts[0].text + '】')
                }
            }>

        </LuckyGrid>
    </>

}
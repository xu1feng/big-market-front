import {queryUserActivityAccount} from "@/apis";
import React, {useEffect, useState} from "react";
import {UserActivityAccountVO} from "@/types/UserActivityAccountVO";

// @ts-ignore
export function ActivityAccount({refresh}) {
    const [dayCount, setDayCount] = useState(0)

    const queryUserActivityAccountHandle = async () => {
        const queryParams = new URLSearchParams(window.location.search);
        // 查询账户数据
        const result = await queryUserActivityAccount(String(queryParams.get('userId')), Number(queryParams.get('activityId')));
        const {code, info, data}: { code: string; info: string; data: UserActivityAccountVO } = await result.json();

        if (code != "0000") {
            window.alert("查询活动账户额度，接口调用失败 code:" + code + " info:" + info)
            return;
        }

        // 日可抽奖额度
        setDayCount(data.dayCountSurplus)
    }

    useEffect(() => {
        queryUserActivityAccountHandle().then(r => {
        });
    }, [refresh])

    return (
        <>
            <div
                className="px-6 py-2 mb-8 text-white bg-yellow-500 rounded-full shadow-lg hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
                style={{cursor: "pointer"}}
            >
                今日可抽奖{dayCount}次
            </div>
        </>
    )

}
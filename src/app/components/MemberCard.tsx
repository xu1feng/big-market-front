import {calendarSignRebate, isCalendarSignRebate, queryUserActivityAccount, queryUserCreditAccount} from "@/apis";
import React, {useEffect, useState} from "react";
import {UserActivityAccountVO} from "@/types/UserActivityAccountVO";

// @ts-ignore
export function MemberCard({allRefresh}) {
    const [refresh, setRefresh] = useState(0);

    const [dayCount, setDayCount] = useState(0)
    const [creditAmount, setCreditAmount] = useState(0)
    const [sign, setSign] = useState(false);

    const [userId, setUserId] = useState('');

    const getParams = async () => {
        setUserId(String(new URLSearchParams(window.location.search).get('userId')));
    }

    const handleRefresh = () => {
        setRefresh(refresh + 1)
    };

    // 获取当前日期
    const currentDate = new Date();
    // 格式化日期为 YYYY年MM月DD日
    const formattedDate = currentDate.getFullYear() + '年'
        + ('0' + (currentDate.getMonth() + 1)).slice(-2) + '月'
        + ('0' + currentDate.getDate()).slice(-2) + '日';

    const queryUserActivityAccountHandle = async () => {
        const queryParams = new URLSearchParams(window.location.search);
        const result = await queryUserActivityAccount(String(queryParams.get('userId')), Number(queryParams.get('activityId')));
        // 查询账户数据
        const {code, info, data}: { code: string; info: string; data: UserActivityAccountVO } = await result.json();

        if (code != "0000") {
            window.alert("查询活动账户额度，接口调用失败 code:" + code + " info:" + info)
            return;
        }

        // 日可抽奖额度
        setDayCount(data.dayCountSurplus)
    }

    const queryUserCreditAccountHandle = async () => {
        const queryParams = new URLSearchParams(window.location.search);
        const result = await queryUserCreditAccount(String(queryParams.get('userId')));
        const {code, info, data}: { code: string; info: string; data: number } = await result.json();

        if (code != "0000") {
            window.alert("查询活动账户额度，接口调用失败 code:" + code + " info:" + info)
            return;
        }

        // 用户积分
        setCreditAmount(data)
    }

    const calendarSignRebateHandle = async () => {
        if (sign) {
            window.alert("今日已签到！")
            return;
        }
        const queryParams = new URLSearchParams(window.location.search);
        const result = await calendarSignRebate(String(queryParams.get('userId')));
        const {code, info}: { code: string; info: string; } = await result.json();

        if (code != "0000" && code != "0003") {
            window.alert("日历签到返利接口，接口调用失败 code:" + code + " info:" + info)
            return;
        }

        setSign(true);

        // 设置一个3秒后执行的定时器
        const timer = setTimeout(() => {
            handleRefresh()
        }, 550);

        // 清除定时器，以防组件在执行前被卸载
        return () => clearTimeout(timer);
    }

    const isCalendarSignRebateHandle = async () => {

        const queryParams = new URLSearchParams(window.location.search);
        const result = await isCalendarSignRebate(String(queryParams.get('userId')));
        const {code, info, data}: { code: string; info: string; data: boolean } = await result.json();

        if (code != "0000") {
            window.alert("判断是否签到接口，接口调用失败 code:" + code + " info:" + info)
            return;
        }

        setSign(data);
    }


    useEffect(() => {
        getParams().then(r => {
        });

        queryUserActivityAccountHandle().then(r => {
        });

        queryUserCreditAccountHandle().then(r => {
        });

        isCalendarSignRebateHandle().then(r => {
        });
    }, [refresh, allRefresh])

    return (
        <>
            <div
                className="relative max-w-sm mx-auto bg-gradient-to-r from-blue-600 to-teal-600 rounded-xl shadow-xl overflow-hidden md:max-w-2xl mb-10">
                <div className="md:flex">
                    <div className="p-8 flex-1">
                        <a href="#"
                           className="block mt-1 text-2xl leading-tight font-semibold text-white hover:text-gray-300 transition duration-300 ease-in-out">营销平台会员卡</a>
                        <div className="mt-4">
                            <p className="text-lg text-gray-100 flex items-center">
                                <span className="material-icons mr-2">💰</span>
                                我的积分：
                                <span
                                    className="font-bold text-gray-100 ml-1 bg-white bg-opacity-20 rounded-full px-2 py-1">
                        {creditAmount ? creditAmount : 0}￥
                    </span>
                            </p>
                            <p className="text-lg text-gray-100 flex items-center mt-2">
                                <span className="material-icons mr-2">🪅</span>
                                抽奖次数：
                                <span
                                    className="font-bold text-gray-100 ml-1 bg-white bg-opacity-20 rounded-full px-2 py-1">
                        {dayCount ? dayCount : 0}
                    </span>
                            </p>
                        </div>
                    </div>
                    <div className="p-8 flex items-center justify-between">
                        <button onClick={calendarSignRebateHandle} style={{cursor: "pointer"}}
                                className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded-full shadow-md transition duration-300 ease-in-out">
                            {sign ? "已签" : "签到"}
                        </button>
                        <div className="text-gray-100 text-md font-semibold ml-4">
                            {formattedDate}
                        </div>
                    </div>
                </div>
                <button onClick={handleRefresh} style={{cursor: "pointer"}}
                        className="absolute bottom-4 right-4 bg-white hover:bg-gray-200 text-black font-bold py-2 px-4 rounded-full shadow-md transition duration-300 ease-in-out">
                    刷新⌛️
                </button>
                <div
                    className="absolute top-4 right-4 bg-white bg-opacity-20 text-white font-bold py-1 px-3 rounded-full shadow-md">
                    id: {userId}
                </div>
            </div>

        </>
    )

}
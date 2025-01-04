"use client";

import {LuckyWheelPage} from "@/app/pages/lucky/lucky-wheel-page";
import {LuckyGridPage} from "@/app/pages/lucky/lucky-grid-page";
import dynamic from "next/dynamic";

const StrategyArmoryButton = dynamic(async () => (await import("./components/StrategyArmory")).StrategyArmory)

export default function Home() {

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100"
             style={{backgroundImage: "url('/background.svg')", backgroundColor:"#e7305e;"}}>
            {/* 头部文案 */}
            <header className="text-7xl font-bold text-center text-gray-800 my-8" style={{color:"white"}}>
                大营销平台 - 抽奖展示
            </header>

            {/* 装配抽奖 */}
            <StrategyArmoryButton/>

            {/* 中间的两个div元素 */}
            <div className="flex flex-col md:flex-row gap-4 mb-8">
                <div className="w-full md:w-1/2 p-6 bg-white shadow-lg rounded-lg">
                    <div className="text-gray-700">
                        <LuckyWheelPage/>
                    </div>
                </div>
                <div className="w-full md:w-1/2 p-6 bg-white shadow-lg rounded-lg">
                    <div className="text-gray-700">
                        <LuckyGridPage/>
                    </div>
                </div>
            </div>

            {/* 底部文案 */}
            <footer className="text-gray-600 text-center my-8" style={{color:"white"}}>
                努力成为架构师 - 沉淀版
            </footer>
        </div>
    );
}

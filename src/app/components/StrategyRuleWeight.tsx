import {queryRaffleStrategyRuleWeight} from "@/apis";
import {useEffect, useState} from "react";
import {StrategyRuleWeightVO} from "@/types/StrategyRuleWeightVO";

// @ts-ignore
export function StrategyRuleWeight({refresh}) {

    const [strategyRuleWeightVOList, setStrategyRuleWeightVOList] = useState<StrategyRuleWeightVO[]>([]);

    const queryRaffleStrategyRuleWeightHandle = async () => {
        const queryParams = new URLSearchParams(window.location.search);
        const result = await queryRaffleStrategyRuleWeight(String(queryParams.get('userId')), Number(queryParams.get('activityId')));
        const {code, info, data}: { code: string; info: string; data: StrategyRuleWeightVO[] } = await result.json();

        if (code != "0000") {
            window.alert("查询活动账户额度，接口调用失败 code:" + code + " info:" + info)
            return;
        }

        setStrategyRuleWeightVOList(data)
    }

    // 这是你的进度条组件
    // @ts-ignore
    const ProgressBar = ({index, total, completed, awards}) => {
        // 计算完成的百分比
        const percentage = (completed / total) * 100;

        // @ts-ignore
        return (
            <div className="w-full" style={{width: '250px'}}> {/* 设置外部容器宽度为800px */}
                <div className="flex items-center"> {/* 使用flex布局对齐文本和进度条 */}
                    <div className="mr-2"> {/* 添加右边距以分隔文本和进度条 */}
                        <span className="text-xs font-bold text-white">抽奖阶梯{index + 1}</span> {/* 文本样式 */}
                    </div>
                    <div
                        className="bg-gray-200 rounded-full h-4 relative overflow-hidden flex-grow"> {/* 使用relative使得子元素可以绝对定位，添加overflow-hidden以确保圆角 */}
                        <div
                            className="bg-gradient-to-r from-blue-600 to-blue-400 h-4 rounded-full" // 设置内部进度条为向右的渐变色
                            style={{width: `${percentage}%`}} // 设置内部进度条宽度为60%
                        ></div>
                        <div
                            className="absolute right-0 top-0 h-4 flex items-center justify-end pr-1" // 使用absolute定位文本到最右侧，并使用justify-end使文本靠右对齐
                            style={{width: `${100}%`}} // 确保文本容器覆盖整个进度条宽度
                        >
                            <span
                                className="text-xs font-bold text-black">{completed > total ? total : completed}/{total}</span> {/* 文本样式为黑色加粗 */}
                        </div>
                    </div>
                </div>
                {
                    awards && <div className="mt-2">
                        <div className="text-xs text-black">必中奖品范围</div>
                        {// @ts-ignore

                            awards.map((award, idx) => (

                                <div key={award.awardId} className="text-xs text-white">
                                    {idx + 1}. {award.awardTitle}
                                </div>
                            ))}
                    </div>
                }

            </div>
        );
    };

    useEffect(() => {
        queryRaffleStrategyRuleWeightHandle().then(r => {
        });
    }, [refresh])

    return (
        <>
            {strategyRuleWeightVOList.map((ruleWeight, index) => (
                <div key={index}>
                    <ProgressBar index={index} total={ruleWeight.ruleWeightCount}
                                 completed={ruleWeight.userActivityAccountTotalUseCount}
                                 awards={ruleWeight.strategyAwards}/>
                </div>
            ))}
        </>
    )

}
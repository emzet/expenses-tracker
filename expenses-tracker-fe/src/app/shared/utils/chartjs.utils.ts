import type { TooltipItem } from 'chart.js';



export const percentageTooltipLabel = ({ dataIndex, dataset: { data } }: TooltipItem<'pie'>) =>
  ((data[dataIndex] / data.reduce((total: number, current: number) => total + current, 0)) * 100).toFixed(2).concat(' %');

# Deck.gl 学习笔记
> 今天我的中期答辩结束了，总结一下这几天写 Deck.gl 踩的坑。

## 为什么选择 Deck.gl？
在中期之前我先是尝试了 Leaflet.js 用于地图数据可视化，但是 Leaflet 存在以下问题：
- 独立的状态管理与生命周期：不会随着 React 的 rerender 而更新
- 为了添加对象，只能用 useRef 的 hack 方式，也不方便控制每个 Layer 对象

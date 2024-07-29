# TIS helper

> 截至2024-2-19,本脚本可用



## 安装

请使用 Tampermonkey 脚本管理器，建议从 [官网](https://www.tampermonkey.net/) 安装。安装完成后，[点击此处安装脚本](https://raw.githubusercontent.com/vollate/SUSTech-tis-cheater/main/tis-cheater.user.js)。

## 用法

手动选择你要抢的课（点选课即可，已自动激活原来被禁用的按钮）来添加到待抢名单。显示选课失败是正常的，点一下就行。
本脚本只在 `tis.sustech.edu.cn` 上工作，如需抢课，请在 tis 页面上进行操作。
## 功能介绍
- Start: 开始抢课，结束前请不要关闭当前标签或切换到别的标签，保持浏览器标签处于激活状态。否则脚本可能被浏览器暂停执行。
- Stop: 停止抢课
- Show selected：显示已选列表
- Clear all courses: 清空已选列表
- Set interval: 设置抢课间隔，单位为毫秒，默认为 200ms

![exmaple](img/example.png)

## 免责声明

- 本脚本（以下简称“脚本”）仅供学习和研究目的，不得用于任何商业或非法活动。使用本脚本进行抢课等活动完全基于用户个人决定，与脚本作者无关。
- 用户在使用本脚本时应确保其行为符合当地法律法规及所在学校的规章制度。脚本作者不对用户使用脚本而可能违反的法律法规或校规负责。
- 使用本脚本可能带来的任何风险（包括但不限于帐号封禁、学校纪律处分等后果）由用户自行承担。脚本作者不承担因使用脚本而产生的任何直接或间接后果的责任。
- 脚本作者不对脚本的持续运作、更新、效果或任何相关服务提供任何形式的保证。脚本的效能可能受到众多因素的影响，包括但不限于网络环境、系统兼容性等。
- 对于本免责声明的解释或适用，脚本作者保留最终解释权。

## TODO

- [x] 显示添加到抢课列表中的课程名
- [ ] 删除单个课程
- [x] 显示抢课成功消息 ~~console.log 也是显示~~


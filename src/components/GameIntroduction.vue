<script setup lang="ts">
import { chessName, Dragon, Chicken, Elephant, Leopard } from '@/chess'
</script>

<template>
  <details>
    <summary>游戏介绍</summary>

    <p>游戏名为“十二金鸡”，是以前小时候玩过的游戏。写个小程序来回味一下。</p>
    <br />

    <p>
      1. 吃子规则：
      <template v-for="id in 11" :key="id">
        {{ chessName.get(id) }} {{ id < 11 ? ' > ' : '' }} </template
      >。
      <br />
      另外, {{ chessName.get(Dragon) }}可以吃除{{ chessName.get(Chicken) }}以外的所有子， 有且仅有{{
        chessName.get(Chicken)
      }}能吃{{ chessName.get(Dragon) }}。相同棋子互吃会同归于尽。<span style="font-weight: 600"
        >注意，本棋允许自残。</span
      >
    </p>

    <p>
      2.
      棋盘划分：棋盘共7行、4列。正中间一行为河界，河界靠边两列为“岸”，中间两列为“河”。河界将棋盘划分为两篇“陆地”区域。
    </p>

    <p>3. 堵岸：当“岸”上是同一个玩家的棋子时，我们称该玩家“堵岸”了。</p>

    <p>4. 移动规则：</p>
    <p>
      4.1.
      {{
        chessName.get(Chicken)
      }}可以到处飞行，但是当对方“堵岸”时，不允许从所在陆地区域飞往另一陆地区域。
    </p>
    <p>4.2. {{ chessName.get(Dragon) }}、{{ chessName.get(Elephant) }}可以从挨着河的陆地下河。</p>
    <p>4.3. 河中的棋子在对方“堵岸”时不能从河里上到陆地。</p>
    <p>4.4. 从河里上陆地，可以选择任意一格紧挨着河的陆地。</p>
    <p>
      4.5. 当任何一方“堵岸”时，{{
        chessName.get(Leopard)
      }}可以下河炸掉沿河区域（棋盘正中间3行棋子全部死亡）。
    </p>
    <p>4.6. 当对方“堵岸”时，不能攻击对方“岸上”的棋子。</p>
    <p>4.7. 任何时候，河里的棋子都受保护。</p>
    <p>4.8. {{ chessName.get(Dragon) }}上岸会干涸而死。</p>
    <p>4.9. 未特殊说明的情况都只能横向或纵向走一格。</p>

    <p>5. 胜利目标：吃完对方的棋子。</p>

    <p>6. 开局时先手者翻到的棋子色则为己方颜色。</p>

    <br />

    <p>
      另外，说一下操作习惯的问题，由于允许自残的情况存在，所以当选择棋子后，如果再次点击另外一个较弱的己方棋子时，会触发自残；选择较强的棋子时会自动切换选择到较强棋子。
    </p>

    <br />

    <p>目前暂时为给游戏编写AI，所以需要两个人对弈。</p>
  </details>
  <details>
    <summary>相关链接</summary>
    <p><a href="https://github.com/SalHe/animals12" target="_blank">源码</a></p>
    <p><a href="https://salhe.github.io/" target="_blank">作者主页</a></p>
    <p><a href="https://github.com/SalHe/animals12/issues/new" target="_blank">建议&反馈</a></p>
  </details>
</template>

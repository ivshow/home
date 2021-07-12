<template>
  <div>
    <div class="title">今天吃啥？</div>
    <LuckyGrid
      class="lucky-grid"
      ref="LuckDraw"
      width="300px"
      height="300px"
      :prizes="prizes"
      :buttons="buttons"
      :blocks="blocks"
      :default-config="defaultConfig"
      :default-style="defaultStyle"
      :active-style="activeStyle"
      @start="startCallBack"
      @end="endCallBack"
    />
  </div>
</template>

<script>
import { Dialog } from 'vant';

export default {
  data() {
    return {
      luckyNum: 0,
      prizes: [],
      blocks: [
        { padding: '15px', background: '#ffc27a', borderRadius: 28 },
        { padding: '4px', background: '#ff4a4c', borderRadius: 23 },
        { padding: '4px', background: '#ff625b', borderRadius: 20 }
      ],
      defaultConfig: {
        gutter: 5
      },
      defaultStyle: {
        borderRadius: 15,
        fontColor: '#DF424B',
        fontSize: '14px',
        textAlign: 'center',
        background: '#fff',
        shadow: '0 5 1 #ebf1f4'
      },
      activeStyle: {
        background: 'linear-gradient(270deg, #FFDCB8, #FDC689)',
        shadow: ''
      }
    };
  },
  computed: {
    buttons() {
      return [
        {
          x: 1,
          y: 1,
          background: 'linear-gradient(270deg, #FFDCB8, #FDC689)',
          shadow: '0 5 1 #e89b4f',
          fonts: [{ text: '吃', fontColor: '#fff', top: '30%', fontSize: '26px' }]
          // imgs: [
          //   { src: require('./img/button.png'), width: '65%', top: '13%' },
          //   { src: require('./img/btn.png'), width: '50%', top: '73%' }
          // ]
        }
      ];
    }
  },
  mounted() {
    this.getPrizeList();
  },
  methods: {
    getPrizeList() {
      // 模拟接口请求奖品列表
      setTimeout(() => {
        const data = [
          { name: '炒拉条/油泼面' },
          { name: '砂锅米线' },
          { name: '凉皮肉夹馍' },
          { name: '菜夹馍' },
          { name: '盖浇饭' },
          { name: '快餐' },
          { name: '香锅/冒菜' },
          { name: '麻食' }
        ];
        const prizes = [];
        this.luckyNum = 1;
        let axis = [
          [0, 0],
          [1, 0],
          [2, 0],
          [2, 1],
          [2, 2],
          [1, 2],
          [0, 2],
          [0, 1]
        ];
        for (let i = 0; i < 8; i++) {
          let item = data[i];
          prizes.push({
            index: i,
            x: axis[i][0],
            y: axis[i][1],
            fonts: [{ text: item.name, top: '40%' }]
            // imgs: [{ src: item.img, width: '55%', top: '8%' }]
          });
        }
        this.prizes = prizes;
      }, 0);
    },
    startCallBack() {
      // if (!this.luckyNum) return alert('还剩0次抽奖机会');
      this.$refs.LuckDraw.play();
      setTimeout(() => {
        this.$refs.LuckDraw.stop((Math.random() * 7) >> 0);
      }, 2000);
    },
    endCallBack(prize) {
      Dialog({ message: `我想吃: ${prize.fonts[0].text}` });
      this.luckyNum--;
    }
  }
};
</script>

<style lang="less">
.title {
  text-align: center;
  font-size: 20px;
  margin: 50px;
}
.lucky-grid {
  margin: 0 auto;
}
</style>

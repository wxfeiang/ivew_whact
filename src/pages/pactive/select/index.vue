import { $Toast } from '@/utils/iview';
<template>
  <div class="iselect">
    <div :class="[items.isSelected ? 'sitem' : 'item']" v-for="(items, index) in deviceList " :key="items.id" @click="chooseItem(index)">
      <div class="iup">
        <div class="iupleft">
          <img class="ilimg" :src="items.imgUrl" alt="">
        </div>
        <div class="iupcenter">
          <div class="iupcup"><span class="iuptitle">{{items.name}}</span></div>
        </div>
        <div class="iupright">
          <i
            :class="items.isSelected ? 'icon iconfont icon-check-circle-fill dsimg' : 'icon iconfont icon-yuanquan dimg' "
          ></i>
        </div>
      </div>
    </div>
    <div class="isplice"></div>
    <div class="cbutton">
      <div class="rbutton">
        <button class="bbutton"  @click="confirm()">确认</button>
      </div>
    </div>
  </div>
</template>

<script>
const device = {
  'genvict': '../genvict/main',
  'wanji': '../wanji/main',
  'juli': '../juli/main'
}
export default {
  data() {
    return {
      deviceList: [
        {
          id: 1001,
          name: '金溢设备',
          type: 'genvict',
          isSelected: true,
          imgUrl: '/static/images/genvict.png'
        },
        {
          id: 1002,
          name: '万集设备',
          type: 'wanji',
          isSelected: false,
          imgUrl: '/static/images/wanji.png'
        },
        {
          id: 1003,
          name: '聚利设备',
          type: 'juli',
          isSelected: false,
          imgUrl: '/static/images/juli.png'
        }
      ]
    }
  },
  methods: {
    chooseItem(index) {
      this.deviceList.forEach(item => {
        item.isSelected = false
      })
      this.deviceList[index].isSelected = !this.deviceList[index].isSelected
    },
    confirm() {
      let tSelect = this.deviceList.filter(item => item.isSelected)
      console.log('跳转设备激活: ' + JSON.stringify(tSelect[0].type))
      wx.navigateTo({
        url: `${device[tSelect[0].type]}`
      })
    }
  }
}
</script>
<style scoped lang='stylus'>
.iselect
  width 100%
  background-color bg-color
  display flex
  flex-flow column nowrap
  justify-content flex-start
  align-items center
.sitem
  width 95%
  flex 1
  display flex
  flex-flow column nowrap
  justify-content flex-start
  align-items center
  background-color white-color
  border-radius 5px
  border 1px main-color solid
  margin-top 20px
.item
  width 95%
  flex 1
  display flex
  flex-flow column nowrap
  justify-content flex-start
  align-items center
  background-color white-color
  border-radius 5px
  border 1px white-color solid
  margin-top 20px
.iup
  width 95%
  height 100px
  display flex
  flex-flow row nowrap
  justify-content space-around
  align-items center
.iupleft
  width 40%
  height 100%
  display flex
  flex-flow row nowrap
  justify-content center
  align-items center
  .ilimg
    width 90%
    height 60%
.iupcenter
  width 40%
  height 100%
  display flex
  flex-flow column nowrap
  justify-content space-around
  align-items center
.iupcup
  width 100%
  height 40%
  display flex
  flex-flow row nowrap
  justify-content flex-start
  align-items center
.iuptitle
  width 100%
  height 100%
  font-size 18px
  color main-font
.idowntitle
  width 60%
  height 50%
  font-size 12px
  color main-color
  background-color #D2F6FF
  border-radius 10px
  display flex
  flex-flow row nowrap
  justify-content center
  align-items center
.iupright
  width 10%
  height 100%
  display flex
  flex-flow row nowrap
  justify-content center
  align-items center
  .dsimg
    line-height 100%
    font-size 30px
    color main-color
  .dimg
    line-height 100%
    font-size 30px
    color sub-font
.cbutton
  width 100%
  height 90px
  background-color white-color
  position fixed
  bottom 0
  display flex
  flex-flow column nowrap
  justify-content center
  align-items center
.rbutton
  width 90%
  height 42px
  display flex
  flex-flow column nowrap
  justify-content center
  align-items center
.bbutton
  width 100%
  height 100%
  display flex
  flex-flow row nowrap
  justify-content center
  align-items center
  background-color main-color
  font-size 15px
  color white-color
  border-radius 40px
</style>

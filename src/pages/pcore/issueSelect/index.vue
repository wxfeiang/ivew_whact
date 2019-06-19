import { $Toast } from '@/utils/iview';
<template>
  <div class="iselect">
    <div class="item" v-for="(items, index) in bankList " :key="items.id">
      <div class="iup">
        <div class="iupleft">
          <img class="ilimg" src="/static/images/sfz.jpg" alt="">
        </div>
        <div class="iupcenter">
          <div class="iupcup"><span class="iuptitle">{{items.title}}</span></div>
          <div class="iupcdown"><span class="idowntitle">{{items.stitle}}</span></div>
        </div>
        <div class="iupright" @click="chooseItem(index)">
          <i
            :class="items.isSelected ? 'icon iconfont icon-check-circle-fill dsimg' : 'icon iconfont icon-yuanquan dimg' "
          ></i>
        </div>
      </div>
      <div class="icenter" @click="showDetail(index)">
        <div class="ictitle">{{items.tail}}</div>
        <i
            :class="items.isCollapse ? 'icon iconfont icon-caret-up dimg' : 'icon iconfont icon-caret-down dimg' "
          ></i>
      </div>
      <div class="idown" v-if="items.isCollapse">
        <div class="idcontent" v-for="(item, jndex) in items.detail " :key="item.id">
          <div class="idcitem">
            <i class="icon iconfont icon-yk_yuanquan_fill dimg"></i>
            <span class="idctitle">{{item.content}}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="isplice"></div>
    <div class="cbutton">
      <div class="rbutton">
        <button class="bbutton"  @click="confirm()">确认办理</button>
      </div>
    </div>
    <i-toast id="toast"/>
  </div>
</template>

<script>
import { $Toast } from '@/utils/iview'
export default {
  data() {
    return {
      bankList: [
        {
          id: 1001,
          isCollapse: false,
          name: '兰州银行',
          title: '办兰州银行信用卡',
          stitle: '5-7天拿到设备',
          tail: '可选腾讯视频会员或海陆空意外险',
          isSelected: false,
          detail: [
            {
              id: 10011,
              content: '收代理费是来得及发落实到解放军速度快放假看'
            },
            {
              id: 10012,
              content: '收代理费是来得及发落实到解放军速度快放假看'
            },
            {
              id: 10013,
              content: '收代理费是来得及发落实到解放军速度快放假看'
            }
          ]
        },
        {
          id: 1002,
          isCollapse: false,
          name: '工商银行',
          title: '办工商银行信用卡',
          stitle: '5-7天拿到设备',
          tail: '可选腾讯视频会员或海陆空意外险',
          isSelected: false,
          detail: [
            {
              id: 10011,
              content: '收代理费是来得及发落实到解放军速度快放假看'
            },
            {
              id: 10012,
              content: '收代理费是来得及发落实到解放军速度快放假看'
            },
            {
              id: 10013,
              content: '收代理费是来得及发落实到解放军速度快放假看'
            }
          ]
        },
        {
          id: 1002,
          isCollapse: false,
          name: '微信车主会员',
          title: '开通车主会员',
          stitle: '0-3天拿到设备',
          tail: '永不过期，只需￥99',
          isSelected: true,
          detail: [
            {
              id: 10011,
              content: '收代理费是来得及发落实到解放军速度快放假看'
            },
            {
              id: 10012,
              content: '收代理费是来得及发落实到解放军速度快放假看'
            },
            {
              id: 10013,
              content: '收代理费是来得及发落实到解放军速度快放假看'
            }
          ]
        }
      ]
    }
  },
  methods: {
    showDetail(index) {
      this.bankList[index].isCollapse = !this.bankList[index].isCollapse
    },
    chooseItem(index) {
      this.bankList.forEach(item => {
        item.isSelected = false
      })
      this.bankList[index].isSelected = !this.bankList[index].isSelected
    },
    confirm() {
      let cSelect = this.bankList.filter(item => item.isSelected)
      if (cSelect && cSelect.length > 0) {
        console.log('cSelect: ' + cSelect[0].name)
        wx.navigateTo({
          url: `../issueStep/main?bankName=${cSelect[0].name}`
        })
      } else {
        $Toast({
          type: 'warning',
          duration: 4,
          content: '请选择办理方式!'
        })
        return false
      }
    }
  },
  mounted () {
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
  .item
    width 95%
    flex 1
    display flex
    flex-flow column nowrap
    justify-content flex-start
    align-items center
    background-color white-color
    border-radius 5px
    margin-top 15px
    .iup
      width 95%
      height 100px
      display flex
      flex-flow row nowrap
      justify-content space-around
      align-items center
      .iupleft
        width 30%
        height 100%
        display flex
        flex-flow row nowrap
        justify-content center
        align-items center
        .ilimg
          width 100%
          height 80%
      .iupcenter
        width 50%
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
          align-items flex-end
          .iuptitle
            width 100%
            height 50%
            font-size 18px
            color main-font
        .iupcdown
          width 100%
          height 40%
          display flex
          flex-flow row nowrap
          justify-content flex-start
          align-items flex-start
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
    .icenter
      width 95%
      height 30px
      display flex
      flex-flow row nowrap
      justify-content flex-start
      align-items center
      margin-bottom 5px
      .ictitle
        font-size 15px
        color main-font
      .dimg
        line-height 100%
        font-size 20px
        color sub-font
    .idown
      width 95%
      flex 1
      display flex
      flex-flow column nowrap
      justify-content flex-start
      align-items center
      border-top 1px bg-color solid
      .idcontent
        width 100%
        flex 1
        display flex
        flex-flow column nowrap
        justify-content flex-start
        align-items center
        .idcitem
          width 100%
          height 100%
          display flex
          flex-flow row nowrap
          justify-content flex-start
          align-items center
          .dimg
            width 5%
            height 30px
            line-height 100%
            color title-font
            font-size 7px
            display flex
            flex-flow row nowrap
            justify-content center
            align-items center
          .idctitle
            width 90%
            height 30px
            color title-font
            font-size 14px
            display flex
            flex-flow row nowrap
            justify-content flex-start
            align-items center
  .isplice
    width 100%
    height 100px
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

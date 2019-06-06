<template>
  <div class="help">
    <div class="card" v-if="hasData">
      <div class="item" v-for="(item, index) in cardList" :key="item.id">
        <div class="title">
          <div class="main">
            <img class="imgs" :src="item.imgUrl" alt>
            <span class="titles">{{item.orgName}}</span>
          </div>
          <div class="ismain" v-if="item.mCard === 1">
            主卡
            <!-- <i class="icon iconfont icon-check-circle-fill icon"></i> -->
          </div>
          <div class="issub" v-else>
            副卡
            <!-- <i class="icon iconfont icon-yuanquan icon"></i> -->
          </div>
        </div>
        <div class="sub">{{item.plate_no}}</div>
        <div class="sub">{{item.etcNo}}</div>
      </div>
    </div>
    <div class="ncontent" v-if="!hasData">
      <div class="iicon">
        <i class="icon iconfont icon-wushuju iimg"></i>
        <span class="iifont">未查询到数据</span>
      </div>
    </div>
    <i-toast id="toast"/>
  </div>
</template>

<script>
import { $Toast } from '@/utils/iview'
import { mapState } from 'vuex'
import { getCardList } from '@/api/my'
export default {
  data() {
    return {
      cardList: [],
      orgMap: {
        '62010102001': '../../../static/images/banks/gs.png',
        '62010102003': '../../../static/images/banks/zg.png',
        '62010102004': '../../../static/images/banks/ny.png',
        '62010102025': '../../../static/images/banks/gsyh.png',
        '62010102026': '../../../static/images/banks/nx.png',
        '62010199999': '../../../static/images/gsgs.png',
        '62010102024': '../../../static/images/banks/lz.png',
        '62010102006': '../../../static/images/banks/yz.png',
        '62010102011': '../../../static/images/banks/hx.png',
        '62010102002': '../../../static/images/banks/js.png'
      },
      hasData: true
    }
  },
  computed: {
    ...mapState(['openid'])
  },
  methods: {
    radioChange(item, index) {
      this.cardList.forEach(element => {
        element.isMain = false
      })
      this.cardList[index].isMain = true
    },
    async queryCardList() {
      let that = this
      wx.showLoading({ title: '加载中', mask: true })
      try {
        let params = {
          openid: this.openid
        }
        let iReturn = await getCardList(params)
        wx.hideLoading()
        if (iReturn.status === 200 && iReturn.data && iReturn.data.length > 0) {
          let tmpList = iReturn.data
          tmpList.forEach(item => {
            item.imgUrl = that.orgMap[item.orgId]
          })
          this.cardList = tmpList
          this.hasData = true
        } else {
          this.hasData = false
        }
      } catch (err) {
        wx.hideLoading()
        $Toast({
          type: 'error',
          duration: 4,
          content: `获取ETC卡异常 ${err}`
        })
      }
    }
  },
  mounted() {
    this.queryCardList()
  }
}
</script>
<style lang="stylus">
.view-button
  width 100% !important
  height 80% !important
  line-height 36px !important
  margin 1px !important
  background #009efb !important
  color #ffffff !important
</style>
<style scoped lang="stylus">
.help
  width 100%
  background-color bg-color
  display flex
  flex-flow column nowrap
  justify-content flex-start
  align-items center
  .card
    width 100%
    flex 1
    display flex
    flex-flow column nowrap
    justify-content space-around
    align-items center
    .item
      width 90%
      height 150px
      display flex
      flex-flow column nowrap
      justify-content flex-start
      align-items center
      background-color #4e81bd
      margin-top 10px
      border-radius 5px
      color #ffffff
      .title
        width 100%
        height 50%
        display flex
        flex-flow row nowrap
        justify-content space-around
        align-items center
        .main
          width 80%
          height 100%
          display flex
          flex-flow row nowrap
          justify-content space-around
          align-items center
          .imgs
            width 13%
            height 65%
            background-color white-color
            border-radius 16px
            display flex
            flex-flow row nowrap
            justify-content center
            align-items center
          .titles
            width 70%
            height 70%
            font-size 18px
            color white-color
            display flex
            flex-flow row nowrap
            justify-content flex-start
            align-items center
        .ismain
          width 15%
          height 30px
          display flex
          flex-flow row nowrap
          justify-content center
          align-items center
          background-color white-color
          border-radius 5px
          color #44bd9c
          .icon
            width 100%
            height 100%
            color #ffffff
            font-size 25px
        .issub
          width 15%
          height 30px
          display flex
          flex-flow row nowrap
          justify-content center
          align-items center
          color #ffc05c
          background-color white-color
          border-radius 5px
          .icon
            width 100%
            height 100%
            color #ffffff
            font-size 25px
      .sub
        width 90%
        height 50%
        display flex
        flex-flow row nowrap
        justify-content center
        align-items center
        font-size 25px
  .ncontent
    width 100%
    height 100vh
    display flex
    flex-flow column nowrap
    justify-content flex-start
    align-items center
    background-color bg-color
    margin-top 50px
    .iicon
      width 100%
      height 300px
      font-size 15px
      color #989898
      display flex
      flex-flow column nowrap
      justify-content center
      align-items center
      .iimg
        width 100%
        height 70%
        line-height 100%
        display flex
        flex-flow row nowrap
        justify-content center
        align-items flex-end
        font-size 100px
      .iifont
        width 100%
        height 20%
        display flex
        flex-flow row nowrap
        justify-content center
        align-items center
</style>

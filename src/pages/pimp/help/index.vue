<template>
  <div class="help">
    <div class="ttabs">
      <div class="weui-navbar">
        <block v-for="(item,index) in tabList" :key="index">
          <div :id="index" :class="{'weui-bar__item_on':activeIndex == index}" class="weui-navbar__item" @click="tabClick">
            <div class="weui-navbar__title">{{item}}</div>
          </div>
        </block>
        <div class="weui-navbar__slider_two" :class="navbarSliderClass"></div>
      </div>
      <div class="weui-tab__panel">
        <div class="weui-tab__content" v-if="activeIndex === '0'">
          <div class="list">
            <div class="items" v-for="(item, index) in helpList" :key="item.id" @click="gotoDetail(item)">
              <div class="item">
                <div class="title">{{item.titles}}</div>
                <div class="pic">
                  <i class="icon iconfont icon-right dimg"></i>
                </div>
              </div>
            </div>
            <div class="loadmore" v-if="loadMore">
              <div class="weui-loadmore">
                <div class="weui-loading"></div>
                <div class="weui-loadmore__tips">正在加载</div>
              </div>
            </div>
          </div>
        </div>
        <div class="weui-tab__content"  v-if="activeIndex === '1'">
          <div class="fback">
            <div class="select">
              <picker class="picker" :value="placeIndex" :range="placeData" :range-key="'name'" @change="placeChange">
                <div class="show">
                  <div class="title" v-if="placeSelect === ''">
                    <span class="title">选择反馈类型</span>
                    <i class="icon iconfont icon-caret-down img"></i>
                  </div>
                  <div class="" v-else>{{ placeData[placeIndex].name }}</div>
                </div>
              </picker>
            </div>
            <div class="content">
              <textarea  class="textarea" maxlength="-1" v-model="userContent" bindblur="bindTextAreaBlur" placeholder="请在此留下您宝贵的意见，帮助我们不断改进和成长，谢谢!" />
            </div>
            <div class="number">
              <input  class="input" placeholder="请输入手机号码便于我们联系您!" maxlength="11" type="number" v-model="contactPhone"/>
            </div>
            <div class="button">
              <button class="open"  @click="handleNext">提交</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {helpSave} from '@/api/my'
import {newsInfo} from '@/api/newss'
export default {
  data () {
    return {
      activeIndex: '0',
      loadMore: false,
      tabList: ['常见问题', '意见反馈'],
      helpList: [],
      placeData: [
        {
          name: '意见',
          value: 1
        },
        {
          name: '反馈',
          value: 2
        },
        {
          name: '投诉',
          value: 3
        }
      ],
      placeSelect: '',
      placeIndex: 0,
      contactPhone: '',
      userContent: '',
      pagenation: {
        pageNum: 1,
        pageSize: 10
      }
    }
  },
  computed: {
    navbarSliderClass () {
      if (this.activeIndex === '0') {
        return 'weui-navbar__slider_0'
      }
      if (this.activeIndex === '1') {
        return 'weui-navbar__slider_1'
      }
    }
  },
  methods: {
    tabClick (e) {
      this.activeIndex = e.currentTarget.id
    },
    placeChange (e) {
      this.placeIndex = e.mp.detail.value
      this.placeSelect = this.placeData[this.placeIndex].value
    },
    async getHelpList () {
      wx.showLoading({title: '加载中', mask: true})
      try {
        let params = {
          type: '6',
          id: '',
          pageNum: this.pagenation.pageNum,
          pageSize: this.pagenation.pageSize
        }
        let iReturn = await newsInfo(params)
        wx.hideLoading()
        if (iReturn.status === 200 && iReturn.data.list) {
          this.helpList = iReturn.data.list
        }
      } catch (err) {
        wx.hideLoading()
        wx.showToast({title: `${err}`, icon: 'none', duration: 4000})
      }
    },
    async getHelpListForMore () {
      wx.showLoading({title: '加载中', mask: true})
      try {
        let params = {
          type: '6',
          id: '',
          pageNum: this.pagenation.pageNum,
          pageSize: this.pagenation.pageSize
        }
        let iReturn = await newsInfo(params)
        wx.hideLoading()
        if (iReturn.status === 200 && iReturn.data.list) {
          let tmpList = iReturn.data.list
          let tmpNewList = this.helpList
          this.helpList = []
          tmpList.forEach((item, index) => {
            item.id = item.id + index + 10
            tmpNewList.push(item)
          })
          this.helpList = tmpNewList
          this.loadMore = false
        }
      } catch (err) {
        wx.hideLoading()
        wx.showToast({title: `${err}`, icon: 'none', duration: 4000})
      }
    },
    gotoDetail (item) {
      let title = item.titles.replace(/\?/g, '%3F')
      wx.navigateTo({
        url: `../../pcore/articleDetail/main?id=${item.id}&title=${title}&type=${item.newType}`
      })
    },
    handleNext () {
      this.helpSave()
    },
    async helpSave () {
      try {
        if (!this.placeSelect) {
          wx.showToast({title: `请选择反馈类型!`, icon: 'none', duration: 4000})
          return false
        }
        if (!this.userContent) {
          wx.showToast({title: `请填写内容!`, icon: 'none', duration: 4000})
          return false
        }
        if (!this.contactPhone) {
          wx.showToast({title: `请填写联系电话!`, icon: 'none', duration: 4000})
          return false
        }
        if (!(/^1[34578]\d{9}$/.test(this.contactPhone))) {
          wx.showToast({title: `请填写正确的手机号码!`, icon: 'none', duration: 4000})
          return false
        }
        let params = {
          types: this.placeSelect,
          content: this.userContent,
          mobile: this.contactPhone
        }
        wx.showLoading({title: '加载中', mask: true})
        let iReturn = await helpSave(params)
        wx.hideLoading()
        if (iReturn.status === 200) {
          wx.showToast({title: `提交成功,感谢您的反馈!`, icon: 'success', duration: 4000})
          this.userContent = ''
          this.contactPhone = ''
        }
      } catch (err) {
        wx.hideLoading()
        wx.showToast({title: `${err}`, icon: 'none', duration: 4000})
      }
    }
  },
  onReachBottom () {
    this.loadMore = true
    this.getHelpListForMore()
  },
  mounted () {
    this.getHelpList()
  }
}
</script>
<style scoped>
.weui-tab__content {
    width: 100%;
    height: 90%;
    display: flex;
    flex-flow: row nowrap;
    justify-content: center;
    align-items: center;
}
.weui-navbar {
  background-color: #fff;
}
.weui-navbar__slider_0 {
  left: 110rpx;
  transform: translateX(0);
}
.weui-navbar__slider_1 {
  left: 220rpx;
  transform: translateX(250rpx);
}
</style>
<style scoped lang="stylus">
.help
  width 100%
  display flex
  flex-flow column nowrap
  justify-content flex-start
  align-items center
  .ttabs
    width 100%
    height 10%
    font-size 15px
    color title-font
  .list
    width 100%
    margin-top 5px
    flex 1
    display flex
    flex-flow column nowrap
    justify-content flex-start
    align-items center
    .items
      width 100%
      height 55px
      display flex
      flex-flow column nowrap
      justify-content flex-start
      align-items center
      .item
        width 100%
        height 90%
        display flex
        flex-flow row nowrap
        justify-content space-around
        align-items center
        background-color white-color
        border-bottom 1px bg-color solid
        .title
          width 80%
          height 100%
          display flex
          flex-flow row nowrap
          justify-content flex-start
          align-items center
          font-size 15px
          color main-font
        .pic
          width 10%
          height 100%
          display flex
          flex-flow row nowrap
          justify-content center
          align-items center
          .dimg
            color title-font
    .loadmore
      width 100%
      height 50px
  .fback
    width 90%
    height 400px
    margin-top 20px
    display flex
    flex-flow column nowrap
    justify-content space-around
    align-items center
    .select
      width 100%
      height 12%
      border-radius 5px
      display flex
      flex-flow row nowrap
      justify-content space-around
      align-items center
      .picker
        width 100%
        height 60%
        border 1px main-color solid
        border-radius 5px
        color main-color
        font-size 15px
        display flex
        flex-flow row nowrap
        justify-content center
        align-items center
        background-color #ffffff
        .show
          width 100%
          height 100%
          display flex
          flex-flow row nowrap
          justify-content center
          align-items center
          .title
            width 100%
            height 100%
            font-size 15px
            display flex
            flex-flow row nowrap
            justify-content space-around
            align-items center
            .title
              width 100%
              height 100%
            .img
              width 10%
              height 100%
              font-size 10px
    .content
      width 100%
      height 50%
      background-color #ffffff
      border-radius 5px
      display flex
      flex-flow row nowrap
      justify-content center
      align-items center
      font-size 15px
      color sub-font
      border-radius 5px
      border 1px #dddddd solid
      .textarea
        width 90%
        height 90%
    .number
      width 100%
      height 11%
      background-color #ffffff
      display flex
      flex-flow row wrap
      justify-content flex-start
      align-items center
      border-radius 5px
      border 1px #dddddd solid
      font-size 15px
      color sub-font
      .input
        width 100%
        height 100%
        padding 10px
    .button
      width 100%
      height 13%
      border-radius 5px
      margin-top 10px
      display flex
      flex-flow row nowrap
      justify-content center
      align-items center
      .open
        width 100%
        height 80%
        display flex
        flex-flow row nowrap
        justify-content center
        align-items center
        background-color main-color
        font-size 15px
        color white-color
</style>

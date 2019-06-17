<template>
  <div class="service">
    <div class="service-icon">
      <image src="/static/images/logo.png" class="img"></image>
      <span class="version">v0.9.2</span>
    </div>
    <div class="service-content">
      <div class="allrow">
        <div class="left">官方网站</div>
        <div class="right">www.gsgaosu.com</div>
      </div>
      <div class="allrow">
        <div class="left">官方邮箱</div>
        <div class="right">kf@gsgaosu.cn</div>
      </div>
      <div class="allrow" @click="makCall">
        <div class="left">客服电话</div>
        <div class="right">18009408933</div>
      </div>
    </div>
    <div class="service-tail">
      <div class="cname">甘肃省高速公路电子不停车收费(ETC)服务中心</div>
      <div class="cenglish">Copyright 2019 gsgaosu. All Rights Reserved</div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      userInfo: {}
    }
  },
  methods: {
    makCall() {
      wx.makePhoneCall({
        phoneNumber: '18009408933'
      })
    }
  },
  mounted() {}
}
</script>
<style lang="stylus">
.view-button
  width 100% !important
  height 80% !important
  line-height 36px !important
  margin 1px !important
  background #22ad38 !important
  color #ffffff !important
</style>
<style scoped lang="stylus">
.service
  width 100%
  height 100%
  background-color #ffffff
  display flex
  flex-flow column nowrap
  justify-content flex-start
  align-items center
  &-icon
    width 100%
    height 40%
    display flex
    flex-flow column nowrap
    justify-content center
    align-items center
    .img
      width 84px
      height 84px
      font-size 100px
      display flex
      flex-flow row nowrap
      justify-content center
      align-items flex-end
    .title
      width 100%
      height 15%
      color #00459a
      font-weight 500
      text-shadow 2px 2px 30px #666
      font-size 15px
      display flex
      flex-flow row nowrap
      justify-content center
      align-items flex-end
    .version
      width 100%
      height 15%
      color sub-font
      font-size 15px
      display flex
      flex-flow row nowrap
      justify-content center
      align-items center
  &-content
    width 100%
    height 40%
    display flex
    flex-flow column nowrap
    justify-content flex-start
    align-items center
    .allrow
      width 90%
      height 20%
      display flex
      flex-flow row nowrap
      justify-content center
      align-items center
      border-bottom 1px bg-color solid
      font-size 15px
      color title-font
      .left
        width 50%
        height 100%
        display flex
        flex-flow row nowrap
        justify-content flex-start
        align-items flex-end
      .right
        width 50%
        height 100%
        display flex
        flex-flow row nowrap
        justify-content flex-end
        align-items flex-end
  &-tail
    width 100%
    height 20%
    display flex
    flex-flow column nowrap
    justify-content center
    align-items center
    color sub-font
    font-size 13px
    .cname
      width 100%
      height 20%
      display flex
      flex-flow column nowrap
      justify-content flex-end
      align-items center
    .cenglish
      width 100%
      height 20%
      display flex
      flex-flow column nowrap
      justify-content flex-start
      align-items center
</style>

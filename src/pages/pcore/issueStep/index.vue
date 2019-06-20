import { $Toast } from '@/utils/iview';
<template>
  <div class="index">
    <div class="toptitle">
      <div class="toptitle-content">
        <div class="toptitleleft">
          <div class="toptitleline"></div>
          <div class="toptitletext">办理流程</div>
        </div>
        <div class="toptitlemore">
          <span class="topmoretext">了解更多</span>
          <i class="icon iconfont icon-question-circle topmoreicon"></i>
        </div>
      </div>
    </div>
    <div class="middlepart">
      <div class="midpartstep">
        <div class="midstepline"></div>
        <i class="icon iconfont icon-biaodan1 midstepicon"></i>
        <div class="midsteptext">
          <div class="steptexttop">选择办理方式</div>
          <div class="steptextbottom">确认办理信用卡的姓名和身份证</div>
        </div>
        <div class="mistepbtn">去选择</div>
      </div>
      <div class="midpartstep">
        <div class="midstepline"></div>
        <i class="icon iconfont icon-biaodan1 midstepicon"></i>
        <div class="midsteptext">
          <div class="steptexttop">填写信用卡资料</div>
          <div class="steptextbottom">通过ETC助手提交平安银行信用卡办理申请</div>
        </div>
        <div class="mistepbtn">去填写</div>
      </div>
      <div class="midpartstep">
        <div class="midstepline"></div>
        <i class="icon iconfont icon-biaodan1 midstepicon"></i>
        <div class="midsteptext">
          <div class="steptexttop">登记信息</div>
          <div class="steptextbottom">确认办理信用卡的姓名和身份证</div>
        </div>
        <div class="mistepbtn">去上传</div>
      </div>
      <div class="midpartstep">
        <i class="icon iconfont icon-yk_yuanquan_fill midstateicon"></i>
        <div class="midsteptext">
          <div class="steptexttop">等待审核</div>
          <div class="steptextbottom">1~3个工作日确认资格，信用卡新用户可在一个月内免费办理ETC</div>
        </div>
        <div class="midstepstate">未完成</div>
      </div>
    </div>
    <div class="ordermsg">
      <div class="ordertitle">
        <span class="ordertitletext">订单信息</span>
      </div>
      <div class="ordercontent">
        <div class="ordername">{{orderData.bankName}}</div>
        <div class="ordernum">
          <span>订单编号</span>
          {{orderData.orderId}}
        </div>
        <div class="ordercancel">取消订单</div>
      </div>
    </div>
    <i-toast id="toast"/>
  </div>
</template>

<script>
import { $Toast } from '@/utils/iview'
import { hasOrder } from '@/api/goods'
export default {
  data() {
    return {
      orderData: {
        bankName: '',
        orderId: ''
      }
    }
  },
  methods: {
    async getApplyId() {
      try {
        let params = {
          userId: this.openid
        }
        let iReturn = await hasOrder(params)
        this.ocrData = this.issueData
        if (iReturn.status === 200 && iReturn.data) {
          this.orderData.orderId = iReturn.data
        } else {
          console.log('初始化订单失败,未返回数据')
          $Toast({
            type: 'error',
            duration: 3,
            content: '初始化订单失败!'
          })
          setTimeout(function() {
            wx.navigateBack({
              delta: 1
            })
          }, 3000)
        }
      } catch (err) {
        console.log('初始化订单异常: ' + JSON.stringify(err))
        $Toast({
          type: 'error',
          duration: 3,
          content: '初始化订单传异常!'
        })
        setTimeout(function() {
          wx.navigateBack({
            delta: 1
          })
        }, 3000)
      }
    }
  },
  mounted() {
    this.orderData.bankName = this.$root.$mp.query.bankName
    this.getApplyId()
  }
}
</script>
<style scoped lang='stylus'>
.index
  background-color white-color
  width 100%
  height 100%
  display flex
  flex-flow column nowrap
  justify-content flex-start
  align-items center
  position relative
.toptitle
  width 100%
  height 50px
  display flex
  flex-flow row nowrap
  justify-content center
  align-items center
  &-content
    width 88%
    height 100%
    display flex
    flex-flow row nowrap
    justify-content space-between
    align-items center
.toptitleleft
  height 100%
  display flex
  flex-flow row nowrap
  justify-content flex-start
  align-items center
.toptitleline
  height 40%
  width 3px
  background-color main-color
  margin-right 10px
.toptitletext
  font-size 15px
.toptitlemore
  height 100%
  display flex
  flex-flow row nowrap
  justify-content flex-start
  align-items center
.topmoretext
  font-size 13px
  color sub-font
.topmoreicon
  font-size 20px
  color main-color
  margin-left 5px
.middlepart
  width 100%
  display flex
  flex-flow column nowrap
  justify-content flex-start
  align-items center
.midpartstep
  width 95%
  height 75px
  display flex
  flex-flow row nowrap
  justify-content space-around
  align-items center
  position relative
.midstepicon
  width 13%
  height 100%
  display flex
  flex-flow row nowrap
  justify-content center
  align-items center
  font-size 30px
  color main-color
  z-index 1
.midstateicon
  width 17%
  height 100%
  display flex
  flex-flow row nowrap
  justify-content center
  align-items center
  font-size 10px
  color sub-font
  margin-right 7px
.midstepline
  width 0.5px
  height 52px
  background-color sub-font
  position absolute
  top 52px
  left 28px
.midsteptext
  width 50%
  height 70%
  display flex
  flex-flow column nowrap
  justify-content space-between
  align-items flex-start
.steptexttop
  width 100%
  height 50%
  display flex
  flex-flow row nowrap
  justify-content flex-start
  align-items center
  font-size 14px
  font-weight 450
.steptextbottom
  width 100%
  height 50%
  display flex
  flex-flow row nowrap
  justify-content flex-start
  align-items flex-start
  font-size 12px
  color title-font
.mistepbtn
  width 25%
  height 30px
  display flex
  flex-flow row nowrap
  justify-content center
  align-items center
  font-size 15px
  color white-color
  border-radius 15px
  background-color main-color
  margin-left 10px
.midstepstate
  width 30%
  height 30px
  display flex
  flex-flow row nowrap
  justify-content center
  align-items center
  font-size 13px
  color sub-font
  margin-left 30px
.ordermsg
  width 100%
  display flex
  flex-flow column nowrap
  justify-content flex-start
  align-items center
  margin-top 30px
.ordertitle
  width 100%
  height 45px
  display flex
  flex-flow row nowrap
  justify-content center
  align-items center
  color sub-font
  font-size 15px
.ordertitletext
  margin-top 5px
.ordercontent
  width 90%
  height 144px
  display flex
  flex-flow column nowrap
  justify-content space-around
  align-items center
  border 1px dashed #999
  margin-bottom 10px
  border-radius 5px
.ordername
  width 90%
  height 30%
  display flex
  flex-flow row nowrap
  justify-content flex-start
  align-items center
  border-bottom 0.5px solid sub-font
  color main-font
  font-size 15px
.ordernum
  width 90%
  height 30%
  display flex
  flex-flow row nowrap
  justify-content flex-start
  align-items center
  font-size 14px
.ordernum span
  color sub-font
  margin-right 10px
.ordercancel
  width 26%
  height 20%
  border 1px solid #999
  border-radius 19.5px
  display flex
  flex-flow row nowrap
  justify-content center
  align-items center
  margin-bottom 8px
  color #999
  font-size 12px
</style>

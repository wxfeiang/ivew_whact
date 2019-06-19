import { $Toast } from '@/utils/iview';
<template>
  <div class="istep">
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
          setTimeout(function () {
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
        setTimeout(function () {
          wx.navigateBack({
            delta: 1
          })
        }, 3000)
      }
    }
  },
  mounted () {
    this.orderData.bankName = this.$root.$mp.query.bankName
    this.getApplyId()
  }
}
</script>
<style scoped lang='stylus'>
.istep
  width 100%
  background-color bg-color
  display flex
  flex-flow column nowrap
  justify-content flex-start
  align-items center
</style>

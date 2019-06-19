import { $Toast } from '@/utils/iview';
<template>
  <div class="issue">
    <div class="picture">
      <img class="ppimg" src="/static/images/etcu.png">
      <div class="pmark"></div>
    </div>
    <div class="ifee">
      <div class="ifitem">
        <div class="ifleft">
          <span class="ifll">现价</span>
          <span class="iflr">￥0</span>
        </div>
        <span class="ifcenter">微信用户专享</span>
        <span class="ifright">办理量：{{goods.count}}笔</span>
      </div>
      <div class="ifnoew">
        <span class="ifnl">原价</span>
        <span class="ifnr">￥{{goods.totalMoney}}</span>
      </div>
      <div class="ifcontent">
        <span class="ifct">快递</span>
        <span class="ifctc">
          <i class="icon iconfont icon-location ifctimg"></i>
          甘肃省内免快递费（EMS）</span>
      </div>
      <span class="iftitle">全国通用 高速ETC办理</span>
    </div>
    <div class="product">
      <div class="actions">
        <div :class="[palink === 0 ? 'palink paaction' : 'palink']" @click="aswitch('product')">产品介绍</div>
        <div :class="[palink === 1 ? 'palink paaction' : 'palink']" @click="aswitch('flow')">办理流程</div>
        <div :class="[palink === 2 ? 'palink paaction' : 'palink']" @click="aswitch('question')">常见问题</div>
      </div>
      <div class="devices">
        <img class="dimg" src="/static/images/etco.png">
      </div>
      <div class="flows">
        <div class="ftitle">
          <span class="ftsplice"></span>
          <span class="ftmark">办理流程</span>
        </div>
        <div class="item">
          <div class="ftitle">
            <span class="fttitle">
              第1步: 在线选购
            </span>
          </div>
          <div class="fcontent">
            点击“立即申办”,进入“证件上传”页面
          </div>
        </div>
        <div class="item">
          <div class="ftitle">
            <span class="fttitle">
              第2步: 提交资料
            </span>
          </div>
          <div class="fcontent">
            通过手机拍照提交审核资料(身份证、行驶证、车头照)。
          </div>
        </div>
        <div class="item">
          <div class="ftitle">
            <span class="fttitle">
              第3步: 审核发货
            </span>
          </div>
          <div class="fcontent">
            “甘肃高速公路局”审核车辆信息,完成蓝牙盒子、标签装箱邮寄。
          </div>
        </div>
        <div class="item">
          <div class="ftitle">
            <span class="fttitle">
              第4步: 安装激活
            </span>
          </div>
          <div class="fcontent">
            上门服务,安装蓝牙盒子并激活标签。
          </div>
        </div>
        <div class="item">
          <div class="ftitle">
            <span class="fttitle">
              第5步: 签收商品
            </span>
          </div>
          <div class="fcontent">
            在“甘肃高速e付”小程序中签收商品完成订单。
          </div>
        </div>
      </div>
      <div class="tips">
        <div class="ttitle">
          <span class="ttsplice"></span>
          <span class="ttmark">温馨提示</span>
        </div>
        <div class="tcontent">
          <span class="tctitle">1、ETC设备属于定制产品无法二次销售。一旦制卡不支持退换货</span>
          <span class="tctitle">2、用户在进入高速通行前，需开通微信车主服务，否则无法完成微信代扣，对正常出行造成影响。</span>
          <span class="tctitle">3、用户进入高速通行后，再未离开高速之前不能关闭微信车主服务，否则将会被计入黑名单。</span>
        </div>
      </div>
      <div class="helps">
        <div class="htitle">
          <span class="htsplice"></span>
          <span class="htmark">常见问题</span>
        </div>
        <div class="item">
          <div class="ftitle">
            <span class="ficon"><i class="icon iconfont icon-question fimg"></i></span>
            <span class="fttitle">
              是否全国通用？可以多车使用一个么？
            </span>
          </div>
          <div class="fcontent">
            <span class="fcicon"><i class="icon iconfont icon-answer fimg"></i></span>
            <span class="fctitle">
              支持全国29省高速通行,本设备一车一卡,专车专用。
            </span>
          </div>
        </div>
        <div class="item">
          <div class="ftitle">
            <span class="ficon"><i class="icon iconfont icon-question fimg"></i></span>
            <span class="fttitle">
              什么是记账卡？
            </span>
          </div>
          <div class="fcontent">
            <span class="fcicon"><i class="icon iconfont icon-answer fimg"></i></span>
            <span class="fctitle">
              记账卡也就是信用卡，先通行后扣费，不需要预存通行费用。
            </span>
          </div>
        </div>
        <div class="item">
          <div class="ftitle">
            <span class="ficon"><i class="icon iconfont icon-question fimg"></i></span>
            <span class="fttitle">
              如何办理？
            </span>
          </div>
          <div class="fcontent">
            <span class="fcicon"><i class="icon iconfont icon-answer fimg"></i></span>
            <span class="fctitle">
              在微信小程序上搜索“甘肃高速e付”并进入，上传个人身份证、驾驶证、车辆行驶证及车头正面照(含车牌)，待设备定制完成后，即可快递到您的手里。
            </span>
          </div>
        </div>
        <div class="item">
          <div class="ftitle">
            <span class="ficon"><i class="icon iconfont icon-question fimg"></i></span>
            <span class="fttitle">
              办理是否收取服务费或其他额外费用？
            </span>
          </div>
          <div class="fcontent">
            <span class="fcicon"><i class="icon iconfont icon-answer fimg"></i></span>
            <span class="fctitle">
              在线办理ETC不用支付邮寄费用，也不会再收取额外费用。
            </span>
          </div>
        </div>
        <div class="item">
          <div class="ftitle">
            <span class="ficon"><i class="icon iconfont icon-question fimg"></i></span>
            <span class="fttitle">
              办理需要多久？
            </span>
          </div>
          <div class="fcontent">
            <span class="fcicon"><i class="icon iconfont icon-answer fimg"></i></span>
            <span class="fctitle">
              申办完成并提交资料后，12小时内完成审核，并定制卡片，48小时内发货，省内用户将在3至5个工作日内收到已经定制完成的卡片及设备。
            </span>
          </div>
        </div>
        <div class="item">
          <div class="ftitle">
            <span class="ficon"><i class="icon iconfont icon-question fimg"></i></span>
            <span class="fttitle">
              如何安装？
            </span>
          </div>
          <div class="fcontent">
            <span class="fcicon"><i class="icon iconfont icon-answer fimg"></i></span>
            <span class="fctitle">
              收到快递设备后，将由专业的业务人员，上门向您进行免费的安装服务，并现场激活，保证您的设备能正常使用。
            </span>
          </div>
        </div>
        <div class="item">
          <div class="ftitle">
            <span class="ficon"><i class="icon iconfont icon-question fimg"></i></span>
            <span class="fttitle">
              已经办理过ETC，如何重新办理？
            </span>
          </div>
          <div class="fcontent">
            <span class="fcicon"><i class="icon iconfont icon-answer fimg"></i></span>
            <span class="fctitle">
              已经办理过ETC的车辆，需要在原渠道注销之前的ETC才能重新申办。
            </span>
          </div>
        </div>
        <div class="mcend"></div>
      </div>
    </div>
    <div class="apply">
      <div class="aservice" @click="makCall">
        <i class="icon iconfont icon-kefu asimg"></i>
        <span class="astitle">客服</span>
      </div>
      <!-- <div class="acard">
        <span class="actitle">卡片类型</span>
        <span class="acmark">记账卡</span>
      </div> -->
      <div class="abutton">
        <button class="bbutton"  @click="toPay()">立即申办</button>
      </div>
    </div>
  </div>
</template>

<script>
import { goodsList } from '@/api/goods'
export default {
  data() {
    return {
      palink: 0,
      goods: {
        deviceImg: [],
        totalMoney: '188',
        deviceMoney: '208',
        deliverMoney: '20',
        count: '3726'
      }
    }
  },
  methods: {
    makCall() {
      wx.makePhoneCall({
        phoneNumber: '18009408933'
      })
    },
    aswitch(whiche) {
      const lActive = {
        'product': 0,
        'flow': 1,
        'question': 2
      }
      const lPosition = {
        'product': 1350,
        'flow': 2650,
        'question': 3700
      }
      this.palink = lActive[whiche]
      let t = lPosition[whiche] / 750 * wx.getSystemInfoSync().windowWidth
      wx.pageScrollTo({
        scrollTop: t,
        duration: 300
      })
    },
    toPay() {
      wx.navigateTo({
        url: `../issueSelect/main`
      })
    },
    async getGoods() {
      wx.showLoading({title: '加载中', mask: true})
      try {
        let gRetrun = await goodsList()
        wx.hideLoading()
        if (gRetrun.status === 200 && gRetrun.data) {
          this.goods.totalMoney = gRetrun.data.total || '188'
          this.goods.count = gRetrun.data.count || '4782'
          // for (let item of gRetrun.data.goodsInfo) {
          //   if (item.gname === '蓝牙盒子套装') {
          //     this.goods.deviceMoney = item.gprice
          //     this.goods.deviceImg.push(item.imgUrl)
          //   }
          //   if (item.gname === '快递费') {
          //     this.goods.deliverMoney = item.gprice
          //   }
          // }
        } else {
          console.log('商品信息未返回数据')
        }
      } catch (err) {
        wx.hideLoading()
        console.log('获取商品信息异常')
      }
    }
  },
  mounted () {
    this.getGoods()
  }
}
</script>
<style scoped lang='stylus'>
.issue
  width 100%
  background-color bg-color
  display flex
  flex-flow column nowrap
  justify-content flex-start
  align-items center
  position relative
  .picture
    width 100%
    height 500px
    .ppimg
      width 100%
      height 100%
  .ifee
    width 100%
    height 155px
    display flex
    flex-flow column nowrap
    justify-content flex-start
    align-items center
    position relative
    margin-top 10px
    background-color white-color
    .ifitem
      width 95%
      height 45px
      display flex
      flex-flow row nowrap
      justify-content flex-start
      align-items center
      position relative
      .ifleft
        width 20%
        height 100%
        display flex
        flex-flow row nowrap
        justify-content flex-start
        align-items center
        .ifll
          width 50%
          height 100%
          display flex
          flex-flow row nowrap
          justify-content flex-start
          align-items center
          font-size 15px
          color main-font
        .iflr
          font-size 15px
          color main-color
      .ifcenter
        width 25%
        height 50%
        display flex
        flex-flow row nowrap
        justify-content center
        align-items center
        font-size 12px
        color white-color
        background-color sub-color
        border-radius 6px
      .ifright
        width 55%
        height 100%
        display flex
        flex-flow row nowrap
        justify-content flex-end
        align-items center
        font-size 13px
        color sub-font
    .ifnoew
      width 95%
      height 35px
      display flex
      flex-flow row nowrap
      justify-content flex-start
      align-items center
      position relative
      .ifnl
        width 10%
        height 50px
        display flex
        flex-flow row nowrap
        justify-content flex-start
        align-items center
        font-size 15px
        color main-font
      .ifnr
        width 90%
        height 50px
        display flex
        flex-flow row nowrap
        justify-content flex-start
        align-items center
        font-size 15px
        color main-font
        text-decoration line-through #FF0000
    .iftitle
      width 95%
      height 35px
      display flex
      flex-flow row nowrap
      justify-content flex-start
      align-items center
      font-size 15px
      color main-font
      font-weight 700
    .ifcontent
      width 95%
      height 35px
      display flex
      flex-flow row nowrap
      justify-content flex-start
      align-items center
      .ifct
        width 10%
        height 100%
        display flex
        flex-flow row nowrap
        justify-content flex-start
        align-items center
        font-size 14px
        color main-font
      .ifctc
        width 90%
        height 100%
        display flex
        flex-flow row nowrap
        justify-content flex-start
        align-items center
        font-size 15px
        color main-font
        .ifctimg
          line-height 100%
          font-size 15px
          color main-color
  .product
    width 100%
    flex 1
    margin-top 10px
    .actions
      width 100%
      height 40px
      border-bottom 1px bg-color solid
      display flex
      flex-flow row nowrap
      justify-content space-around
      align-items center
      background-color white-color
      .palink
        width 20%
        height 100%
        font-size 13px
        color main-font
        display flex
        flex-flow row nowrap
        justify-content center
        align-items center
      .paaction
        border-bottom 3px main-color solid
    .devices
      width 100%
      height 600px
      background-color white-color
      .dimg
        width 100%
        height 100%
        margin-top 10px
    .flows
      width 100%
      height 405px
      margin-top 20px
      background-color white-color
      display flex
      flex-flow column nowrap
      justify-content flex-start
      align-items center
      .ftitle
        width 95%
        height 30px
        display flex
        flex-flow row nowrap
        justify-content space-around
        align-items center
        margin-top 3px
        .ftsplice
          width 1%
          height 60%
          display flex
          flex-flow row nowrap
          justify-content center
          align-items center
          background-color main-color
        .ftmark
          width 96%
          height 100%
          display flex
          flex-flow row nowrap
          justify-content flex-start
          align-items center
          font-size 15px
          color main-font
      .item
        width 100%
        height 70px
        display flex
        flex-flow column wrap
        justify-content space-around
        align-items center
        margin-top 5px
        .ftitle
          width 90%
          height 30%
          display flex
          flex-flow row wrap
          justify-content flex-start
          align-items center
          .fttitle
            width 100%
            height 100%
            display flex
            flex-flow row wrap
            justify-content flex-start
            align-items center
            color main-font
            font-size 15px
        .fcontent
          width 90%
          height 65%
          display flex
          flex-flow row nowrap
          justify-content flex-start
          align-items center
          font-size 13px
          color sub-font
    .tips
      width 100%
      height 200px
      margin-top 10px
      background-color white-color
      display flex
      flex-flow column nowrap
      justify-content flex-start
      align-items center
      .ttitle
        width 95%
        height 30px
        display flex
        flex-flow row nowrap
        justify-content space-around
        align-items center
        margin-top 3px
        .ttsplice
          width 1%
          height 60%
          display flex
          flex-flow row nowrap
          justify-content center
          align-items center
          background-color main-color
        .ttmark
          width 96%
          height 100%
          display flex
          flex-flow row nowrap
          justify-content flex-start
          align-items center
          font-size 15px
          color main-font
      .tcontent
        width 90%
        // height 170px
        flex 1
        display flex
        flex-flow column nowrap
        justify-content flex-start
        align-items center
        .tctitle
          width 100%
          flex 1
          display flex
          flex-flow row nowrap
          justify-content flex-start
          align-items center
          color sub-font
          font-size 13px
    .helps
      width 100%
      flex 1
      margin-top 10px
      background-color white-color
      display flex
      flex-flow column nowrap
      justify-content flex-start
      align-items center
      .htitle
        width 95%
        height 30px
        display flex
        flex-flow row nowrap
        justify-content space-around
        align-items center
        margin-top 3px
        .htsplice
          width 1%
          height 60%
          display flex
          flex-flow row nowrap
          justify-content center
          align-items center
          background-color main-color
        .htmark
          width 96%
          height 100%
          display flex
          flex-flow row nowrap
          justify-content flex-start
          align-items center
          font-size 15px
          color main-font
      .item
        width 90%
        flex 1
        display flex
        flex-flow column wrap
        justify-content flex-start
        align-items center
        margin-top 15px
        background-color #f9f7fa
        border-radius 5px
        .ftitle
          width 100%
          height 35px
          display flex
          flex-flow row wrap
          justify-content flex-start
          align-items center
          .ficon
            width 10%
            height 100%
            display flex
            flex-flow row wrap
            justify-content center
            align-items center
            .fimg
              color #019efd
              font-size 20px
              line-height 100%
          .fttitle
            width 90%
            height 100%
            display flex
            flex-flow row wrap
            justify-content flex-start
            align-items center
            color main-font
            font-size 15px
        .fcontent
          width 100%
          min-height 30px
          flex 1
          display flex
          flex-flow row wrap
          justify-content center
          align-items center
          .fcicon
            width 10%
            height 100%
            display flex
            flex-flow row wrap
            justify-content center
            align-items flex-start
            .fimg
              color #5bd4ab
              font-size 20px
              line-height 100%
          .fctitle
            width 90%
            flex 1
            display flex
            flex-flow row wrap
            justify-content flex-start
            align-items flex-start
            color sub-font
            font-size 13px
            margin-bottom 5px
      .mcend
        width 100%
        height 65px
        display flex
        flex-flow row nowrap
        justify-content center
        align-items center
        background-color white-color
  .apply
    width 100%
    height 60px
    background-color white-color
    position fixed
    bottom 0
    display flex
    flex-flow row nowrap
    justify-content space-around
    align-items center
    border-top 1px bg-color solid
    .aservice
      width 15%
      height 100%
      display flex
      flex-flow column nowrap
      justify-content center
      align-items center
      .asimg
        width 100%
        height 50%
        line-height 100%
        font-size 20px
        color main-color
        display flex
        flex-flow row nowrap
        justify-content center
        align-items flex-end
      .astitle
        width 100%
        height 50%
        display flex
        flex-flow row nowrap
        justify-content center
        align-items center
        font-size 12px
        color sub-font
    .acard
      width 20%
      height 100%
      border-left 1px bg-color solid
      display flex
      flex-flow column nowrap
      justify-content space-around
      align-items center
      .actitle
        width 100%
        height 50%
        font-size 12px
        color sub-font
        display flex
        flex-flow row nowrap
        justify-content center
        align-items flex-end
      .acmark
        width 100%
        height 50%
        font-size 14px
        color main-font
        display flex
        flex-flow row nowrap
        justify-content center
        align-items flex-start
    .abutton
      width 80%
      height 70%
      display flex
      flex-flow column nowrap
      justify-content center
      align-items center
      .bbutton
        width 90%
        height 100%
        display flex
        flex-flow row nowrap
        justify-content center
        align-items center
        background-color main-color
        font-size 15px
        color white-color
        border-radius 20px
</style>

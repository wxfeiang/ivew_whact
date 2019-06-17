<template>
  <div class="bind">
    <div class="bind-title">输入车牌,并开通微信车主服务免密支付</div>

    <div class="bind-main">
      <div class="bind-main-number">
        <div class="bind-main-number-input">
          <div class="bind-main-number-input-section">
            <div class="main-groups">
              <div
                class="main-groups-btna"
                v-bind:class="{isClick: isYue }"
                @click="btnClickYue"
              >{{areaName}}</div>
              <div
                class="main-groups-btnb"
                v-bind:class="{isClick: isA}"
                @click="btnClickA"
              >{{areaLetter}}</div>
              <div class="main-groups-mid"></div>
            </div>
            <div class="sub-groups">
              <div
                class="sub-groups-btna"
                @click="btnClickNum('one')"
                v-bind:class="{isNumClick: isNumOne }"
              >{{numOne}}</div>
              <div
                class="sub-groups-btnb"
                @click="btnClickNum('two')"
                v-bind:class="{isNumClick: isNumTwo }"
              >{{numTwo}}</div>
              <div
                class="sub-groups-btnc"
                @click="btnClickNum('three')"
                v-bind:class="{isNumClick: isNumThree }"
              >{{numThree}}</div>
              <div
                class="sub-groups-btnd"
                @click="btnClickNum('four')"
                v-bind:class="{isNumClick: isNumFour }"
              >{{numFour}}</div>
              <div
                class="sub-groups-btne"
                @click="btnClickNum('five')"
                v-bind:class="{isNumClick: isNumFive }"
              >{{numFive}}</div>
              <div
                class="sub-groups-btnf"
                @click="btnClickNum('six')"
                v-bind:class="{isNumClick: isNumSix }"
              >
                <div class="sub-groups-btnf-icon" v-if="!isNumSix && numSix === ''">
                  <i class="view-hb icon iconfont icon-hb"></i>
                </div>
                <div class="sub-groups-btnf-title" v-if="!isNumSix && numSix === ''">新能源</div>
                <div class="sub-groups-btnf-content" v-if="isNumSix || numSix != ''">{{numSix}}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="bind-main-confirm">
        <button class="bind-main-confirm-open" @click="handleOpen">开通无感停车</button>
      </div>
    </div>

    <div class="bind-sub">
      <div class="bind-sub-icon">
        <i class="icon iconfont icon-warning img"></i>
      </div>
      <div class="bind-sub-guide">当前只支持添加蓝色车牌</div>
    </div>

    <!-- 键盘div -->
    <div class="keyboard" v-if="keyboardShow" :class="{animationDown:isDown,animationUp:isUp}">
      <div class="btn-complete" @click="completeClick">
        <span>完成</span>
      </div>
      <div v-if="keyboard == 'txt'">
        <div class="keyboard-row" v-for="(item, rows) in carTxt" :key="rows">
          <div
            class="keyboard-row-item"
            v-for="(i, index) in item.name"
            :key="index"
            @click="btnWordClick(rows,index,i)"
          >{{i}}</div>
        </div>
        <div class="keyboard-row">
          <div class="keyboard-row-item abc" @click="abcClick">ABC</div>
          <div class="keyboard-row-item" @click="btnBottomClick('藏')">藏</div>
          <div class="keyboard-row-item" @click="btnBottomClick('使')">使</div>
          <div class="keyboard-row-item" @click="btnBottomClick('领')">领</div>
          <div class="keyboard-row-item" @click="btnBottomClick('警')">警</div>
          <div class="keyboard-row-item" @click="btnBottomClick('学')">学</div>
          <div class="keyboard-row-item" @click="btnBottomClick('港')">港</div>
          <div class="keyboard-row-item" @click="btnBottomClick('澳')">澳</div>
          <div class="keyboard-row-item clear" @click="clearClick">
            <i class="icon iconfont icon-shanchu clear-icon"></i>
          </div>
        </div>
      </div>
      <div v-if="keyboard == 'num'">
        <div
          class="keyboard-row"
          :class="{threeRow:rows === 2}"
          v-for="(item, rows) in carNum"
          :key="rows"
        >
          <div
            class="keyboard-row-item"
            v-for="(i, index) in item.name"
            :key="index"
            @click="btnWordClick(rows,index,i)"
          >{{i}}</div>
        </div>
        <div class="keyboard-row">
          <div class="keyboard-row-item abc" @click="provinceClick">省份</div>
          <div
            v-for="(item, index) in carNumBottom"
            :key="index"
            class="keyboard-row-item"
            @click="btnBottomNumClick(item)"
          >{{item}}</div>
          <div class="keyboard-row-item clear" @click="clearClick">
            <i class="icon iconfont icon-shanchu clear-icon"></i>
          </div>
        </div>
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
      isDown: false,
      isUp: false,
      key: 2,
      areaName: '甘',
      areaLetter: '',
      numOne: '',
      numTwo: '',
      numThree: '',
      numFour: '',
      numFive: '',
      numSix: '',
      keyboardShow: true,
      keyboard: 'num',
      isYue: false,
      isA: true,
      isNumOne: false,
      isNumTwo: false,
      isNumThree: false,
      isNumFour: false,
      isNumFive: false,
      isNumSix: false,
      isOne: false,
      isTwo: false,
      isThree: false,
      isFour: false,
      isFive: false,
      isSix: false,
      isSeven: false,
      isEight: false,
      carTxt: [
        { name: ['京', '津', '渝', '沪', '冀', '晋', '辽', '吉', '黑', '苏'] },
        { name: ['浙', '皖', '闽', '赣', '鲁', '豫', '鄂', '湘', '粤', '琼'] },
        { name: ['川', '贵', '云', '陕', '甘', '青', '蒙', '桂', '宁', '新'] }
      ],
      carNumBottom: ['Z', 'X', 'C', 'V', 'B', 'N', 'M'],
      carNum: [
        { name: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'] },
        { name: ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'] },
        { name: ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'] }
      ],
      addedCarNum: ''
    }
  },
  methods: {
    gotoProtocol() {
      wx.navigateTo({
        url: '../protocol/main'
      })
    },
    btnClickYue() {
      this.isYue = true
      this.isA = false
      this.isUp = true
      this.isNumOne = false
      this.isNumTwo = false
      this.isNumThree = false
      this.isNumFour = false
      this.isNumFive = false
      this.isNumSix = false
      this.keyboardShow = true
      this.keyboard = 'txt'
      this.key = 1
    },
    btnClickA() {
      this.isA = true
      this.isYue = false
      this.isUp = true
      this.isNumOne = false
      this.isNumTwo = false
      this.isNumThree = false
      this.isNumFour = false
      this.isNumFive = false
      this.isNumSix = false
      this.keyboardShow = true
      this.keyboard = 'num'
      this.key = 2
    },
    btnClickNum(name) {
      this.keyboard = 'num'
      this.keyboardShow = true
      this.isYue = false
      this.isA = false
      this.isNumOne = false
      this.isNumTwo = false
      this.isNumThree = false
      this.isNumFour = false
      this.isNumFive = false
      this.isNumSix = false
      this.isUp = true
      if (name === 'one') {
        this.isNumOne = true
        this.key = 3
      } else if (name === 'two') {
        this.isNumTwo = true
        this.key = 4
      } else if (name === 'three') {
        this.isNumThree = true
        this.key = 5
      } else if (name === 'four') {
        this.isNumFour = true
        this.key = 6
      } else if (name === 'five') {
        this.isNumFive = true
        this.key = 7
      } else if (name === 'six') {
        this.isNumSix = true
        this.key = 8
      }
    },
    btnWordClick(rows, index, i) {
      if (this.key === 1) {
        this.areaName = i
        this.isYue = false
        this.isA = true
        this.key = 2
        this.keyboard = 'num'
      } else if (this.key === 2) {
        this.areaLetter = i
        this.isA = false
        this.isNumOne = true
        this.key = 3
      } else if (this.key === 3) {
        this.numOne = i
        this.isNumOne = false
        this.isNumTwo = true
        this.key = 4
      } else if (this.key === 4) {
        this.numTwo = i
        this.isNumTwo = false
        this.isNumThree = true
        this.key = 5
      } else if (this.key === 5) {
        this.numThree = i
        this.isNumThree = false
        this.isNumFour = true
        this.key = 6
      } else if (this.key === 6) {
        this.numFour = i
        this.isNumFour = false
        this.isNumFive = true
        this.key = 7
      } else if (this.key === 7) {
        this.numFive = i
        this.isNumFive = false
      } else if (this.key === 8) {
        this.numSix = i
      }
    },
    btnBottomClick(val) {
      if (this.key === 8) {
        this.numSix = val
      } else {
        this.areaName = val
      }
      this.btnClickA()
    },
    btnBottomNumClick(i) {
      if (this.key === 2) {
        this.areaLetter = i
        this.isA = false
        this.isNumOne = true
        this.key = 3
      } else if (this.key === 3) {
        this.numOne = i
        this.isNumOne = false
        this.isNumTwo = true
        this.key = 4
      } else if (this.key === 4) {
        this.numTwo = i
        this.isNumTwo = false
        this.isNumThree = true
        this.key = 5
      } else if (this.key === 5) {
        this.numThree = i
        this.isNumThree = false
        this.isNumFour = true
        this.key = 6
      } else if (this.key === 6) {
        this.numFour = i
        this.isNumFour = false
        this.isNumFive = true
        this.key = 7
      } else if (this.key === 7) {
        this.numFive = i
        this.isNumFive = false
      } else if (this.key === 8) {
        this.numSix = i
      }
    },
    completeClick() {
      this.isYue = false
      this.isA = false
      this.isNumOne = false
      this.isNumTwo = false
      this.isNumThree = false
      this.isNumFour = false
      this.isNumFive = false
      this.isNumSix = false
      this.isUp = false
      this.isDown = true
      this.keyboardShow = false
    },
    abcClick() {
      this.keyboard = 'num'
    },
    provinceClick() {
      if (this.isYue || this.isNumFive || this.isNumSix) {
        this.keyboard = 'txt'
      }
    },
    clearClick() {
      if (this.key === 1) {
        this.areaName = ''
        this.isYue = true
      } else if (this.key === 2) {
        this.areaLetter = ''
        this.isA = false
        this.isYue = true
        this.key = 1
        this.keyboard = 'txt'
      } else if (this.key === 3) {
        this.numOne = ''
        this.isNumOne = false
        this.isA = true
        this.key = 2
      } else if (this.key === 4) {
        this.numTwo = ''
        this.isNumTwo = false
        this.isNumOne = true
        this.key = 3
      } else if (this.key === 5) {
        this.numThree = ''
        this.isNumThree = false
        this.isNumTwo = true
        this.key = 4
      } else if (this.key === 6) {
        this.numFour = ''
        this.isNumFour = false
        this.isNumThree = true
        this.key = 5
      } else if (this.key === 7) {
        this.numFive = ''
        this.isNumFive = false
        this.isNumFour = true
        this.key = 6
      } else if (this.key === 8) {
        this.numSix = ''
        this.isNumSix = false
        this.isNumFive = true
        this.key = 7
      }
    },
    handleOpen() {
      if (
        this.areaName === '' ||
        this.areaLetter === '' ||
        this.numOne === '' ||
        this.numTwo === '' ||
        this.numThree === '' ||
        this.numFour === '' ||
        this.numFive === ''
      ) {
        $Toast({
          type: 'warning',
          duration: 4,
          content: '请输入完整车牌号码!'
        })
        return false
      }
      let num = ''
      if (this.numSix === '') {
        num =
          this.areaName +
          this.areaLetter +
          this.numOne +
          this.numTwo +
          this.numThree +
          this.numFour +
          this.numFive
      } else {
        num =
          this.areaName +
          this.areaLetter +
          this.numOne +
          this.numTwo +
          this.numThree +
          this.numFour +
          this.numFive +
          this.numSix
      }
      let carNumberReg = /^(([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-Z](([0-9]{5}[DF])|([DF]([A-HJ-NP-Z0-9])[0-9]{4})))|([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-Z][A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学警港澳使领]))$/
      if (!carNumberReg.test(num)) {
        $Toast({
          type: 'warning',
          duration: 4,
          content: '车牌格式有误,请重新填写!'
        })
        return false
      } else {
        console.log(`pHead: ${this.areaName}    cHead: ${this.areaLetter}`)
        if (this.areaName === '甘' && /^[IOQRSTUVWXYZ]$/.test(this.areaLetter)) {
          $Toast({
            type: 'warning',
            duration: 4,
            content: '车牌格式有误,请重新填写!'
          })
          return false
        } else {
          wx.navigateTo({
            url: `../bindVerify/main?plateNumber=${num}`
          })
        }
      }
    }
  }
}
</script>
<style lang="stylus">
.isClick
  border 1px solid #2f4ee0 !important
  z-index 50
  background-color #fff !important
.isNumClick
  border 1px solid #2f4ee0 !important
  z-index 10
  background-color #fff !important
</style>
<style scoped lang="stylus">
.bind
  width 100%
  height 100%
  background-color main-color
  display flex
  flex-flow column nowrap
  justify-content flex-start
  align-items center
  &-title
    width 100%
    height 20%
    background-color main-color
    display flex
    flex-flow row nowrap
    justify-content center
    align-items center
    font-size 15px
    color #ffffff
  &-main
    width 90%
    height 25%
    background-color #ffffff
    border-radius 3px
    display flex
    flex-flow column nowrap
    justify-content space-around
    align-items center
    &-number
      width 95%
      height 60%
      display flex
      flex-flow row nowrap
      justify-content center
      align-items center
      &-input
        width 100%
        height 70%
        display flex
        flex-flow row nowrap
        justify-content center
        align-items center
        &-section
          width 100%
          height 100%
          display flex
          flex-flow row nowrap
          justify-content space-around
          align-items center
          .main-groups
            width 27%
            height 100%
            display flex
            flex-flow row nowrap
            justify-content space-around
            align-items center
            &-btna
              width 33px
              height 60%
              display flex
              flex-flow row nowrap
              justify-content space-around
              align-items center
              border 1px solid #1da9da
            &-btnb
              width 33px
              height 60%
              display flex
              flex-flow row nowrap
              justify-content space-around
              align-items center
              border 1px solid #1da9da
            &-mid
              width 5px
              height 5px
              border-radius 50%
              background #dddddd
          .sub-groups
            width 73%
            height 100%
            display flex
            flex-flow row nowrap
            justify-content space-around
            align-items center
            &-btna
              width 33px
              height 60%
              display flex
              flex-flow row nowrap
              justify-content space-around
              align-items center
              border 1px solid #1da9da
            &-btnb
              width 33px
              height 60%
              display flex
              flex-flow row nowrap
              justify-content space-around
              align-items center
              border 1px solid #1da9da
            &-btnc
              width 33px
              height 60%
              display flex
              flex-flow row nowrap
              justify-content space-around
              align-items center
              border 1px solid #1da9da
            &-btnd
              width 33px
              height 60%
              display flex
              flex-flow row nowrap
              justify-content space-around
              align-items center
              border 1px solid #1da9da
            &-btne
              width 33px
              height 60%
              display flex
              flex-flow row nowrap
              justify-content space-around
              align-items center
              border 1px solid #1da9da
            &-btnf
              width 33px
              height 60%
              display flex
              flex-flow column nowrap
              justify-content center
              align-items center
              border 1px solid #1da9da
              &-icon
                width 100%
                height 65%
                display flex
                flex-flow row nowrap
                justify-content center
                align-items flex-end
                color lightgreen
                .view-hb
                  line-height 100%
                  font-size 23px
              &-title
                width 100%
                height 35%
                font-size 8px
                color #c0c0c0
                display flex
                flex-flow row nowrap
                justify-content center
                align-items center
              &-content
                width 100%
                height 100%
                display flex
                flex-flow row nowrap
                justify-content space-around
                align-items center
    &-confirm
      width 95%
      height 40%
      display flex
      flex-flow column nowrap
      justify-content flex-start
      align-items center
      &-open
        width 100%
        height 80%
        display flex
        flex-flow row nowrap
        justify-content center
        align-items center
        background main-color
        color #ffffff
  &-sub
    width 100%
    height 10%
    display flex
    flex-flow row nowrap
    justify-content center
    align-items center
    &-icon
      width 35%
      height 100%
      display flex
      flex-flow row nowrap
      justify-content flex-end
      align-items center
      color #ddd
      font-size 13px
    &-guide
      width 65%
      height 100%
      display flex
      flex-flow row nowrap
      justify-content flex-start
      align-items center
      color #ffffff
      font-size 12px
      padding-left 5px
  .keyboard
    width 100%
    height 447px
    position fixed
    bottom -200px
    background-color #cfd3dc
    z-index 10
    &.animationDown
      animation slide_dowms 0.3s ease-out
      animation-fill-mode forwards
    &.animationUp
      animation slide_ups 0.3s ease-out
      animation-fill-mode forwards
    .btn-complete
      height 30px
      color #2d8cf0
      font-size 15px
      width 100%
      background-color #eeeeee
      border none
      border-top 1px solid #eee
      display flex
      flex-flow row nowrap
      justify-content flex-end
      align-items center
      span
        padding-right 10px
    .threeRow
      margin-left 10px
      margin-right 10px
    .keyboard-row
      margin-top 10px
      display flex
      justify-content space-between
      padding 0 8px
      color #333
      .keyboard-row-items
        display flex
        justify-content left
      .keyboard-row-bottom
        display flex
        justify-content space-between
      .keyboard-row-item
        width 30px
        height 40px
        background #fff
        font-size 20px
        text-align center
        border 1px solid #ccc
        border-radius 5px
        color #333
        display flex
        flex-flow row nowrap
        justify-content center
        align-items center
        &.abc
          width 50px
          height 40px
          display flex
          align-items center
          justify-content center
          background-color #acb3bd
        &.clear
          width 50px
          height 40px
          display flex
          align-items center
          justify-content center
          background-color #acb3bd
          .clear-icon
            width 50%
            height 100%
            color #333333
            font-size 30px
            display flex
            align-items center
            justify-content center
      .none-botton
        border none
        height 40px
        width 35px
        visibility hidden
</style>

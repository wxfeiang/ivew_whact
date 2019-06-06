<template>
  <div class="info">
    <div class="list">
      <div class="item">
        <div class="title">姓名</div>
        <div class="name">
          <input
            class="ninput"
            v-model="userName"
            type="text"
            mode="wrapped"
            maxlength="10"
            placeholder="请输入姓名"
          >
        </div>
      </div>
      <div class="splice"></div>
      <div class="item">
        <div class="title">性别</div>
        <div class="name">
          <picker
            class="picker"
            :value="genderIndex"
            :range="genderData"
            :range-key="'name'"
            @change="genderChange"
          >
            <div class="show">
              <div class="stitle">
                <span class="sstitle">{{ genderData[genderIndex].name }}</span>
                <i class="icon iconfont icon-caret-down img"></i>
              </div>
            </div>
          </picker>
        </div>
      </div>
      <div class="splice"></div>
      <div class="item">
        <div class="title">手机号码</div>
        <div class="name">
          <input
            class="ninput"
            v-model="userMobile"
            type="number"
            mode="wrapped"
            placeholder="请输入手机号码"
          >
        </div>
      </div>
      <!-- <div class="splice"></div>
      <div class="item">
        <div class="title">身份证</div>
        <div class="name">
          <input
            class="ninput"
            v-model="userIdentity"
            type="text"
            maxlength="18"
            mode="wrapped"
            placeholder="请输入身份证"
          >
        </div>
      </div> -->
      <!-- <div class="info-list-item">
        <div class="info-list-item-title">地区</div>
        <div class="info-list-item-name">
          <picker class="info-list-item-name-picker" mode="region" :value="regionSelect" @change="regionChange">
            <div class="info-list-item-name-picker-show">
              <div class="">{{regionData.city}}</div>
            </div>
          </picker>
        </div>
      </div>
      <div class="info-list-splice"></div>-->
    </div>
    <div class="save">
      <button class="sbutton" @click="handleSave">保存</button>
    </div>
    <i-toast id="toast"/>
    <i-modal
      title="用户信息更新成功"
      ok-text="确定"
      :show-cancel="showCancel"
      :visible="showdModal"
      @ok="updateSuccess"
      @cancel="updateCancel"
    ></i-modal>
  </div>
</template>

<script>
import { $Toast } from '@/utils/iview'
import { mapState, mapMutations } from 'vuex'
import * as types from '@/store/mutation-types'
import { userFind, userUpdate } from '@/api/user'
import * as util from '@/utils/index'
export default {
  data() {
    return {
      showdModal: false,
      showCancel: false,
      userId: '',
      userName: '',
      userMobile: '',
      regionData: '',
      userIdentity: '',
      gender: '',
      genderData: [
        {
          name: '男',
          value: 1
        },
        {
          name: '女',
          value: 2
        }
      ],
      genderSelect: '',
      genderIndex: 0,
      regionIndex: 0,
      regionSelect: ''
    }
  },
  computed: {
    ...mapState(['openid', 'mobile', 'user'])
  },
  methods: {
    updateSuccess() {
      this.showdModal = false
      wx.navigateBack({
        delta: 1
      })
    },
    updateCancel() {
      this.showdModal = false
    },
    genderChange(e) {
      this.genderIndex = e.mp.detail.value
      this.genderSelect = this.genderData[this.genderIndex].value
    },
    regionChange(e) {
      this.regionSelect = e.mp.detail.value
    },
    async handleSave() {
      if (!this.userName || this.userName === '') {
        $Toast({
          type: 'warning',
          duration: 4,
          content: '请填写姓名!'
        })
        return false
      }
      if (
        !this.userMobile ||
        !/^1[34578]\d{9}$/.test(this.userMobile) ||
        this.userMobile === ''
      ) {
        $Toast({
          type: 'warning',
          duration: 4,
          content: '请填写正确的手机号码!'
        })
        return false
      }
      // if (
      //   !this.userIdentity ||
      //   !util.checkID(this.userIdentity) ||
      //   this.userIdentity === ''
      // ) {
      //   $Toast({
      //     type: 'warning',
      //     duration: 4,
      //     content: '请填写正确的身份证号码!'
      //   })
      //   return false
      // }
      if (!this.userId) {
        $Toast({
          type: 'warning',
          duration: 4,
          content: '没有找到用户信息,无法更新!'
        })
        return false
      }
      wx.showLoading({ title: '加载中', mask: true })
      try {
        let params = {
          id: this.userId,
          userName: this.userName,
          mobile: this.userMobile,
          gender: this.genderSelect
          // identityId: this.userIdentity
        }
        let iReturn = await userUpdate(params)
        wx.hideLoading()
        if (iReturn.status === 200 && iReturn.data === 1) {
          this.saveMobile(this.userMobile)
          // this.saveIdentity(this.userIdentity)
          this.showdModal = true
        } else {
          $Toast({
            type: 'error',
            duration: 4,
            content: '更新失败,请重试!'
          })
        }
      } catch (err) {
        wx.hideLoading()
        $Toast({
          type: 'error',
          duration: 4,
          content: `更新异常 ${err}`
        })
      }
    },
    async userFind() {
      wx.showLoading({ title: '加载中', mask: true })
      try {
        let params = {
          openid: this.openid || '',
          mobile: this.mobile || ''
        }
        let iReturn = await userFind(params)
        wx.hideLoading()
        if (iReturn.status === 200 && iReturn.data) {
          this.userName = iReturn.data.userName
          this.userMobile = iReturn.data.mobile
          this.genderSelect = iReturn.data.gender
          this.userId = iReturn.data.id
          // this.userIdentity = iReturn.data.identityId
          this.genderData.forEach((item, index) => {
            if (item.value === this.genderSelect) {
              this.genderIndex = index
            } else {
              this.genderIndex = 0
            }
          })
        } else {
          $Toast({
            type: 'error',
            duration: 4,
            content: '没有找到用户!'
          })
        }
      } catch (err) {
        wx.hideLoading()
        $Toast({
          type: 'error',
          duration: 4,
          content: '没有找到用户!'
        })
      }
    },
    ...mapMutations({
      saveMobile: types.SYSTEM_MOBILE
      // saveIdentity: types.SYSTEM_IDENTITYID
    })
  },
  mounted() {
    this.userMobile = this.mobile
    // this.regionData = this.location
    this.genderSelect = this.user.gender
    this.genderData.forEach((item, index) => {
      if (item.value === this.genderSelect) {
        this.genderIndex = index
      } else {
        this.genderIndex = 0
      }
    })
    this.userFind()
  }
}
</script>
<style scoped lang="stylus">
.info
  width 100%
  height 100%
  background-color bg-color
  display flex
  flex-flow column nowrap
  justify-content flex-start
  align-items center
  .list
    width 100%
    height 30%
    display flex
    flex-flow column nowrap
    justify-content flex-start
    align-items center
    background-color white-color
    .item
      width 95%
      height 33%
      display flex
      flex-flow row nowrap
      justify-content flex-start
      align-items center
      .title
        width 25%
        height 100%
        display flex
        flex-flow row nowrap
        justify-content flex-start
        align-items center
        font-size 15px
        color title-font
      .name
        width 75%
        height 100%
        display flex
        flex-flow row nowrap
        justify-content flex-start
        align-items center
        font-size 15px
        color sub-font
        .picker
          width 100%
          height 60%
          color sub-font
          font-size 15px
          display flex
          flex-flow row nowrap
          justify-content flex-start
          align-items center
          .show
            width 100%
            height 100%
            display flex
            flex-flow row nowrap
            justify-content center
            align-items center
            .stitle
              width 100%
              height 100%
              font-size 15px
              display flex
              flex-flow row nowrap
              justify-content space-around
              align-items center
              .sstitle
                width 90%
                height 100%
              .img
                width 10%
                height 100%
                font-size 10px
      .ninput
        width 100%
        height 100%
    .splice
      width 100%
      height 1px
      background-color bg-color
  .save
    width 90%
    height 9%
    bottom 0
    display flex
    flex-flow row nowrap
    justify-content center
    align-items center
    margin-top 50px
    .sbutton
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

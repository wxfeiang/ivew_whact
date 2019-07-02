import { $Toast } from '@/utils/iview';
<template>
  <div class="iselect">
    <div class="ipick" v-if="isInit">
      <div class="ipcenter">
        <div class="ipctitle">请选择</div>
        <div class="ipcitem" @click="toSelect('yes')">
          <div class="ipcileft">
            <img class="ipcimg" src="/static/images/banks/gs.png" alt="">
          </div>
          <div class="ipciright">
            <span class="ipcititle">持有工商银行卡</span>
          </div>
        </div>
        <div class="ipcsplice"></div>
        <div class="ipcitem"  @click="toSelect('no')">
          <div class="ipcileft">
            <i class="icon iconfont icon-accountbook ipcicon"></i>
          </div>
          <div class="ipciright">
            <span class="ipcititle">工银e钱包</span>
          </div>
        </div>
        <i-modal title="提示" :visible="showMask" :show-cancel="showCancel" @ok="clickConfirm">
          <view>将跳转至工商银行网站</view>
          <view>进行信用卡申办资料填写</view>
        </i-modal>
      </div>
    </div>
    <div class="iprotocl" v-if="!isInit">
      <div class="ipback" @click="gobackp">
        <i class="icon iconfont icon-right ipbicon"></i>
        <span class="ipbtitle">返回</span>
      </div>
      <div class="iptmp" v-if="!isRead">
        <div class="ipcontent">
          <div class="ipcc" v-html="article"></div>
        </div>
        <div class="ipmark" @click="hasRead">
          <i class="icon iconfont icon-yuanquan ipmicon" v-if="!isChoice"></i>
          <i class="icon iconfont icon-check-circle-fill ipmicon" v-if="isChoice"></i>
          <span class="ipmtitle">我已阅读并同意《工行代扣协议》</span>
        </div>
      </div>
      <div class="ipdeal" v-if="isRead">
        <div class="ipditem">
          <div class="ipdtitle">开户姓名</div>
          <div class="ipdname">
            <input
              class="ninput"
              v-model="icbc.userName"
              type="text"
              mode="wrapped"
              maxlength="20"
              placeholder="请输入开户姓名"
            >
          </div>
        </div>
        <div class="ipditem">
          <div class="ipdtitle">工行卡号</div>
          <div class="ipdname">
            <input
              class="ninput"
              v-model="icbc.cardNumber"
              type="number"
              mode="wrapped"
              maxlength="19"
              placeholder="请输入工行卡号"
            >
          </div>
        </div>
        <div class="ipditem">
          <div class="ipdtitle">员工编号</div>
          <div class="ipdname">
            <input
              class="ninput"
              v-model="icbc.staffNo"
              type="number"
              mode="wrapped"
              maxlength="9"
              placeholder="无编号可不填"
            >
          </div>
        </div>
        <div class="ipdimark">
          <span class="ipdimm">* 持卡人务必与机动车所有人一致</span>
          <span class="ipdimm">* 五年内不得将绑定的工商银行账户修改为他行账户</span>
        </div>
        <div class="ipdbtn">
          <button class="ipdbutton" @click="handleConfirm">提交</button>
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
      isInit: true,
      isRead: false,
      isChoice: false,
      showMask: false,
      showCancel: false,
      icbc: {
        userName: '',
        cardNumber: '',
        staffNo: ''
      },
      applyId: '',
      article: `<h3 style="text-align:center;margin-top:5px">工商银行信用卡客户协议（个人卡）</h3><p align="left">本人已阅读，理解并接受《广发银行信用卡章程》（“章程”）《广发银行信用卡客户协议（个人卡）》（“合约”）及本申请  表的全部条款和内容，本人在申请表上签名即视为本人已知悉并理解《章程》和《合约》及本申请表的全部内容，并同意接受其约束。本人确认，广发银行已就增加  本人责任或限制本人权利、免除或限制广发银行责任或广发银行单方拥有某些权利的所有条款向本人作出相应提示和说明，本人对所有条款完全理解并自愿接受该内  容。 <br>
  广发银行信用卡（以下简称“广发卡”）主卡及附属卡申请人/持卡人（以下简称“客户”）与广发银行（以下简称“银行”）就广发卡申请、使用等有关事宜，签订协议如下： </p>
<p align="left"><strong>第一条&nbsp;  广发卡种类 </strong><br>
  广发卡按币种不同分为人民币卡、外币卡及双币卡；按还款法律责任不同分为主卡、附属卡。 </p>
<p align="left"><strong>第二条&nbsp;  广发卡申请 </strong><br>
  1.主卡客户须为年满十八周岁并具备完全民事行为能力、有合法稳定收入及资信良好的自然人。附属卡申请人须年满十六周岁。 <br>
  2.银行对信用卡实行多卡归户管理，客户名下所有信用卡卡片（含主卡、附属卡）均属同一客户账户。主卡客户可向银行为其他自然人申请附属卡，附属卡的所有账务均被记入主卡账户，主卡及附属卡客户须对广发卡账户中的所有债务承担连带清偿责任。 <br>
  <strong>3.</strong><strong>客户应按银行要求提供真实完整、准确有效的资料及信息，包括但不限于个人身份信息、个人财产信息、账户信息（收款账户、还款账户）等资料。不论广发卡申请是否获得批核，银行不再予以退还。</strong><br>
  <br>
  <strong>4.</strong><strong>客户提供的以上资料及客户在申请表中所填内容（包括但不限于住宅地址、手机号码、电话号码、  身份证号码、有效期等证件资料、电子邮箱等资料）如有变更或失效的，应立即联系银行办理变更手续。客户同意以其在信用卡申请表上所填写的住宅地址、手机号  码、电子邮箱地址作为客户和银行就本协议发生纠纷时法律文书的送达地址。银行或诉讼管辖法院向持卡人提供的任何送达地址寄送文件均视为已送达，因客户提供  资料失实、不详尽或资料更新不及时导致的后果及损失，由客户承担。 </strong><br>
  <strong>5.</strong><strong>客户同意并授权银行向中国人民银行金融信用信息基础数据库、信贷征信业监督管理部门批准建立  的征信信息数据库及其他渠道查询、处理、留存和使用其财产、个人信息和资信状况相关的资料，以确认客户的资信状况。客户同意并授权银行在申请办理信用卡及  办卡后，在信贷审批、担保资格审查、贷后管理、异议核查等法律法规允许的情况下查询、处理、留存和使用其财产、个人信息和资信状况相关的资料，银行查询获  得的信用报告可用于信贷审批、担保资格审查、贷后管理、异议核查等合法的用途范围内。对于超出授权查询的一切后果及法律责任由银行承担。客户知悉并理解本  授权条款的声明。银行承诺对上述客户资料保密。</strong> <br>
  <strong>6.</strong><strong>客户同意并授权银行向中国人民银行金融信用信息基础数据库及信贷征信业监督管理部门批准建立  的征信信息数据库报送上述资料；客户同意并授权银行根据司法机关、金融监管机关或其它行政机关要求处理上述资料，或依照法定程序，将上述资料提供给银行卡  组织、金融行业公会、社会征信机构或其它金融机构；在法律规定的范围内，客户同意并授权银行将上述资料用于银行自行或委托第三方进行案件调查，债务追索等  情况。如发生上述不良信息等报送情形且依法需通知客户的，银行可以电话、短信、电子邮件、对账单、催收单等方式通知客户，客户联系方式以其提交并存留在银  行的联络信息为准。</strong> <br>
  <strong>7.</strong><strong>客户上述授权视同同意银行通过合法渠道获取并报送客户个人金融信息。银行将审慎合法使用并保密。获取的信息涉及客户隐私，客户可能承担因自身原因或其他原因造成信贷记录不良而导致的不良影响，客户认可授权行为并知晓授权行为可能产生的后果。 </strong><br>
  <strong>8.</strong><strong>为提供更优质的产品和服务，客户同意银行使用其个人金融信息提供本行及其分支机构、下属公司其他产品及服务，同意提供客户个人金融信息给银行的业务合作伙伴及委托处理事务之第三方（包括但不限于中国银联银行卡风险信息共享系统、中国银联等银行卡国际组织、甲方的</strong><strong>非金融</strong><strong>机  构支付服务支付机构、甲方的联名卡合作方、甲方的服务机构、代理人、外包作业机构及相关资信机构），用于包括但不限于支付结算、联名卡服务、增值服务、金  融服务、还款等用途。银行有义务要求业务合作伙伴及委托处理事务之第三方对客户的相关信息进行保密，防范信息被非法使用。 </strong><br>
  <strong>如客户不同意向银行及其分支机构或与银行签约的业务合作伙伴及委托处理事务之第三方提供个人金融信息，可随时以书面形式通知银行，银行在收到通知后，在银行规定的时限内，将停止向客户提供相应的产品及服务，客户因而将无法享受银行提供的相应优惠及增值服务。 </strong></p>
<p align="left"><strong>第三条&nbsp;  批核及信用额度评估 </strong><br>
  1.银行有权根据客户的资信状况，决定是否予以发卡、授予信用额度及决定信用额度的范围。 <br>
  2.主卡持卡人与附属卡持卡人共享信用额度。银行对客户的多个信用卡账户授信额度（消费额度）、分期付款额度（分期额度）、附属卡授信额度、现金提取授信额度（提现额度），并设定总授信额度上限。 <br>
  <strong>3.</strong><strong>客户同意银行可以根据客户交易、还款等用卡情况、资信状况变化或风险信息等情况调整其广发卡  的信用额度（额度可调整直至为零），或者要求客户提供或增加权利质押担保。银行调整信用额度可通过短信、电话、官方微信、发现精彩APP、对账单、口头或  书面等方式之一通知客户。如客户不能接受该等调整的，可要求银行协商恢复其原信用额度，应以银行最终的综合评估为准。前述信用额度调整不影响客户在本协议  项下的还款义务，客户仍需偿还已发生的交易款项、利息、违约金及费用等，且不得以未收到通知为由要求银行承担责任，除非银行存在法律、法规规定的过错。</strong> <br>
  4<strong>.</strong><strong>除银行核准的信用额度外，客户同意开通超授信额度用卡服务，可使用原信用额度上浮不超过10%的超限额度。客户可通过客服热线等方式取消超限额度。 </strong><br>
  5.客户在一个账单周期内仅允许超限一次。如两个连续的账单周期内超限将被取消超限额度，客户还清超限部分后才可申请开通超限额度。 </p>
<p align="left"><strong>第四条&nbsp;  广发卡的使用 </strong><br>
  1.客户取得广发卡后须立即在卡片背面签名栏签上与申请文件相同的签名,并在交易时使用此签名字样，否则，由此产生的损失由客户承担。客户如需要更改签名式样的，须事先书面向银行申请，经银行确认并办理更换卡手续后生效。<br>
  <strong>如客户申领广发卡带有可用于脱机消费的芯片电子现金业务，开卡时默认开通电子现金业务，电子现金余额初始为零，客户须先进行电子现金圈存后进行消费，电子现金余额最高不得超过人民币1000元。 </strong><br>
  <strong>2.</strong><strong>广发卡交易密码包括消费、柜员机、网上银行、手机银行、网上支付、电话交易等密码、以及交易动态码等交易密码，客户应妥善保管，不得向任何人透露。任何通过密码完成的交易或发出的指令，均视为客户本人所为，均由客户自行承担由此产生的后果和损失。</strong><strong>基  于持卡人签字形成的交易凭证和/或凭广发信用卡磁条、芯片、卡号或密码等电子数据和/或卡片信息而办理的各项交易（包括但不限于通过销售点终端、手工受  理、邮件、电话、手机、短信、微信、传真、互联网等方式进行的信用卡交易）所产生的信息记录之一或全部均属于该项交易的有效凭据。如有关交易确已发生，除  非银行存在法律、法规规定的过错，客户不得以无交易凭证、交易凭证上签字非本人所为、密码非本人输入或未输入密码等理由拒绝偿付因交易发生的款项</strong><strong>。 </strong><br>
  <strong>3.</strong><strong>客户使用支持电子现金账户的广发卡可在贴有“银联”标识、且支持电子现金受理的特约单位的芯  片接触或非接触式受理终端上进行电子现金脱机消费。电子现金脱机消费交易时无需密码及签名验证，所有电子现金交易均视为客户本人行为。因客户对卡片保管不  善（包括但不限于丢失或被盗等）造成的客户损失均由客户自行承担。如有关交易确已发生，客户不得拒绝偿付交易款项。 </strong><br>
  4.电子现金账户客户可通过本卡贷记账户实现指定账户圈存，可通过签约方式开通自动圈存，并可通过我行网点、ATM等其他现金终端进行现金充值。指定账户圈存交易自圈存日起计入本卡贷记账户消费交易，并按入账日期计入当期账单。 <br>
  5.客户可以使用广发卡刷卡消费、提取现金、登录网上银行进行网上支付、使用银行自助设备等。持卡人溢缴款柜台取现限额，不超过溢缴款额。持卡人通过柜面  或者自助渠道办理预借现金提取业务、通过各类渠道办理预借现金转账业务的每卡每日限额不超过持卡人总授信额度。客户通过各渠道办理的预借现金业务限额，银  行将依据监管要求进行调整。发生变动时银行可通过官方客户端发现精彩、官方微信、短信、账单等多种或一种方式通知客户，客户可从以上多种或一种渠道查询。<strong>银行在认为有需要时，有权限制或不许可客户进行交易。 </strong><br>
  6.广发卡只限客户本人使用，客户承诺不以转让、转借、出租、质押或任何其它方式将卡片交他人使用，否则，客户除需承担因此产生的债务及银行的损失外，仍应按金融监管机构的规定承担相应责任。 <br>
  <strong>7.</strong><strong>对于客户与商户等之间发生的交易纠纷、以及客户未经网上银行登录进行网上支付发生的交易纠纷，应由双方自行解决，银行不负任何责任，客户不得以此拒偿因使用广发卡交易所产生的债务。客户也不得以退还使用广发卡交易取得的货物等方式向银行索取退款。 </strong><br>
  8.客户使用广发卡，应遵守国家法律法规、境内外银行卡组织有关规定，及金融监管机关或其它行政机关关于银行卡交易限制、外汇管制等规定。 <br>
  <strong>9.</strong><strong>广发卡属于银行所有，为实现风险管控、客户用卡安全保障等安全管控目标，</strong><strong>客户同意并授权</strong><strong>银  行可根据客户使用卡片、履行协议、控制客户用卡风险等情况及银行认为正当的理由，做出包括但不限于暂停或停止客户使用卡片（电子现金除外）的权利及调低其  信用额度、设置或调整交易限制、不换发新卡、列入不良信息名单、分期付款还款提前偿还等决定，而不必事先通知客户及说明理由。</strong><strong>当银行做以上决定后，客户的全部未偿债务均视为到期并须一次性清偿。 </strong><br>
  <strong>10.</strong><strong>客户同意银行赠与其交易累计积分或免费提供其他优惠，银行作为赠与人有权变更积分规则、优惠种类及内容或清除积分、终止有关优惠等，而无须事先征得客户同意。发生变更时，银行可通过公告等方式向客户履行告知义务，履行告知义务后变更发生法律效力。 </strong><br>
  <strong>11.</strong><strong>客户清楚并确认银行与特约单位或受理单位之间不存在直接或间接共同利益关系或关联关系，客  户选择特约单位或受理单位的商品或服务完全是客户本人自愿基于对特约单位或受理单位的信赖，与银行无关，客户同意不以因与特约单位或受理单位发生纠纷为由  拒绝支付所欠银行的款项。客户同意不利用信用卡进行虚假交易等欺诈活动套取资金、积分、奖品或增值服务，客户同意银行有权要求其返还等值金额的款项，银行  可将该款项列为客户对银行的信用卡债务，并按银行信用卡规定计算利费、进行催收和报送征信信息。 </strong><br>
  <strong>如因第三方原因导致银行无法提供或无法完全提供增值服务的，银行不承担任何责任。 </strong><br>
  <strong>12.</strong><strong>客户清楚并同意，信用卡只能用于消费领域，不可用于生产经营、投资（包括但不限于购买房产，购买股票、期货、理财产品等）、偿还债务、借贷等非消费领域。 </strong></p>
<p align="left"><strong>第五条&nbsp; 广发卡保管及挂失 </strong><br>
  1.客户应妥善保管信用卡及其卡片信息、密码、交易动态码、交易凭证、身份证件和个人信息等，防止信用卡及其卡片信息、密码、交易凭证、身份证件和个人信息丢失、被盗、泄露或被冒用。 <br>
  <strong>2.</strong><strong>客户须对因保管不善、将卡片转交他人或其它不谨慎或不良行为而发生的卡片丢失、被盗及被冒用  所导致的损失承担责任。客户不得将信用卡及其卡片信息、密码、交易凭证、交易动态码、身份证件和个人信息相关信息泄露给他人，且不得出租或转借信用卡，否  则应自行承担由此产生的后果和损失，如广发卡丢失、被盗或被冒用，客户应立即致电银行的客服热线、网上银行（www.cgbchina.com.cn）、  手机银行等电子银行渠道或营业网点办理挂失（电子现金除外），挂失手续办妥后挂失即时生效，同时，应向公安机关报案。客户对挂失生效后其广发卡发生的交易  不承担任何责任，除非客户对该交易存在欺诈、串通他人欺诈或其他不诚实行为。银行不办理电子现金挂失服务。 </strong><br>
  3.对于广发卡丢失或失窃后在挂失前48小时内发生的被盗用损失，客户可在被盗用交易发生后的45天内将失卡保障申请材料快递至银行，经审核属实，银行在  相应卡类的保障限额内补偿。保障范围不包括须使用密码的交易和网上交易、电购、邮购交易；保障金额不包括自有存款；新开卡客户在首次刷卡消费的次日即享此  项保障；连续6个月没有发生交易的信用卡将被自动取消该项保障功能。具体条款以《失卡保障计划》为准，详细的失卡保障计划内容请登陆网站查看。 <br>
  <strong>4.</strong><strong>失卡客户必须配合银行调查人员调查，配合范围包括但不限于以下：（1）如实详尽描述失卡经过；（2）协助银行对争议商户进行调查；（3）配合银行向司法机关调取相应资料及了解案件处理进度。若客户不同意配合调查，银行有权拒绝理赔，客户应自行承担由此产生的后果和损失。 </strong><br>
  <strong>5.</strong><strong>失卡客户通过公安机关追回的或其他渠道获得的财物赔偿，客户有义务15日内及时</strong><strong>通知银行、并将所得财物赔偿移交银行，银行对追回财物享有所有权。</strong><strong>如客户存在隐瞒行为，银行有权依据本条款拒绝赔偿及保留依法追偿的权利。 </strong><br>
  <strong>6.</strong><strong>客户在失卡后有义务立即挂失，若因客户本人没有及时挂失的【最长时限不超过48小时】，银行  可作出拒赔决定。同时客户同意，如银行已按客户提供的手机号码、邮箱地址、微信号码等之一的方式发送手机短信、电子邮件或微信信息提示交易信息、安全告知  等内容，客户应该立即采取挂失等措施，防止损失发生或扩大损失，客户同意对未及时操作引起的所有结果（包括但不限于损失和扩大损失）承担一切责任。</strong> <br>
  7.如客户取回丢失或被盗的广发卡，在未申请重制新卡前，可申请取消挂失，经银行确认后生效，但银行无需退还挂失费。 <br>
  8.若丢失银行配发的优先通道卡，客户应立即致电银行的客服热线申请挂失。在挂失前的优先通道卡所产生的费用由客户负责，客户不得拒偿因此产生的债务。 </p>
<p align="left"><strong>第六条&nbsp;  广发卡更新及更换 </strong><br>
  1.客户同意，如在原广发卡到期至少一个月前没有通知银行终止用卡并办理注销手续，或在申请卡类转换获银行批准前未通知银行终止申请，即表示客户要求继续用卡，银行将制作新卡并发给客户。 <br>
  2.银行有权决定是否向客户发放更新卡以取代其过期卡，有权决定是否向客户更换其挂失、被冒用或怀疑有欺诈问题的卡。 <br>
  3.客户在办理卡片注销、更换、更新或者卡类转换后，银行一律不收回原广发卡，由客户将卡片从中间剪成两半从而破坏磁条和（或）芯片后自行销毁。由于客户没有正确销毁卡片而导致卡片被盗用、被冒用等损失由客户承担。 <br>
  4．客户的支持电子现金账户的广发卡在更新、更换时，可在柜台将旧卡的电子现金余额转移到新卡，旧卡由我行收回销毁。银行将在受理后30个自然日内将电子  现金账户余额转入新卡贷记账户，转入金额以银行系统记录金额为准。若未交回，旧卡的电子现金余额可继续使用至卡片有效期满，期间不允许进行圈存、现金充  值。 <br>
  5.根据国家政策要求或银行经营管理和风险控制等需要，银行有权调整某些卡产品，包括但不限于产品下线、停止发行等。对于已经下线、停止发行的卡产品，银  行有权在年费相同的情况下，为客户发放其他信用卡产品。客户可以选择继续使用，或者致电银行客户服务热线进行卡片注销。如客户决定使用新的信用卡产品，将  享受该等信用卡产品的服务、权益（客户无论是否使用新的卡产品，银行下线、停止的卡产品服务及权限均停止）。 </p>
<p align="left"><strong>第七条&nbsp;  存款利息 </strong><br>
  <strong>银行对贷记卡账户中的存款、电子现金账户余额均不计付利息。保证金存款利息银行按中国人民银行的相应规定计付给客户。 </strong></p>
<p align="left"><strong>第八条&nbsp;  对账单、签购单 </strong><br>
  1.银行向客户提供对账单的地址以客户提供为准。如客户未能按时收到对账单，应及时通过银行网上银行（www.cgbchina.com.cn）、手机银  行等电子银行渠道、银行官方客户端发现精彩、短信、官方微信、自助语音系统（IVR）及客服热线等途径查询。客户不得以未收到对账单为由，拒偿其广发卡账  户中的任何债务。 <br>
  2.如客户自上一份月结账单后，贷记卡账户没有任何交易且账户没有任何未偿还余额的，银行可不提供对账单。 <br>
  3.客户应及时、认真核实对账单内容，若对所列交易有异议，应自交易发生的当期账单日起三十日内提出，否则视同客户已认可全部交易。 <br>
  4.客户应妥善保管签购单等交易凭证，以免卡片信息被他人盗取。银行协助客户调阅签购单、处理交易争端所产生的费用由客户承担；在银行协助查核时，客户应  提供与争端交易相关的文件，因客户在规定时限内无法提供相关文件而导致的损失，由客户承担。 <br>
  5.应客户要求，每年免费提供一次近12期对账单。 </p>
<p align="left"><strong>第九条&nbsp;  还款 </strong><br>
  1.客户应及时偿还因使用广发卡产生的全部债务，或偿还最低还款额。银行有权要求客户于指定日期清偿所有债务。 <br>
  <strong>2.</strong><strong>广发卡透支利息日利率为万分之五，年利率为日利率乘以当年实际天数，按月计收复利，复利计收  对象包括本金、利息及政策允许计收复利的手续费等全部欠款，并设有最低收取限额。客户的最低收取限额及透支利率、违约金收取标准、最低还款比例由银行根据  客户综合表现确定，在客户持有的信用卡片有效期内，银行有权依据客户风险情况不定期调整，具体以银行通知为准。发生变动时银行可通过官方客户端发现精彩、  官方微信、短信、账单等多种或一种方式通知客户，客户可从以上多种或一种渠道查询。 </strong><br>
  3.客户使用广发卡发生的非预借现金交易，可选择享受以下待遇之一（不得同时享受两种待遇）： <br>
  （1）免息还款期待遇。银行记账日至对账单通知的到期还款日为免息还款期，最长为56天。如客户在到期还款日前偿还账单所列全部债务则账单当期的交易可自动享受免息还款期待遇，无须支付非预借现金交易的利息。<strong>否则，非预借现金交易不享有免息待遇。</strong><strong>全部应还款额</strong><strong>均从银行记账日起按透支利率计收利息，直至所有债务还清为止。 </strong><br>
  （2）最低还款额待遇。客户可按照银行对账单标明的最低还款额还款。最低还款额为银行规定的客户应该偿还的最低金额，包括当期账单累计未还透支消费交易本  金、利息的一定比例，以及当期预借现金本金、当期产生的费用、违约金及上一账单中最低还款额未还部分的总和，均设有最低限额。如计算的最低还款额低于最低  限额，以最低限额为准；如本月实际透支金额低于最低限额，则以本月实际透支金额为准。 <br>
  <strong>客户充分了解并清楚知晓如选择按最低还款额还款的，客户自愿同意不再享受免息待遇，欠款均从交易入账日起按透支利率计收利息，直至所  有债务还清为止。若客户在到期还款日前还款额低于最低还款额,还必须承担以最低还款额未还部分的一定比例计算的违约金,违约金设有最低收取限额。</strong><strong>客户的最低还款比例、最低收费限额及违约金率由银行根据客户综合表现确定，在客户持有的信用卡片有效期内，银行有权依据客户风险情况不定期调整，具体以银行通知为准。发生调整时</strong><strong>银行可通过官方客户端发现精彩、官方微信、短信、账单等多种或一种方式通知客户</strong><strong>，客户也可通过账单或客服热线查询。 </strong><br>
  <strong>4.</strong><strong>客户使用广发卡发生的预借现金交易，现金交易额及依法允许计收复利的费用等由交易发生日之日起按透支利率计收透支利息，不享受免息还款期、最低还款额待遇。</strong> <br>
  <strong>5</strong><strong>.</strong><strong>客户的还款入账日以款项到达广发卡账户日为准。收到持卡  人还款时，按照以下顺序对其信用卡账户的各项欠款进行冲还：正常及逾期1-90天（含）的，按照先年费、提现/转账手续费、违约金、各项费用和应收利息，  后本金的顺序进行冲还；逾期91天以上的，按照先本金，后应收利息、年费、提现/转账手续费、违约金、各项费用的顺序进行冲还。已挂账单的欠款会优先未挂  账单的欠款冲还。银行保留决定并更改还款顺序的权利。 </strong><br>
  6.客户使用广发卡发生的交易，均需以账户结算货币支付   ，如交易的货币为非账户结算货币，入账时交易货币与账户结算货币的清算汇率依照VISA、Mastercard国际信用卡组织及中国银联的规定办理。银行  将对持卡人在境外发生的国际交易(国际交易是指通过国际信用卡组织清算网络完成的交易)按交易金额的一定比例收取外汇交易服务费。 <br>
  7.持卡人的外币透支欠款，应以有关法律规定、国家外汇管理部门的规定及银行要求的币种偿还。对于可通过人民币购外汇还款的交易欠款，银行将在对账单上注  明，客户可选择以外币偿还，也可选择通过人民币购汇偿还，汇率按照银行当天公布的“现汇现钞卖出价”执行。 <br>
  8.客户如选择自动转账还款方式的，银行有权在到期还款日直接从客户指定还款账户扣划款项，偿还欠款。客户须在到期还款日前两天起确保还款账户备有足够的余额，否则，<strong>因余额不足导致未足额还款或自动转账不成功而产生的违约金、透支利息等费用由客户承担。 </strong><br>
  9.还款款项务必偿还至本人广发卡欠款账户内，银行不会以任何理由、任何形式指引客户将还款款项存至任何第三方单位账户或个人账户。<strong>因客户未将还款款项偿还至本人广发卡欠款账户而造成的损失，将由客户本人承担，客户应继续偿还其广发卡债务直至所有债务结清。 </strong><br>
  <strong>10.</strong><strong>客户清楚并同意按银行账单依约还款，并在出现包括但不限于交易不成功、交易退货、交易差错  等交易退款情况，按如下规则处理：（1）交易退款在当期账单日（不含）前入账的，交易退款可冲抵当期账单欠款；（2）交易退款在当期账单日（不含）后入账  的，交易退款只能冲抵下期欠款。</strong></p>
<p align="left"><strong>第十条&nbsp;  欠款催收及抵欠 </strong><br>
  <strong>1.</strong><strong>银行有权通过电话、信函、手机短信、微信、电子邮件、面访或司法渠  道等方式自行或委托第三方向客户本人及担保人直接催缴欠款，向客户提供给银行的联系人、近亲属及工作单位等要求代为转告催缴欠款事宜。在此情况下，银行有  权将必要的客户身份信息等个人金融信息及欠款账户信息提供给担保人、联系人、亲友、工作单位及其他代偿意愿人。 </strong><br>
  <strong>银行在实现债权过程中发生的所有费用均由客户承担，包括但不限于诉讼费、委托费、律师费等。 </strong><br>
  <strong>2.</strong><strong>银行有权通过新闻媒介实行公告催收，并向社会或有关方面公布具有不良行为的客户名单，有权向人民法院申请将未履行判决义务的客户纳入失信被执行人名单，由人民法院向社会公示，人民法院可将失信被执行人名单通过报纸、广播、电视、网络、法院公告栏等其他方式予以公布。 </strong><br>
  <strong>3.</strong><strong>客户授权银行可直接从客户开立的保证金账户及其它任何账户中扣划资金以清偿其广发卡欠款，银行在扣划前无需另行通知客户。</strong>如前述账户币种与欠款的广发卡账户结算币种不一致，以折抵欠款当天银行公布的汇率、或通过美元套算的间接汇率折算。 </p>
<p align="left"><strong>第十一条&nbsp;  广发卡注销 </strong><br>
  1.客户注销广发卡时须提前三十天申请，在银行确认后注销方可生效；同时，<strong>客户同意银行可根据自身经营管理、风险控制和用卡安全等需要注销其广发卡，且无须事先通知客户</strong><strong>。客户申请注销前或被强制注销时必须一次性清偿所有债务，并终止与商户签订的广发卡分期扣款协议。</strong> <br>
  2.客户在办理注销手续后，仍须清偿广发卡的所有债务，包括客户在注销前已发生、但尚未入账的交易金额等。银行对已收取的年费不再向客户退还。 <br>
  3.客户注销卡片的申请，一般自银行接受之日起第31天生效，无限卡、世界卡、白金卡、钛金卡的注销申请自银行接受之日起第76天生效。银行保留决定并更改卡片注销生效时间的权利。卡片注销生效时间如有变动，以银行最新规定为准。 <br>
  4.客户在注销卡片申请生效后，应及时到银行营业网点提取保证金及存款，办理销户手续。<strong>如客户在注销生效后五个月仍不办理销户手续的，银行将从注销生效后第六个月起按月向客户收取账户管理费，不足一个月按一个月收取，直至广发卡存款余额为零。 </strong><br>
  5.白金卡客户申请注销卡片的，应同时停止使用银行提供的所有增值服务。如客户在申请注销卡片后使用相关服务，由此而产生的费用将由客户承担。 </p>
<p align="left"><strong>第十二条&nbsp;  其它 </strong><br>
  <strong>1.</strong><strong>客户应按银行规定缴交年费，首期年费在新卡启用的当天产生，缴费周  期为一年，从客户广发卡账户中扣收且不再退还，在卡片有效期内，每年的年费将定期从前述账户中自动扣收。客户清楚年费仅指客户向银行申请信用卡业务服务，  按规定应向银行支付的款项并不是赠予积分、奖品、增值服务等的对价。客户同意不得以包括但不限于暂停或停止卡片使用、调整信用额度、注销卡片、调整或停止  增值服务、积分、奖品等优惠情况要求退回或减少年费，除非银行存在法律法规规定的过错。</strong> <br>
  2.客户如需委托他人代办业务，须出具委托书，注明具体的委托事项和权限，由受托人携带客户及受托人身份证原件和该委托书办理。客户在委托书上的签名须与预留的签名式样一致。银行保留要求部分业务必须由客户本人办理的权利。 <br>
  3.银行向广发卡主卡客户发出有关通知，视同已同时通知附属卡客户。主卡客户有义务将银行通知知会其附属卡客户。 <br>
  4.对某些交易因习惯或特殊性质，而无需或无法进行签名的，如邮购、网上购物和未及时列入账单的酒店消费等，交易过程中所产生的信息记录（包括但不限于邮  件、电话、手机、短信、传真、互联网记录）之一或全部均属该项交易的有效凭证，客户不得以单据上无签名或无交易单据为由拒绝付款，相关交易情况以商户提供  的电子交易信息为准。对于因真实交易产生的商户补扣款，客户不得以没有签单或者授权扣款为由拒绝付款。 <br>
  5.银行为客户提供热线电话服务。为向客户提供更好的服务及控制风险，银行将对银行与客户的通话进行录音。 <br>
  6.银行可根据客户的申请及资信状况，要求客户提供一定的担保。担保范围为客户在其信用卡项下发生的全部债务（包括但不限于信用额度内透支及超信用额度透  支的本金、利息和费用、违约金）。担保期间应超过信用卡有效期到期日后30天。客户信用卡有效期期满继续使用的，应该办理担保相应的转期、续保手续。银行  对担保财产享有优先受偿权。 <br>
  提供担保的，双方需另行签订担保合同，办理保证金交存、存单质押等手续。上述文件与本协议具有同等法律效力。 <br>
  7.受中国银联等银行卡组织卡片标准规范限制（刻印名长度仅支持19位字符，含空格），如因客户姓名长度过长，卡面无法支持印刷完整信息的，银行则有权根据中国银联等银行卡组织的标准规范，按姓名规则的字符顺序保留前19位字符。 </p>
<p align="left"><strong>第十三条&nbsp;  本协议效力及争议解决 </strong><br>
  1.本协议自客户或其代理人签署并交还银行之日起生效。申请资料、《广发银行信用卡章程》、《广发卡费率》、《广发信用卡用卡安全须知》、《广发卡用户指  南》作为本协议的附件，与本协议具有同等法律效力。附件与本协议约定不一致时，公布在后的条款具有优先效力。 <br>
  2.<strong>银行某些品种的信用卡、优惠计划和服务受各自特定条款的约束，相应协议条款及内容均已在</strong><strong>银行网站公告，</strong><strong>客户已仔细阅读、充分了解清楚知晓并接受全部条款和内容，这些条款若与本协议条款有任何抵触，以该特定条款为准客户充分了解清楚知晓并接受相应服务的</strong><strong>利率、年费、手续费、违约金除有特别约定外，按照本协议约定执行。</strong> <br>
  <strong>3.</strong><strong>根据国家政策要求或银行经营管理和风险控制等需要，银行有权对本协议及附件作出修改，包括但  不限于对利率、年费、手续费、违约金、免息还款等的调整。银行将提前至少四十五日，通过银行网站、网点公告等方式对修改的内容进行公布，客户如不能接受修  改后的协议，可以申请注销卡片。 </strong><br>
  4.本协议适用中华人民共和国法律法规、有关监管部门的规范性文件。未尽事宜依据行业惯例和银行业务规定办理。有关本协议的一切争议，由双方协商解决，不愿协商或协商不成的，由银行所在地人民法院管辖。 <br>
  <strong>5.</strong><strong>手机短信、电子邮件、微信信息等作为银行向客户告知安全、交易账单和宣传活动等信息的重要途径，为保护客户权益，为更好向客户提供信用卡服务、金融服务及增值服务（包括但不限于推荐产品），客户同意以其提供的包括但不限于</strong><strong>固定电话、手机号码、电子邮件或微信账号等通讯方式</strong><strong>接收银行及其分支机构、下属公司，银行的业务合作伙伴及委托处理事务之第三方发送的产品或服务等信息、电子邮件及电话。银行已按客户提供的手机号码、邮箱地址、微信号码发送手机短信、电子邮件、微信信息，即视为已送达客户本人。 </strong><br>
  <strong>客户申请以其提供的手机号码、邮箱地址、微信帐号等通讯方式与银行进行业务操作。客户以其提供的手机号码、邮箱地址、微信帐号等通讯  方式进行的相关业务操作，银行均视为客户本人合法有效的业务指令，并视为已授权进行相关业务操作，客户对该操作引起的所有结果承担一切责任。 </strong><br>
  <strong>如客户不同意接受银行及其分支机构或与银行签约的业务合作伙伴及委托处理事务之第三方发送的上述信息，可随时以书面形式通知银行，银行在收到通知后，在银行规定的时限内，将停止向客户提供相应的产品及服务，客户因而将无法享受银行提供的相应优惠及增值服务。 </strong><br>
  <strong>6.</strong><strong>客户同意银行在任何时间将本人广发卡账户所有归属于银行的债权全部或部分转让与包括但不限于  资产管理机构的任何第三方，客户同意银行无需另行获得客户同意或另行通知，客户债权转让自银行作出转让之日起生效。如客户不同意银行转让债权，可随时以书  面形式通知银行，银行在收到通知后，在银行规定的时限内，银行将停止转让该日期后的债权。 </strong><br>
  7.本协议由银行负责制定、修改和解释。银行保留根据国家法律和规定修改本协议的权利。银行将提前公告或通知（银行可根据业务实际情况选择通过包括但不限  于营业网点公告、银行网站公告、对账单告知、官方微信公告、手机银行公告、网上银行公告、电子银行公告、短信通知、报刊公告或语音电话等一种或多种方式）  通知客户下述变更事项：本协议或作为本协议组成部分的《广发银行信用卡章程》的修改、信用卡费率表中收费项目或标准的变化、信用卡有关利率的调整、卡片名  称的变化等，该等变更自公告中载明的生效日期开始生效。客户可以选择是否继续使用信用卡，客户如对变更内容有异议而决定不继续使用信用卡，可按照规定办理  销户手续。客户未办理销户手续的，视为同意变更内容。修改后的条款对所有当事人具有同等约束力。 <br>
  <strong>8.</strong><strong>客户确认已全部阅读并理解、接受本协议及在银行网站上公布的协议附件的所有内容，包括在银行合理提请下已注意其中免除或限制银行责任的条款，未明了之处也已向银行要求解释并已得到满意答复。 </strong></p>
<p align="left"><strong>注： </strong><br>
  <strong>1.</strong><strong>透支消费利息及预借现金利息分别计收最低收取限额，标准为RMB1/USD1。 </strong><br>
  <strong>2.</strong><strong>违约金将按客户每期账单最低还款额未还清部分的5%收取；如客户连  续2个月（含）以上未按时还清每期账单最低还款额，则按客户账单最低还款额未还清部分6%收取违约金；客户不存在连续2个月（含）以上未按时还清每期账单  最低还款额的，恢复按最低还款额未还清部分5%收取违约金。同时违约金最低收取限额为：个人单币卡(含公务卡)最低RMB30/USD5/HKD40，个  人双币卡最低RMB30/USD2，单位卡最低RMB10/USD1，银行可根据客户综合情况适当下调违约金最低收取限额。 </strong><br>
  <strong>3.</strong><strong>客户的透支利率、违约金标准率由银行根据客户综合表现确定，在客户  持有的信用卡片有效期内，银行有权依据客户风险情况不定期调整，其中透支利率调整上限为日利率万分之五，透支利率下限为日利率万分之五的0.7倍，具体以  银行通知为准。发生变动时银行可将通过官方客户端发现精彩、官方微信、短信、账单等多种或一种方式通知客户，客户可从以上渠道查询。 </strong></p>
<p>&nbsp;</p><strong></strong>`
    }
  },
  methods: {
    gobackp() {
      this.isInit = true
      this.isRead = false
      this.isChoice = false
    },
    toSelect(which) {
      if (which === 'yes') {
        this.isInit = false
      } else {
        this.isInit = true
        this.showMask = true
      }
    },
    hasRead() {
      let that = this
      this.isChoice = true
      setTimeout(function () {
        that.isRead = true
      }, 1000)
    },
    handleConfirm() {
      if (!this.icbc.userName) {
        $Toast({
          type: 'warning',
          duration: 4,
          content: '请输入开户名称!'
        })
        return false
      }
      if (!this.icbc.cardNumber) {
        $Toast({
          type: 'warning',
          duration: 4,
          content: '请输入卡号!'
        })
        return false
      }
      if (this.icbc.cardNumber.substr(0, 2) !== '62') {
        $Toast({
          type: 'warning',
          duration: 4,
          content: '请输入正确的银联卡卡号1!'
        })
        return false
      }
      console.log('长度: ' + this.icbc.cardNumber.length)
      if (this.icbc.cardNumber.length === 16 || this.icbc.cardNumber.length === 19) {
        $Toast({
          type: 'success',
          duration: 4,
          content: '提交有卡用户数据!'
        })
        wx.switchTab({
          url: '../../index/main'
        })
      } else {
        $Toast({
          type: 'warning',
          duration: 4,
          content: '请输入正确的银联卡卡号2!'
        })
        return false
      }
    },
    clickConfirm() {
      let lUrl = ''
      this.showMask = false
      if (this.applyId) {
        lUrl = `https://www.gsunis.cn?applyId=${this.applyId}`
        console.log('跳转H5: ' + lUrl)
        wx.navigateTo({
          url: `../issueCredit/main?links=${lUrl}`
        })
      } else {
        $Toast({
          type: 'warning',
          duration: 4,
          content: '初始化银行跳转失败!'
        })
      }
    }
  },
  mounted () {
    this.applyId = this.$root.$mp.query.applyId || ''
    this.article = global.icbc
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
  .ipick
    width 100%
    height 100vh
    background-color #888888
    display flex
    flex-flow row nowrap
    justify-content center
    align-items center
    .ipcenter
      width 70%
      height 150px
      background-color white-color
      display flex
      flex-flow column nowrap
      justify-content center
      align-items center
      border-radius 5px
      .ipcsplice
        width 100%
        height 1px
        background-color bg-color
      .ipctitle
        width 100%
        height 40px
        display flex
        flex-flow row nowrap
        justify-content center
        align-items center
        font-size 15px
        color main-font
        background-color bg-color
        border-radius 5px
      .ipcitem
        width 95%
        height 55px
        display flex
        flex-flow row nowrap
        justify-content center
        align-items center
        background-color white-color
        .ipcileft
          width 35%
          height 100%
          display flex
          flex-flow row nowrap
          justify-content flex-end
          align-items center
          .ipcicon
            width 40px
            height 40px
            line-height 100%
            font-size 32px
            color #c6000b
            display flex
            flex-flow row nowrap
            justify-content center
            align-items center
          .ipcimg
            width 40px
            height 40px
            display flex
            flex-flow row nowrap
            justify-content center
            align-items center
        .ipciright
          width 65%
          height 100%
          display flex
          flex-flow row nowrap
          justify-content flex-start
          align-items center
          .ipcititle
            width 100%
            height 100%
            font-size 15px
            color main-font
            display flex
            flex-flow row nowrap
            justify-content flex-start
            align-items center
  .iprotocl
    width 100%
    flex 1
    display flex
    flex-flow column nowrap
    justify-content flex-start
    align-items center
    position relative
    .ipback
      width 60px
      height 60px
      display flex
      flex-flow row nowrap
      justify-content flex-start
      align-items center
      position fixed
      border-radius 30px
      background-color #cdcdcd
      z-index 99
      top 5px
      right 5px
      .ipbicon
        line-height 100%
        font-size 15px
        color main-color
        transform rotate(180deg)
        margin-left 5px
      .ipbtitle
        width 80%
        height 100%
        display flex
        flex-flow row nowrap
        justify-content flex-start
        align-items center
        font-size 15px
        color main-color
        text-indent 5px
    .iptmp
      width 100%
      flex 1
      display flex
      flex-flow column nowrap
      justify-content flex-start
      align-items center
      position relative
      .ipcontent
        width 100%
        flex 1
        display flex
        flex-flow row nowrap
        justify-content center
        align-items center
        background-color white-color
        margin-bottom 50px
        .ipcc
          width 95%
          display flex
          flex-flow row nowrap
          justify-content center
          align-items center
          font-size 15px
          color main-font
      .ipmark
        width 100%
        height 50px
        display flex
        flex-flow row nowrap
        justify-content center
        align-items center
        position fixed
        bottom 0
        left 0
        background-color white-color
        .ipmicon
          line-height 100%
          font-size 20px
          color main-color
          display flex
          flex-flow row nowrap
          justify-content center
          align-items center
        .ipmtitle
          width 60%
          height 100%
          font-size 13px
          color main-font
          text-indent 5px
          display flex
          flex-flow row nowrap
          justify-content flex-start
          align-items center
    .ipdeal
      width 100%
      height 100%
      display flex
      flex-flow column nowrap
      justify-content flex-start
      align-items center
      background-color bg-color
      .ipditem
        width 100%
        height 60px
        display flex
        flex-flow row nowrap
        justify-content space-around
        align-items center
        background-color white-color
        border-bottom 1px bg-color solid
        .ipdimm
          width 100%
          height 50%
          font-size 13px
          color #c6000b
        .ipdtitle
          width 25%
          height 100%
          display flex
          flex-flow row nowrap
          justify-content center
          align-items center
          font-size 15px
          color title-font
        .ipdname
          width 75%
          height 100%
          display flex
          flex-flow row nowrap
          justify-content flex-start
          align-items center
          font-size 15px
          color sub-font
          .ninput
            width 100%
            height 100%
      .ipdimark
        width 100%
        height 40px
        display flex
        flex-flow column nowrap
        justify-content center
        align-items center
        margin-top 5px
        .ipdimm
          width 100%
          height 50%
          font-size 13px
          color #c6000b
          display flex
          flex-flow row nowrap
          justify-content flex-start
          align-items center
          text-indent 10px
      .ipdbtn
        width 90%
        height 45px
        display flex
        flex-flow row nowrap
        justify-content center
        align-items center
        margin-top 20px
        .ipdbutton
          width 100%
          height 100%
          display flex
          flex-flow row nowrap
          justify-content center
          align-items center
          background-color #c6000b
          font-size 15px
          color white-color
</style>

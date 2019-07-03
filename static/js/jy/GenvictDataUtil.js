const DATA_LENGTH = (95 * 2)
const NORMAL_DATA_LENGTH = (13 * 2)
const FRAME_LENGTH = (20 * 2)
const ProtocolType = 'genvict'
var x = 3
var y = 1

function protocolType () {
  return ProtocolType
}

function numberToHexString (z, A, B) {
  let hex = z.toString(16)
  for (let i = hex.length; i < A * 2; i++) {
    hex = '0' + hex
  }
  if (hex.length > A * 2) {
    hex = hex.substring(hex.length - A * 2)
  }
  if (!B) {
    let temp = ''
    for (let i = hex.length - 2; i >= 0; i -= 2) {
      temp = temp + hex.substring(i, i + 2)
    };
    hex = temp
  }
  return hex
}

function makeAuthResponse () {
  let send = 'FE0100124E2100010A06080012024F4B1200'
  let bufferArray = []
  let bufferStr = send.substring(0, 36)
  let typedArray = new Uint8Array(bufferStr.match(/[\da-f]{2}/gi).map(function (z) {
    return parseInt(z, 16)
  }))
  bufferArray.push(typedArray.buffer)
  return bufferArray
};

function makeInitResponse () {
  let send = 'FE0100164E2300020A06080012024F4B100018002000'
  let bufferArray = []
  let bufferStr = send.substring(0, FRAME_LENGTH)
  let typedArray = new Uint8Array(bufferStr.match(/[\da-f]{2}/gi).map(function (z) {
    return parseInt(z, 16)
  }))
  bufferArray.push(typedArray.buffer)
  bufferStr = send.substring(40)
  typedArray = new Uint8Array(bufferStr.match(/[\da-f]{2}/gi).map(function (z) {
    return parseInt(z, 16)
  }))
  bufferArray.push(typedArray.buffer)
  return bufferArray
}

function makeFrame (z) {
  let send = '' + z
  let u = parseInt(send.length / DATA_LENGTH)
  let frameBalance = send.length % DATA_LENGTH
  let t = []
  for (let i = 0; i < u; i++) {
    t.push(send.substring(i * DATA_LENGTH, i * DATA_LENGTH + DATA_LENGTH))
  }
  if (frameBalance > 0) {
    t.push(send.substring(send.length - frameBalance))
  }
  let bufferArray = []
  let frame
  y++
  if (y > 0xf) {
    y = 1
  };
  for (let i = 0; i < t.length; i++) {
    let ctl = ''
    if (protocolType() === 'xinguobiao') {
      if (i === 0) {
        ctl = numberToHexString(0x8000 + t.length, 2, true)
      } else {
        ctl = numberToHexString(i + 1, 2, true)
      }
      frame = xinGuoBiaoPackData(t[i], ctl)
    } else if (protocolType() === 'genvict') {
      if (i === 0) {
        ctl = numberToHexString(0x80 + t.length - 1, 1, true)
      } else {
        ctl = numberToHexString(t.length - i - 1, 1, true)
      }
      frame = GVPackData(t[i], ctl)
    }
    frame = wechatPackData(frame)
    let bufferCount = parseInt(frame.length / FRAME_LENGTH)
    let bufferBalance = frame.length % FRAME_LENGTH
    for (let j = 0; j < bufferCount; j++) {
      let bufferStr = frame.substring(j * FRAME_LENGTH, j * FRAME_LENGTH + FRAME_LENGTH)
      let typedArray = new Uint8Array(bufferStr.match(/[\da-f]{2}/gi).map(function (A) {
        return parseInt(A, 16)
      }))
      bufferArray.push(typedArray.buffer)
    };
    if (bufferBalance > 0) {
      let bufferStr = frame.substring(frame.length - bufferBalance)
      let typedArray = new Uint8Array(bufferStr.match(/[\da-f]{2}/gi).map(function (A) {
        return parseInt(A, 16)
      }))
      bufferArray.push(typedArray.buffer)
    }
  };
  return bufferArray
}

function makeNormalCMD (z) {
  y++
  if (y > 0xf) {
    y = 1
  };
  let bufferArray = []
  let frameNum = numberToHexString(0x80 + y, 1, true)
  let frame = normalPackData('', frameNum, '00', z)
  let typedArray = new Uint8Array(frame.match(/[\da-f]{2}/gi).map(function (A) {
    return parseInt(A, 16)
  }))
  bufferArray.push(typedArray.buffer)
  return bufferArray
}

function makeNormalFrame (z, A) {
  let send = '' + A
  let u = parseInt(send.length / NORMAL_DATA_LENGTH)
  let frameBalance = send.length % NORMAL_DATA_LENGTH
  let t = []
  for (let i = 0; i < u; i++) {
    t.push(send.substring(i * NORMAL_DATA_LENGTH, i * NORMAL_DATA_LENGTH + NORMAL_DATA_LENGTH))
  }
  if (frameBalance > 0) {
    t.push(send.substring(send.length - frameBalance))
  };
  let bufferArray = []
  let frame
  y++
  if (y > 0xf) {
    y = 1
  };
  for (let i = 0; i < t.length; i++) {
    let frameNum = ''
    let sequNum = numberToHexString(t.length - i - 1, 1, true)
    if (i === 0) {
      frameNum = numberToHexString(0x80 + y, 1, true)
    } else {
      frameNum = numberToHexString(y, 1, true)
    };
    frame = normalPackData(t[i], frameNum, sequNum, z)
    let typedArray = new Uint8Array(frame.match(/[\da-f]{2}/gi).map(function (B) {
      return parseInt(B, 16)
    }))
    bufferArray.push(typedArray.buffer)
  }
  return bufferArray
}

function initDeviceSendData () {
  let send
  if (protocolType() === 'xinguobiao') {
    send = '80'
  } else if (protocolType() === 'genvict') {
    send = 'A2'
  } else if (protocolType() === 'normal') {
    send = '000D0074043000'
    return makeNormalFrame('01', send)
  }
  return makeFrame(send)
}

function makeDeviceChannelSendData (z) {
  let order = '' + z
  let send
  if (protocolType() === 'xinguobiao') {
    send = '81' + numberToHexString(order.length / 2, 2, false) + order
  } else if (protocolType() === 'genvict') {
    send = 'A5' + numberToHexString(order.length / 2, 1, false) + order
  } else if (protocolType() === 'normal') {
    return makeNormalCMD(z)
  }
  return makeFrame(send)
}

function makeAuthenChannelSendData (z, A) {
  let order = z + A
  let send
  if (protocolType() === 'genvict') {
    send = 'A6' + numberToHexString(order.length / 2, 2, false) + order
  }
  return makeFrame(send)
}

function makecosSendData (z, A) {
  if (protocolType() === 'normal') {
    let send = customPackData(A)
    return makeNormalFrame('03', send)
  }
  let order
  if (parseInt(z.substring(1, 2), 10) === 0) {
    order = '80' + tlvPackData(A)
  } else {
    order = A[0]
  }
  let send
  if (protocolType() === 'xinguobiao') {
    send = '82' + z + numberToHexString(order.length / 2, 2, false) + order
    return makeFrame(send)
  } else if (protocolType() === 'genvict') {
    send = 'A3' + z + numberToHexString(order.length / 2, 2, false) + order
    return makeFrame(send)
  }
}

function makeResetCard () {
  let order = '0200'
  if (protocolType() === 'normal') {
    return makeNormalFrame('07', order)
  }
}

function maketransSendData (z, A) {
  let order
  order = A
  let send
  if (protocolType() === 'xinguobiao') {
    send = '82' + z + numberToHexString(order.length / 2, 2, false) + order
  } else if (protocolType() === 'genvict') {
    send = 'A3' + z + numberToHexString(order.length / 2, 2, false) + order
  }
  return makeFrame(send)
}

function makeGVEsamSendData (z, A) {
  if (protocolType() === 'normal') {
    let send = customPackData(A)
    return makeNormalFrame('02', send)
  }
  let order
  if (parseInt(z.substring(1, 2), 10) === 0) {
    order = '80' + tlvPackData(A)
  } else {
    order = A[0]
  };
  let send
  if (protocolType() === 'xinguobiao') {} else if (protocolType() === 'genvict') {
    send = 'A1' + z + numberToHexString(order.length / 2, 2, false) + order
  }
  return makeFrame(send)
}

function makeGVtransEsamSendData (z, A) {
  let order
  order = A
  let send
  if (protocolType() === 'xinguobiao') {} else if (protocolType() === 'genvict') {
    send = 'A1' + z + numberToHexString(order.length / 2, 2, false) + order
  }
  return makeFrame(send)
}

function makeSelfDeviceChannelSendData (z) {
  let order = '' + z
  let send
  if (protocolType() === 'xinguobiao') {} else if (protocolType() === 'genvict') {
    send = 'AE' + numberToHexString(order.length / 2, 1, false) + order
  }
  return makeFrame(send)
}

function makeAuthenSendData (z) {
  let order = '' + z
  let send = '84' + numberToHexString(order.length / 2, 2, false) + order
  return makeFrame(send)
}

function makeDeviceAuthenSendData (z, A) {
  let order = 'C1' + z + A
  let send = 'AD' + numberToHexString(order.length / 2, 2, false) + order
  return makeFrame(send)
}

function makeTransA1reqData (z) {
  let send = 'A6' + numberToHexString(z.length / 2 + 1, 2, false) + 'C9' + z
  return makeFrame(send)
}

function makeLoadCreditT0reqData (z) {
  let str = '01' + numberToHexString(z.length / 2, 1, false) + z
  let send = 'A6' + numberToHexString(str.length / 2 + 1, 2, false) + 'C8' + str
  return makeFrame(send)
}

function tlvPackData (z) {
  let content = ''
  for (let i = 0; i < z.length; i++) {
    content = content + numberToHexString(i + 1, 1, false) + numberToHexString(z[i].length / 2, 1, false) + z[i]
  }
  let contentLen = content.length / 2
  let tlvData = ''
  if (contentLen >= 0x100) {
    tlvData = '82' + numberToHexString(contentLen, 2, false) + content
  } else if (contentLen > 0x80) {
    tlvData = '81' + numberToHexString(contentLen, 1, false) + content
  } else {
    tlvData = numberToHexString(contentLen, 1, false) + content
  }
  return tlvData
}

function customPackData (z) {
  let content = ''
  for (let i = 0; i < z.length; i++) {
    content = content + numberToHexString(z[i].length / 2, 1, true) + z[i]
  }
  let tlvData = numberToHexString(z.length, 1, true) + content
  return tlvData
}

function wechatPackData (z) {
  z = '0A0012' + numberToHexString(z.length / 2, 1, true) + z + '1800'
  let bMagic = 'FE'
  let bVer = '01'
  let nLength = numberToHexString(z.length / 2 + 8, 2, true)
  let nCmdId = '7531'
  let nSeq = numberToHexString(x, 2, true)
  z = bMagic + bVer + nLength + nCmdId + nSeq + z
  x++
  if (x > 0xf) {
    x = 1
  }
  return z
}

function xinGuoBiaoPackData (z, A) {
  let st = '50'
  let temp = '' + z
  let len = numberToHexString(temp.length / 2, 1, true)
  let frame = st + A + len + temp
  let bcc = 0
  for (let j = 0; j < frame.length / 2; j++) {
    let bit = parseInt(frame.substring(j * 2, j * 2 + 2), 16)
    bcc = bcc ^ bit
  }
  frame = frame + numberToHexString(bcc, 1, true)
  return frame
}

function GVPackData (z, A) {
  let st = '33'
  let sn = numberToHexString(y, 1, true)
  let temp = '' + z
  let len = numberToHexString(temp.length / 2, 1, true)
  let frame = st + sn + A + len + temp
  let bcc = 0
  for (let j = 1; j < frame.length / 2; j++) {
    let bit = parseInt(frame.substring(j * 2, j * 2 + 2), 16)
    bcc = bcc ^ bit
  }
  frame = frame + numberToHexString(bcc, 1, true)
  return frame
}

function normalPackData (z, A, B, C) {
  let st = '33'
  let temp = '' + z
  let len = numberToHexString(temp.length / 2, 1, true)
  let frame = st + A + C + B + len + temp
  let bcc = 0
  for (let j = 0; j < frame.length / 2; j++) {
    let bit = parseInt(frame.substring(j * 2, j * 2 + 2), 16)
    bcc = bcc ^ bit
  };
  frame = frame + numberToHexString(bcc, 1, true)
  return frame
}
module.exports = {
  makeAuthResponse: makeAuthResponse,
  makeInitResponse: makeInitResponse,
  initDeviceSendData: initDeviceSendData,
  makeSelfDeviceChannelSendData: makeSelfDeviceChannelSendData,
  makeDeviceChannelSendData: makeDeviceChannelSendData,
  makeFrame: makeFrame,
  makecosSendData: makecosSendData,
  makeAuthenSendData: makeAuthenSendData,
  numberToHexString: numberToHexString,
  protocolType: protocolType,
  makeDeviceAuthenSendData: makeDeviceAuthenSendData,
  makeGVEsamSendData: makeGVEsamSendData,
  makeGVtransEsamSendData: makeGVtransEsamSendData,
  maketransSendData: maketransSendData,
  makeResetCard: makeResetCard,
  makeAuthenChannelSendData: makeAuthenChannelSendData,
  makeTransA1reqData: makeTransA1reqData,
  makeLoadCreditT0reqData: makeLoadCreditT0reqData
}

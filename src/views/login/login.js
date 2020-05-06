import { checkSpecialKey } from '../../assets/js/util'

export function checkUserName (rule, value, callback) {
  if (value.trim().length === 0) {
    callback(new Error('请输入用户名'))
  } else if (!checkSpecialKey(value.trim())) {
    callback(new Error('用户名不合法，请重新输入'))
  } else {
    callback()
  }
}

export function checkPassword (rule, value, callback) {
  if (value.trim().length < 8) {
    callback(new Error('密码错误'))
  } else {
    callback()
  }
}

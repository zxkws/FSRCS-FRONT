import { checkSpecialKey } from '../../assets/js/util'

export function validateNickName (rule, value, callback) {
  if (value.trim().length === 0) {
    callback()
  } else if (!checkSpecialKey(value.trim())) {
    callback(new Error('您输入的用户名包含非法字符'))
  } else {
    callback()
  }
}

export function validateNickPassword (rule, value, callback) {
  if (value.trim().length < 8 && value.trim().length > 0) {
    callback(new Error('密码至少8位'))
  } else {
    callback()
  }
}

export function handleParam (data) {
  return {
    userId: data.userId,
    userFlag: '医师'
  }
}

export function handleCancelParam (data) {
  return {
    userId: data.userId,
    userFlag: '用户'
  }
}

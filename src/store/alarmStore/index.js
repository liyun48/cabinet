import service from '@/utils/request'

export default {
  // 初始状态
  state: {
    // 报警列表
    alarmList: [],
    // 报警信息总数
    alarmTotal: 0
  },
  // 获取器
  getters: {
    alarmList: state => state.alarmList,
    alarmTotal: state => state.alarmTotal
  },
  // 突变
  mutations: {
    changeAlarmList(state, data) {
      state.alarmList = data.result
      state.alarmTotal = data.count
      // console.log(state,'---')
      // console.log(data,'===')
    }
  },
  // 动作
  actions: {
    // 报警统计
    alarmStatistics() {
      return new Promise((resolve, reject) => {
        service.get('/api_alarm/get_alarm_statistics/')
          .then(({ data }) => {
            resolve(data)
          })
          .catch((err) => {
            reject(err)
          })
      })
    },
    // 审核报警
    checkAlarm(context, obj) {
      return new Promise((resolve, reject) => {
        service.post('/api_alarm/audit_alarm/', obj)
          .then((res) => {
            resolve(res)
          })
          .catch((err) => {
            reject(err)
          })
      })
    },
    // 处理报警
    dealAlarm(context, obj) {
      return new Promise((resolve, reject) => {
        service.post('/api_alarm/process_alarm/', obj)
          .then((res) => {
            resolve(res)
          })
          .catch((err) => {
            reject(err)
          })
      })
    },
    // 获取报警列表
    findAlarmList(context, params) {
      return new Promise((resolve, reject) => {
        service.get('/api_alarm/get_alarm_list/', { params: params })
          .then(({ data }) => {
            context.commit('changeAlarmList', data)
            resolve(data)
          })
          .catch((err) => {
            reject(err)
          })
      })
    },
    // 获取报警状态
    findAlarmStatus(context) {
      return new Promise((resolve, reject) => {
        service.get('/api_alarm/get_alarm_status/')
          .then(({ data }) => {
            resolve(data)
          })
          .catch((err) => {
            reject(err)
          })
      })
    }
  }
}

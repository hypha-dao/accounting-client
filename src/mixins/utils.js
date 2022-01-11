import { mapMutations } from 'vuex'
export const utils = {
  methods: {
    ...mapMutations('general', ['setErrorMsg', 'setSuccessMsg', 'setIsLoading']),
    copyToClipboard (str) {
      const el = document.createElement('textarea')
      el.value = str
      el.setAttribute('readonly', '')
      el.style.position = 'absolute'
      el.style.left = '-9999px'
      document.body.appendChild(el)
      const selected =
        document.getSelection().rangeCount > 0
          ? document.getSelection().getRangeAt(0)
          : false
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
      if (selected) {
        document.getSelection().removeAllRanges()
        document.getSelection().addRange(selected)
      }
    },
    showNotification (message, type = 'success') {
      const color = type.toLowerCase() === 'success' ? 'green' : 'red'
      const icon = type.toLowerCase() === 'success' ? 'done' : 'error'
      this.$q.notify({
        color: color,
        textColor: 'white',
        message: message,
        icon: icon,
        timeout: 5000,
        actions: [{ label: 'Close', color: 'white' }]
      })
    },
    showSuccessMsg (message) {
      this.setSuccessMsg(message)
    },
    showErrorMsg (message) {
      this.setErrorMsg(message)
    },
    showIsLoading (state) {
      this.setIsLoading(state)
    },
    dateToString (_date) {
      if (!_date) return _date
      var date = new Date(_date.replace(/ /g, 'T'))
      return (date.getDate() + 1) + ' ' + [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul',
        'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
      ][date.getMonth()] + ' ' + date.getFullYear()
    },
    formatAmount (number, precision = 2) {
      return Number(number).toLocaleString('en-US', { style: 'decimal', minimumFractionDigits: precision, maximumFractionDigits: precision })
    }
  }
}

/**
 * localStorage encapsulation
 */

export default {
  /**
   * storage set
   * @param key {string} parameter name
   * @param value {any} parameter value
   */
  set(key: string, value: unknown) {
    localStorage.setItem(key, JSON.stringify(value))
  },
  /**
   * storage get
   * @param key {string} parameter name
   * @returns storage value
   */
  get(key: string) {
    const value = localStorage.getItem(key)
    if (!value) return ''
    try {
      return JSON.parse(value)
    } catch (error) {
      return value
    }
  },
  /**
   * remove localStorage value
   * @param key {string} parameter name
   */
  remove(key: string) {
    localStorage.removeItem(key)
  },
  /**
   * clear localStorage value
   */
  clear() {
    localStorage.clear()
  }
}

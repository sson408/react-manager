type ENV = 'dev' | 'stg' | 'prd'

const env = (document.documentElement.dataset.env as ENV) || 'stg'

// const config = {
//   apiBaseUrl: 'https://localhost:44365/api'
// }

// export default config

const config = {
  dev: {
    apiBaseUrl: 'https://localhost:44365/api'
  },
  prd: {
    apiBaseUrl: '../api'
  }
}

export default {
  env,
  ...config['dev']
}

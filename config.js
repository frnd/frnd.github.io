var config = {
  production: {
    baseUrl: process.env.BASE_URL || '', // '' for relative links
    site: {
      url: process.env.SITE_URL || 'http://frnd.github.io', // full site url
      title: 'frnd',
      comments: true,
      disqus: process.env.DISQUS || 'frnd.github.io',
      googleAnalytics: process.env.GOOGLE_ANALYTICS || '123457'
    }
  },
  development: {
    baseUrl: process.env.DEV_BASE_URL || '', // '' for relative links
    site: {
      url: process.env.DEV_SITE_URL || 'http://localhost:8000', // full site url
      title: 'frnd',
      comments: true,
      disqus: process.env.DEV_DISQUS || 'staging-example',
      googleAnalytics: process.env.DEV_GOOGLE_ANALYTICS || '123456'
    }
  },
  social: {
    github_username: 'frnd',
    stackoverflow_id: '',
    twitter_username: '',
    google_plus_id: '',
    email: '',
    linkedin_username: 'fgonzalez',
    angellist_username: '',
    bitcoin_url: '',
    paypal_url: '',
    flattr_button: ''
  },
  ghPages: {
    remoteUrl: null,
    origin: 'origin',
    branch: 'gh-pages',
    cacheDir: '.publish',
    push: true,
    force: false,
    message: null
  }
};

module.exports = config;

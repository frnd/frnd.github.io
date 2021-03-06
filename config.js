var config = {
  production: {
    baseUrl: process.env.BASE_URL || '', // '' for relative links
    site: {
      url: process.env.SITE_URL || 'http://frnd.github.io', // full site url
      title: 'frnd',
      author: 'Fernando González',
      comments: false,
      disqus: process.env.DISQUS || 'frnd.github.io',
      googleAnalytics: process.env.GOOGLE_ANALYTICS || 'UA-68223149-1'
    }
  },
  development: {
    baseUrl: process.env.DEV_BASE_URL || '', // '' for relative links
    site: {
      url: process.env.DEV_SITE_URL || 'http://localhost:8000', // full site url
      title: 'frnd',
      author: 'Fernando González',
      comments: false,
      disqus: process.env.DEV_DISQUS || 'staging-example',
      googleAnalytics: process.env.DEV_GOOGLE_ANALYTICS || '12345678'
    }
  },
  social: {
    github_username: 'frnd',
    stackoverflow_id: '',
    twitter_username: 'frndgn',
    google_plus_id: '',
    email: '',
    linkedin_username: 'fgonzalez',
    angellist_username: '',
    bitcoin_url: '',
    paypal_url: '',
    flattr_button: ''
  },
  ghPages: {
    origin: 'origin',
    branch: 'master',
  }
};

module.exports = config;

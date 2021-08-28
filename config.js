const GITHUB_OAUTH_URL = 'https://github.com/login/oauth/authorize'
const SCOPE = 'user,repo'

const client_id = ''

module.exports = {
    github: {
        request_token_url: 'https://github.com/login/oauth/access_token',
        client_id,
        client_secret: '',
    },
    GITHUB_OAUTH_URL,
    OAUTH_URL: `${GITHUB_OAUTH_URL}?client_id=${client_id}&scope=${SCOPE}`
}
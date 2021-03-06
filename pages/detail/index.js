import dynamic from 'next/dynamic'
import withRepoBasic from "../../components/with-repo-basic"
import api from '../../lib/api'

const MDRenderer = dynamic(
    () => import('../../components/MarkdownRender'),
    {
        loading: () => <p>Loading</p>
    }
)
function Detail ({ readme }) {
    const githubAuth = null;
    return <MDRenderer content={readme.content} isBase64={true} />
}

Detail.getInitialProps = async ({ ctx: { query: { owner, name }, req, res }}) => {
    if(githubAuth === 'undefined') {
        this.setState({})
    }
    const readmeResp = await api.request({
        url: `/repos/${owner}/${name}/readme`
    }, req, res)

    return {
        readme: readmeResp.data
    }
}

export default withRepoBasic(Detail, 'index')

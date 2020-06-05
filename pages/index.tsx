import { GetServerSideProps } from 'next'

function IndexPage({ data }) {
  return <div>{data} </div>
}

export default IndexPage

export const getServerSideProps: GetServerSideProps = async (context) => {
  // Fetch data from external API
  const data = await Promise.resolve('lol')
  // Pass data to the page via props
  return { props: { data } }
}


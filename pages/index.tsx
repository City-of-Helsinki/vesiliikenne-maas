import { GetServerSideProps, NextPage } from 'next'

interface IndexPageProperties {
  uuidAsData?: string;
}

const IndexPage: NextPage<IndexPageProperties> = ({ uuidAsData }) =>
  <div>{uuidAsData}</div>

export default IndexPage

export const getServerSideProps: GetServerSideProps = async (context) => {
  const theVal = await Promise.resolve('to be uuid as data')
  return { props: { arvo: theVal } }
}


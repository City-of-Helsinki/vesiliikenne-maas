import { NextPage, GetServerSideProps } from 'next'
import * as React from 'react'
import NextError from 'next/error'
import axios from 'axios'
import ApiKeyField from '../../../components/ApiKeyField'

interface props {
  NODE_ENV: string
}


const DemoIndex: NextPage<props> = ({ NODE_ENV }) => {
  const [tokenValue, setTokenValue] = React.useState('')

  if (NODE_ENV !== 'development') {
    return <NextError statusCode={404} />
  }

  return (
    <div>Welcome</div>
  )
}

export default DemoIndex

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: {
      NODE_ENV: process.env.NODE_ENV,
    },
  }
}

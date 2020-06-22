import { NextApiRequest, NextApiResponse } from 'next'
import { withApiKeyAuthentication } from '../../../../lib/middleware'
import { Pool, Client } from 'pg'

const pool = new Pool({
  connectionString: 'postgresql://postgres:hki-vesiliikenne@localhost:5432/postgres'
})

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> => {
  const stuff = await pool.query("SELECT NOW()")
    //.then((a) => { console.log(a)})
  //console.log(result);
  res.json({moi: "ehllo", stuff})
}

export default withApiKeyAuthentication(handler)
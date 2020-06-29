import { pool } from "./db";

describe('Database', () => {
  it('responds', async () => {
    expect.assertions(1)
    const result = await pool.query("select now()")
    expect(result.rows.length).toEqual(1)
  })
})

afterAll(async () => {
  return await pool.end()
})

import { GetServerSideProps, NextPage } from 'next'
import { qrCodeWithTicketDetails, Ticket } from '../src/ticket-renderer'
import TicketContainer from './components/TicketContainer'

interface IndexPageProperties {
  qrCodeContents: string
  ticket: Ticket
}

const IndexPage: NextPage<IndexPageProperties> = ({
  qrCodeContents,
  ticket
}) => (
  <div>
    <TicketContainer
      ticketType={ticket.ticketTypeId}
      validUntil={new Date(ticket.validTo)}
      qrCodeContents={qrCodeContents}
    />
    <div>
      <img alt="the qr code" src={qrCodeContents} />
    </div>
    <div>{ticket.agency}</div>
    <div>{ticket.ticketTypeId}</div>
    <div>{ticket.validTo}</div>
  </div>
)

export default IndexPage

export const getServerSideProps: GetServerSideProps = async context => {
  const [qrCodeContents, ticket] = await qrCodeWithTicketDetails('foo bar')
  return { props: { qrCodeContents, ticket } }
}

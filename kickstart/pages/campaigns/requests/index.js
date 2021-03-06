import React, { Component } from 'react';
import { Button, Table } from 'semantic-ui-react';
import { Link } from '../../../routes';
import Layout from '../../../components/Layout';
import Campaign from '../../../ethereum/campaign';
import RequestRow from '../../../components/RequestRow';
import web3 from '../../../ethereum/web3';

class RequestIndex extends Component {
    static async getInitialProps(props) {
        const { address } = props.query;
        const campaign = Campaign(address);
        const requestCount = await campaign.methods.getRequestsCount().call();
        const approversCount = await campaign.methods.approversCount().call();

        const accounts = await web3.eth.getAccounts();
        const isManager = await campaign.methods.manager().call() === accounts[0];

        const requests = await Promise.all(
            Array(parseInt(requestCount)).fill().map((element, index) => {
                return campaign.methods.requests(index).call();
            })
        );
        return { address, requests, requestCount, approversCount, isManager };
    }

    render() {
        const { Header, Row, HeaderCell, Body } = Table;
        return (
            <Layout>
                <Link route={`/campaigns/${this.props.address}`}>
                    <a>Back</a>
                </Link>
                <h3>Requests</h3>
                <Link route={`/campaigns/${this.props.address}/requests/new`}>
                    <a>
                        <Button primary floated="right" style={{ marginBottom: 10 }}>Add request</Button>
                    </a>
                </Link>
                <Table>
                    <Header>
                        <Row>
                            <HeaderCell>ID</HeaderCell>
                            <HeaderCell>Description</HeaderCell>
                            <HeaderCell>Amount</HeaderCell>
                            <HeaderCell>Recipient</HeaderCell>
                            <HeaderCell>Approval count</HeaderCell>
                            <HeaderCell>Approve</HeaderCell>
                            {!this.props.isManager ? null : ( <HeaderCell>Finalize</HeaderCell> )}
                        </Row>
                    </Header>
                    <Body>
                        {this.renderRows()}
                    </Body>
                </Table>
                <div>Found {this.props.requestCount} requests.</div>
            </Layout>
        );
    }

    renderRows() {
        return this.props.requests.map((request, index) => {
            return <RequestRow key={index} id={index} request={request}
                address={this.props.address} approversCount={this.props.approversCount} isManager={this.props.isManager} />;
        })
    }
}

export default RequestIndex;
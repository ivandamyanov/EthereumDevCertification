import React, { Component } from 'react';
import { Message, Button } from 'semantic-ui-react';
import web3 from '../ethereum/web3';
import { Table } from 'semantic-ui-react';
import Campaign from '../ethereum/campaign';

class RequestRow extends Component {
    render() {
        const { Row, Cell } = Table;
        const { id, request, approversCount } = this.props
        const readyToFinalize = request.approvalCount > approversCount / 2
        && !request.isComplete;

        return (
            <Row disabled={request.isComplete} positive={readyToFinalize}>
                <Cell>{id}</Cell>
                <Cell>{request.description}</Cell>
                <Cell>{web3.utils.fromWei(request.value, 'ether')}</Cell>
                <Cell>{request.recipient}</Cell>
                <Cell>{request.approvalCount}/{approversCount}</Cell>
                <Cell>
                    {request.isComplete ? null : (
                        <Button color="green" basic onClick={this.onApprove}>Approve</Button>
                    )}
                </Cell>
                <Cell> {request.isComplete ? null : (
                    <Button color="teal" basic onClick={this.onFinalize}>Finalize</Button>
                )}
                </Cell>
            </Row>
        );
    }

    onApprove = async () => {
        const campaign = Campaign(this.props.address);
        const accounts = await web3.eth.getAccounts();
        await campaign.methods.approveRequest(this.props.id).send({
            from: accounts[0]
        });
    };

    onFinalize = async () => {
        const campaign = Campaign(this.props.address);
        const accounts = await web3.eth.getAccounts();
        await campaign.methods.finalizeRequest(this.props.id).send({
            from: accounts[0]
        });
    };
}

export default RequestRow;
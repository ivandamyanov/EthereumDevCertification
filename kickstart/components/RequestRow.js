import React, { Component } from 'react';
import { Message, Button } from 'semantic-ui-react';
import web3 from '../ethereum/web3';
import { Table } from 'semantic-ui-react';
import Campaign from '../ethereum/campaign';

class RequestRow extends Component {
    state = {
        isApproving: false,
        isFinalizing: false,
        errorMessage: ''
    };

    render() {
        const { Row, Cell } = Table;
        const { id, request, approversCount, isManager } = this.props
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
                        <Button color="green" basic onClick={this.onApprove} loading={this.state.isApproving}>Approve</Button>
                    )}
                </Cell>
                {!isManager ? null : (
                    <Cell> {request.isComplete ? null : (
                        <Button color="teal" basic onClick={this.onFinalize} loading={this.state.isFinalizing}>Finalize</Button>
                    )}
                    </Cell>
                )}
                { !this.state.errorMessage ? null : (
                    <Cell>
                        <div class="ui icon button" data-tooltip={this.state.errorMessage}>
                            <i class="info icon"></i>
                        </div>
                    </Cell>
                )}
            </Row>
        );
    }

    onApprove = async () => {
        const campaign = Campaign(this.props.address);
        this.setState({ isApproving: true, errorMessage: '' });

        try {
            const accounts = await web3.eth.getAccounts();
            await campaign.methods.approveRequest(this.props.id).send({
                from: accounts[0]
            });
        }
        catch (err) {
            this.setState({ errorMessage: err.message });
        }
        this.setState({ isApproving: false });
    };

    onFinalize = async () => {
        const campaign = Campaign(this.props.address);
        this.setState({ isFinalizing: true, errorMessage: '' });

        try {
            const accounts = await web3.eth.getAccounts();
            await campaign.methods.finalizeRequest(this.props.id).send({
                from: accounts[0]
            });
        }
        catch (err) {
            this.setState({ errorMessage: err.message });
        }

        this.setState({ isFinalizing: false });
    };
}

export default RequestRow;
import React, { Component } from 'react';
import { Form, Input, Message, Button } from 'semantic-ui-react';
import Campaign from '../ethereum/campaign';
import web3 from '../ethereum/web3';
import { Router } from '../routes';

class ContributeForm extends Component {
    state = {
        value: '',
        errorMessage: '',
        loading: false
    };

    render() {
        return (
            <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
                <Form.Field>
                    <label>Amount to contribute</label>
                    <Input label="ether" labelPosition="right" value={this.state.value} onChange={event => this.setState({ value: event.target.value })} />
                </Form.Field>
                <Message error header="Oops!" content={this.state.errorMessage} />
                <Button floated="right" content="Contribute" icon="circle add" primary loading={this.state.loading} />

            </Form>
        );
    }

    onSubmit = async event => {
        event.preventDefault;
        if (this.state.value) {
            if (!parseFloat(this.state.value)) {
                this.setState({ errorMessage: "Please enter a valid ether amount!" }); 
                return;
            }

            const campaign = Campaign(this.props.address);
            this.setState({ loading: true, errorMessage: '' });
            try {
                const accounts = await web3.eth.getAccounts();
                await campaign.methods.contribute().send({
                    from: accounts[0],
                    value: web3.utils.toWei(this.state.value, 'ether')
                });

                Router.replaceRoute(`/campaigns/${this.props.address}`)
            } catch (err) {
                this.setState({ errorMessage: err.message });
            }
            this.setState({ loading: false, value: '' });
        }
    }
}

export default ContributeForm;
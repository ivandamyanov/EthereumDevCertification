import React from 'react';
import Header from './Header';
import { Container } from 'semantic-ui-react';
import Head from 'next/head';

export default props => {
    return (
        <Container>
            <Head><link async rel="stylesheet" href="//cdn.jsdelivr.net/npm/semantic-ui@2.4.1/dist/semantic.min.css" /></Head>
            <Header />
            {props.children}
        </Container>
    );
};
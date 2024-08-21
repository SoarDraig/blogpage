import React from 'react';
import Layout from '@theme/Layout';
import { Analytics } from '@vercel/analytics/react';

function MyLayout(props) {
    return (
        <>
            <Layout {...props} />
            <Analytics />
        </>
    );
}

export default MyLayout;

//nodejs apis by jonell hahaha

const express = require('express');
const axios = require('axios');

const app = express();
const port = 3000;

app.get('/check', async (req, res) => {
    const { host } = req.query;

    if (!host) {
        return res.status(400).json({ error: 'Host query parameter is required' });
    }

    let httpData = null;
    let tcpData = null;
    let httpStatusCode = null;
    let tcpStatusCode = null;
    let errorOccurred = false;

    try {
        const httpResponse = await axios.get(`https://check-host.net/check-http?host=${host}&max_nodes=3`, {
            headers: {
                'Accept': 'application/json'
            }
        });
        httpData = httpResponse.data;
        httpStatusCode = httpResponse.status;
    } catch (error) {
        httpData = {
            error: error.response ? error.response.data : 'Unable to fetch HTTP data'
        };
        httpStatusCode = error.response ? error.response.status : 500;
        errorOccurred = true;
    }

    try {
        const tcpResponse = await axios.get(`https://check-host.net/check-tcp?host=${host}&max_nodes=3`, {
            headers: {
                'Accept': 'application/json'
            }
        });
        tcpData = tcpResponse.data;
        tcpStatusCode = tcpResponse.status;
    } catch (error) {
        tcpData = {
            error: error.response ? error.response.data : 'Unable to fetch TCP data'
        };
        tcpStatusCode = error.response ? error.response.status : 500;
        errorOccurred = true;
    }

    res.json({
        http: {
            data: httpData,
            status_code: httpStatusCode
        },
        tcp: {
            data: tcpData,
            status_code: tcpStatusCode
        },
        status_code: errorOccurred ? 500 : 200
    });
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});

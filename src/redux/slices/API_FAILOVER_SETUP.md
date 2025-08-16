API Failover Setup with RTK Query

This document explains how the API failover mechanism works in apiSlice.js.
We use Redux Toolkit Query (RTK Query) with a primary API URL and a backup API URL.
If the primary API is unavailable (503 error or network failure), the client automatically retries the request against the backup API.
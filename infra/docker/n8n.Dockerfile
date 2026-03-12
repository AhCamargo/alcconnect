FROM n8nio/n8n:latest

USER root

# Copy the custom node
COPY packages/n8n-nodes-alcconnect /tmp/n8n-nodes-alcconnect

# Pack and install into n8n's community nodes directory
RUN mkdir -p /home/node/.n8n/nodes && \
    cd /home/node/.n8n/nodes && \
    npm init -y 2>/dev/null && \
    cd /tmp/n8n-nodes-alcconnect && \
    npm pack 2>/dev/null && \
    cd /home/node/.n8n/nodes && \
    npm install --ignore-scripts /tmp/n8n-nodes-alcconnect/n8n-nodes-alcconnect-1.0.0.tgz && \
    chown -R node:node /home/node/.n8n/nodes && \
    rm -rf /tmp/n8n-nodes-alcconnect

USER node

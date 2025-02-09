# Superfluid Plugin

Superfluid plugin allows you to interact with Superfluid contracts.

## Installation
```bash
npm install @anton-stack/superfluid-plugin
```

## Usage for AgentKit

```ts
import { AgentKit } from '@coinbase/agentkit';
import { superFluidActionProvider } from '@anton-stack/superfluid-plugin/agentkit';

const superfluid = superFluidActionProvider();

const agentKit = await AgentKit.from({
    walletProvider, // Your Wallet Provider. eg- viem, cdp, etc.
    actionProviders: [superfluid],
});
```

## Tools

- **Create or Update or Delete Flow**: Create, update, or delete a flow of tokens from sender to receiver.
- **Get Flow Rate**: Get the current flowrate between a sender and receiver for a specific token.
- **Update Member Units**: Update the units for a member in a Superfluid Pool.
- **Get Member Units**: Get the units of a member in a Superfluid Pool.
- **Get Member Flow Rate**: Get the flow rate of a member in a Superfluid Pool.
- **Get Total Flow Rate**: Get the total flow rate of a Superfluid Pool.
## **Pyth Network Developer Feedback**  

**Submitted by:** [AnoneMarket](https://github.com/mathisrgt/AnonMarket)  
**Hackathon:** [ETHGlobal Bangkok](https://ethglobal.com/events/bangkok/)  
**PR Submission** : [PR-Pyth-Feedback](https://github.com/pyth-network/documentation/pull/503)  

---

### **Introduction**

This document provides feedback on the Pyth Network’s developer experience. We followed the bounty’s steps:  
1. Interacted with Pyth contracts via a dApp and the API.  
2. Reviewed the documentation on Pyth’s pull oracle.  
3. Compiled our feedback and suggestions for improvement.

---

### **Steps Taken**

#### **Interaction with Pyth Contracts**  
- Fetched price updates using Hermes, added `0x` prefix to data, calculated update fees, and updated prices on-chain.  
- Verified updated prices using `getPriceNoOlderThan`.

#### **Documentation Review**  
We reviewed the setup guide, contract interaction, and error codes, finding them generally helpful but lacking in certain areas like error-handling.

---

### **Findings and Feedback**

| Area | Observation | Suggested Improvement |  
|---|---|---|  
| **Hermes Client** | Lacks error-handling examples. | Add troubleshooting examples for Hermes errors. |  
| **ABI Specification** | Minimal ABI; missing edge cases. | Include a more detailed ABI reference. |  
| **Price Feed IDs** | The list of feed IDs can be overwhelming. | Add a quick-start guide for common use cases. |  
| **Developer Flow** | Manually adding `0x` is prone to error. | Automate the `0x` prefix addition in the SDK. |  

---

### **Summary**

1. **Documentation**: Add troubleshooting and expand examples.  
2. **SDK**: Automate data formatting and provide gas fee insights.  
3. **Developer Experience**: Improve Hermes API documentation and simplify feed ID navigation.

---

### **PR Submission**

We submitted a PR to automate the `0x` prefix addition in the SDK.  
**Link to PR:** [PR-Pyth-Feedback](https://github.com/pyth-network/documentation/pull/503)

---

Thank you for the opportunity!

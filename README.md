# 🔗 **AnonMarket** (Eth Global Bangkok 2024) 🌍  
  

<h4 align="center">  
 🎥 <a href="https://www.youtube.com/watch?v=lrAvW4_3MSg/">**Watch Video Walkthrough**</a>  
</h4>  


---

## 🌟 **The Vision**  

AnonMarket aims to revolutionize **predictive markets** by introducing **privacy-first decentralized betting**. Our platform empowers users to predict real-world outcomes, such as:  
🎯 Will **Bitcoin hit $100,000** in the next two months?  
🇺🇸 Who will be the **next U.S. president**?  

These markets help participants gauge trends, assess probabilities, and even shape outcomes, all while **preserving privacy** through **cutting-edge cryptographic techniques** like **Alice ring signatures**.  

---

## 🔍 **What Makes AnonMarket Unique?**  

AnonMarket combines **privacy, reliability, and accessibility** to redefine predictive markets:  

### 🛡️ **Privacy Beyond Limits**  
- 🕵️‍♂️ With **ring signatures**, user identities remain **anonymous** while maintaining blockchain transparency.  
- 🔒 Ensures users can participate freely without compromising personal information.  

### 🔗 **Accurate and Trustworthy Resolutions**  
- 🌐 Integrates **Chainlink** and **Pyth oracles** for reliable, real-time external data.  
- 📊 Provides unbiased and verifiable outcomes for market settlements.  

### 🎯 **Seamless Onboarding**  
- **Web3Auth** ensures a smooth experience with wallet abstraction for both blockchain novices and experts.  
- 🔄 Easy account creation and integration without prior crypto knowledge.  

### 🆔 **Decentralized Identity**  
- Powered by **Worldcoin’s World ID**, ensuring participants are legitimate while keeping their identities private.  

### 💰 **Stable Payments, Cross-Chain Power**  
- 💵 Bets are placed and resolved using **USDC**, a stable, widely recognized currency.  
- 🌉 **Fusion+ from 1Inch** facilitates **cross-chain interoperability**, bridging funds between Bitcoin, Ethereum, and Solana seamlessly.  

---

## 🛠️ **Technical Innovations**  

AnonMarket leverages **state-of-the-art technologies** to create a seamless and efficient platform:  

<img width="3488" alt="Sequence Diagram - AnonMarket" src="https://github.com/user-attachments/assets/e9354aaa-3247-4a6e-bf70-b1d1d59aab48">

### 🔒 **Backend**  

AnonMarket’s backend leverages a **multi-chain architecture** to deliver **scalability, transparency, and reliability** across various blockchain ecosystems. Each chain serves a unique purpose, ensuring seamless functionality and a tailored experience for users.  

#### 🚀 **Core Components**  

- **Escrow Mechanism**  
  Secure and transparent escrow services powered by immutable smart contracts.  
  - **Contract**: [Escrow Smart Contract](https://sepolia.etherscan.io/address/0x8fcaedd4478b7843a5f0757d90ebb9aa64e47e76)  

- **Automated Market Maker (AMM)**  
  Efficiently manages liquidity and trades using optimized algorithms for low-cost transactions.  
  - **Contract**: [AMM Smart Contract](https://sepolia.etherscan.io/address/0x971A566C700bfb18C33D3536aFDE4cb89a9a6c62)  

- **Oracle Integration**  
  Ensures accurate, real-time data resolution for markets via trusted oracles.  
  - **Contract**: [Oracle Smart Contract](https://sepolia.etherscan.io/address/0x2F8e49D12718Dd2D996E51638B83180C03b59d2c)  

---

#### 🌐 **Blockchain Deployments**  

- **Base**  
  A scalable and cost-efficient Layer 2 solution designed to lower entry barriers for users.  
  - **Contract**: [Base Smart Contract](https://rootstock-testnet.blockscout.com/address/0x1a548aD9D7e13fD3011Bd659B486CE27AC6E3CB9#code)  

- **Rootstock (RSK)**  
  Combining Bitcoin’s security with smart contract capabilities, enabling seamless integration for Bitcoin-native users.  
  - **Contract**: [Rootstock Smart Contract](https://rootstock-testnet.blockscout.com/address/0x1a548aD9D7e13fD3011Bd659B486CE27AC6E3CB9#code)  

- **Zircuit**  
  Focused on privacy-first solutions, Zircuit enhances anonymity through advanced cryptographic methods like zero-knowledge proofs.  
  - **Contract**: [Zircuit Smart Contract](https://rootstock-testnet.blockscout.com/address/0x1a548aD9D7e13fD3011Bd659B486CE27AC6E3CB9#code)  

- **Chiliz**  
  Tailored for sports and entertainment, facilitating prediction markets for global events and tournaments.  
  - **Contract**: [Chiliz Smart Contract](https://rootstock-testnet.blockscout.com/address/0x1a548aD9D7e13fD3011Bd659B486CE27AC6E3CB9#code)  

- **Linea**  
  A Layer 2 scaling solution offering reduced gas fees and faster transactions while leveraging Ethereum’s robust security.  
  - **Contract**: [Linea Smart Contract](https://sepolia.lineascan.build/address/address/0xE7037f0742360A7A82554102058A48F3c7751C64#code)  

- **Scroll**  
  A zkEVM-compatible Layer 2 designed for high-throughput scenarios, ensuring low-latency and robust security.  
  - **Contract**: [Scroll Smart Contract](https://rootstock-testnet.blockscout.com/address/0x1a548aD9D7e13fD3011Bd659B486CE27AC6E3CB9#code)  

---

### 🛠️ **Optimizations**  
Custom-built smart contracts ensure **low gas fees** through batching mechanisms and advanced optimizations.  

👉 **[Explore Smart Contract Deployment](https://github.com/mathisrgt/AnonMarket/blob/main/contracts/scripts/deployAll.ts)**  

AnonMarket’s backend architecture guarantees **strong security, low costs, and high performance**, enabling a seamless user experience across multiple chains.  

### 📡 **Oracles**  
- Uses **Chainlink** and **Pyth** for trusted event data, ensuring accurate market resolutions.  

### 🧩 **Seamless Integration**  
- **Web3Auth** powers account abstraction for streamlined onboarding.  
- Decentralized identity verification with **Worldcoin’s World ID** ensures authenticity without sacrificing privacy.  

### 💵 **Transactions and Interoperability**  
- **Circle's USDC** offers a stable currency for platform transactions.  
- **Fusion+ by 1Inch** bridges assets efficiently across multiple blockchains, ensuring a smooth user experience for cross-chain bets.  

### 🌐 **Frontend**  
- Built using **React** and **Next.js**, delivering a responsive, intuitive, and lightning-fast user interface.  

---

## 🔎 **What Are Ring Signatures?**  

Ring signatures are at the heart of AnonMarket’s privacy features.  

### 🧠 **How They Work**  
A **ring signature** allows a user to sign a transaction within a group while keeping their identity anonymous.  
- **Ambiguity**: It’s impossible to trace the exact signer, enhancing privacy.  
- **Untraceable Transactions**: Widely used in **privacy coins** (e.g., Monero) and **secure voting systems**.  

### 🤔 **Why Ring Signatures?**  
- **Efficiency**: Lightweight compared to computationally intense alternatives like Fully Homomorphic Encryption (FHE).  
- **Transparency**: Unlike Zero-Knowledge Proofs (ZK), which can be opaque to developers, ring signatures are simple and accessible.  
- **Applications**: Ideal for **anonymous payments**, **secure voting systems**, and **predictive markets** like AnonMarket.  

---

## 🧩 **Ring Signature Use Cases**  

Ring signatures provide privacy for many applications beyond **AnonMarket**. Here are some key use cases:

1. **Private Governance Voting**  
   Enable hidden or anonymous voting for DAOs and community governance, allowing secure decision-making without exposing individual preferences.  

2. **Privacy-Preserving Surveys and Polls**  
   Gather honest feedback or opinions on sensitive topics while protecting the privacy of participants, useful for market research or community sentiment polling.  

3. **DeFi Risk Pools**  
   Users can anonymously participate in decentralized risk-sharing pools, such as insurance platforms, where privacy is essential for payouts and claims.  

4. **Private Betting Platforms**  
   Create betting platforms for sports, elections, or other outcomes where users’ identities and transaction histories remain concealed.  

5. **Confidential Donations and Funding**  
   Enable anonymous donations to causes, non-profits, or content creators while maintaining transparency in fund allocation and usage.  

6. **Identity Verification without Exposure**  
   Use technologies like **zero-knowledge proofs** or **Worldcoin’s World ID** to verify users' identities without revealing personal details.  

7. **Gamified Learning and Competitions**  
   Create platforms for educational games or competitions where participants' identities and scores are kept private, adding fairness and mystery.  

8. **Confidential Escrow Services**  
   Offer secure and anonymous escrow services for transactions, where neither party's identity or agreement details are exposed.  

9. **Encrypted Messaging Markets**  
   Build messaging platforms that ensure private communications for markets or competitive environments while keeping user identities protected.

---

## 💡 **Challenges and Solutions**  

🚧 **Optimizing Gas Costs**:  
We implemented batching mechanisms in our smart contracts, significantly reducing gas costs for users.  

🚧 **Onboarding Non-Crypto Users**:  
Using **Web3Auth**, we simplified the wallet setup process, enabling a frictionless entry for users new to blockchain.  

🚧 **Ensuring Cross-Chain Efficiency**:  
Incorporating **Fusion+ from 1Inch** solved interoperability challenges, creating a truly multi-chain experience.  

---

## 🎨 **Explore More**  

📑 **[See Slide Deck](https://docs.google.com/presentation/d/1_0uY0g43k-Wpyq8IDSsvDb_MKPpnTrOtdJZ6FS55OzM/edit?usp=sharing)**  
🌐 **[Project Demo Coming Soon](https://anon-market.vercel.app/)**  

---

## 👥 **Meet the Team**  

We’re a group of passionate developers with a shared love for **blockchain innovation**:  

- 👨‍💻 **[Mathis Sergent](https://linkedin.com/in/mathis-sergent/)**  
  **Backend Developer** | 4+ years of experience | Passionate about scalable architectures | 10+ hackathons worldwide.  

- 👨‍💻 **[Mathieu Laruelle](https://linkedin.com/in/mathieu-laruelle/)**  
  **FullStack Developer** | 3+ years of experience | Expert in creating intuitive interfaces | Hackathon veteran.  

- 🎨 **[Marc Bertholat](https://linkedin.com/in/marcbertholat/)**  
  **UI/UX Designer** | 3+ years of experience | Focused on delivering seamless user experiences | Hackathon enthusiast.  

- 👨‍💻 **[Charles-André Goichot](https://linkedin.com/in/charles-andr%C3%A9-goichot/)**  
  **Blockchain Developer** | 4+ years of experience | Skilled in optimizing performance | Skilled problem solver.  

- 👨‍💻 **[Ewan Hamon](https://linkedin.com/in/ewan-hamon/)**  
  **Frontend Developer** | 4+ years of experience | Specialized in Rust & Smart Contracts | 10+ hackathons globally.  

---

## 🤝 **Feedback and Support**  

📧 **We’d love to hear from you!**  

If you have any suggestions or encounter issues while exploring **AnonMarket**, don’t hesitate to reach out. Together, we can build the future of predictive markets.

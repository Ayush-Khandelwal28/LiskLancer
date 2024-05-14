# LiskLancer

Welcome to LiskLancer, the platform where freelancers and Employers meet! LiskLancer is designed to streamline the process of finding gigs for freelancers and matching them with Employers looking for their skills.

# Problem We Are Addressing
Various platforms connect freelancers to projects, enabling them to earn money. However, several problems arise within these platforms. Firstly, there's unfair bidding, causing freelancers to suffer. To address this, we implemented a bidding system using a commit and reveal scheme. Encrypted bids are stored in the contract, and once bidding closes, bidders reveal their bids. If they match, the bids are finalized.

Another prevalent issue is payment disputes. Owners frequently fail to pay freelancers the agreed-upon amount, or freelancers demand full payment even when owner is unsatisfied with the project. Conversely, freelancers sometimes fail to deliver as required, yet still demand full payment. There are also cases where owners suffer when assigned freelancers fail to complete the work, wasting the owner's time.

To tackle these issues, we introduced a staking feature. The owner stakes the full amount of the winning bid, while the freelancer stakes 5% of the winning bid. If the freelancer fails to complete the work, they lose their stake. Conversely, if the owner is satisfied by the submitted work, both staked amounts are transferred to the freelancer. In cases of dispute, where the owner is unsatisfied with the work and wishes to withhold payment, they can raise an issue with LiskLancer. Here, a team of arbiters will assess the submitted work, voting for or against it. The ratio of votes will determine the final payment to the freelancer, with the remaining amount returned to the owner.

## Features

1. **Bidding with Commitment and Reveal Scheme**

   One of our core functionalities is bidding with Commitment and Reveal Scheme. Employers can post their projects along with the necessary details, and freelancers can bid on them. This ensures that the bidding process is secure and transparent. Only the encrypted bids are stored in the contract during the bidding time window.

   ### Commitment and Reveal Scheme
   
   Here we implement Commitment and Reveal Scheme  to ensure the confidentiality of bids while allowing bidders to prove their commitment to their bids.

   **Overview**

   The Commitment and Reveal Scheme involves two steps:
   
   - **Commitment Phase:** Bidders commit to their bids without revealing the actual bid amount. Instead, they submit a encrypted version of their bid along with a secret key.
   
   - **Reveal Phase:** After the Commitment Phase ends, bidders reveal their actual bid amounts along with the secret key used during the Commitment Phase. The contract then verifies that the revealed bid amount matches the encrypted submitted bid during the Commitment Phase.
   

2. **Escrow Contract**

   To bolster security and accountability for both Employers and freelancers, LiskLancer introduces escrow contracts. When a project is assigned to a freelancer, both parties must sign the escrow contract and commit a predetermined amount to formalize their agreement. 

    Freelancers are required to stake 5% of the bid amount to demonstrate their commitment to completing the assigned tasks. This stake acts as assurance of their dedication. The 5% fee is refunded upon successful completion of the project; however, failure to deliver results in forfeiture of the stake. 

    Simultaneously, Employers are required to stake the winning bid amount, ensuring that the freelancer will receive payment even if issues arise from the project owner's side. 

    Subsequently, the freelancer delivers their work via LiskLancer for review and approval by the project owner. This meticulous process guarantees mutual commitment and fulfillment of obligations before any payment is processed.

    

3. **Dispute Resolution**

   In the event of a dispute regarding the payment amount between the project owner and freelancer, LiskLancer offers a robust dispute resolution mechanism. A panel of arbiters votes on the dispute using Zero Knowledge Proof. The number of "yes" and "no" votes determine the final payment amount to be made to the freelancer, ensuring fair and impartial resolution.

4. **ERC20 Tokens**

   LiskLancer has deployed an ERC20 token contract, which serves as the currency for our website. These tokens are used for staking and locking funds, as well as for transferring funds between two parties and for all other transactions where required.
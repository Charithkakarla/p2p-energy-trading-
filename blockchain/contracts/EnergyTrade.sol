// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title EnergyTrade
 * @dev P2P energy trading contract with escrow settlement
 */
contract EnergyTrade {
    enum TradeStatus {
        PENDING,      // Trade created, awaiting payment
        ESCROWED,     // Payment locked in contract
        DELIVERED,    // Energy delivered
        COMPLETED,    // Settlement complete, payment released
        CANCELLED     // Trade cancelled
    }

    struct Trade {
        string tradeId;
        address seller;
        address buyer;
        uint256 energyAmount;  // in kWh (using uint for simplicity, multiply by 1e18 for decimals)
        uint256 pricePerUnit;  // in wei
        uint256 totalPrice;    // in wei
        TradeStatus status;
        uint256 createdAt;
        uint256 deliveredAt;
        uint256 completedAt;
    }

    mapping(string => Trade) public trades;
    mapping(address => string[]) public userTrades;

    event TradeCreated(
        string indexed tradeId,
        address indexed seller,
        address indexed buyer,
        uint256 energyAmount,
        uint256 totalPrice,
        uint256 timestamp
    );

    event TradeEscrowed(
        string indexed tradeId,
        address indexed buyer,
        uint256 amount,
        uint256 timestamp
    );

    event TradeDelivered(
        string indexed tradeId,
        address indexed seller,
        uint256 timestamp
    );

    event TradeCompleted(
        string indexed tradeId,
        address indexed seller,
        address indexed buyer,
        uint256 amount,
        uint256 timestamp
    );

    event TradeCancelled(string indexed tradeId, uint256 timestamp);

    /**
     * @dev Create a new trade listing
     * @param _tradeId Unique trade identifier
     * @param _buyer Address of the buyer
     * @param _energyAmount Amount of energy in kWh
     * @param _pricePerUnit Price per unit in wei
     */
    function createTrade(
        string memory _tradeId,
        address _buyer,
        uint256 _energyAmount,
        uint256 _pricePerUnit
    ) public {
        require(_buyer != address(0), "Invalid buyer address");
        require(_energyAmount > 0, "Energy amount must be greater than 0");
        require(_pricePerUnit > 0, "Price must be greater than 0");

        uint256 totalPrice = _energyAmount * _pricePerUnit;

        trades[_tradeId] = Trade({
            tradeId: _tradeId,
            seller: msg.sender,
            buyer: _buyer,
            energyAmount: _energyAmount,
            pricePerUnit: _pricePerUnit,
            totalPrice: totalPrice,
            status: TradeStatus.PENDING,
            createdAt: block.timestamp,
            deliveredAt: 0,
            completedAt: 0
        });

        userTrades[msg.sender].push(_tradeId);
        userTrades[_buyer].push(_tradeId);

        emit TradeCreated(
            _tradeId,
            msg.sender,
            _buyer,
            _energyAmount,
            totalPrice,
            block.timestamp
        );
    }

    /**
     * @dev Buyer locks payment in escrow
     * @param _tradeId Trade identifier
     */
    function lockEscrow(string memory _tradeId) public payable {
        Trade storage trade = trades[_tradeId];
        require(trade.seller != address(0), "Trade not found");
        require(msg.sender == trade.buyer, "Only buyer can lock escrow");
        require(trade.status == TradeStatus.PENDING, "Invalid trade status");
        require(msg.value == trade.totalPrice, "Incorrect payment amount");

        trade.status = TradeStatus.ESCROWED;

        emit TradeEscrowed(_tradeId, msg.sender, msg.value, block.timestamp);
    }

    /**
     * @dev Seller confirms energy delivery
     * @param _tradeId Trade identifier
     */
    function confirmDelivery(string memory _tradeId) public {
        Trade storage trade = trades[_tradeId];
        require(trade.seller != address(0), "Trade not found");
        require(msg.sender == trade.seller, "Only seller can confirm delivery");
        require(trade.status == TradeStatus.ESCROWED, "Trade must be escrowed");

        trade.status = TradeStatus.DELIVERED;
        trade.deliveredAt = block.timestamp;

        emit TradeDelivered(_tradeId, msg.sender, block.timestamp);
    }

    /**
     * @dev Complete trade and release payment to seller
     * @param _tradeId Trade identifier
     */
    function completeSettlement(string memory _tradeId) public {
        Trade storage trade = trades[_tradeId];
        require(trade.seller != address(0), "Trade not found");
        require(
            msg.sender == trade.buyer || msg.sender == trade.seller,
            "Only buyer or seller can complete settlement"
        );
        require(
            trade.status == TradeStatus.DELIVERED,
            "Trade must be delivered"
        );

        trade.status = TradeStatus.COMPLETED;
        trade.completedAt = block.timestamp;

        // Transfer funds to seller
        (bool success, ) = payable(trade.seller).call{
            value: trade.totalPrice
        }("");
        require(success, "Payment transfer failed");

        emit TradeCompleted(
            _tradeId,
            trade.seller,
            trade.buyer,
            trade.totalPrice,
            block.timestamp
        );
    }

    /**
     * @dev Cancel a trade and refund escrow if needed
     * @param _tradeId Trade identifier
     */
    function cancelTrade(string memory _tradeId) public {
        Trade storage trade = trades[_tradeId];
        require(trade.seller != address(0), "Trade not found");
        require(
            msg.sender == trade.buyer || msg.sender == trade.seller,
            "Only buyer or seller can cancel"
        );
        require(
            trade.status == TradeStatus.PENDING ||
                trade.status == TradeStatus.ESCROWED,
            "Cannot cancel completed trades"
        );

        if (trade.status == TradeStatus.ESCROWED) {
            // Refund buyer
            (bool success, ) = payable(trade.buyer).call{
                value: trade.totalPrice
            }("");
            require(success, "Refund failed");
        }

        trade.status = TradeStatus.CANCELLED;

        emit TradeCancelled(_tradeId, block.timestamp);
    }

    /**
     * @dev Get trade details
     * @param _tradeId Trade identifier
     */
    function getTrade(string memory _tradeId)
        public
        view
        returns (Trade memory)
    {
        return trades[_tradeId];
    }

    /**
     * @dev Get all trades for a user
     * @param _user User address
     */
    function getUserTrades(address _user)
        public
        view
        returns (string[] memory)
    {
        return userTrades[_user];
    }
}

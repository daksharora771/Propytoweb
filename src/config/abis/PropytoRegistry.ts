export const PropytoRegistryABI = [
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "assetId",
        "type": "uint256"
      }
    ],
    "name": "AssetMediaUpdated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "assetId",
        "type": "uint256"
      }
    ],
    "name": "AssetMetadataUpdated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "assetId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "oldPrice",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "newPrice",
        "type": "uint256"
      }
    ],
    "name": "AssetPriceUpdated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "assetId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "name",
        "type": "string"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "registeredBy",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "seller",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "propytosftAddress",
        "type": "address"
      }
    ],
    "name": "AssetRegistered",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "assetId",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "oldSeller",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "newSeller",
        "type": "address"
      }
    ],
    "name": "AssetSellershipTransferred",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "assetId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "enum PropytoRegistry.AssetStatus",
        "name": "oldStatus",
        "type": "uint8"
      },
      {
        "indexed": false,
        "internalType": "enum PropytoRegistry.AssetStatus",
        "name": "newStatus",
        "type": "uint8"
      }
    ],
    "name": "AssetStatusUpdated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "assetId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "feeAmount",
        "type": "uint256"
      }
    ],
    "name": "FeesCollected",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint8",
        "name": "version",
        "type": "uint8"
      }
    ],
    "name": "Initialized",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "platformFeePercentage",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "feeCollector",
        "type": "address"
      }
    ],
    "name": "MarketplaceConfigUpdated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "previousOwner",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "OwnershipTransferred",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "assetId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "totalShares",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "sharePrice",
        "type": "uint256"
      }
    ],
    "name": "PartialOwnershipEnabled",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "Paused",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "assetId",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "buyer",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "shareCount",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "totalPrice",
        "type": "uint256"
      }
    ],
    "name": "SharesPurchased",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "assetId",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "shareCount",
        "type": "uint256"
      }
    ],
    "name": "SharesTransferred",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "Unpaused",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "assetCount",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "assetMedia",
    "outputs": [
      {
        "internalType": "string",
        "name": "assetImage",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "assetVideo",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "assetFloorPlan",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "assetMetadata",
    "outputs": [
      {
        "internalType": "string",
        "name": "assetDescription",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "assetFeatures",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "assetAmenities",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "assetLocation",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "assetRentData",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "rentPrice",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "rentDeposit",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "rentPeriod",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "rentSecurityDeposit",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "assets",
    "outputs": [
      {
        "internalType": "string",
        "name": "name",
        "type": "string"
      },
      {
        "internalType": "enum PropytoRegistry.AssetType",
        "name": "assetType",
        "type": "uint8"
      },
      {
        "internalType": "address",
        "name": "assetAddress",
        "type": "address"
      },
      {
        "internalType": "enum PropytoRegistry.AssetStatus",
        "name": "assetStatus",
        "type": "uint8"
      },
      {
        "internalType": "enum PropytoRegistry.AssetFurnishing",
        "name": "assetFurnishing",
        "type": "uint8"
      },
      {
        "internalType": "enum PropytoRegistry.AssetZone",
        "name": "assetZone",
        "type": "uint8"
      },
      {
        "internalType": "uint256",
        "name": "assetPrice",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "assetArea",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "assetAge",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "assetOtherDetails",
        "type": "string"
      },
      {
        "internalType": "bool",
        "name": "isRentable",
        "type": "bool"
      },
      {
        "internalType": "bool",
        "name": "isSellable",
        "type": "bool"
      },
      {
        "internalType": "bool",
        "name": "isPartiallyOwnEnabled",
        "type": "bool"
      },
      {
        "internalType": "address",
        "name": "seller",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "listingExpiry",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "assetId",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "totalShares",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "sharePrice",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "minSharePurchase",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "maxSharesPerOwner",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "sellerShares",
        "type": "uint256"
      }
    ],
    "name": "enablePartialOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "assetId",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "newExpiry",
        "type": "uint256"
      }
    ],
    "name": "extendListingExpiry",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "assetId",
        "type": "uint256"
      }
    ],
    "name": "getAssetOwners",
    "outputs": [
      {
        "internalType": "address[]",
        "name": "",
        "type": "address[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "assetId",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "ownerAddress",
        "type": "address"
      }
    ],
    "name": "getOwnershipPercentage",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "seller",
        "type": "address"
      }
    ],
    "name": "getSellerAssets",
    "outputs": [
      {
        "internalType": "uint256[]",
        "name": "",
        "type": "uint256[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "assetId",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "ownerAddress",
        "type": "address"
      }
    ],
    "name": "getSharesOwned",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_usdtToken",
        "type": "address"
      }
    ],
    "name": "initialize",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "marketplaceConfig",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "platformFeePercentage",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "feeCollector",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "listingFee",
        "type": "uint256"
      },
      {
        "internalType": "bool",
        "name": "feesEnabled",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "paused",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "propytosftAddress",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "assetId",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "shareCount",
        "type": "uint256"
      },
      {
        "internalType": "bool",
        "name": "isBuyAsset",
        "type": "bool"
      }
    ],
    "name": "purchaseShares",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "components": [
          {
            "internalType": "string",
            "name": "name",
            "type": "string"
          },
          {
            "internalType": "enum PropytoRegistry.AssetType",
            "name": "assetType",
            "type": "uint8"
          },
          {
            "internalType": "address",
            "name": "assetAddress",
            "type": "address"
          },
          {
            "internalType": "enum PropytoRegistry.AssetStatus",
            "name": "assetStatus",
            "type": "uint8"
          },
          {
            "internalType": "enum PropytoRegistry.AssetFurnishing",
            "name": "assetFurnishing",
            "type": "uint8"
          },
          {
            "internalType": "enum PropytoRegistry.AssetZone",
            "name": "assetZone",
            "type": "uint8"
          },
          {
            "internalType": "uint256",
            "name": "assetPrice",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "assetArea",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "assetAge",
            "type": "uint256"
          },
          {
            "internalType": "string",
            "name": "assetOtherDetails",
            "type": "string"
          },
          {
            "internalType": "bool",
            "name": "isRentable",
            "type": "bool"
          },
          {
            "internalType": "bool",
            "name": "isSellable",
            "type": "bool"
          },
          {
            "internalType": "bool",
            "name": "isPartiallyOwnEnabled",
            "type": "bool"
          },
          {
            "internalType": "address",
            "name": "seller",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "listingExpiry",
            "type": "uint256"
          }
        ],
        "internalType": "struct PropytoRegistry.PropytoAsset",
        "name": "_asset",
        "type": "tuple"
      },
      {
        "components": [
          {
            "internalType": "string",
            "name": "assetDescription",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "assetFeatures",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "assetAmenities",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "assetLocation",
            "type": "string"
          }
        ],
        "internalType": "struct PropytoRegistry.PropytoAssetMetadata",
        "name": "_metadata",
        "type": "tuple"
      },
      {
        "components": [
          {
            "internalType": "string",
            "name": "assetImage",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "assetVideo",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "assetFloorPlan",
            "type": "string"
          }
        ],
        "internalType": "struct PropytoRegistry.PropytoAssetMedia",
        "name": "_media",
        "type": "tuple"
      }
    ],
    "name": "registerAsset",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "renounceOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "transferOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "assetId",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "newPrice",
        "type": "uint256"
      }
    ],
    "name": "updateAssetPrice",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "newFeePercentage",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "newFeeCollector",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "newListingFee",
        "type": "uint256"
      },
      {
        "internalType": "bool",
        "name": "feesEnabled",
        "type": "bool"
      }
    ],
    "name": "updateMarketplaceConfig",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "newUsdtToken",
        "type": "address"
      }
    ],
    "name": "updateUsdtToken",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "usdtToken",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
] 
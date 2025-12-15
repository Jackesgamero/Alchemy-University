import {
  Box,
  Button,
  Center,
  Flex,
  Heading,
  Image,
  Input,
  SimpleGrid,
  Text,
  Spinner,
  useToast,
} from '@chakra-ui/react';
import { Alchemy, Network } from 'alchemy-sdk';
import { useEffect, useMemo, useState } from 'react';

/**
 * Normalizes NFT image URLs (IPFS -> HTTP)
 */
function resolveImageUrl(nft) {
  let image =
    nft.rawMetadata?.image ||
    nft.media?.[0]?.gateway ||
    nft.media?.[0]?.raw;

  if (!image) return null;

  if (image.startsWith('ipfs://')) {
    return image.replace('ipfs://', 'https://ipfs.io/ipfs/');
  }

  try {
    new URL(image); // Validate URL
    return image;
  } catch {
    return null;
  }
}

/**
 * Simple Ethereum address validator
 */
function isValidEthereumAddress(address) {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

function App() {
  const [userAddress, setUserAddress] = useState('');
  const [walletAddress, setWalletAddress] = useState('');
  const [walletENS, setWalletENS] = useState('');
  const [results, setResults] = useState(null);
  const [hasQueried, setHasQueried] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const toast = useToast();

  const alchemy = useMemo(() => {
    return new Alchemy({
      apiKey: import.meta.env.VITE_ALCHEMY_API_KEY,
      network: Network.ETH_MAINNET,
    });
  }, []);

  // Resolve ENS name to Ethereum address
  async function resolveEnsName(name) {
    try {
      const address = await alchemy.core.resolveName(name);
      if (!address) throw new Error('ENS name could not be resolved');
      return address;
    } catch (err) {
      console.error(err);
      return null;
    }
  }

  async function connectWallet() {
    if (!window.ethereum) {
      toast({
        title: 'Metamask not detected',
        status: 'warning',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    try {
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      const addr = accounts[0];
      if (!isValidEthereumAddress(addr)) throw new Error('Invalid wallet address');

      setWalletAddress(addr);

      // Try to resolve ENS for connected wallet
      try {
        const ens = await alchemy.core.lookupAddress(addr);
        if (ens) setWalletENS(ens);
      } catch {}

      setUserAddress(addr);
    } catch (err) {
      console.error(err);
      toast({
        title: 'Failed to connect wallet',
        description: err.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  }

  async function getNFTsForOwner(input = userAddress) {
    if (!input) {
      setError('Address or ENS name is empty.');
      return;
    }

    let address = input.trim();

    // If input is not a valid Ethereum address, try to resolve ENS
    if (!isValidEthereumAddress(address)) {
      const resolved = await resolveEnsName(address);
      if (!resolved) {
        setError('Invalid Ethereum address or ENS name.');
        return;
      }
      address = resolved;
    }

    try {
      setLoading(true);
      setError('');
      setResults(null);

      const data = await alchemy.nft.getNftsForOwner(address, {
        refreshCache: false,
      });

      if (!data?.ownedNfts || data.ownedNfts.length === 0) {
        setError('No NFTs found for this address.');
      }

      setResults(data);
      setHasQueried(true);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch NFTs. Check the address/ENS and network.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (walletAddress) {
      getNFTsForOwner(walletAddress);
    }
  }, [walletAddress]);

  return (
    <Box w="100vw" minH="100vh" bg="gray.100" py={10}>
      <Center>
        <Flex alignItems="center" justifyContent="center" flexDirection="column">
          <Heading fontSize={36} mb={2}>NFT Indexer 🖼</Heading>
          <Text mb={2}>
            Plug in an address or ENS name and this website will return all of its NFTs
          </Text>

          <Button mt={2} size="lg" colorScheme="orange" onClick={connectWallet}>
            {walletAddress
              ? `Connected: ${walletENS || walletAddress.slice(0, 6) + '...' + walletAddress.slice(-4)}`
              : 'Connect MetaMask'}
          </Button>
        </Flex>
      </Center>

      <Flex w="100%" flexDirection="column" alignItems="center" mt={10}>
        <Heading mb={4}>Get all the ERC-721 tokens of this address:</Heading>

        <Input
          value={userAddress}
          onChange={(e) => setUserAddress(e.target.value.trim())}
          color="black"
          w={["90%", "600px"]}
          textAlign="center"
          p={4}
          bgColor="white"
          fontSize={20}
          mb={4}
          placeholder="0x123... or vitalik.eth"
        />

        <Button
          fontSize={18}
          onClick={() => getNFTsForOwner()}
          colorScheme="blue"
          isLoading={loading}
          loadingText="Fetching NFTs"
          mb={10}
        >
          Fetch NFTs
        </Button>

        {loading && <Spinner size="xl" />}
        {error && <Text color="red.500" mb={4}>{error}</Text>}

        {hasQueried && results?.ownedNfts?.length > 0 && (
          <SimpleGrid
            w="90vw"
            minChildWidth="250px"
            spacing={6}
            mb={10}
          >
            {results.ownedNfts.map((nft) => {
              const imageUrl = resolveImageUrl(nft);

              return (
                <Flex
                  key={`${nft.contract.address}-${nft.tokenId}`}
                  flexDir="column"
                  bg="gray.800"
                  p={4}
                  borderRadius="2xl"
                  boxShadow="lg"
                  transition="transform 0.2s, box-shadow 0.2s"
                  _hover={{
                    transform: 'translateY(-5px)',
                    boxShadow: '2xl',
                  }}
                  overflow="hidden"
                >
                  <Image
                    src={imageUrl || 'https://via.placeholder.com/300'}
                    fallbackSrc="https://via.placeholder.com/300"
                    alt={nft.title || 'NFT'}
                    borderRadius="lg"
                    objectFit="cover"
                    w="100%"
                    h="250px"
                    mb={3}
                    loading="lazy"
                  />
                  <Text fontWeight="bold" fontSize="lg" noOfLines={1} mb={1}>
                    {nft.title || 'No Name'}
                  </Text>
                  <Text fontSize="sm" color="gray.400" noOfLines={1}>
                    {nft.contract.address.slice(0, 6)}...{nft.contract.address.slice(-4)}
                  </Text>
                </Flex>
              );
            })}
          </SimpleGrid>
        )}
      </Flex>
    </Box>
  );
}

export default App;

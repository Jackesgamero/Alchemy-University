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
} from '@chakra-ui/react';
import { Alchemy, Network, Utils } from 'alchemy-sdk';
import { useState } from 'react';
import { Spinner, Badge } from '@chakra-ui/react';
import { ethers } from 'ethers';


function App() {
  const [userAddress, setUserAddress] = useState('');
  const [walletAddress, setWalletAddress] = useState('');
  const [results, setResults] = useState([]);
  const [hasQueried, setHasQueried] = useState(false);
  const [tokenDataObjects, setTokenDataObjects] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  async function connectWallet() {
    if(!window.ethereum) {
      alert('Metamask not detected');
      return;
    }

    try {
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      setWalletAddress(accounts[0]);
      setUserAddress(accounts[0]);
    } catch (error) {
      console.error(error);
    }
  }

  async function getTokenBalance() {
    if (!userAddress) return;

    try {
      setIsLoading(true);
      setHasQueried(false);

      // Use Alchemy provider for ENS resolution
      const provider = new ethers.providers.AlchemyProvider("homestead", import.meta.env.VITE_ALCHEMY_API_KEY);

      let addressToQuery = userAddress;

      // Resolve ENS if input ends with ".eth"
      if (userAddress.endsWith(".eth")) {
        const resolved = await provider.resolveName(userAddress);

        if (!resolved) {
          alert("Could not resolve ENS name. Please enter a valid ENS or address.");
          setIsLoading(false);
          return;
        }

        addressToQuery = resolved;
        setUserAddress(addressToQuery); // optional: update input
      }

      // Now fetch balances using Alchemy SDK
      const alchemy = new Alchemy({
        apiKey: import.meta.env.VITE_ALCHEMY_API_KEY,
        network: Network.ETH_MAINNET,
      });

      const data = await alchemy.core.getTokenBalances(addressToQuery);
      setResults(data);

      const tokenDataPromises = data.tokenBalances.map(token =>
        alchemy.core.getTokenMetadata(token.contractAddress)
      );

      setTokenDataObjects(await Promise.all(tokenDataPromises));
      setHasQueried(true);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch token balances. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  }
 return (
  <Box w="100vw" minH="100vh" bg="gray.900" color="white" py={10}>
    {/* HEADER */}
    <Center>
      <Flex align="center" direction="column" gap={2}>
        <Heading fontSize="4xl">ERC-20 Token Indexer</Heading>
        <Text opacity={0.7}>
          Connect your wallet or paste an address to see ERC-20 balances
        </Text>

        {/* WALLET BUTTON */}
        <Button
          mt={4}
          size="lg"
          colorScheme="orange"
          onClick={connectWallet}
        >
          {walletAddress
            ? `Connected: ${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`
            : 'Connect MetaMask'}
        </Button>
      </Flex>
    </Center>

    {/* INPUT SECTION */}
    <Flex direction="column" align="center" mt={12} gap={6}>
      <Heading size="lg">
        Get all the ERC-20 token balances of this address
      </Heading>

      <Input
        value={userAddress}
        onChange={(e) => setUserAddress(e.target.value)}
        w="600px"
        maxW="90%"
        p={6}
        fontSize="lg"
        textAlign="center"
        bg="white"
        color="black"
        borderRadius="xl"
        boxShadow="lg"
        _focus={{ boxShadow: '2xl' }}
      />

      <Button
        size="lg"
        colorScheme="blue"
        onClick={getTokenBalance}
        isDisabled={isLoading || !userAddress}
      >
        {isLoading ? 'Fetching balances...' : 'Check ERC-20 Token Balances'}
      </Button>
    </Flex>

    {/* LOADING */}
    {isLoading && (
      <Flex direction="column" align="center" mt={14}>
        <Spinner size="xl" thickness="4px" />
        <Text mt={4} fontSize="lg" opacity={0.8}>
          Fetching token balances from Ethereum...
        </Text>
      </Flex>
    )}

    {/* RESULTS */}
    {hasQueried && !isLoading && (
      <>
        <Center mt={16}>
          <Heading size="lg">ERC-20 Token Balances</Heading>
        </Center>

        <SimpleGrid
          maxW="1200px"        // ancho máximo
          w="90%"             // ocupar todo el ancho disponible
          mt={10}
          px={{ base: 4, md: 6, lg: 8, xl: 10 }}  // padding lateral efectivo
          mx="auto"            // centrar la grid
          columns={{ base: 1, md: 2, lg: 3, xl: 4 }}
          spacing={8}
        >
          {results.tokenBalances.map((e, i) => (
            <Flex
              key={e.contractAddress}
              direction="column"
              bg="blue.600"       // color contrastante
              color="white"       // texto blanco para contraste
              p={6}               // padding uniforme
              borderRadius="2xl"
              boxShadow="2xl"     // sombra más visible
              transition="0.2s"
              _hover={{
                transform: 'scale(1.05)',
                boxShadow: '3xl',
              }}
            >
              <Flex align="center" mb={3}>
                {tokenDataObjects[i]?.logo && (
                  <Image
                    src={tokenDataObjects[i].logo}
                    boxSize="36px"
                    mr={3}
                    borderRadius="full"
                  />
                )}
                <Heading size="sm">
                  {tokenDataObjects[i]?.symbol || 'UNKNOWN'}
                </Heading>
              </Flex>

              <Text
                fontSize="xl"
                fontWeight="bold"
                overflowWrap="break-word"
                wordBreak="break-all"
              >
                {Utils.formatUnits(
                  e.tokenBalance,
                  tokenDataObjects[i]?.decimals
                )}
              </Text>


              <Text fontSize="xs" opacity={0.6} mt={3}>
                {e.contractAddress.slice(0, 6)}...
                {e.contractAddress.slice(-4)}
              </Text>
            </Flex>
          ))}
        </SimpleGrid>
      </>
    )}
  </Box>
);
}

export default App;
async function main() {
    const Counter = await hre.ethers.getContractFactory('Counter');
    const counter = await Counter.deploy();

    console.log(`Counter deployed to: ${await counter.getAddress()}`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
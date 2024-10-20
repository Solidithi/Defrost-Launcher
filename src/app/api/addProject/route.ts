import { ethers } from "ethers";
import { NextRequest, NextResponse } from "next/server";
import { prismaClient } from "@/*";
import contractArtifact from "../../../abi/ProjectPoolFactory.json";
import { title } from "process";
import { ContractEvent } from "@thirdweb-dev/react";

const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

export async function POST(req: NextRequest, res: NextResponse) {
  const body = await req.json();
  console.log(body);

  const {
    verifyTokenData,
    generalDetailData,
    promotionData,
    smartContractEventData,
  } = body;
  console.log("This is comb " + generalDetailData.selectedImages);
  if (!verifyTokenData || !generalDetailData || !promotionData) {
    return NextResponse.json(
      { success: false, error: "Missing data" },
      { status: 400 }
    );
  }
  console.log("Event " + smartContractEventData);

  console.log("General " + generalDetailData.selectedCoin);
  console.log("Promotion " + promotionData.endDate);

  //verifyTokenPage
  // const verifyToken = verifyTokenData[0];

  //generalDetailPage
  const selectedVToken = generalDetailData.selectedCoin; //selectedToken address
  const selectedImages = generalDetailData.selectedImages;
  const selectedLogo = generalDetailData.selectedLogo;
  const projectTitle = generalDetailData.projectTitle;
  const shortDescription = generalDetailData.shortDescription;
  const longDescription = generalDetailData.longDescription;

  //promotionPage
  // const tokenExchangeRate = promotionData[0];
  // const amountTokenRelease = promotionData[1];
  // const softCap = promotionData[1];
  // const hardCap = promotionData[2];
  // const minInvest = promotionData[3];
  // const maxInvest = promotionData[4];
  const startDate = promotionData.startDate;
  const endDate = promotionData.endDate;
  // )
  const eventData: ContractEvent = smartContractEventData[0];
  console.log(eventData);
  const projectiD = eventData.data; /*** @notice */

  console.log(projectiD);

  const txnHashCreated = eventData.transaction.transactionHash; /*** @notice */

  //Convert date to unix time to fit the contract uint256
  const startTimed = new Date(startDate);
  const unixTime = Math.floor(startTimed.getTime() / 1000); ///FOMRATED to uint256
  const endTimed = new Date(endDate);
  const unixTimeEnd = Math.floor(endTimed.getTime() / 1000); //FORMATED to uint256

  // await prismaClient.project.create({
  //     data: {

  // const {tokenAddress, tokenF  orSale, pricePerToken, startTime, endTime, minInvest, maxInvest } = body; //projectName missing
  // const {tokenAddress, tokenForSale, pricePerToken, startTime, endTime, minInvest, maxInvest, projectName } = {
  //     tokenAddress: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
  //     tokenForSale: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
  //     pricePerToken: 100,
  //     startTime: 100,
  //     endTime: 100,
  //     minInvest: 100,
  //     maxInvest: 100,
  //     projectName: "projectName"
  // };
  try {
    // const provider = new ethers.providers.Web3Provider(window.ethereum);
    // const signer = provider.getSigner();
    // const contractABI = contractArtifact.abi;
    // const contract = new ethers.Contract(
    //     contractAddress,
    //     contractABI,
    //     signer,
    // )
    // const addProject = contract.createProjectpool(
    //     verifyToken, tokenExchangeRate, unixTime, unixTimeEnd,
    //     minInvest, maxInvest, softCap, hardCap,
    //     /**@notice reward, */
    //     selectedVToken

    const data = await prismaClient.project.create({
      data: {
        // projectID:  projectiD,
        projectTitle: projectTitle,
        projectLogoImageUrl: selectedLogo,
        description: longDescription,
        shortDescription: shortDescription,
        projectImageUrls: selectedImages,
        startDate: startDate,
        endDate: endDate,
        txnHashCreated: txnHashCreated,
      },
    });
    console.log(data);
  } catch (error) {
    console.log(error);
    return NextResponse.json({ success: false, error: error }, { status: 400 });
  }
  return NextResponse.json({ success: true });
}

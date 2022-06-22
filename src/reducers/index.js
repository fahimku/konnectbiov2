import { combineReducers } from "redux";
import auth from "./auth";
import navigation from "./navigation";
import alerts from "./alerts";
import layout from "./layout";
import users from "./usersReducers";
import categories from "./category/categories";
import posts from "./post/post";
import { connectRouter } from "connected-react-router";
import countries from "./countries/countries";
import campaign from "./campaign/campaign";
import marketPlace from "./marketPlace/marketPlace";
import addCampaignToShop from "./marketPlace/addCampaignToShop";
import instagram from "./instagram/instagram";
import links from "./links/links";
import campaignSummary from "./campaign/campaignSummary";
import bioShopSummary from "./campaign/bioshopSummary";
import dashboard from "./dashboard";
import campaignAnalytics from "./campaign/campaignAnalytics";
import brands from "./brands/brands";
import brandsCategory from "./brands/brandsCategory";
import categoryById from "./brands/categoryById";
import bioshop from "./bioshop/bioshop";
import singleBioShop from "./bioshop/singleBioShop";
import postSummary from "./post/postSummary";
import chat from "./chat";
import hashtags from "./hashtags/hashtags";
import hashtag from "./hashtags/hashtag";
import tags from "./mention/tags";
import profile from "./searchProfile/profiles";
import profiles from "./searchProfile/addProfile";
import instagramAnalytic from "./analytics/instagramAnalytic";
import instagramUserData from "./instagramUserData";
import instagramPostData from "./myposts/instagramPostData";
import gallery from "./instagram/gallery";
import schedulePosts from "./instagram/schedulePosts";
import mobileDropdown from "./mobileDropdrown";
import mediaSummary from "./media/mediaSummary";
import affiliateTransactions from "./affiliateTransactions/affiliateTransactions";
import affiliateCampaigns from "./affiliateTransactions/affiliateCampaigns";
import affiliateSales from "./affiliateTransactions/affiliateSales";
import affiliateSalesInf from "./marketplaceTransactions/marketPlaceSales";
import affiliateRequest from "./affiliateTransactions/affiliateRequest";
// import affiliateInfluencers from "./affiliateTransactions/affiliateInfluencers";
import campaignDetailTransactions from "./affiliateTransactions/campaignDetailTransactions";
import influencerDetailTransactions from "./affiliateTransactions/influencerDetailTransactions";

import marketplaceTransactions from "./marketplaceTransactions/marketplaceTransactions";
import marketplaceBrands from "./marketplaceTransactions/marketplaceBrands";
import marketplaceCampaigns from "./marketplaceTransactions/marketplaceCampaigns";
import marketplaceDetailTransactions from "./marketplaceTransactions/marketplaceDetailTransactions";
import marketplaceApproval from "./marketplaceBrand/marketplaceApproval";

import affiliateCards from "./affiliateDeposit/affiliateCards";
import affiliatePayment from "./affiliateDeposit/affiliatePayment";
import affiliateBalance from "./affiliateDeposit/affiliateBalance";
import addAffiliateRequest from "./affiliateTransactions/addAffiliateRequest";

import promoRequest from "./promoRequest/promoCode";
import shopifyDetail from "./shopifySetup/shopifyDetail";

import affiliateBillingDetail from "./affiliateBilling/affiliateBillingDetail";
import affiliateContractDetail from "./affiliateBilling/affiliateContractDetail";
import shopifyTracker from "./shopifyTrackers/shopifyTracker";
import userInfo from "./userInfo/userInfo";
import bioPosts from "./biopost/biopost";

export default (history) =>
  combineReducers({
    router: connectRouter(history),
    links,
    chat,
    brands,
    addCampaignToShop,
    brandsCategory,
    categoryById,
    alerts,
    auth,
    navigation,
    dashboard,
    layout,
    users,
    bioshop,
    singleBioShop,
    categories,
    posts,
    countries,
    campaign,
    marketPlace,
    instagram,
    campaignSummary,
    bioShopSummary,
    campaignAnalytics,
    postSummary,
    hashtags,
    hashtag,
    tags,
    profile,
    profiles,
    instagramAnalytic,
    instagramUserData,
    instagramPostData,
    gallery,
    schedulePosts,
    mobileDropdown,
    mediaSummary,
    affiliateTransactions,
    affiliateCampaigns,
    affiliateSales,
    affiliateSalesInf,
    affiliateRequest,
    // affiliateInfluencers,
    campaignDetailTransactions,
    influencerDetailTransactions,
    marketplaceTransactions,
    marketplaceBrands,
    marketplaceCampaigns,
    marketplaceDetailTransactions,
    affiliateCards,
    affiliatePayment,
    addAffiliateRequest,
    affiliateBalance,
    promoRequest,
    marketplaceApproval,
    shopifyDetail,
    affiliateBillingDetail,
    affiliateContractDetail,
    shopifyTracker,
    userInfo,
    bioPosts,
  });

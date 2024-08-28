const companyName = "Cladily";
const facebookUrl = "https://facebook.com";
const twitterUrl = "https://twitter.com";
const instagramUrl = "https://instagram.com";
const linkedinUrl = "https://linkedin.com";
const companyEmail = "contact@cladily.com";
const companyPhone = "+91 7635022185";
const companyAddress = "360020 Rajkot, Gujarat, India";

const productNavLink = [
  { name: "Featured Picks", link: "featured-picks" },
  { name: "Trending Now", link: "trending-now" },
  { name: "Editor's Choice", link: "editors-choice" },
  { name: "Top Rated", link: "top-rated" },
  { name: "Customer Favorites", link: "customer-favorites" },
];

const products = [
  {
    id: 1,
    name: "Classic White T-Shirt",
    price: "1,564 INR",
    imageUrls: [
      "https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcT4BqVULnk8jq-y5kIzr23mJ2jDVxORXzi6vVHE8YifS5k1qRH_Kcitwt5SPIYVVpgE8DfPEWM-BeADe_Mkn_4nBVZEkFm8wFxBmjWXi2_dsG1-gJIHowhH",
      "https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcS2g_krORgbbQy7rzRLFzTgTrypoeQe1lJIphy8QUrxdizE_xl4R8gr0rzK6CkdY-kxd1xxYNUrEy_2So8veXtVmdte5xGwrcUlP5Df9vIKVwvZVY8o7Ixm-Q",
      "https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcRPxyWsgCdhyeufXpGNm5zRRxOltY-8EF5MWt1IogvtiRkLvpynkkudTFpfEWqNeVK-Yab2qSZ4c7SgfAjk3ISuikvkISgrS66hkceKDv-ZFFOgHhj6I9Ef",
    ],
    sizes: ["S", "M", "L", "XL"],
  },
  {
    id: 2,
    name: "Summer Floral Dress",
    price: "2,999 INR",
    imageUrls: [
      "https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcTn9NEV8crfwl6MbZjO5Ku4js1bdnPJpOQslVXlH1nHjnCkqA6lm0tc2lJsL6U4anSkPHNTQ2O1_lzyxgNPQd153DIW07s3EVQ4PL3mvBQ",
      "https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcTzzfJrIUnhjTBVMNMr7Eg7GoV0LLFgyb1r-Ic0x64NaNkTV0MvSjOe_5a3Mg9ioMf6x5ilT5P6_xmHazfbUN_Pf4e917jetW1c9SpdCG4p",
      "https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcT4RzSUlpFIq3ujwWTxQf6eN1Ed2DgHRgduddo-Y_AagTO7EcBPaYk9oDiBXtPSjjwyHfc8SX57k4MxeQZ64slrYWGq9NfSVgrM22HmufM",
      "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcQFtJSmcLHYhuac21fxJE8KI6zG3TRMhAuMVhnzFqkfn1pv1EdPTo6jE7PDfyQKVzjbIVNISXgFb5OpF5UnJtCVXuUFeO7v4KzO99hK_0k",
    ],
    sizes: ["M", "L"],
  },
  {
    id: 3,
    name: "Denim Jacket",
    price: "2,599 INR",
    imageUrls: [
      "https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcQ0nBEd2AsxHRqZLf8o3nckyZGn8QpoyXReIqxGwJTyehi_uzbqOOdjww82Om8OhjEJTxqCyaBJq-SK1PoFSMHyduQgYcQslaHPP3b_58o",
      "https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcQ7X5O2XIc1IdZYiEEFxXcW3rL4xOCH8KLTdiL0xBH_o9gEBNQ7o0LHdlPEcQKYO1F0dKmXxiNYIkV_05X5PT9aO6lDIcSP-auYgd-j-AO9b5fm3QAbWwUK",
      "https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcRn0VBKK_XuLonPEjkEZP8TBZq9zeaqVv7vYk7LV51Qm-AXqO3_aeWMD6K6sCOKfQudrmZaQR03rTpmQuHxCvtzyhtweBkTWnfeiv3ny5KZ",
    ],
    sizes: ["S", "L", "XL"],
  },
  {
    id: 4,
    name: "Cozy Knit Sweater",
    price: "2,879 INR",
    imageUrls: [
      "https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcTvDOPTdII1i3sPSX_cXuN-iRpF8k9lxR6xVcWBm7gcUzWlP3k3Ud-FTN_Eae18lTdDX2HWZaVYh2wV8rF_0NiAr62K5EiHBkTk_CCMj3M",
      "https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcS4sO5I78savGhAiIonQczAV-qZpeArfmL-E2a3Gi2-eQ6ERh8bFwNhlFR3g0xcjTWd1nfb8aAIbv8d1bJix7CWh2QYxZHbZ3jIbicduwmpecYetgdYBKBy",
      "https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcR96Vei3hewwwypyJa4TaeAMjS-MKqY6m2S-NP092hPVt2glBLOtJlYKuP1FqjPPnEhotv_30SQwJoEsxrkN-19_5GbrkYacFygXW30ZI4S9tgMCa12pgBS",
      "https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcQjoQEqOWhnWkvExmtIXmxeFWe7mkFtBYcG2ZF_51jMj-o6YCUDldvVE4Ttx9BSvlj3YCJl9DOWudojUQwjz5QUN2wEslerrCSsHctuGYbT",
    ],
    sizes: ["S", "M", "XL"],
  },
  {
    id: 5,
    name: "Formal Black Pants",
    price: "2,976 INR",
    imageUrls: [
      "https://static.zara.net/assets/public/b435/c974/bbb04b3c9259/8946526c9f70/06861441800-e1/06861441800-e1.jpg?ts=1704788324552&w=1126",
      "https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcTEvkkYQ4CXVwIbo5FQRMjM-LvUtXYgnnJ0-w4qj7kRVpwSl5jPYhBBZ7nNodPaaNHnVsoxeS_LkDqduC0o5UYajyaDXmAJ6xXELQ9ZJzpBZulak-F_mCaq",
      "https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcT2jJkAS9RjoJFqe1bIpOM4eiLouGL4qQ6G5m2RQFcspQ6NmxOvd2U6J7vVuTUva4Th_7VjgMf97RgWu12epW74Xd47q2OteGtPx8qoxlQ",
    ],
    sizes: ["M", "L", "XL"],
  },
  {
    id: 6,
    name: "Casual Polo Shirt",
    price: "1,799 INR",
    imageUrls: [
      "https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcRWFB8uyqww57QwH1MZtt-6x8wGdyeoSpKklICoLteB083fURwP0orCSCObE3k5djEzJmGORUeTE7xeLu-418-4fFbTg7V5U9Lh-IrST0M",
      "https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcTJuEdmPyzYa3BU2TZU32r2aF1LHqcaYMMer_fDM7aExulq9wcXaEtWXQktuLDGZ3CLGC17_UNDGzpx-mh3jRv4seNi2GC29-5D9ifPhV0",
      "https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcSWEBuWwJ8eK20PlH2hlup7bg6wRbM0wsBgVwah2Z88P8r4WXetMfBvaUUu7S3-r3VB79EelwDIRP54OJ049biZAVlHgrAHP6zsb1lvdcSX",
    ],
    sizes: ["S", "M", "L"],
  },
  {
    id: 7,
    name: "Striped Maxi Dress",
    price: "3,249 INR",
    imageUrls: [
      "https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcSCoGWTBRb-_DpBF31ySvtbQuh_q8dHSOPkDTbyrz96MTsw4UGAgJD9sEBO93eWog0LGTvjGGoy6tn5nIJN7I3wirDoG7HCFatIJ-Og_Gw",
      "https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcSFIIJvvUdBdm7kqomf672CHeZ5PScWfwWC9E2BV4MWBhx6xaAF2me67bWCpneKTK4DdnpCZ-SDBJSuMswkoFaJEmfMlytAdCchSk_jsQEp",
      "https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcS1XQ39oVbR1nwqgmgc62O7XCfm9AT1VjjQ_vIO1eBzhZwm4Z9u-_wXTmYRe9jgBgmcivmLBXujUHiqPJ76jVuVnZoGMlyWnZwoXppFHNbsS6u06iWpHbgc",
      "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcQ-PM1Yfsa4SuUpS9w9q90_01Cg6NvWQYINFeF-cxIqkis5lUYajItZM91xbwiqIqhz73JRO0wi-sgZ718XlX4XRxrkc28gwpc1I9h7o_rv",
      "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcQmxT47zOjXeVEutWRC-psQLCXiwRTeSr5G7EBtaE2VE4-teFTKLOOVwxAhpXEEjNQYJfYGxLaL544AaNaeZHHexj0rBOXgx7OsN3jbJn2L",
    ],
    sizes: ["M", "L"],
  },
  {
    id: 8,
    name: "Leather Biker Jacket",
    price: "4,299 INR",
    imageUrls: [
      "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcTv10AvuVee5CJ5Zr4Z4LzKOkuKaIbwtNmkmhV0VXdIJakGcWgzMTQlJvK5LL2kS8w3GogSByjU3zLYBnYxLeHcCoJsQXNU08YPaCmtDiA",
      "https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcRzD0tQiLdyAX-l-SHUhQz3D8cybsBfWPNgHiDocxPAcHWGQPoNbXED6acfjox_jD_lVb7VPtskqeTDYCTRnzh_V5MEZs8_5OF-nsQnr1b7Ytz9cJFApTa7",
      "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcQkwDWq5HAa0QlYDhwYrrEL_VDo18pyWVMU37ZoH4NcSStqPiPZ7NemD3MqlGmLK8HSMYJSuAFNaBuuf8Sa2KpkrrpKvJJ-JQkEpoGmZh9p",
    ],
    sizes: ["S", "M", "L"],
  },
  {
    id: 9,
    name: "Chino Shorts",
    price: "1,899 INR",
    imageUrls: [
      "https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcTmA-jNUHelZ-L0NG_8sDPnH3N-XtucxPc8uCMKt9HCifh_avLKZDjH28N1qqq3y6eYUJoG0MpWNdRntslwiuiFz71_XAfU7vLduofpN3ND",
      "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcQugX1KnGs1pSGXXAdLo5GW-sQgc2Hc4Vdn-hgc10Au2LKRPtLQrakhOiXBifKT7QwV9XjaqmMM9wOJeCVpbYTuXZxBLv-j1Q",
      "https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcQPP7mt0tr1c8qAw7IWUxUIlBnxADf3w3jkPqn3B4SvlLxNzOoaTtvNYd0ey-9YDurXRVtvt_MCUsqtBlB8VbFirQQI_L8IyQzL8HgTnjktwgSy9_cHy6qyaw",
      "https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcRQnzEOfLYJY8mcln8mw0nH69XoPxd6XRQYT-LdZ7Igpj-oBd9F4qlS0Ej_8Pomjrqt0dvI1NtOykasbWx02TmG7cl2QVA9xaI4AWKXnoSQCQUaTXUZLUYX",
    ],
    sizes: ["M", "L", "XL"],
  },
];

export {
  companyName,
  facebookUrl,
  twitterUrl,
  instagramUrl,
  linkedinUrl,
  companyEmail,
  companyPhone,
  companyAddress,
  productNavLink,
  products,
};

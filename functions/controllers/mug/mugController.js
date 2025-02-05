const fs = require("fs");
const path = require("path");
const axios = require("axios");
const { Font } = require("canvacord");
const { NymPostfive } = require("../../services/nymPost_5.jsx");
const { NymPostsix } = require("../../services/nymPost_6.jsx");
require("dotenv").config();
const {
  getBase64FromFile,
  generateUniqueFileName,
} = require("../../helper/helper.js");
const {
  uploadImageToPrintify,
} = require("../printifyPost/printifyController.js");
const { publishData } = require("../shopify/shopifyController.js");

//const token = process.env.PRINTIFY_ACCESS_TOKEN;
const shopId = process.env.PRINTIFY_SHOP_ID;
const PrintifyToken = require("../../models/printify_token.js");

const getToken = async () => {
  try {
    const tokenData = await PrintifyToken.findOne();
    if (!tokenData) {
      throw new Error("No token found in the database.");
    }
    return tokenData.token;
  } catch (error) {
    throw new Error(`Error fetching token: ${error.message}`);
  }
};

const createMug = async (name, type, definition, tags, product_description) => {
  try {
    const token = await getToken();
    let blackCard;
    let redCard;
    let pinkCard;
    let blueCard;
    let navyCard;

    let blackCard2;
    let redCard2;
    let pinkCard2;
    let blueCard2;
    let navyCard2;

    //width, definition width, definition height, left

    if (type == 1) {
      blackCard = new NymPostsix({
        width: 2475, //2475
        height: 1375, //1155, 1275
        nymFontSize: "160px",
        nymLineHeight: "17px",
        definitionFontSize: "67px",
        definitionLineHeight: "58px", //17
        Nym: name,
        Definition: definition,
        NymColor: "#000000",
        formatNym: true,
        top: 460, //360
        definitionTop: 547,
        left: 50, //76, 50
        nymWidth: 920,
        definitionWidth: 800, //849
        nymHeight: 182,
        definitionHeight: 38, //88 , 78, 68, 58
      });

      redCard = new NymPostsix({
        width: 2475,
        height: 1375, //1155
        nymFontSize: "160px",
        nymLineHeight: "17px",
        definitionFontSize: "67px",
        definitionLineHeight: "58px", //17
        Nym: name,
        Definition: definition,
        NymColor: "#A92A1A",
        formatNym: true,
        top: 460, //360
        definitionTop: 547,
        left: 50, //76
        nymWidth: 920,
        definitionWidth: 800,
        nymHeight: 182,
        definitionHeight: 38,
      });

      pinkCard = new NymPostsix({
        width: 2475,
        height: 1375, //1155
        nymFontSize: "160px",
        nymLineHeight: "17px",
        definitionFontSize: "67px",
        definitionLineHeight: "58px", //17
        Nym: name,
        Definition: definition,
        NymColor: "#E0A19B",
        formatNym: true,
        top: 460, //360
        definitionTop: 547,
        left: 50, //76
        nymWidth: 920,
        definitionWidth: 800,
        nymHeight: 182,
        definitionHeight: 38,
      });

      blueCard = new NymPostsix({
        width: 2475,
        height: 1375, //1155
        nymFontSize: "160px",
        nymLineHeight: "17px",
        definitionFontSize: "67px",
        definitionLineHeight: "58px", //17
        Nym: name,
        Definition: definition,
        NymColor: "#4182A1",
        formatNym: true,
        top: 460, //360
        definitionTop: 547,
        left: 50, //76
        nymWidth: 920,
        definitionWidth: 800,
        nymHeight: 182,
        definitionHeight: 38,
      });

      navyCard = new NymPostsix({
        width: 2475,
        height: 1375, //1155
        nymFontSize: "160px",
        nymLineHeight: "17px",
        definitionFontSize: "67px",
        definitionLineHeight: "58px", //17
        Nym: name,
        Definition: definition,
        NymColor: "#191838",
        formatNym: true,
        top: 460, //360
        definitionTop: 547,
        left: 50, //76
        nymWidth: 920,
        definitionWidth: 800,
        nymHeight: 182,
        definitionHeight: 38,
      });

      //15 oz
      blackCard2 = new NymPostsix({
        width: 2475,
        height: 1275,
        nymFontSize: "160px",
        nymLineHeight: "17px",
        definitionFontSize: "67px",
        definitionLineHeight: "58px", //17
        Nym: name,
        Definition: definition,
        NymColor: "#000000",
        formatNym: true,
        top: 460,
        definitionTop: 547,
        left: 0,
        nymWidth: 920,
        definitionWidth: 800,
        nymHeight: 182,
        definitionHeight: 38,
        leftPadding: 20,
      });

      redCard2 = new NymPostsix({
        width: 2475,
        height: 1275,
        nymFontSize: "160px",
        nymLineHeight: "17px",
        definitionFontSize: "67px",
        definitionLineHeight: "58px", //17
        Nym: name,
        Definition: definition,
        NymColor: "#A92A1A",
        formatNym: true,
        top: 460,
        definitionTop: 547,
        left: 0,
        nymWidth: 920,
        definitionWidth: 800,
        nymHeight: 182,
        definitionHeight: 38,
        leftPadding: 20,
      });

      pinkCard2 = new NymPostsix({
        width: 2475,
        height: 1275,
        nymFontSize: "160px",
        nymLineHeight: "17px",
        definitionFontSize: "67px",
        definitionLineHeight: "58px", //17
        Nym: name,
        Definition: definition,
        NymColor: "#E0A19B",
        formatNym: true,
        top: 460,
        definitionTop: 547,
        left: 0,
        nymWidth: 920,
        definitionWidth: 800,
        nymHeight: 182,
        definitionHeight: 38,
        leftPadding: 20,
      });

      blueCard2 = new NymPostsix({
        width: 2475,
        height: 1275,
        nymFontSize: "160px",
        nymLineHeight: "17px",
        definitionFontSize: "67px",
        definitionLineHeight: "58px", //17
        Nym: name,
        Definition: definition,
        NymColor: "#4182A1",
        formatNym: true,
        top: 460,
        definitionTop: 547,
        left: 0,
        nymWidth: 920,
        definitionWidth: 800,
        nymHeight: 182,
        definitionHeight: 38,
        leftPadding: 20,
      });

      navyCard2 = new NymPostsix({
        width: 2475,
        height: 1275,
        nymFontSize: "160px",
        nymLineHeight: "17px",
        definitionFontSize: "67px",
        definitionLineHeight: "58px", //17
        Nym: name,
        Definition: definition,
        NymColor: "#191838",
        formatNym: true,
        top: 460,
        definitionTop: 547,
        left: 0,
        nymWidth: 920,
        definitionWidth: 800,
        nymHeight: 182,
        definitionHeight: 38,
        leftPadding: 20,
      });
    }

    if (type == 2) {
      blackCard = new NymPostfive({
        width: 2475,
        height: 1155,
        nymFontSize: "160px", //160
        nymLineHeight: "100px", //155, 140
        Nym: name,
        NymColor: "#000000",
        formatNym: false,
        top: 470,
        left: 76,
        nymWidth: 920,
        nymHeight: 140, //182, 160
      });

      redCard = new NymPostfive({
        width: 2475,
        height: 1155,
        nymFontSize: "160px",
        nymLineHeight: "100px",
        Nym: name,
        NymColor: "#A92A1A",
        formatNym: false,
        top: 470,
        left: 76,
        nymWidth: 920,
        nymHeight: 140,
      });

      blueCard = new NymPostfive({
        width: 2475,
        height: 1155,
        nymFontSize: "160px",
        nymLineHeight: "100px",
        Nym: name,
        NymColor: "#4182A1",
        formatNym: false,
        top: 470,
        left: 76,
        nymWidth: 920,
        nymHeight: 140,
      });

      pinkCard = new NymPostfive({
        width: 2475,
        height: 1155,
        nymFontSize: "160px",
        nymLineHeight: "100px",
        Nym: name,
        NymColor: "#E0A19B",
        formatNym: false,
        top: 470,
        left: 76,
        nymWidth: 920,
        nymHeight: 140,
      });

      navyCard = new NymPostfive({
        width: 2475,
        height: 1155,
        nymFontSize: "160px",
        nymLineHeight: "100px",
        Nym: name,
        NymColor: "#191838",
        formatNym: false,
        top: 470,
        left: 76,
        nymWidth: 920,
        nymHeight: 140,
      });

      //15oz

      blackCard2 = new NymPostfive({
        width: 2475,
        height: 1275,
        nymFontSize: "160px",
        nymLineHeight: "100px",
        Nym: name,
        NymColor: "#000000",
        formatNym: false,
        top: 558,
        left: 1,
        nymWidth: 920,
        nymHeight: 140,
      });

      redCard2 = new NymPostfive({
        width: 2475,
        height: 1275,
        nymFontSize: "160px",
        nymLineHeight: "100px",
        Nym: name,
        NymColor: "#A92A1A",
        formatNym: false,
        top: 558,
        left: 1,
        nymWidth: 920,
        nymHeight: 140,
      });

      blueCard2 = new NymPostfive({
        width: 2475,
        height: 1275,
        nymFontSize: "160px",
        nymLineHeight: "100px",
        Nym: name,
        NymColor: "#4182A1",
        formatNym: false,
        top: 558,
        left: 1,
        nymWidth: 920,
        nymHeight: 140,
      });

      pinkCard2 = new NymPostfive({
        width: 2475,
        height: 1275,
        nymFontSize: "160px",
        nymLineHeight: "100px",
        Nym: name,
        NymColor: "#E0A19B",
        formatNym: false,
        top: 558,
        left: 1,
        nymWidth: 920,
        nymHeight: 140,
      });

      navyCard2 = new NymPostfive({
        width: 2475,
        height: 1275,
        nymFontSize: "160px",
        nymLineHeight: "100px",
        Nym: name,
        NymColor: "#191838",
        formatNym: false,
        top: 558,
        left: 1,
        nymWidth: 920,
        nymHeight: 140,
      });
    }

    if (type == 3) {
      blackCard = new NymPostfive({
        width: 2475,
        height: 1155,
        nymFontSize: "160px",
        nymLineHeight: "140px", //155
        Nym: name,
        NymColor: "#000000",
        formatNym: true,
        top: 470,
        left: 76,
        nymWidth: 920,
        nymHeight: 140,
      });

      redCard = new NymPostfive({
        width: 2475,
        height: 1155,
        nymFontSize: "160px",
        nymLineHeight: "140px",
        Nym: name,
        NymColor: "#A92A1A",
        formatNym: true,
        top: 470,
        left: 76,
        nymWidth: 920,
        nymHeight: 140,
      });

      pinkCard = new NymPostfive({
        width: 2475,
        height: 1155,
        nymFontSize: "160px",
        nymLineHeight: "140px",
        Nym: name,
        NymColor: "#E0A19B",
        formatNym: true,
        top: 470,
        left: 76,
        nymWidth: 920,
        nymHeight: 140,
      });

      blueCard = new NymPostfive({
        width: 2475,
        height: 1155,
        nymFontSize: "160px",
        nymLineHeight: "140px",
        Nym: name,
        NymColor: "#4182A1",
        formatNym: true,
        top: 470,
        left: 76,
        nymWidth: 920,
        nymHeight: 140,
      });

      navyCard = new NymPostfive({
        width: 2475,
        height: 1155,
        nymFontSize: "160px",
        nymLineHeight: "140px",
        Nym: name,
        NymColor: "#191838",
        formatNym: true,
        top: 470,
        left: 76,
        nymWidth: 920,
        nymHeight: 140,
      });

      //15oz

      blackCard2 = new NymPostfive({
        width: 2475,
        height: 1275,
        nymFontSize: "160px",
        nymLineHeight: "140px",
        Nym: name,
        NymColor: "#000000",
        formatNym: true,
        top: 546,
        left: 1,
        nymWidth: 920,
        nymHeight: 140,
      });

      redCard2 = new NymPostfive({
        width: 2475,
        height: 1275,
        nymFontSize: "160px",
        nymLineHeight: "140px",
        Nym: name,
        NymColor: "#A92A1A",
        formatNym: true,
        top: 546,
        left: 1,
        nymWidth: 920,
        nymHeight: 140,
      });

      pinkCard2 = new NymPostfive({
        width: 2475,
        height: 1275,
        nymFontSize: "160px",
        nymLineHeight: "140px",
        Nym: name,
        NymColor: "#E0A19B",
        formatNym: true,
        top: 546,
        left: 1,
        nymWidth: 920,
        nymHeight: 140,
      });

      blueCard2 = new NymPostfive({
        width: 2475,
        height: 1275,
        nymFontSize: "160px",
        nymLineHeight: "140px",
        Nym: name,
        NymColor: "#4182A1",
        formatNym: true,
        top: 546,
        left: 1,
        nymWidth: 920,
        nymHeight: 140,
      });

      navyCard2 = new NymPostfive({
        width: 2475,
        height: 1275,
        nymFontSize: "160px",
        nymLineHeight: "140px",
        Nym: name,
        NymColor: "#191838",
        formatNym: true,
        top: 546,
        left: 1,
        nymWidth: 920,
        nymHeight: 140,
      });
    }
    let blackImageId = null;
    let redImageId = null;
    let pinkImageId = null;
    let blueImageId = null;
    let navyImageId = null;

    let blackImageId2 = null;
    let redImageId2 = null;
    let pinkImageId2 = null;
    let blueImageId2 = null;
    let navyImageId2 = null;

    const cards = [
      { card: blackCard, color: "black", variable: "blackImageId" },
      { card: redCard, color: "red", variable: "redImageId" },
      { card: pinkCard, color: "pink", variable: "pinkImageId" },
      { card: blueCard, color: "blue", variable: "blueImageId" },
      { card: navyCard, color: "navy", variable: "navyImageId" },

      { card: blackCard2, color: "black", variable: "blackImageId2" },
      { card: redCard2, color: "red", variable: "redImageId2" },
      { card: pinkCard2, color: "pink", variable: "pinkImageId2" },
      { card: blueCard2, color: "blue", variable: "blueImageId2" },
      { card: navyCard2, color: "navy", variable: "navyImageId2" },
    ];

    for (const { card, color, variable } of cards) {
      const image = await card.build({ format: "png" });
      const fileName = generateUniqueFileName();
      const filePath = path.join(
        __dirname,
        "../../public/assets/images",
        fileName
      );

      fs.writeFileSync(filePath, image);
      const base64Image = await getBase64FromFile(filePath);
      try {
        if (variable === "blackImageId") {
          blackImageId = await uploadImageToPrintify(
            fileName,
            base64Image,
            token
          );
        } else if (variable === "redImageId") {
          redImageId = await uploadImageToPrintify(
            fileName,
            base64Image,
            token
          );
        } else if (variable === "pinkImageId") {
          pinkImageId = await uploadImageToPrintify(
            fileName,
            base64Image,
            token
          );
        } else if (variable === "blueImageId") {
          blueImageId = await uploadImageToPrintify(
            fileName,
            base64Image,
            token
          );
        } else if (variable === "navyImageId") {
          navyImageId = await uploadImageToPrintify(
            fileName,
            base64Image,
            token
          );
        } else if (variable === "redImageId2") {
          redImageId2 = await uploadImageToPrintify(
            fileName,
            base64Image,
            token
          );
        } else if (variable === "pinkImageId2") {
          pinkImageId2 = await uploadImageToPrintify(
            fileName,
            base64Image,
            token
          );
        } else if (variable === "blueImageId2") {
          blueImageId2 = await uploadImageToPrintify(
            fileName,
            base64Image,
            token
          );
        } else if (variable === "navyImageId2") {
          navyImageId2 = await uploadImageToPrintify(
            fileName,
            base64Image,
            token
          );
        } else if (variable === "blackImageId2") {
          blackImageId2 = await uploadImageToPrintify(
            fileName,
            base64Image,
            token
          );
        }
        fs.unlinkSync(filePath);
      } catch (error) {
        return;
      }
    }

    // 4. Create a product in Printify
    const productResponse = await axios.post(
      `https://api.printify.com/v1/shops/${shopId}/products.json`,
      {
        title: `${name} Coffee Mug`,
        description: `<div class="candle-description">
            <h2>Accent Coffee Mug</h2>
            <p>${product_description}</p>
            <p>
              Meet your next favorite morning companion, the accented ceramic mug. This mug brings the perfect blend of style and functionality to elevate your coffee or tea ritual. Available in two generous sizes, 11oz (0.33 l) and 15oz (0.44 l), this mug offers ample space for your favorite brew. Made with white ceramic and sporting a sleek glossy finish with eye-catching contrast, this mug is a bliss both to use and to look at. The ergonomic C-shaped handle provides a comfortable grip, while the lead and BPA-free construction guarantee peace of mind with every sip.
            </p>

            <ul>
              <li><strong>Material:</strong> White ceramic with colored interior and handle</li>
              <li><strong>Available sizes:</strong> 11oz (0.33 l) and 15oz (0.44 l)</li>
              <li><strong>Colors:</strong> Choose from 5 interior and handle colors</li>
              <li><strong>Handle:</strong> C-shaped handle</li>
              <li><strong>Finish:</strong> Glossy finish</li>
              <li><strong>Design:</strong> Eye-catching color contrast</li>
              <li><strong>Safety:</strong> Lead and BPA-free</li>
            </ul>

          </div>
            <div style="overflow-x:auto;">
              <table style="border-collapse: collapse; width: 100%; text-align: left; min-width: 600px;">
                <thead>
                  <tr>
                    <th style="border: 1px solid #ddd; padding: 8px;"></th>
                    <th style="border: 1px solid #ddd; padding: 8px;">11oz</th>
                    
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style="border: 1px solid #ddd; padding: 8px;">Height, in</td>
                    <td style="border: 1px solid #ddd; padding: 8px;">3.78</td>
                  </tr>
                  <tr>
                    <td style="border: 1px solid #ddd; padding: 8px;">Diamter , in</td>
                    <td style="border: 1px solid #ddd; padding: 8px;">3.23</td>
                  </tr>
                </tbody>
              </table>
            </div>`,
        blueprint_id: 635,
        print_provider_id: 28,
        tags: tags,
        variants: [
          {
            id: 72180,
            price: 899,
            is_enabled: true,
          },
          {
            id: 72182,
            price: 899,
            is_enabled: true,
          },
          {
            id: 72183,
            price: 899,
            is_enabled: true,
          },
          {
            id: 72184,
            price: 899,
            is_enabled: true,
          },
          {
            id: 105883,
            price: 1099,
            is_enabled: true,
          },
          {
            id: 105885,
            price: 1099,
            is_enabled: true,
          },
          {
            id: 105886,
            price: 1099,
            is_enabled: true,
          },
          {
            id: 105887,
            price: 1099,
            is_enabled: true,
          },
          {
            id: 105888,
            price: 899,
            is_enabled: true,
          },
          {
            id: 105889,
            price: 1099,
            is_enabled: true,
          },
        ],
        print_areas: [
          {
            variant_ids: [72180],
            placeholders: [
              {
                position: "front",
                images: [
                  {
                    id: blackImageId,
                    x: 0.5,
                    y: 0.5,
                    scale: 1,
                    angle: 0,
                  },
                ],
                height: 1196,
                width: 1988,
              },
            ],
          },
          {
            variant_ids: [105883],
            placeholders: [
              {
                position: "front",
                images: [
                  {
                    id: blackImageId2,
                    x: 0.5,
                    y: 0.5,
                    scale: 1,
                    angle: 0,
                  },
                ],
                height: 1196,
                width: 1988,
              },
            ],
          },
          {
            variant_ids: [72182],
            placeholders: [
              {
                position: "front",
                images: [
                  {
                    id: navyImageId,
                    x: 0.5,
                    y: 0.5,
                    scale: 1,
                    angle: 0,
                  },
                ],
                height: 1196,
                width: 1988,
              },
            ],
          },
          {
            variant_ids: [105885],
            placeholders: [
              {
                position: "front",
                images: [
                  {
                    id: navyImageId2,
                    x: 0.5,
                    y: 0.5,
                    scale: 1,
                    angle: 0,
                  },
                ],
                height: 1196,
                width: 1988,
              },
            ],
          },
          {
            variant_ids: [72183],
            placeholders: [
              {
                position: "front",
                images: [
                  {
                    id: pinkImageId,
                    x: 0.5,
                    y: 0.5,
                    scale: 1,
                    angle: 0,
                  },
                ],
                height: 1196,
                width: 1988,
              },
            ],
          },
          {
            variant_ids: [105886],
            placeholders: [
              {
                position: "front",
                images: [
                  {
                    id: pinkImageId2,
                    x: 0.5,
                    y: 0.5,
                    scale: 1,
                    angle: 0,
                  },
                ],
                height: 1196,
                width: 1988,
              },
            ],
          },
          {
            variant_ids: [72184],
            placeholders: [
              {
                position: "front",
                images: [
                  {
                    id: redImageId,
                    x: 0.5,
                    y: 0.5,
                    scale: 1,
                    angle: 0,
                  },
                ],
                height: 1196,
                width: 1988,
              },
            ],
          },
          {
            variant_ids: [105887],
            placeholders: [
              {
                position: "front",
                images: [
                  {
                    id: redImageId2,
                    x: 0.5,
                    y: 0.5,
                    scale: 1,
                    angle: 0,
                  },
                ],
                height: 1196,
                width: 1988,
              },
            ],
          },

          {
            variant_ids: [105888],
            placeholders: [
              {
                position: "front",
                images: [
                  {
                    id: blueImageId,
                    x: 0.5,
                    y: 0.5,
                    scale: 1,
                    angle: 0,
                  },
                ],
                height: 1196,
                width: 1988,
              },
            ],
          },
          {
            variant_ids: [105889],
            placeholders: [
              {
                position: "front",
                images: [
                  {
                    id: blueImageId2,
                    x: 0.5,
                    y: 0.5,
                    scale: 1,
                    angle: 0,
                  },
                ],
                height: 1196,
                width: 1988,
              },
            ],
          },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const productId = productResponse.data.id;
    const productImage3 = productResponse.data.images[2];
    console.log(productImage3.src);
    const data = await publishData(productId);
    if (data) {
      if (productImage3.src == null) {
        const productResponse = await axios.delete(
          `https://api.printify.com/v1/shops/${shopId}/products/${productId}.json`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }
      return { productId, image_url: productImage3.src };
    } else {
      return;
    }
  } catch (error) {
    return error;
  }
};

module.exports = { createMug };

const fs = require("fs");
const path = require("path");
const axios = require("axios");
const { Font } = require("canvacord");
const { NymPost } = require("../../services/nymPost.jsx");
const { NymPosttwo } = require("../../services/nymPost_2.jsx");
const { NymPostone } = require("../../services/nymPost_1.jsx");
require("dotenv").config();
const {
  getBase64FromFile,
  generateUniqueFileName,
  getImageUrlForColor,
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

const createTShirt = async (
  name,
  type,
  definition,
  tags,
  product_description
) => {
  try {
    const token = await getToken();
    let whiteCard;
    let blackCard;
    if (type == 1) {
      whiteCard = new NymPostone({
        width: 3852,
        height: 4398,
        nymFontSize: "540px",
        nymLineHeight: "628.02px",
        definitionFontSize: "250px",
        definitionLineHeight: "293.5px",
        Nym: name,
        Definition: definition,
        NymColor: "#FFFFFF",
        formatNym: false,
        nymTop: 326,
        definitionTop: 904,
        left: 271,
        nymWidth: 3263,
        nymHeight: 558,
        definitionWidth: 3263,
        definitionHeight: 241,
        distanceBetweenTexts: 20,
      });

      blackCard = new NymPostone({
        width: 3852,
        height: 4398,
        nymFontSize: "540px",
        nymLineHeight: "628.02px",
        definitionFontSize: "250px",
        definitionLineHeight: "293.5px",
        Nym: name,
        Definition: definition,
        NymColor: "#000000",
        formatNym: false,
        nymTop: 326,
        definitionTop: 904,
        left: 271,
        nymWidth: 3263,
        nymHeight: 558,
        definitionWidth: 3263,
        definitionHeight: 241,
        distanceBetweenTexts: 20,
      });
    }

    if (type == 2) {
      whiteCard = new NymPosttwo({
        width: 3852,
        height: 4398,
        nymFontSize: "460px",
        nymLineHeight: "534.98px", //534.98
        Nym: name,
        NymColor: "#FFFFFF",
        formatNym: false,
        top: 349,
        left: 518,
        nymWidth: 2915,
        nymHeight: 2244,
      });

      blackCard = new NymPosttwo({
        width: 3852,
        height: 4398,
        nymFontSize: "460px",
        nymLineHeight: "534.98px",
        Nym: name,
        NymColor: "#000000",
        formatNym: false,
        top: 349,
        left: 518,
        nymWidth: 2915,
        nymHeight: 2244,
      });
    }

    if (type == 3) {
      console.log(type);
      whiteCard = new NymPost({
        width: 3852,
        height: 4398,
        nymFontSize: "530px",
        nymLineHeight: "600px",
        Nym: name,
        NymColor: "#FFFFFF",
        formatNym: false,
        top: 245,
        left: 223,
        nymWidth: 3505,
        nymHeight: 3989,
      });

      blackCard = new NymPost({
        width: 3852,
        height: 4398,
        nymFontSize: "530px",
        nymLineHeight: "600px",
        Nym: name,
        NymColor: "#000000",
        formatNym: false,
        top: 245,
        left: 223,
        nymWidth: 3505,
        nymHeight: 3989,
      });
    }

    const whiteImage = await whiteCard.build({ format: "png" });
    const whiteFileName = generateUniqueFileName();
    const whiteFilePath = path.join(
      __dirname,
      "../../public/assets/images",
      whiteFileName
    );

    fs.writeFileSync(whiteFilePath, whiteImage);
    const whiteBase64Image = await getBase64FromFile(whiteFilePath);

    const whiteImageId = await uploadImageToPrintify(
      whiteFileName,
      whiteBase64Image,
      token
    );

    const blackImage = await blackCard.build({ format: "png" });
    const blackFileName = generateUniqueFileName();
    const blackFilePath = path.join(
      __dirname,
      "../../public/assets/images",
      blackFileName
    );

    fs.writeFileSync(blackFilePath, blackImage);
    const blackBase64Image = await getBase64FromFile(blackFilePath);
    const blackImageId = await uploadImageToPrintify(
      blackFileName,
      blackBase64Image,
      token
    );

    const productResponse = await axios.post(
      `https://api.printify.com/v1/shops/${shopId}/products.json`,
      {
        title: `${name} T-Shirt`,
        description: `<div>
          <h2>Unisex Soft-Style T-Shirt</h2>
          <p>${product_description}</p>
          <p>The unisex soft-style t-shirt puts a new spin on casual comfort. Made from very soft materials, this tee is 100% cotton for solid colors. Heather colors and sports grey include polyester. The shoulders have twill tape for improved durability. There are no side seams. The collar is made with ribbed knitting to prevent curling damage.</p>
          
          <ul>
            <li><strong>Material:</strong> 100% ring-spun cotton (solid colors); Heather colors and Sports Grey include polyester</li>
            <li><strong>Weight:</strong> Lightweight fabric (4.5 oz/yd² or 153 g/m²)</li>
            <li><strong>Fit:</strong> Classic fit with crew neckline</li>
            <li><strong>Label:</strong> Pearlized, tear-away label for total wearing comfort</li>
            <li><strong>Ethical sourcing:</strong> Made using ethically grown and harvested US cotton</li>
            <li><strong>Certifications:</strong> Certified by Oeko-Tex for safety and quality assurance</li>
            <li><strong>Fabric blends:</strong> Heather colors - 35% ring-spun cotton, 65% polyester; Sport Grey and Antique colors - 90% cotton, 10% polyester; Graphite Heather - 50% ring-spun cotton, 50% polyester</li>
          </ul>

          <h3>Size Chart:</h3>
          <div style="overflow-x:auto;">
            <table style="border-collapse: collapse; width: 100%; text-align: left; min-width: 600px;">
              <thead>
                <tr>
                  <th style="border: 1px solid #ddd; padding: 8px;">Size</th>
                  <th style="border: 1px solid #ddd; padding: 8px;">XS</th>
                  <th style="border: 1px solid #ddd; padding: 8px;">S</th>
                  <th style="border: 1px solid #ddd; padding: 8px;">M</th>
                  <th style="border: 1px solid #ddd; padding: 8px;">L</th>
                  <th style="border: 1px solid #ddd; padding: 8px;">XL</th>
                  <th style="border: 1px solid #ddd; padding: 8px;">2XL</th>
                  <th style="border: 1px solid #ddd; padding: 8px;">3XL</th>
                  <th style="border: 1px solid #ddd; padding: 8px;">4XL</th>
                  <th style="border: 1px solid #ddd; padding: 8px;">5XL</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style="border: 1px solid #ddd; padding: 8px;">Width, in</td>
                  <td style="border: 1px solid #ddd; padding: 8px;">16.00</td>
                  <td style="border: 1px solid #ddd; padding: 8px;">18.00</td>
                  <td style="border: 1px solid #ddd; padding: 8px;">20.00</td>
                  <td style="border: 1px solid #ddd; padding: 8px;">22.00</td>
                  <td style="border: 1px solid #ddd; padding: 8px;">24.00</td>
                  <td style="border: 1px solid #ddd; padding: 8px;">26.00</td>
                  <td style="border: 1px solid #ddd; padding: 8px;">28.00</td>
                  <td style="border: 1px solid #ddd; padding: 8px;">30.00</td>
                  <td style="border: 1px solid #ddd; padding: 8px;">32.00</td>
                </tr>
                <tr>
                  <td style="border: 1px solid #ddd; padding: 8px;">Length, in</td>
                  <td style="border: 1px solid #ddd; padding: 8px;">27.00</td>
                  <td style="border: 1px solid #ddd; padding: 8px;">28.00</td>
                  <td style="border: 1px solid #ddd; padding: 8px;">29.00</td>
                  <td style="border: 1px solid #ddd; padding: 8px;">30.00</td>
                  <td style="border: 1px solid #ddd; padding: 8px;">31.00</td>
                  <td style="border: 1px solid #ddd; padding: 8px;">32.00</td>
                  <td style="border: 1px solid #ddd; padding: 8px;">33.00</td>
                  <td style="border: 1px solid #ddd; padding: 8px;">34.00</td>
                  <td style="border: 1px solid #ddd; padding: 8px;">35.00</td>
                </tr>
                <tr>
                  <td style="border: 1px solid #ddd; padding: 8px;">Sleeve length, in</td>
                  <td style="border: 1px solid #ddd; padding: 8px;">7.99</td>
                  <td style="border: 1px solid #ddd; padding: 8px;">8.23</td>
                  <td style="border: 1px solid #ddd; padding: 8px;">8.50</td>
                  <td style="border: 1px solid #ddd; padding: 8px;">8.74</td>
                  <td style="border: 1px solid #ddd; padding: 8px;">9.02</td>
                  <td style="border: 1px solid #ddd; padding: 8px;">9.25</td>
                  <td style="border: 1px solid #ddd; padding: 8px;">9.49</td>
                  <td style="border: 1px solid #ddd; padding: 8px;">9.72</td>
                  <td style="border: 1px solid #ddd; padding: 8px;">9.96</td>
                </tr>
                <tr>
                  <td style="border: 1px solid #ddd; padding: 8px;">Size tolerance, in</td>
                  <td style="border: 1px solid #ddd; padding: 8px;">1.50</td>
                  <td style="border: 1px solid #ddd; padding: 8px;">1.50</td>
                  <td style="border: 1px solid #ddd; padding: 8px;">1.50</td>
                  <td style="border: 1px solid #ddd; padding: 8px;">1.50</td>
                  <td style="border: 1px solid #ddd; padding: 8px;">1.50</td>
                  <td style="border: 1px solid #ddd; padding: 8px;">1.50</td>
                  <td style="border: 1px solid #ddd; padding: 8px;">1.50</td>
                  <td style="border: 1px solid #ddd; padding: 8px;">1.50</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>`,
        blueprint_id: 145,
        print_provider_id: 99,
        tags: tags,
        is_printify_express_enabled: true,
        variants: [
          {
            id: 38155,
            price: 1600,
            is_enabled: true,
            is_printify_express_eligible: true,
          },
          {
            id: 38169,
            price: 1600,
            is_enabled: true,
            is_printify_express_eligible: true,
          },
          {
            id: 38183,
            price: 1600,
            is_enabled: true,
            is_printify_express_eligible: true,
          },
          {
            id: 38197,
            price: 1600,
            is_enabled: true,
            is_printify_express_eligible: true,
          },
          {
            id: 42112,
            price: 2050,
            is_enabled: true,
            is_printify_express_eligible: true,
          },
          {
            id: 38211,
            price: 1850,
            is_enabled: true,
            is_printify_express_eligible: true,
          },

          {
            id: 38205,
            price: 1600,
            is_enabled: true,
            is_printify_express_eligible: true,
          },
          {
            id: 38163,
            price: 1600,
            is_enabled: true,
            is_printify_express_eligible: true,
          },
          {
            id: 38191,
            price: 1600,
            is_enabled: true,
            is_printify_express_eligible: true,
          },
          {
            id: 38177,
            price: 1600,
            is_enabled: true,
            is_printify_express_eligible: true,
          },
          {
            id: 67829,
            price: 1600,
            is_enabled: true,
            is_printify_express_eligible: true,
          },
          {
            id: 66211,
            price: 2300,
            is_enabled: true,
            is_printify_express_eligible: true,
          },
          {
            id: 42120,
            price: 2050,
            is_enabled: true,
            is_printify_express_eligible: true,
          },
          {
            id: 38219,
            price: 1850,
            is_enabled: true,
            is_printify_express_eligible: true,
          },
          {
            id: 95175,
            price: 2450,
            is_enabled: true,
            is_printify_express_eligible: true,
          },

          {
            id: 38204,
            price: 1600,
            is_enabled: true,
            is_printify_express_eligible: true,
          },
          {
            id: 38162,
            price: 1600,
            is_enabled: true,
            is_printify_express_eligible: true,
          },
          {
            id: 38190,
            price: 1600,
            is_enabled: true,
            is_printify_express_eligible: true,
          },
          {
            id: 38176,
            price: 1600,
            is_enabled: true,
            is_printify_express_eligible: true,
          },
          {
            id: 67827,
            price: 1600,
            is_enabled: true,
            is_printify_express_eligible: true,
          },
          {
            id: 66210,
            price: 2300,
            is_enabled: true,
            is_printify_express_eligible: true,
          },
          {
            id: 42119,
            price: 2050,
            is_enabled: true,
            is_printify_express_eligible: true,
          },
          {
            id: 38218,
            price: 1850,
            is_enabled: true,
            is_printify_express_eligible: true,
          },
          {
            id: 95176,
            price: 2450,
            is_enabled: true,
            is_printify_express_eligible: true,
          },
          {
            id: 42815,
            price: 1600,
            is_enabled: true,
            is_printify_express_eligible: true,
          },
          {
            id: 42812,
            price: 1600,
            is_enabled: true,
            is_printify_express_eligible: true,
          },
          {
            id: 42814,
            price: 1600,
            is_enabled: true,
            is_printify_express_eligible: true,
          },
          {
            id: 42813,
            price: 1600,
            is_enabled: true,
            is_printify_express_eligible: true,
          },
          {
            id: 66214,
            price: 2300,
            is_enabled: true,
            is_printify_express_eligible: true,
          },
          {
            id: 42817,
            price: 2050,
            is_enabled: true,
            is_printify_express_eligible: true,
          },
          {
            id: 42816,
            price: 1850,
            is_enabled: true,
            is_printify_express_eligible: true,
          },

          {
            id: 42830,
            price: 1600,
            is_enabled: true,
            is_printify_express_eligible: true,
          },
          {
            id: 42818,
            price: 1600,
            is_enabled: true,
            is_printify_express_eligible: true,
          },
          {
            id: 42824,
            price: 1600,
            is_enabled: true,
            is_printify_express_eligible: true,
          },
          {
            id: 42836,
            price: 1600,
            is_enabled: true,
            is_printify_express_eligible: true,
          },
          {
            id: 67809,
            price: 1600,
            is_enabled: true,
            is_printify_express_eligible: true,
          },
          {
            id: 66193,
            price: 2300,
            is_enabled: true,
            is_printify_express_eligible: true,
          },
          {
            id: 42848,
            price: 2050,
            is_enabled: true,
            is_printify_express_eligible: true,
          },
          {
            id: 42842,
            price: 1850,
            is_enabled: true,
            is_printify_express_eligible: true,
          },
          {
            id: 95152,
            price: 2450,
            is_enabled: true,
            is_printify_express_eligible: true,
          },

          {
            id: 38206,
            price: 1600,
            is_enabled: true,
            is_printify_express_eligible: true,
          },
          {
            id: 38192,
            price: 1600,
            is_enabled: true,
            is_printify_express_eligible: true,
          },
          {
            id: 38178,
            price: 1600,
            is_enabled: true,
            is_printify_express_eligible: true,
          },
          {
            id: 38164,
            price: 1600,
            is_enabled: true,
            is_printify_express_eligible: true,
          },
          {
            id: 67831,
            price: 1600,
            is_enabled: true,
            is_printify_express_eligible: true,
          },
          {
            id: 66213,
            price: 2300,
            is_enabled: true,
            is_printify_express_eligible: true,
          },
          {
            id: 42122,
            price: 2050,
            is_enabled: true,
            is_printify_express_eligible: true,
          },
          {
            id: 38220,
            price: 1850,
            is_enabled: true,
            is_printify_express_eligible: true,
          },
          {
            id: 95180,
            price: 2450,
            is_enabled: true,
            is_printify_express_eligible: true,
          },

          {
            id: 63307,
            price: 1600,
            is_enabled: true,
            is_printify_express_eligible: true,
          },
          {
            id: 63297,
            price: 1600,
            is_enabled: true,
            is_printify_express_eligible: true,
          },
          {
            id: 63292,
            price: 1600,
            is_enabled: true,
            is_printify_express_eligible: true,
          },
          {
            id: 63302,
            price: 1600,
            is_enabled: true,
            is_printify_express_eligible: true,
          },
          {
            id: 63317,
            price: 2050,
            is_enabled: true,
            is_printify_express_eligible: true,
          },
          {
            id: 63312,
            price: 1850,
            is_enabled: true,
            is_printify_express_eligible: true,
          },
        ],
        print_areas: [
          {
            variant_ids: [
              38205, 38163, 38191, 38177, 67829, 66211, 42120, 38219, 95175,
              38204, 38162, 38190, 38176, 67827, 66210, 42119, 38218, 95176,
            ],
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
              },
            ],
          },
          {
            variant_ids: [
              38155, 38169, 38183, 38197, 42112, 38211, 42830, 42818, 42824,
              42836, 67809, 66193, 42848, 42842, 95152, 42815, 42812, 42814,
              42813, 66214, 42817, 42816, 63307, 63297, 63292, 63302, 63317,
              63312, 38206, 38192, 38178, 38164, 67831, 66213, 42122, 38220,
              95180,
            ],
            placeholders: [
              {
                position: "front",
                images: [
                  {
                    id: whiteImageId,
                    x: 0.5,
                    y: 0.5,
                    scale: 1,
                    angle: 0,
                  },
                ],
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
    const data = await publishData(productId);

    if (data) {
      const whiteImageUrl = getImageUrlForColor(productResponse.data);
      if (whiteImageUrl == null) {
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
      fs.unlinkSync(blackFilePath);
      fs.unlinkSync(whiteFilePath);
      return { productId, image_url: whiteImageUrl };
    } else {
      return;
    }
  } catch (error) {
    return error;
  }
};

module.exports = { createTShirt };

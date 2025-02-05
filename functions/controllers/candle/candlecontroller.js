const fs = require("fs");
const path = require("path");
const axios = require("axios");
const { Font } = require("canvacord");
const { NymPostthree } = require("../../services/nymPost_3.jsx");
const { NymPostfour } = require("../../services/nymPost_4.jsx");
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

const createCandle = async (
  name,
  type,
  definition,
  tags,
  product_description
) => {
  try {
    let black4oz;
    let black9oz;
    const token = await getToken();
    if (type == 1) {
      black4oz = new NymPostfour({
        width: 624,
        height: 546,
        innerBorderWidth: 458,
        innerBorderHeight: 400,
        innerBorderTop: 73,
        innerBorderLeft: 83,
        nymWidth: 391,
        nymHeight: 160, //60
        nymFontSize: "70px",
        nymLineHeight: "81.41px",
        definitionWidth: 391,
        definitionHeight: 19,
        definitionFontSize: "27px",
        definitionLineHeight: "28px", //17
        bottomTextWidth: 252,
        bottomTextHeight: 45,
        bottomTextTop: 350,
        bottomFontSize: "22px",
        bottomLineHeight: "21px",
        Nym: name,
        Definition: definition,
        BottomText: "Soy Wax Candle \n 4 oz / 20+ hours",
        NymColor: "#000000",
        formatNym: false,
      });

      black9oz = new NymPostfour({
        width: 863,
        height: 706,
        innerBorderWidth: 695,
        innerBorderHeight: 563,
        innerBorderTop: 71,
        innerBorderLeft: 91,
        nymWidth: 513,
        nymHeight: 160, //60
        nymFontSize: "100px",
        nymLineHeight: "116.3px",
        definitionWidth: 580,
        definitionHeight: 24,
        definitionFontSize: "41px",
        definitionLineHeight: "40px", //17
        bottomTextWidth: 252,
        bottomTextHeight: 45,
        bottomTextTop: 500,
        bottomFontSize: "22px",
        bottomLineHeight: "21px",
        Nym: name,
        Definition: definition,
        BottomText: "Soy Wax Candle \n 9 oz / 45+ hours",
        NymColor: "#000000",
        formatNym: false,
      });
    }

    if (type == 2) {
      black4oz = new NymPostthree({
        width: 624,
        height: 546,
        innerBorderWidth: 458,
        innerBorderHeight: 400,
        innerBorderTop: 73,
        innerBorderLeft: 83,
        nymWidth: 305,
        nymHeight: 211,
        nymTop: 167,
        nymLeft: 160,
        nymFontSize: "50px",
        nymLineHeight: "50px",
        bottomTextWidth: 252,
        bottomTextHeight: 45,
        bottomTextTop: 350,
        bottomTextLeft: 186,
        bottomFontSize: "17px",
        bottomLineHeight: "17px",
        Nym: name,
        NymColor: "#000000",
        formatNym: false,
      });

      black9oz = new NymPostthree({
        width: 863,
        height: 706,
        innerBorderWidth: 695,
        innerBorderHeight: 563,
        innerBorderTop: 71,
        innerBorderLeft: 91,
        nymWidth: 514,
        nymHeight: 302,
        nymTop: 202,
        nymLeft: 174,
        nymFontSize: "80px",
        nymLineHeight: "70px",
        bottomTextWidth: 252,
        bottomTextHeight: 45,
        bottomTextTop: 500,
        bottomTextLeft: 305,
        bottomFontSize: "22px",
        bottomLineHeight: "21px",
        Nym: name,
        BottomText: "Soy Wax Candle \n 9 oz / 45+ hours",
        NymColor: "#000000",
        formatNym: false,
      });
    }

    if (type == 3) {
      black4oz = new NymPostthree({
        width: 645,
        height: 546,
        innerBorderWidth: 458,
        innerBorderHeight: 400,
        innerBorderTop: 73,
        innerBorderLeft: 93,
        nymWidth: 359,
        nymHeight: 250,
        nymTop: 148,
        nymLeft: 133,
        nymFontSize: "60px",
        nymLineHeight: "55px",
        bottomTextWidth: 252,
        bottomTextHeight: 45,
        bottomTextTop: 350,
        bottomTextLeft: 186,
        bottomFontSize: "17px",
        bottomLineHeight: "17px",
        Nym: name,
        BottomText: "Soy Wax Candle \n 4 oz / 20+ hours",
        NymColor: "#000000",
        formatNym: true,
      });

      black9oz = new NymPostthree({
        width: 863,
        height: 706,
        innerBorderWidth: 695,
        innerBorderHeight: 563,
        innerBorderTop: 71,
        innerBorderLeft: 91,
        nymWidth: 534,
        nymHeight: 372,
        nymTop: 167,
        nymLeft: 164,
        nymFontSize: "92px",
        nymLineHeight: "85px",
        bottomTextWidth: 252,
        bottomTextHeight: 45,
        bottomTextTop: 500,
        bottomTextLeft: 305,
        bottomFontSize: "22px",
        bottomLineHeight: "21px",
        Nym: name,
        BottomText: "Soy Wax Candle \n 9 oz / 45+ hours",
        NymColor: "#000000",
        formatNym: true,
      });
    }

    const blackImage_1 = await black4oz.build({ format: "png" });
    const blackFileName_1 = generateUniqueFileName();
    const blackFilePath_1 = path.join(
      __dirname,
      "../../public/assets/images",
      blackFileName_1
    );

    fs.writeFileSync(blackFilePath_1, blackImage_1);

    const blackBase64Image_1 = await getBase64FromFile(blackFilePath_1);

    const blackImageId_1 = await uploadImageToPrintify(
      blackFileName_1,
      blackBase64Image_1,
      token
    );

    const blackImage_2 = await black9oz.build({ format: "png" });
    const blackFileName_2 = generateUniqueFileName();
    const blackFilePath_2 = path.join(
      __dirname,
      "../../public/assets/images",
      blackFileName_2
    );

    fs.writeFileSync(blackFilePath_2, blackImage_2);

    const blackBase64Image_2 = await getBase64FromFile(blackFilePath_2);

    const blackImageId_2 = await uploadImageToPrintify(
      blackFileName_2,
      blackBase64Image_2,
      token
    );

    const productResponse = await axios.post(
      `https://api.printify.com/v1/shops/${shopId}/products.json`,
      {
        title: `${name} Scented Coconut Apricot Candles`,
        description: `<div class="candle-description">
            <h2>Scented Coconut Apricot Candles</h2>
            <p>${product_description}</p>
            <p>
              These scented candles are hand-poured in the USA, and made from premium coconut apricot wax with cotton wicks that are lead and zinc-free. With a burn time of approximately 20 hours, they provide long-lasting fragrance and warmth. The candles come in 9 scents, as well as in elegant amber and classic clear vessels, topped with a stylish gold lid, making them a beautiful, ambient addition to any space.
            </p>

            <ul>
              <li><strong>Material: </strong>coconut apricot wax, cotton wick</li>
              <li><strong>Lid: </strong>gold</li>
              <li><strong>Vessel color:</strong> amber and clear</li>
              <li><strong>Burn time:</strong> up to 20 hours (4oz), up to 50 hours (9oz)</li>
              <li> NB! All scents have the same natural color</li>
              <li> Compliant with ASTM safety standards</li>
              <li> Assembled in the USA from globally sourced parts</li>
            </ul>

          </div>
            <div style="overflow-x:auto;">
              <table style="border-collapse: collapse; width: 100%; text-align: left; min-width: 600px;">
                <thead>
                  <tr>
                    <th style="border: 1px solid #ddd; padding: 8px;"></th>
                    <th style="border: 1px solid #ddd; padding: 8px;">4oz</th>
                    
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style="border: 1px solid #ddd; padding: 8px;">Diamter, in</td>
                    <td style="border: 1px solid #ddd; padding: 8px;">2.30</td>
                  </tr>
                  <tr>
                    <td style="border: 1px solid #ddd; padding: 8px;">Height , in</td>
                    <td style="border: 1px solid #ddd; padding: 8px;">2.50</td>
                  </tr>
                </tbody>
              </table>
            </div>`,
        blueprint_id: 1488,
        print_provider_id: 70,
        tags: tags,
        variants: [
          {
            id: 107587,
            price: 999,
            is_enabled: true,
          },
          {
            id: 107588,
            price: 999,
            is_enabled: true,
          },
          {
            id: 107589,
            price: 999,
            is_enabled: true,
          },
          {
            id: 107590,
            price: 999,
            is_enabled: true,
          },
          {
            id: 107591,
            price: 999,
            is_enabled: true,
          },
          {
            id: 107592,
            price: 999,
            is_enabled: true,
          },
          {
            id: 107593,
            price: 999,
            is_enabled: true,
          },
          {
            id: 107594,
            price: 999,
            is_enabled: true,
          },
          {
            id: 107595,
            price: 999,
            is_enabled: true,
          },
          {
            id: 107596,
            price: 1499,
            is_enabled: true,
          },
          {
            id: 107597,
            price: 1499,
            is_enabled: true,
          },
          {
            id: 107598,
            price: 1499,
            is_enabled: true,
          },
          {
            id: 107599,
            price: 1499,
            is_enabled: true,
          },
          {
            id: 107600,
            price: 1499,
            is_enabled: true,
          },
          {
            id: 107601,
            price: 1499,
            is_enabled: true,
          },
          {
            id: 107602,
            price: 1499,
            is_enabled: true,
          },
          {
            id: 107603,
            price: 1499,
            is_enabled: true,
          },
          {
            id: 107604,
            price: 1499,
            is_enabled: true,
          },
          {
            id: 107605,
            price: 999,
            is_enabled: true,
          },
          {
            id: 107606,
            price: 999,
            is_enabled: true,
          },
          {
            id: 107607,
            price: 999,
            is_enabled: true,
          },
          {
            id: 107608,
            price: 999,
            is_enabled: true,
          },
          {
            id: 107609,
            price: 999,
            is_enabled: true,
          },
          {
            id: 107610,
            price: 999,
            is_enabled: true,
          },
          {
            id: 107611,
            price: 999,
            is_enabled: true,
          },
          {
            id: 107612,
            price: 999,
            is_enabled: true,
          },
          {
            id: 107613,
            price: 999,
            is_enabled: true,
          },
          {
            id: 107614,
            price: 1499,
            is_enabled: true,
          },
          {
            id: 107615,
            price: 1499,
            is_enabled: true,
          },
          {
            id: 107616,
            price: 1499,
            is_enabled: true,
          },
          {
            id: 107617,
            price: 1499,
            is_enabled: true,
          },
          {
            id: 107618,
            price: 1499,
            is_enabled: true,
          },
          {
            id: 107619,
            price: 1499,
            is_enabled: true,
          },
          {
            id: 107620,
            price: 1499,
            is_enabled: true,
          },
          {
            id: 107621,
            price: 1499,
            is_enabled: true,
          },
          {
            id: 107622,
            price: 1499,
            is_enabled: true,
          },
        ],
        print_areas: [
          {
            variant_ids: [
              107587, 107588, 107589, 107590, 107591, 107592, 107593, 107594,
              107595, 107605, 107606, 107607, 107608, 107609, 107610, 107611,
              107612, 107613,
            ],
            placeholders: [
              {
                position: "front",
                images: [
                  {
                    id: blackImageId_1,
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
            variant_ids: [
              107596, 107597, 107598, 107599, 107600, 107601, 107602, 107603,
              107604, 107614, 107615, 107616, 107617, 107618, 107619, 107620,
              107621, 107622,
            ],
            placeholders: [
              {
                position: "front",
                images: [
                  {
                    id: blackImageId_2,
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
    const images = productResponse.data.images;

    const randomIndex = Math.floor(Math.random() * 5);

    const selectedImage = images[randomIndex];
    console.log(selectedImage.src);
    if (selectedImage.src == null) {
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
    const data = await publishData(productId);
    if (data) {
      fs.unlinkSync(blackFilePath_1);
      fs.unlinkSync(blackFilePath_2);
      return { productId, image_url: selectedImage.src };
    } else {
      return;
    }
  } catch (error) {
    return error;
  }
};

module.exports = { createCandle };

const fs = require("fs");
const path = require("path");
const axios = require("axios");
const { Font } = require("canvacord");
const { NymPost } = require("../../services/nymPost.jsx");
const { NymPosttwo } = require("../../services/nymPost_2.jsx");
const { NymPostnine } = require("../../services/nymPost_9.jsx");
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

const createHoodie = async (
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
      whiteCard = new NymPostnine({
        width: 3531,
        height: 2352,
        nymFontSize: "520px",
        nymLineHeight: "604.76px",
        definitionFontSize: "240px",
        definitionLineHeight: "281.76px",
        Nym: name,
        Definition: definition,
        NymColor: "#FFFFFF",
        formatNym: false,
        nymTop: 265,
        definitionTop: 823,
        left: 135,
        nymWidth: 3263,
        nymHeight: 558,
        definitionWidth: 3263,
        definitionHeight: 220, //241
        distanceBetweenTexts: 20,
      });

      blackCard = new NymPostnine({
        width: 3531,
        height: 2352,
        nymFontSize: "520px",
        nymLineHeight: "604.76px",
        definitionFontSize: "240px",
        definitionLineHeight: "281.76px",
        Nym: name,
        Definition: definition,
        NymColor: "#000000",
        formatNym: false,
        nymTop: 265,
        definitionTop: 823,
        left: 135,
        nymWidth: 3263,
        nymHeight: 558,
        definitionWidth: 3263,
        definitionHeight: 220,
        distanceBetweenTexts: 20,
      });
    }

    if (type == 2) {
      whiteCard = new NymPosttwo({
        width: 3531,
        height: 2352,
        nymFontSize: "400px",
        nymLineHeight: "385px",
        Nym: name,
        NymColor: "#FFFFFF",
        formatNym: false,
        top: 356,
        left: 599,
        nymWidth: 2332,
        nymHeight: 1859,
      });

      blackCard = new NymPosttwo({
        width: 3531,
        height: 2352,
        nymFontSize: "400px",
        nymLineHeight: "385px",
        Nym: name,
        NymColor: "#000000",
        formatNym: false,
        top: 356,
        left: 599,
        nymWidth: 2332,
        nymHeight: 1859,
      });
    }

    if (type == 3) {
      whiteCard = new NymPost({
        width: 3531,
        height: 2352,
        nymFontSize: "500px",
        nymLineHeight: "470px",
        Nym: name,
        NymColor: "#FFFFFF",
        formatNym: false,
        top: 251,
        left: 290,
        nymWidth: 2951,
        nymHeight: 1989,
      });

      blackCard = new NymPost({
        width: 3531,
        height: 2352,
        nymFontSize: "500px",
        nymLineHeight: "470px",
        Nym: name,
        NymColor: "#000000",
        formatNym: false,
        top: 251,
        left: 290,
        nymWidth: 2951,
        nymHeight: 1989,
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
        title: `${name} Hooded Sweatshirt`,
        description: `
        <p>${product_description}</p>
        This unisex heavy blend hooded sweatshirt is relaxation itself. Made with a thick blend of cotton and polyester, it feels plush, soft and warm, a perfect choice for any cold day. In the front, the spacious kangaroo pocket adds daily practicality while the hood's drawstring is the same color as the base sweater for extra style points.<div>.:Made with a medium-heavy fabric (8.0 oz/yd² (271 g/m²)) that consists of 50% cotton and 50% polyester for that cozy feel and warmth you need in a hoodie.</div><div>.:The classic fit along with the pouch pocket and the tear-away label make for a highly comfortable, scratch-free wearing experience. </div><div>.:The color-matched drawcord and the double-lined hood add a stylish flair and durability that tie everything together.</div><div>.:Made using 100% ethically grown US cotton. Gildan is also a proud member of the US Cotton Trust Protocol ensuring ethical and sustainable means of production. The blank tee's dyes are OEKO-TEX-certified dyes with low environmental impact.</div><div>.:Fabric blends: Heather Sport colors - 60% polyester, 40% cotton</div>
        <div><strong>Size Chart:</strong></div>
  <div style="overflow-x:auto;">
    <table style="border-collapse: collapse; width: 100%; text-align: left; min-width: 600px;">
      <thead>
        <tr>
          <th style="border: 1px solid #ddd; padding: 8px;">Size</th>
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
          <td style="border: 1px solid #ddd; padding: 8px;">Sleeve length (from center back), in</td>
          <td style="border: 1px solid #ddd; padding: 8px;">15.10</td>
          <td style="border: 1px solid #ddd; padding: 8px;">16.50</td>
          <td style="border: 1px solid #ddd; padding: 8px;">18.00</td>
          <td style="border: 1px solid #ddd; padding: 8px;">19.50</td>
          <td style="border: 1px solid #ddd; padding: 8px;">21.00</td>
          <td style="border: 1px solid #ddd; padding: 8px;">22.40</td>
          <td style="border: 1px solid #ddd; padding: 8px;">23.70</td>
          <td style="border: 1px solid #ddd; padding: 8px;">25.00</td>
        </tr>
        <tr>
          <td style="border: 1px solid #ddd; padding: 8px;">Size tolerance, in</td>
          <td style="border: 1px solid #ddd; padding: 8px;" >1.50</td>
          <td style="border: 1px solid #ddd; padding: 8px;" >1.50</td>
          <td style="border: 1px solid #ddd; padding: 8px;" >1.50</td>
          <td style="border: 1px solid #ddd; padding: 8px;" >1.50</td>
          <td style="border: 1px solid #ddd; padding: 8px;" >1.50</td>
          <td style="border: 1px solid #ddd; padding: 8px;" >1.50</td>
          <td style="border: 1px solid #ddd; padding: 8px;" >1.50</td>
          <td style="border: 1px solid #ddd; padding: 8px;" >1.50</td>
        </tr>
      </tbody>
    </table>
  </div>`,
        blueprint_id: 77,
        print_provider_id: 99,
        tags: tags,
        is_printify_express_enabled: true,
        variants: [
          {
            id: 42219,
            price: 2860,
            is_enabled: true,
          },
          {
            id: 42220,
            price: 2860,
            is_enabled: true,
          },
          {
            id: 42221,
            price: 2860,
            is_enabled: true,
          },
          {
            id: 42222,
            price: 2860,
            is_enabled: true,
          },
          {
            id: 42223,
            price: 3150,
            is_enabled: true,
          },
          {
            id: 42224,
            price: 3300,
            is_enabled: true,
          },
          {
            id: 42225,
            price: 3380,
            is_enabled: true,
          },
          {
            id: 42226,
            price: 3380,
            is_enabled: true,
          },
          {
            id: 32910,
            price: 2860,
            is_enabled: true,
          },
          {
            id: 32911,
            price: 2860,
            is_enabled: true,
          },
          {
            id: 32912,
            price: 2860,
            is_enabled: true,
          },
          {
            id: 32913,
            price: 2860,
            is_enabled: true,
          },
          {
            id: 32914,
            price: 3150,
            is_enabled: true,
          },
          {
            id: 32915,
            price: 3300,
            is_enabled: true,
          },
          {
            id: 32916,
            price: 3380,
            is_enabled: true,
          },
          {
            id: 32917,
            price: 3380,
            is_enabled: true,
          },
          {
            id: 32902,
            price: 2860,
            is_enabled: true,
          },
          {
            id: 32903,
            price: 2860,
            is_enabled: true,
          },
          {
            id: 32904,
            price: 2860,
            is_enabled: true,
          },
          {
            id: 32905,
            price: 2860,
            is_enabled: true,
          },
          {
            id: 32906,
            price: 3150,
            is_enabled: true,
          },
          {
            id: 32907,
            price: 3300,
            is_enabled: true,
          },
          {
            id: 32908,
            price: 3380,
            is_enabled: true,
          },
          {
            id: 32909,
            price: 3380,
            is_enabled: true,
          },
          {
            id: 33409,
            price: 2860,
            is_enabled: true,
          },
          {
            id: 33410,
            price: 2860,
            is_enabled: true,
          },
          {
            id: 33411,
            price: 2860,
            is_enabled: true,
          },
          {
            id: 33412,
            price: 2860,
            is_enabled: true,
          },
          {
            id: 33413,
            price: 3150,
            is_enabled: true,
          },
          {
            id: 33414,
            price: 3300,
            is_enabled: true,
          },
          {
            id: 33415,
            price: 3380,
            is_enabled: true,
          },
          {
            id: 33416,
            price: 3380,
            is_enabled: true,
          },
          {
            id: 32918,
            price: 2860,
            is_enabled: true,
          },
          {
            id: 32919,
            price: 2860,
            is_enabled: true,
          },
          {
            id: 32920,
            price: 2860,
            is_enabled: true,
          },
          {
            id: 32921,
            price: 2860,
            is_enabled: true,
          },
          {
            id: 32922,
            price: 3150,
            is_enabled: true,
          },
          {
            id: 32923,
            price: 3300,
            is_enabled: true,
          },
          {
            id: 32924,
            price: 3380,
            is_enabled: true,
          },
          {
            id: 32925,
            price: 3380,
            is_enabled: true,
          },
          {
            id: 32886,
            price: 2860,
            is_enabled: true,
          },
          {
            id: 32887,
            price: 2860,
            is_enabled: true,
          },
          {
            id: 32888,
            price: 2860,
            is_enabled: true,
          },
          {
            id: 32889,
            price: 2860,
            is_enabled: true,
          },
          {
            id: 32890,
            price: 3150,
            is_enabled: true,
          },
          {
            id: 32891,
            price: 3300,
            is_enabled: true,
          },
          {
            id: 32892,
            price: 3380,
            is_enabled: true,
          },
          {
            id: 32893,
            price: 3380,
            is_enabled: true,
          },
          {
            id: 66363,
            price: 2860,
            is_enabled: true,
          },
          {
            id: 66364,
            price: 2860,
            is_enabled: true,
          },
          {
            id: 66365,
            price: 2860,
            is_enabled: true,
          },
          {
            id: 66366,
            price: 2860,
            is_enabled: true,
          },
          {
            id: 66367,
            price: 3150,
            is_enabled: true,
          },
          {
            id: 66368,
            price: 3300,
            is_enabled: true,
          },
        ],
        print_areas: [
          {
            variant_ids: [
              32902, 32903, 32904, 32905, 32906, 32907, 32908, 32909, 32910,
              32911, 32912, 32913, 32914, 32915, 32916, 32917,
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
              66363, 66364, 66365, 66366, 66367, 66368, 32886, 32887, 32888,
              32889, 32890, 32891, 32892, 32893, 32918, 32919, 32920, 32921,
              32922, 32923, 32924, 32925, 33409, 33410, 33411, 33412, 33413,
              33414, 33415, 33416, 42219, 42220, 42221, 42222, 42223, 42224,
              42225, 42226,
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

      console.log("Image of hoodie in controller: ", whiteImageUrl);
      return { productId, image_url: whiteImageUrl };
    } else {
      return;
    }
  } catch (error) {
    return error;
  }
};

module.exports = { createHoodie };

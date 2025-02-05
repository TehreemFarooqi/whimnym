//Candle 2, 3
const { JSX, Builder } = require("canvacord");
const { Font } = require("canvacord");
const { createCanvas } = require("@napi-rs/canvas");
const path = require("path");

Font.fromFileSync(
  path.join(
    __dirname,
    "../public/assets/fonts/BubbleGum/BubblegumSans-Regular.ttf"
  ),
  "BubbleGum"
);
Font.fromFileSync(
  path.join(__dirname, "../public/assets/fonts/Raleway/Raleway-Regular.ttf"),
  "Raleway"
);

class NymPostthree extends Builder {
  constructor({
    width = 645,
    height = 546,
    innerBorderWidth = 458,
    innerBorderHeight = 400,
    innerBorderTop = 73,
    innerBorderLeft = 93,
    nymWidth = 359,
    nymHeight = 250,
    nymTop = 148,
    nymLeft = 133,
    nymFontSize = "5vw",
    nymLineHeight = "5.5vw",
    bottomTextWidth = 252,
    bottomTextHeight = 32,
    bottomTextTop = 350,
    bottomTextLeft = 186,
    bottomFontSize = "2vw",
    bottomLineHeight = "2.2vw",
    Nym = "",
    BottomText = "Soy Wax Candle \n 4 oz / 20+ hours",
    NymColor = "#000000",
    formatNym = false,
  } = {}) {
    super(width, height);
    this.bootstrap({
      Nym,
      BottomText,
      NymColor,
      nymFontSize,
      bottomFontSize,
    });

    this.backgroundImage = null;
    this.backgroundImageLoaded = false;

    this.styles = {
      width,
      height,
      innerBorderWidth,
      innerBorderHeight,
      innerBorderTop,
      innerBorderLeft,
      nymWidth,
      nymHeight,
      nymTop,
      nymLeft,
      nymFontSize,
      nymLineHeight,
      bottomTextWidth,
      bottomTextHeight,
      bottomTextTop,
      bottomTextLeft,
      bottomFontSize,
      bottomLineHeight,
      formatNym,
    };
  }

  setNym(value) {
    this.options.set("Nym", value);
    return this;
  }

  setBottomText(value) {
    this.options.set("BottomText", value);
    return this;
  }

  async render() {
    const { Nym, BottomText, NymColor } = this.options.getOptions();
    const {
      width,
      height,
      innerBorderWidth,
      innerBorderHeight,
      innerBorderTop,
      innerBorderLeft,
      nymWidth,
      nymLineHeight,
      nymHeight,
      nymFontSize,
      bottomTextWidth,
      bottomTextHeight,
      bottomTextTop,
      bottomTextLeft,
      bottomLineHeight,
      bottomFontSize,
      formatNym,
    } = this.styles;

    const canvas = createCanvas(1, 1);
    const context = canvas.getContext("2d");

    // Parse font size and line height
    let currentFontSize = parseFloat(nymFontSize);
    const lineHeightRatio = parseFloat(nymLineHeight) / parseFloat(nymFontSize);

    // Function to measure text dimensions
    const measureTextHeight = (text, maxWidth, fontSize) => {
      context.font = `${fontSize}px Arial`;
      const words = text.split(" ");
      let line = "";
      let lines = [];

      words.forEach((word) => {
        const testLine = line + word + " ";
        const testWidth = context.measureText(testLine).width;

        if (testWidth > maxWidth && line) {
          lines.push(line);
          line = word + " ";
        } else {
          line = testLine;
        }
      });

      if (line) lines.push(line);

      const textHeight = lines.length * (fontSize * 1.2); // Approximate line height
      return textHeight;
    };

    // Adjust font size until the text fits within the defined height
    let textHeight = measureTextHeight(Nym, nymWidth, currentFontSize);
    while (textHeight > nymHeight && currentFontSize > 1) {
      currentFontSize -= 1; // Decrease font size
      textHeight = measureTextHeight(Nym, nymWidth, currentFontSize);
    }

    // Final font size and line height
    const finalNymFontSize = `${currentFontSize}px`;
    const finalNymLineHeight = `${currentFontSize * lineHeightRatio}px`;

    // Format the text if required
    const formattedNym = formatNym ? Nym.toUpperCase() : Nym;

    // Render the JSX element
    return JSX.createElement(
      "div",
      {
        style: {
          position: "relative",
          width: `${width}px`,
          height: `${height}px`,
          border: "1px solid #000",
          display: "flex",
        },
      },
      JSX.createElement(
        "div",
        {
          style: {
            display: "flex",
            flexDirection: "column",
            width: `${innerBorderWidth}px`,
            height: `${innerBorderHeight}px`,
            border: "2px solid #000",
            position: "absolute",
            top: `${innerBorderTop}px`,
            left: `${innerBorderLeft}px`,
            alignItems: "center",
            justifyContent: "center",
          },
        },
        JSX.createElement(
          "h1",
          {
            style: {
              fontSize: finalNymFontSize,
              fontFamily: "BubbleGum",
              color: NymColor,
              lineHeight: finalNymLineHeight,
              textAlign: "center",
              whiteSpace: "pre-wrap",
              width: `${nymWidth}px`,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
              textTransform: formatNym ? "uppercase" : "none",
            },
          },
          formattedNym
        )
      ),
      JSX.createElement(
        "p",
        {
          style: {
            position: "absolute",
            fontSize: bottomFontSize,
            fontFamily: "Raleway",
            color: NymColor,
            lineHeight: bottomLineHeight,
            textAlign: "center",
            width: `${bottomTextWidth}px`,
            bottom: "90px",
            left: "50%",
            transform: "translate(-30%, 0)",
            whiteSpace: "pre-wrap",
            margin: 0,
          },
        },
        BottomText
      )
    );
  }
}

module.exports = { NymPostthree };

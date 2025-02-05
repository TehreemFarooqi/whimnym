// Mug 2, 3
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

class NymPostfive extends Builder {
  constructor({
    width = 2475,
    height = 1155,
    nymFontSize = "160px",
    nymLineHeight = "155px",
    Nym = "HI, I'M NAT",
    NymColor = "#000000",
    formatNym = false,
    top = 470,
    left = 76,
    nymWidth = 920,
    nymHeight = 182,
  } = {}) {
    super(width, height);
    this.bootstrap({
      Nym,
      NymColor,
      nymFontSize,
    });

    this.styles = {
      width,
      height,
      nymFontSize,
      nymLineHeight,
      formatNym,
      top,
      left,
      nymWidth,
      nymHeight,
    };
  }

  setNym(value) {
    this.options.set("Nym", value);
    return this;
  }

  getAdjustedFontSizeForHeight(text, baseFontSize, heightLimit, context) {
    context.font = `${baseFontSize} Arial`;

    const getTextHeight = () => {
      const metrics = context.measureText(text);
      return metrics.fontBoundingBoxAscent + metrics.fontBoundingBoxDescent;
    };

    let currentFontSize = parseFloat(baseFontSize);
    let measuredTextHeight = getTextHeight();

    while (measuredTextHeight > heightLimit) {
      currentFontSize -= 6;
      context.font = `${currentFontSize}px Arial`;
      measuredTextHeight = getTextHeight();
    }

    return {
      fontSize: `${currentFontSize}px`,
      lineHeight: `${currentFontSize}px`,
    };
  }

  async render() {
    const { Nym, NymColor } = this.options.getOptions();
    const {
      width,
      height,
      nymFontSize,
      nymLineHeight,
      formatNym,
      top,
      left,
      nymWidth,
      nymHeight,
    } = this.styles;

    const canvas = createCanvas(1, 1);
    const context = canvas.getContext("2d");

    // Adjust font size and line height for height
    const { fontSize: adjustedNymFontSize, lineHeight: adjustedNymLineHeight } =
      this.getAdjustedFontSizeForHeight(
        Nym.toUpperCase(),
        nymFontSize,
        nymHeight,
        context
      );

    const formattedNym = formatNym ? Nym.toUpperCase() : Nym;

    const verticalCenterOffset =
      (nymHeight - parseFloat(adjustedNymFontSize)) / 2;

    return JSX.createElement(
      "div",
      {
        style: {
          position: "relative",
          width: `${width}px`,
          height: `${height}px`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "10px",
        },
      },
      JSX.createElement(
        "h1",
        {
          style: {
            fontSize: adjustedNymFontSize,
            fontFamily: "BubbleGum",
            color: NymColor,
            lineHeight: adjustedNymLineHeight,
            whiteSpace: "pre-wrap",
            width: `${nymWidth}px`,
            height: `${nymHeight}px`,
            margin: 0,
            textTransform: formatNym ? "uppercase" : "none",
            position: "absolute",
            top: `${top + verticalCenterOffset}px`,
            left: `${left}px`,
            alignItems: "center",
          },
        },
        formattedNym
      )
    );
  }
}

module.exports = { NymPostfive };

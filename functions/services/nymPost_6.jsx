// Mug 1
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

class NymPostsix extends Builder {
  constructor({
    width = 2475,
    height = 1155,
    nymFontSize = "160px",
    nymLineHeight = "155px",
    definitionFontSize = "70px",
    definitionLineHeight = "75px",
    Nym = "HI, I'M NAT",
    Definition = "Short for Natural Disaster",
    NymColor = "#000000",
    formatNym = false,
    top = 470,
    definitionTop = 640,
    left = 76,
    nymWidth = 920,
    definitionWidth = 920,
    nymHeight = 182,
    definitionHeight = 60,
    distanceBetweenTexts = 20,
    leftPadding = 90,
  } = {}) {
    super(width, height);
    this.bootstrap({
      Nym,
      Definition,
      NymColor,
      nymFontSize,
      definitionFontSize,
    });

    this.styles = {
      width,
      height,
      nymFontSize,
      nymLineHeight,
      definitionFontSize,
      definitionLineHeight,
      formatNym,
      top,
      left,
      nymWidth,
      nymHeight,
      definitionWidth,
      definitionHeight,
      distanceBetweenTexts,
      leftPadding,
    };
  }

  async render() {
    const { Nym, Definition, NymColor } = this.options.getOptions();
    const {
      width,
      height,
      nymFontSize,
      nymLineHeight,
      definitionFontSize,
      definitionLineHeight,
      formatNym,
      top,
      left,
      nymWidth,
      definitionWidth,
      definitionHeight,
      distanceBetweenTexts,
      nymHeight,
      leftPadding,
    } = this.styles;

    const canvas = createCanvas(1, 1);
    const context = canvas.getContext("2d");

    const getAdjustedFontSize = (text, baseFontSize, widthLimit) => {
      context.font = `${baseFontSize} Arial`;
      let measuredTextWidth = context.measureText(text).width;

      let currentFontSize = parseFloat(baseFontSize);
      while (measuredTextWidth > widthLimit) {
        currentFontSize -= 1;
        context.font = `${currentFontSize}px Arial`;
        measuredTextWidth = context.measureText(text).width;
      }
      return `${currentFontSize}px`;
    };

    const adjustedNymFontSize = getAdjustedFontSize(
      Nym.toUpperCase(),
      nymFontSize,
      nymWidth
    );

    const adjustedNymHeight = Math.ceil(parseFloat(adjustedNymFontSize) * 1.15);

    const adjustedDefinitionTop =
      top + adjustedNymHeight + distanceBetweenTexts;

    const adjustedDefinitionFontSize = getAdjustedFontSize(
      Definition,
      definitionFontSize,
      definitionWidth
    );

    const adjustedNymLineHeight = `${parseFloat(adjustedNymFontSize) * 1.15}px`;
    const adjustedDefinitionLineHeight = `${
      parseFloat(adjustedDefinitionFontSize) * 1.15
    }px`;

    const wordCount = Definition.length;

    // Adjust definition height based on the word count 62
    const additionalHeight = Math.ceil((wordCount - 23) / 23) * 54;
    const finalDefinitionHeight =
      wordCount > 23 ? definitionHeight + additionalHeight : definitionHeight;

    console.log("Definition height: ", finalDefinitionHeight);

    const formattedNym = formatNym ? Nym.toUpperCase() : Nym;

    return JSX.createElement(
      "div",
      {
        style: {
          position: "relative",
          width: `${width}px`,
          height: `${height}px`,
          display: "flex",
          flexDirection: "row",
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
            width: `${nymWidth}px`,
            height: `${nymHeight}px`,
            margin: 0,
            position: "absolute",
            top: `${top}px`,
            left: left ? `${left}px` : "0px",
            textTransform: "uppercase",
            alignItems: "center",
            justifyContent: "center",
          },
        },
        formattedNym
      ),
      JSX.createElement(
        "p",
        {
          style: {
            fontSize: definitionFontSize,
            fontFamily: "Raleway",
            color: NymColor,
            lineHeight: definitionLineHeight,
            width: `${definitionWidth}px`,
            height: `${finalDefinitionHeight}px`,
            margin: 0,
            position: "absolute",
            top: `${adjustedDefinitionTop}px`,
            left: leftPadding ? `${leftPadding}px` : "90px", // Set dynamic padding or default to 90px
            whiteSpace: "pre-wrap",
            alignItems: "center",
            justifyContent: "center",
          },
        },
        Definition
      )
    );
  }
}

module.exports = { NymPostsix };

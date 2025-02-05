// hoodie design 1
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

class NymPostnine extends Builder {
  constructor({
    width = 3852,
    height = 4398,
    nymFontSize = "540px",
    nymLineHeight = "628.02px",
    definitionFontSize = "250px",
    definitionLineHeight = "293.5px",
    Nym = "Your Nym Text Here",
    Definition = "Your Definition Text Here",
    NymColor = "#000000",
    formatNym = false,
    nymTop = 326,
    definitionTop = 904,
    left = 271,
    nymWidth = 3263,
    nymHeight = 558,
    definitionWidth = 3263,
    definitionHeight = 241,
    distanceBetweenTexts = 20,
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
      nymTop,
      left,
      nymWidth,
      nymHeight,
      definitionWidth,
      definitionHeight,
      distanceBetweenTexts,
      definitionTop,
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
      nymTop,
      left,
      nymWidth,
      nymHeight,
      definitionWidth,
      definitionHeight,
      distanceBetweenTexts,
      definitionTop,
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
      nymTop + adjustedNymHeight + distanceBetweenTexts;

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
    const additionalHeight = Math.ceil((wordCount - 27) / 27) * 300;
    const finalDefinitionHeight =
      wordCount > 27 ? definitionHeight + additionalHeight : definitionHeight;

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
            width: `${nymWidth}px`,
            height: `${nymHeight}px`,
            margin: 0,
            position: "absolute",
            top: `${nymTop}px`,
            left: `${left}px`,
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            textTransform: "uppercase",
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
            height: `${finalDefinitionHeight}px`, // Ensure height is dynamic if needed
            textAlign: "center",
            whiteSpace: "pre-wrap",
            width: `${definitionWidth}px`,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            position: "absolute", // Apply position absolute so it can follow the nym
            top: `${adjustedDefinitionTop}px`, // Use adjusted position for definition text
          },
        },
        Definition
      )
    );
  }
}

module.exports = { NymPostnine };

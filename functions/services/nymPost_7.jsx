// Id 1 design
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

class NymPostseven extends Builder {
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
    top = 326,
    definitionTop = 904,
    left = 0,
    nymWidth = 3263,
    nymHeight = 558,
    definitionWidth = 3263,
    definitionHeight = 241,
    distanceBetweenTexts = 20,
    backgroundImageUrl = null,
  } = {}) {
    super(width, height);
    this.bootstrap({
      Nym,
      Definition,
      NymColor,
      nymFontSize,
      definitionFontSize,
      backgroundImageUrl,
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
      backgroundImageUrl,
    };
  }

  async render() {
    const { Nym, Definition, NymColor, backgroundImageUrl } =
      this.options.getOptions();
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
      nymHeight,
      definitionWidth,
      definitionHeight,
      distanceBetweenTexts,
    } = this.styles;

    const canvas = createCanvas(1, 1);
    const context = canvas.getContext("2d");

    const splitTextIfNeeded = (text, maxWidth) => {
      context.font = `${nymFontSize} Arial`;
      let words = text.split("");
      let currentLine = "";
      let lines = [];
      let breakAdded = false;

      words.forEach((letter) => {
        const testLine = currentLine + letter;
        const { width: testLineWidth } = context.measureText(testLine);

        if (testLineWidth > maxWidth && !breakAdded) {
          lines.push(currentLine);
          currentLine = "-" + letter;
          breakAdded = true;
        } else {
          currentLine = testLine;
        }
      });

      if (currentLine) lines.push(currentLine);

      return lines;
    };

    const lines = splitTextIfNeeded(Nym.toUpperCase(), nymWidth);
    const adjustedNymHeight = lines.length * parseFloat(nymLineHeight);
    const adjustedDefinitionTop =
      top + adjustedNymHeight + distanceBetweenTexts;

    const adjustedDefinitionFontSize = definitionFontSize;
    const adjustedNymLineHeight = `${parseFloat(nymFontSize) * 1.15}px`;
    const adjustedDefinitionLineHeight = `${
      parseFloat(adjustedDefinitionFontSize) * 1.15
    }px`;
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
          backgroundImage: backgroundImageUrl
            ? `url(${backgroundImageUrl})`
            : "none",
          backgroundSize: "cover",
          backgroundPosition: "center",
        },
      },
      lines.map((line, index) =>
        JSX.createElement(
          "h1",
          {
            key: index,
            style: {
              fontSize: nymFontSize,
              fontFamily: "BubbleGum",
              color: "#E39751",
              textShadow: `
                5px 5px 0 black, 
                -5px -5px 0 black, 
                5px -5px 0 black, 
                -5px 5px 0 black,
                5px 0 0 black,
                -5px 0 0 black,
                0 5px 0 black,
                0 -5px 0 black
              `,
              lineHeight: adjustedNymLineHeight,
              width: `${nymWidth}px`,
              margin: 0,
              position: "absolute",
              top: `${top + index * parseFloat(nymLineHeight)}px`,
              left: `${left}px`,
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              textTransform: "uppercase",
            },
          },
          line
        )
      ),
      JSX.createElement(
        "p",
        {
          style: {
            fontSize: adjustedDefinitionFontSize,
            fontFamily: "Raleway",
            color: "#9191DD",
            lineHeight: adjustedDefinitionLineHeight,
            width: `${definitionWidth}px`,
            height: `${definitionHeight}px`,
            margin: 0,
            position: "absolute",
            top: `869px`,
            left: `146px`,
            whiteSpace: "pre-wrap",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            fontWeight: 700,
            textShadow: `
            0.8px 0.8px 0 #9191DD, 
            -0.8px -0.8px 0 #9191DD,
            0.8px -0.8px 0 #9191DD, 
            -0.8px 0.8px 0 #9191DD
          `,
          },
        },
        Definition
      )
    );
  }
}

module.exports = { NymPostseven };
